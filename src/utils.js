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
        src: <String:URL to polyfill>
    }
*/

export function polyfills(...srcs) {
    return new Promise(function (res, rej) {
        srcs.forEach(src => {
            let test = (typeof src.test === 'function') ? src.test() : !!src;

            if (test) {
                res();
            } else {
                let scrpt = document.createElement('script');
                scrpt.onerror = rej;
                scrpt.onload = res;
                scrpt.src = src;
                document.body.appendChild(scrpt);
            }
        });
    });
}
