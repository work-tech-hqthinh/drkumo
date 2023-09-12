import { connect } from "amqplib";

const connection = await connect(
  "amqp://kumo_user:kumo_password@localhost:5672"
);

const channel = await connection.createChannel();
const queue = "messages";

await channel.assertQueue("messages", { durable: false });
await channel.assertQueue("highlands", { durable: false });

// channel.nack(M)

channel.consume("messages", (msg) => {
  const message = msg.content.toString();

  if (message === "Hello World - HQTH MPC GROUP") {
    channel.ack(msg);
    console.log(`[x] RECIEVED MESSAGE: ${message}`);
  }
});

channel.consume("highlands", (msg) => {
  const message = msg.content.toString();

  if (message === "Highlands Coffe Nguyen Anh Thu") {
    channel.ack(msg);
    console.log(`[x] RECIEVED MESSAGE: ${message}`);
  }
});

// channel.ack();
