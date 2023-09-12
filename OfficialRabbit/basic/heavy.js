import { connectionObject } from "../connection.js";
import { connect } from "amqplib";
import { queueName, durableQueue } from "./configure.js";

const connection = await connect(connectionObject);

const channel = await connection.createChannel();

const queue = await channel.assertQueue(durableQueue, { durable: true });
await channel.prefetch(1);


channel.consume(
  durableQueue,
  function (msg) {
    console.log(`[x]: Received message`);
    setTimeout(() => {
      console.log(`[DONE]`);
      console.log(queue);
      channel.ack(msg);
    }, 3000);
    // channel.ack(msg);
  },
  { noAck: false }
);
