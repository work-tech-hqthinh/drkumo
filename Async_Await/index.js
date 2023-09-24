const tick = performance.now();
const log = (value) => {
  console.log(`Time Elapsed [${value}]: ${performance.now() - tick} ms`);
};

const blocker = () => {
  return Promise.resolve().then(() => {
    let a = 0;
    for (let i = 0; i < 2_000_000_000; i++) {}
    return "blocker xxx";
  });
  //   return new Promise((resolve, reject) => {
  //     let a = 0;
  //     for (let i = 0; i < 2_000_000_000; i++) {}
  //     resolve("blocker xxx");
  //   });
};

log("Function Call 1");
// log(blocker());
blocker().then(log);
log("Function Call 2");
