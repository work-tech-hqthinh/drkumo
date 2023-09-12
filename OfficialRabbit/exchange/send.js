import { connect } from "amqplib";
import { connectionObject } from "../connection.js";

import process from "node:process";
import { queueName, durableQueue } from "../configure.js";

// "amqp://kumo_user:kumo_password@localhost:5672"
const connection = await connect(connectionObject);

const channel = await connection.createChannel();

const msg = "Exchange Demo";

const exchangeName = "directExchange";

const connectedExchange = await channel.assertExchange(exchangeName, "direct", {
  durable: true,
});

const blackQueue = await channel.assertQueue("black");
const greenQueue = await channel.assertQueue("green");

channel.bindQueue("black", exchangeName, "black");
channel.bindQueue("green", exchangeName, "black");

const queueMessage = (message, routingKey) => {
  console.log(`[PUB]: ${message}`);
  channel.publish(exchangeName, routingKey, Buffer.from(message), {
    persistent: true,
  });
  // channel.sendToQueue(durableQueue, Buffer.from(message), { persistent: true });
};

// await channel.prefetch(1)

const pushWorks = (numberOfWorks = 10, interval = 1000) => {
  let counter = 0;

  const cleanUp = async () => {
    await connection.close();
    process.exit(0);
  };
  const _interval = setInterval(() => {
    counter % 2 === 0
      ? queueMessage(`[BLACK]: ${counter}`, "black")
      : queueMessage(`[GREEN]: ${counter}`, "green");

    if (++counter === Number(numberOfWorks).valueOf()) {
      clearInterval(_interval);
      cleanUp();
      console.log("----- DONE ------");
    }
  }, interval);
};

pushWorks(process.argv[2] ?? 5);
