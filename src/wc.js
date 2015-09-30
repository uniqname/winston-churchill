import register from './register';
import { polyfiller } from './utils';

// Array.from polyfill
// This is not a spec compliant polyfil but covers the vast
// majority of use cases. In particular it fills how Bable uses
// it to transpile the spread operator.
polyfiller({
    test: !!Array.from,
    fill: () => Array.from = arrayLike => [].slice.call(arrayLike)
});

export const proto = {},

    WC = Object.create(null, {
        register: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: register
        },

        extend: {
            enumerable: true,
            configurable: false,
            writable: false,
            value(method) {
                method.call(null, proto);
            }
        },

        polyfiller: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: polyfiller
        }
    });

export default window.WC = WC;
