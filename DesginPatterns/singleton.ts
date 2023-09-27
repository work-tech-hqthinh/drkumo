
process.on('exit', () => {
    console.log(`TOOK [${((performance.now() - tick) / 1000).toFixed(3)}] seconds to execute`);
})


const tick = performance.now();
interface ILDAP {
    connectWithRetry(): void;
    connectWithoutRetry(): void;
    bind(): void;
    // getInstance: () => LDAP;
}

class LDAP implements ILDAP {
    public isConnected: boolean = false;

    private static instance: LDAP;

    public retries: number = 0;

    public maxRetries: number = 3;
    public curRetries: number = 0;

    private minSecRequired: number = 3_000;
    private maxSecRequired: number = 20_000;

    constructor() {
        // this.connectWithoutRetry();
        this.connectWithRetry();
    }

    // retryRecursive(myResolve?: any): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             if (++this.curRetries <= this.maxRetries) {
    //                 console.log(`curRetries: [${this.curRetries}] - Time: ${((performance.now() - tick) / 1000).toFixed(3)}`);
    //                 return Promise.resolve().then(this.retryRecursive.bind(this, resolve));
    //             }
    //             else {
    //                 console.log("DONE");

    //                 resolve('done2');
    //                 return myResolve('done');
    //             }
    //         }, this.minSecRequired)

    //     });
    // }

    retryRecursive(): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (++this.curRetries <= this.maxRetries) {
                    console.log(`curRetries: [${this.curRetries}] - Time: ${((performance.now() - tick) / 1000).toFixed(3)}`);
                    resolve('continue');

                } else {
                    resolve('success');
                }
            }, this.minSecRequired)

        }).then((result) => {
            if (result === 'continue') {
                return this.retryRecursive();
            } else if (result === 'success') {
                return 'success';
            }
            return 'unknown';
        })
    };


    connectWithRetry(): void {
        const exitTimeoutId = setTimeout(() => {
            console.log(`[KILLED]: Due to connection takes too much time`);
            process.exit(1);
        }, this.maxSecRequired);


        this.retryRecursive().then(result => {
            console.log(`result is ${result}`);
            if (result == 'success') {
                clearTimeout(exitTimeoutId);
                console.log('--- CONNECTED ---');
            };
            console.log(`RESULT IS ${result}`);
        }).catch(e => {
            console.log(`PROBLEM: ${e}`);
        })

    }

    connectWithoutRetry(): void {
        const timeoutId = setTimeout(() => {
            console.log(`[KILLED]: Due to connection takes too much time`);
            process.exit(1);
        }, this.maxSecRequired);

        console.log('--- CONNECTING ---');
        setTimeout(() => {
            console.log('--- CONNECTED ---');
            clearTimeout(timeoutId);
        }, this.minSecRequired);
    }

    bind(): void {

    }

    static getInstance(): LDAP {
        if (!LDAP.instance) LDAP.instance = new LDAP();
        return LDAP.instance;
    }
}

LDAP.getInstance();

console.log('----------  IAM NOT AFFECTED  ---------- ');

// function getRedirectUrl(url, redirectCount) {
//     redirectCount = redirectCount || 0;

//     if (redirectCount > 10) {
//         throw new Error("Redirected too many times.");
//     }

//     return new Promise(function (resolve) {
//         var xhr = new XMLHttpRequest();

//         xhr.onload = function () {
//             resolve(getRedirectsTo(xhr));
//         };

//         xhr.open('HEAD', url, true);
//         xhr.send();
//     })
//         .then(function (redirectsTo) {
//             return redirectsTo
//                 ? getRedirectUrl(redirectsTo, redirectCount + 1)
//                 : url;
//         });
// }