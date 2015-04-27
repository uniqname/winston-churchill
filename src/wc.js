import register from './register';

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

        missingDeps: {
            enumerable: true,
            get: () => function (extention, deps) {
                let missings = deps.reduce((missing, curr) => {
                    if (!WC.extensions[curr]) {
                        missing.push(curr);
                    }
                    return missing;
                }, []);

                if (missings.length) {
                    console.error('The Winsoton Churchill `' + extention + '` extention is missing these dependencies: \n' + missings.join('\n,'));
                }

                return missings;

            }
        }
    });

export default window.WC = WC;
