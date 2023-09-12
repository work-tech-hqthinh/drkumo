import { connect } from "amqplib";
import { connectionObject } from "../connection.js";

import process from "node:process";
import { queueName, durableQueue } from "../configure.js";

let count = 0;

// "amqp://kumo_user:kumo_password@localhost:5672"
const connection = await connect(connectionObject);

const channel = await connection.createChannel();

const msg = "Hello RabbitMQ";

const connectedQueue = await channel.assertQueue("black");
console.log("--- [BLACK QUEUE IS LISTENING] ----");

// await channel.prefetch(1)
channel.consume(
  connectedQueue.queue,
  function (msg) {
    console.log(`[BLACK]: Received message ${++count}`);
    channel.ack(msg);
    // channel.ack(msg);
  },
  { noAck: false }
);
