const { Worker } = require("worker_threads");

// const tick = performance.now();

// for (let i = 0; i < jobs.length; i++) {
//     let count = 0;
//     for (let j = 0; j < jobs[i]; j++) {
//       count++;
//     }
//   }

// const tock = performance.now();
// console.log(`main thread took ${tock - tick}ms`); // [took 9026 ms]

const jobs = Array.from({ length: 100 }, () => 1e9);

run(jobs, +process.argv[2]);

function chunkify(arr, n) {
  let chunks = [];

  for (let i = n; i > 0; i--) {
    chunks.push(arr.splice(0, Math.ceil(arr.length / i)));
  }
  return chunks;
}

// chunkify(
//   new Array(21).fill(0).map((_, idx) => idx + 1),
//   5
// );

function run(jobs, concurrentWorkers) {
  const tick = performance.now();

  let counter = 0;

  const chunks = chunkify(jobs, concurrentWorkers);

  chunks.forEach((data, i) => {
    const worker = new Worker("./worker.js");
    worker.postMessage(data);
    worker.on("message", () => {
      console.log(`worker ${i + 1} completed`);
      if (++counter === concurrentWorkers) {
        const tock = performance.now();
        console.log(`[END]: ${tock - tick} ms`);
      }
    });
  });
}

//1 thread =  [took 9s]
//1 worker thread =  [took 16s]
//2 worker thread  = [took 6s]
//8 worker length 10 = [took 5s]
//8 worker length 100 = [took 5s]
