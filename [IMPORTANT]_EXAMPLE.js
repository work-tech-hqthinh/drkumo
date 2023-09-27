(async function () {
  let data = 10;
  // const wait = (ms) => Promise.resolve().then(() => setTimeout(() => {
  //     console.log('trigger');
  //     data = 100;
  // }, ms));

  const wait = (ms) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        process.nextTick(() => {
          console.log("next tick");
        });

        console.log("trigger");

        data = 100;
        setTimeout(() => {
          console.log("nested");
          resolve();
        }, 1_000);
      }, ms);
    });

  console.log(1);

  await wait(1000);

  console.log("2");
})();

console.log("223");

setTimeout(() => {
  console.log("123");
}, 1);


process.nextTick(() => {
  console.log("outside");
})