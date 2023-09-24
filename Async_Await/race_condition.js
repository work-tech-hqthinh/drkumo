const listOfIngredients = [];

const contents = [{ name: "Food" }, { name: "Water" }, { name: "Fire" }];

const doSomething = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("");
      console.log("[Done doing something]");
    }, 5000);
  });

const fetch = (url) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(contents);
      console.log("[Done fetching]");
    }, 5000);
  });

doSomething()
  .then((url) => {
    // I forgot to return this
    return fetch(url).then((data) => {
      listOfIngredients.push(data);
    });
  })
  .then(() => {
    console.log(`[Ingredient]: ${JSON.stringify(listOfIngredients)}`);
    // Always [], because the fetch request hasn't completed yet.
  });
