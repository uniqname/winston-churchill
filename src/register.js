import * as util from './utils';

let isString = thing => util.typeOf(thing) === 'string';

export default (name, config = {}) => {
    let proto = config.prototype || HTMLElement.prototype,
        ext = config.extends;

    proto = isString(proto) ? document.createElement(proto) : proto;

    proto = util.protoChain(WC.extentions, proto);

    return document.registerElement(name, {
        prototype: Object.create(proto, {}),
        extends: ext
    });
};
