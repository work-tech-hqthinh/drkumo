const waitme = (content) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(content);
    }, 2000);
  });
};

const tick = performance.now();
// await waitme("123").then((value) => {
//   console.log(`[${value}]: Took ${performance.now() - tick} ms `);
// });

// await waitme("456").then((value) => {
//   console.log(`[${value}]: Took ${performance.now() - tick} ms `);
// });

const data = await  Promise.all([waitme("abc"), waitme("def")]);
console.log(`[${performance.now() - tick}]: [${data}]`);


