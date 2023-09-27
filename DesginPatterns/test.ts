
new Promise((resolve, reject) => {
    return setTimeout(() => {
        console.log("1");
        return setTimeout(() => {
            console.log(2);
            resolve('done');
        }, 2000);
    }, 2000);
}).catch(e => {
    console.log(e);
    return Promise.resolve('456');
}).then((result) => {
    console.log(`result is ${result}`);
})