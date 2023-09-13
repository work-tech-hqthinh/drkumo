import { connect } from "amqplib";
import { connectionObject } from "./production.js";

import process from "node:process";
import { RPC } from "../configure.js";

// "amqp://kumo_user:kumo_password@localhost:5672"
const connection = await connect(connectionObject);

const channel = await connection.createChannel();

const myQueue = await channel.assertQueue(RPC.rpcQueue, { durable: true });

const randomId = (Math.random() * 100).toFixed(0);

channel.consume(RPC.rpcQueue, (msg) => {
  console.log(`[x] RECEIVE ${msg.content.toString()}`);

  const replyMessage = `PROCESS BY [${randomId}]`;

  channel.sendToQueue(msg.properties.replyTo, Buffer.from(replyMessage), {
    correlationId: msg.properties.correlationId,
  });
  channel.ack(msg);
});
