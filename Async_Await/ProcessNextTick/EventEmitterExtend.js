import EventEmitter from "events";

class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.on("event", () => {
      console.log("Event Fires");
    });

    this.emit("event");
    // process.nextTick(() => {
    //   this.emit("event");
    // });
  }
}

const myEmitter = new MyEmitter();
