const { parentPort } = require("worker_threads");

parentPort.on("message", (jobs) => {
  work(jobs);
  parentPort.postMessage('done');
  process.exit(1);
});

function work(jobs) {
    for (let i = 0; i < jobs.length; i++) {
      let count = 0;
      for (let j = 0; j < jobs[i]; j++) {
        count++;
      }
    }
}
