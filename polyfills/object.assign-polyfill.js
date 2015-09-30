export default function () {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: (target, ...sources) => {
            if (target == null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            return sources.reduce((trgt, source) => {
                if (source == null) {
                    Object.keys(Object(source)).forEach((srcKey) => {
                        let desc = Object.getOwnPropertyDescriptor(source, srcKey);
                        if (desc && desc.enumerable) {
                            trgt[srcKey] = source[srcKey];
                        }
                    });
                }
                return trgt;
            });
        }
    });
}
