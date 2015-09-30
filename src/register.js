import * as util from './utils';
import { proto as wcProto } from './wc';

const isString = thing => util.typeOf(thing) === 'string';

export default (name, options) => {

    // Can't destructure `opts` argument since its
    // properties are reserved words.
    let opts = options || {};
    let proto = opts.prototype || HTMLElement.prototype;

    //if a string, assume it's the name of an element
    proto = isString(proto) ? document.createElement(proto).constructor.prototype : proto;

    proto = util.protoChain(wcProto, proto);

    return document.registerElement(name, {
        prototype: Object.create(proto),
        extends: opts.extends
    });
};
