// // // const tick = performance.now();

// // // const log = (callback) => callback(`${performance.now() - tick}ms`);
// // // const delay = (msg, ms = 2000) => {
// // //   setTimeout(() => {
// // //     console.log(msg);
// // //     log(console.log);
// // //     delay("WORLD");
// // //   }, ms);
// // // };

// // // delay("hello");

// // // console.log(`END`);

// // function doSomething(callback) {
// //   if (Math.random() > 0.5) {
// //     console.log("RESOLVE");
// //     return Promise.resolve(2000);
// //   } else {
// //     return new Promise((resolve, rejects) => {
// //       setTimeout(() => {
// //         const result = callback();
// //         resolve(result);
// //       }, 1000);
// //     });
// //   }
// // }

// // // doSomething(() => {
// // //   return 1998;
// // // }).then((result) => console.log(`[result]: ${result}`));

// // const wait = (ms) => new Promise((resolve) => setTimeout(() => resolve(ms), ms));

// // wait(3000).then((val) => console.log(val));
// // console.log(1);

// // setTimeout(() => {
// //   console.log("setTimeout");
// // }, 0);

// // new Promise((resolve, reject) => {
// //   setTimeout(() => {
// //     console.log("promise");
// //     resolve();
// //   });
// // });

// process.nextTick(() => {
//   console.log("all done");
// });

// setImmediate(() => {
//   console.log(`setImmediate out`);
// });

// Promise.resolve().then(() => {
//   setTimeout(() => {
//     console.log("promise RESOLVE 1");
//   }, 0);

//   setTimeout(() => {
//     console.log("promise RESOLVE 2");
//   }, 0);

//   process.nextTick(
//     (a, b) => {
//       console.log(`Tick ${a} ${b}`);
//     },
//     3,
//     4
//   );

//   setTimeout(() => {
//     console.log("promise RESOLVE 3");
//   }, 0);

//   process.nextTick(
//     (a, b) => {
//       console.log(`Tick ${a} ${b}`);
//     },
//     5,
//     6
//   );

//   setTimeout(() => {
//     console.log("promise RESOLVE 4");
//   }, 0);

//   setImmediate(() => console.log("setImmediate"));
// });

// const p = new Promise((res, rej) => {
//   res(1);
// });

// // async function asyncReturn() {
// //   return Promise.resp;
// // }

// // function basicReturn() {
// //   return Promise.resolve(p);
// // }

// // console.log(basicReturn())

// // n

// async function asyncReturn() {
//   console.log(`asyncReturn1`);
//   console.log(`asyncReturn2`);
//   console.log(`asyncReturn3`);
// }

// console.log(1);

// asyncReturn();
// console.log(3);

// const tick = performance.now();

// async function foo() {
//   console.log(1);
//   const p1 = new Promise((resolve) => setTimeout(() => resolve("1"), 10000));
//   console.log(2);
//   const p2 = new Promise((_, reject) => setTimeout(() => _("2"), 5000));
//   console.log(3);
//   return Promise.all([p1, p2]); // Do not do this! Use Promise.all or Promise.allSettled instead.
// }
// foo()
//   .catch((e) => {
//     console.log(`${performance.now() - tick}ms}`);
//     console.log(e);
//   })
//   .then(() => {
//     console.log(`${performance.now() - tick}ms}`);
//   });

function resolveAfter2Seconds() {
  console.log("starting slow promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("slow");
      console.log("slow promise is done");
    }, 2000);
  });
}

function resolveAfter1Second() {
  console.log("starting fast promise");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("fast rejected");
      console.log("fast promise is done");
    }, 1000);
  }).catch((e) => "FIXED");
}

async function sequentialStart() {
  console.log("== sequentialStart starts ==");

  // 1. Start a timer, log after it's done
  const slow = resolveAfter2Seconds();
  console.log(await slow);

  // 2. Start the next timer after waiting for the previous one
  const fast = resolveAfter1Second();
  console.log(await fast);

  console.log("== sequentialStart done ==");
}

async function sequentialWait() {
  console.log("== sequentialWait starts ==");

  // 1. Start two timers without waiting for each other
  const slow = resolveAfter2Seconds();
  const fast = resolveAfter1Second();

  // 2. Wait for the slow timer to complete, and then log the result
  //   console.log(await slow);
  // 3. Wait for the fast timer to complete, and then log the result
  console.log(await fast);

  console.log(await slow);

  console.log("== sequentialWait done ==");
}

async function concurrent1() {
  console.log("== concurrent1 starts ==");

  // 1. Start two timers concurrently and wait for both to complete
  const results = await Promise.all([
    resolveAfter2Seconds(),
    resolveAfter1Second(),
  ]);
  // 2. Log the results together
  console.log(results[0]);
  console.log(results[1]);

  console.log("== concurrent1 done ==");
}

async function concurrent2() {
  console.log("== concurrent2 starts ==");

  const tick = performance.now();

  // 1. Start two timers concurrently, log immediately after each one is done
  await Promise.all([
    (async () => console.log(await resolveAfter2Seconds()))(),
    (async () => console.log(await resolveAfter1Second()))(),
  ]);

  console.log(`== concurrent2 done == [${performance.now() - tick}ms}]`);
}

sequentialWait();
// concurrent1().catch(e => console.table(e));

// concurrent2();
// sequentialStart(); // after 2 seconds, logs "slow", then after 1 more second, "fast"

// // wait above to finish
// setTimeout(sequentialWait, 4000); //
