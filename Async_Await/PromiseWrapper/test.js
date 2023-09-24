async function asyncReturn() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res("Hello");
    }, 3000);
  });
}

async function anotherAsyncReturn() {
  console.log("anotherAsyncReturn");
  const data = await asyncReturn();
  console.log(data);
}

console.log("---- 1 ----");

anotherAsyncReturn();

console.log("---- 2 ----");

/**
 * 1
 * anotherAsyncReturn
 * 2
 * hello
 */
