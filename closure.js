const repeat = (Ntime = 10, interval = 1000) => {
  let counter = 0;
  const myInterval = setInterval(() => {
    console.log(`current: ${counter}`);
    counter++;
    if (counter === Ntime) {
      clearInterval(myInterval);
    }
  }, interval);
};


repeat(10);