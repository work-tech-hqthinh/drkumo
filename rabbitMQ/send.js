import { connect } from "amqplib";

const connection = await connect(
  "amqp://kumo_user:kumo_password@localhost:5672"
);

const channel = await connection.createChannel();

/**  USING THE  QUEUE
 * await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));
 */

/** USING THE EXCHANGE */
await channel.assertExchange("logs", "fanout", { durable: false });

const queue = "messages";
const message = "Hello World - HQTH MPC GROUP";

await channel.assertQueue(queue, { durable: false });

await channel.bindQueue(queue, "logs");
// channel.publish("logs", "", Buffer.from(message));
automaticPusher(10, message);

const sencondQueue = "highlands";
const messageSecondQueue = "Highlands Coffe Nguyen Anh Thu";

await channel.bindQueue(sencondQueue, "logs");

function automaticPusher(NTime, message) {
  let counter = 0;
  const myInterval = setInterval(() => {
    channel.publish("logs", "", Buffer.from(message));
    console.log(`counter ${++counter}`);
    if (counter === NTime) {
      clearInterval(myInterval);
      console.log("DONE REPEATING");
    }
  }, 1000);
}

automaticPusher(10, messageSecondQueue);

/**
 * [FANOUT] - The exchange will duplicate the message and send it  to  every queue
 * [DIRECT] - Pushlisher will create a routing key for the message
 *          - The routing key then is compared with the bindingKey of the queue
 *          - Message will go to queue that matches its routing key
 * [TOPIC]  - Instead of having matching key, the binding key only need to match partially
 *          - E.g: Routing key (ship.shoes) will be queued in the  (ship.any) queue
 * [HEADER] - Ignoring the  routing key
 * [DEFAULT] - [ONLY FOR  RABBITMQ - NOT in the standard AMQP - O-9-1]
 *           -
 */

// console.log("RABBITMQ  IS  RUNNING");
