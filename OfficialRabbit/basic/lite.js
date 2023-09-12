import { connectionObject } from "../connection.js";
import { connect } from "amqplib";
import { queueName, durableQueue } from "../configure.js";

const connection = await connect(connectionObject);

const channel = await connection.createChannel();

await channel.assertQueue(durableQueue, { durable: true });
await channel.prefetch(1);

channel.consume(
  durableQueue,
  function (msg) {
    console.log(`[x]: Received message`);
    channel.ack(msg);
    // channel.ack(msg);
  },
  { noAck: false }
);
