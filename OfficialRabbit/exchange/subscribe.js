import { connect } from "amqplib";
import { connectionObject } from "../connection.js";

import process from "node:process";
import { queueName, durableQueue } from "../configure.js";

let count = 0;

// "amqp://kumo_user:kumo_password@localhost:5672"
const connection = await connect(connectionObject);

const channel = await connection.createChannel();

const msg = "Hello RabbitMQ";

const connectedQueue = await channel.assertQueue(durableQueue);

// await channel.prefetch(1)
channel.consume(
  durableQueue,
  function (msg) {
    console.log(`[x]: Received message ${++count}`super);
    channel.ack(msg);
    // channel.ack(msg);
  },
  { noAck: false }
);
