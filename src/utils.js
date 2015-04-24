export function typeOf(thing) {
    return ({}).toString.call(thing).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

export function protoChain(...objs) {
    return objs.reverse().reduce((proto, obj) => {
        Object.setPrototypeOf(obj, proto);
        return obj;
    });
}
