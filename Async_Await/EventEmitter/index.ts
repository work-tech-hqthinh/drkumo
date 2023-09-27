type CallbackFunc = (() => void) | ((...args: any[]) => void);

process.on('exit', () => {
    console.log("FUNCTION EXIT");
    console.log(`TIME OF EXECUTION: ${((performance.now() - tick) / 1000).toFixed(3)}`)
})


let tick = performance.now();
let data = 10;

let connection = false;

const tableOfEvents: Record<string, Array<CallbackFunc>> = {

};

const eventRegiter = (eventName: string, callback: CallbackFunc) => {
    if (!tableOfEvents[eventName]) {
        tableOfEvents[eventName] = [];
    }
    tableOfEvents[eventName].push(callback);
}

const eventEmitter = (eventName: string, ...args: any[]) => {
    if (!tableOfEvents[eventName]) return;

    tableOfEvents[eventName].forEach(callback => callback());
}

type EventEmitter = typeof eventEmitter;

const delay = (callback: any, ms: number = 5_000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            callback();
            resolve('done');
        }, ms);
    })
}



function runTest() {
    const myCallback: CallbackFunc = (resolve) => {
        console.log('Connecting');
        connection = true;
        console.log(`isConnected: [${connection}]`)

    }

    eventRegiter('myEvent', myCallback);

    delay((eventName = 'myEvent') => eventEmitter(eventName)).then(() => {
        console.log(`The Run Test Task is done - isConnected: ${connection}`);
    });
    console.log("THIS IS THE END");
}

runTest();



//Register Event


//Emit Event