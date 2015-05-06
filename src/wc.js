import register from './register';

// Array.from polyfill
// This is not a spec compliant polyfil but covers the vast
// majority of use cases. In particular it fills how Bable uses
// it to transpile the spread operator.

// TODO: Need to research why babel trys to use Array.from
//       without implementing a polyfil internally as they
//       do with other things. As of the time of this note,
//       Array.from is only implemented in FireFox.
if (!Array.from)  Array.from = arrayLike => [].slice.call(arrayLike);


let extensions = {},

    WC = Object.create(null, {
        register: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: register.bind(WC)
        },

        // A dictionary of applied extensions.
        // Every applied extention will be available to each Winston Churchill
        // component in the app.
        extensions: {
            enumerable: true,
            get: () => extensions,
            set: (ext) => new Error('Cannot overwrite `extensions` property on WC')
        },

        extendWith: {
            enumerable: true,
            get: () => function (extensionsList) {
                extensionsList = Array.isArray(extensionsList) ? extensionsList : [extensionsList];
                extensionsList.forEach(function (extension) {
                    extension(WC);
                });
            }
        },

        missingDeps: {
            enumerable: true,
            get: () => function (extention, deps) {
                let missings = deps.reduce((missing, curr) => {
                    if (!WC.extensions[curr]) {
                        missing.push(curr);
                    }
                    return missing;
                }, []);

                if (!WC.extensions[extention]) {
                    WC.extensions[extention] = true;
                }

                if (missings.length) {
                    console.error('The Winsoton Churchill `' + extention + '` extention is missing these dependencies: \n' + missings.join('\n,'));
                }

                return missings;

            }
        }
    });

export default window.WC = WC;
