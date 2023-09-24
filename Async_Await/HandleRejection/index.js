process.on("unhandledRejection", (reason, promise) => {
  console.log({
    reason,
    promise,
  });
});

const delay = (message, ms, msg) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log({ msg });
      resolve(`[DONE]: ${message}`);
    }, ms);
  })
    .then((data) => {
      console.log(data);
      //   throw new Error("my custome error");
    })
    .then((value) => {
      console.log(`213 - [${performance.now() - tick}]ms`);
      return message;
    });

const tick = performance.now();
// await delay("Hello", 3000);
// await delay("WORKD", 7000);

// Promise.any([delay("Hello", 3000), delay("WORLD", 7000)]);

/** WILL RUN THE CODE SEQUENTIALLY */

const contents = [];

// const value = await [() => delay("Hello", 3000), () => delay("WORLD", 7000)]
//   .reduce(
//     (acc, curr) =>
//       acc.then(() => {
//         return curr().then((data) => {
//           console.log({ data, acc });
//           contents.push(data);
//           return { data, acc };
//         });
//       }),
//     Promise.resolve()
//   )
//   .then((result) => {
//     console.log(`[RESULT]: ${contents}`);
//     return result;
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// console.log(`value: ${JSON.stringify(value)}`);

console.log("--- NEW TEST ---");

const value = [
  (msg) => delay("Hello", 3000, msg),
  (msg) => delay("WORLD", 7000, msg),
]
  .reduce((acc, curr) => {
    return acc.then(curr).then((value) => {
      console.log([`value: ${value}`]);
    });
  }, Promise.resolve(1998))
  .then((result) => {
    console.log(`[RESULT NEW]: ${result}`);
    return result;
  })
  .catch((error) => {
    console.log(error);
  });
