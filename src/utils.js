export function typeOf(thing) {
    return ({}).toString.call(thing).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

export function protoChain(...objs) {
    return objs.reverse().reduce((proto, obj) => {
        Object.setPrototypeOf(obj, proto);
        return obj;
    });
}


/*
    srcs: [srcObject]
    srcObject: {
        test: <Boolean || Function:Boolean>,
        fill: <String:URL to polyfill>
    }
*/
export function polyfiller(...tests) {
    return new Promise(function (res, rej) {
        tests.forEach(testObj => {
            let passes = (typeof testObj.test === 'function') ? testObj.test() : testObj.test,
                filler = testObj.fill;

            if (passes) {
                res();
            } else if (typeof fill === 'function') {
                filler();
                res();
            } else {
                let scrpt = document.createElement('script');
                scrpt.onerror = rej;
                scrpt.onload = res;
                scrpt.src = testObj.fill;
                document.body.appendChild(scrpt);
            }
        });
    });
}
