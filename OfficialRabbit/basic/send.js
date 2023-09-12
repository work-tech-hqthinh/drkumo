import { connect } from "amqplib";
import { connectionObject } from "../connection.js";

import process from "node:process";
import { queueName, durableQueue } from "./configure.js";

// "amqp://kumo_user:kumo_password@localhost:5672"
const connection = await connect(connectionObject);

const channel = await connection.createChannel();

// const queue = "hqthinh";
const msg = "Hello RabbitMQ";

// interface AssertQueue {
//     queue: string;
//     messageCount: number;
//     consumerCount: number;
// }

const connectedQueue = await channel.assertQueue(durableQueue, { durable: true });

// await channel.prefetch(1)

const pushWorks = (numberOfWorks = 10, interval = 1000) => {
  console.log(numberOfWorks);
  let counter = 0;

  const cleanUp = async () => {
    await connection.close();
    process.exit(0);
  }
  const _interval = setInterval(() => {
    const Internal_msg = `[x]: message[${counter + 1}] ${msg} is sent`;
    channel.sendToQueue(durableQueue, Buffer.from(Internal_msg), {persistent: true});
    console.log(Internal_msg);
    if (++counter === Number(numberOfWorks).valueOf()) {
      clearInterval(_interval);
      console.log("----- DONE ------");
      cleanUp();
    }
  }, interval);
};

pushWorks(process.argv[2] ?? 5);

// process.on("beforeExit", async (code) => {
//   console.log("Process beforeExit event with code: ", code);
//   await connection.close();
// });

// setTimeout(function () {
//   awit connection.close();
//   process.exit(0);
// }, 500);
