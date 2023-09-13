import { connect } from "amqplib";
import { connectionObject } from "./production.js";

import process, { exitCode, resourceUsage } from "node:process";
import { RPC } from "../configure.js";

// "amqp://kumo_user:kumo_password@localhost:5672"
const connection = await connect(connectionObject);

const channel = await connection.createChannel();

const exchange = "RPC EXCHANGE";

await channel.assertExchange(exchange, "direct", { durable: true });

const msg = "RPC QUEUE";

const rpcQ = await channel.assertQueue(RPC.rpcQueue, { durable: true });
const replyQ = await channel.assertQueue("", { exclusive: true });

await channel.bindQueue(rpcQ.queue, exchange, "toServer");

console.log("[RPC CLIENT] READY");

const push = (msg) => {
  // channel.sendToQueue(RPC.rpcQueue, Buffer.from(msg), {
  //   replyTo: replyQ.queue,
  //   correlationId: "hqthinh",
  // });
  channel.publish(exchange, "toServer", Buffer.from(msg), {
    replyTo: replyQ.queue,
    correlationId: "hqthinh",
  });
};

const exit = async () => {
  await channel.close();
  process.exit(1);
};
async function testing(numberOfTime = 10, interval = 1000) {
  let count = 0;
  const _interval = setInterval(async () => {
    push(`[${count + 1}]`);
    if (++count === numberOfTime) {
      clearInterval(_interval);
      await exit();
    }
  }, interval);
}
// Callback Queue
channel.consume(replyQ.queue, (msg) => {
  console.log(`[ReplyQueue]: ${msg.content.toString()} `);
  channel.ack(msg);
});

const time = process.argv[2] ?? 10;
testing(Number(time).valueOf());
