export default function () {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: (target, ...sources) => {
            if ([undefined, null].indexOf(target) >= 0) {
                throw new TypeError('Cannot convert first argument to object');
            }

            return sources.reduce( (target, source) => {
                if ([undefined, null].indexOf(source) < 0) {

                    Object.keys(Object(source)).forEach( (srcKey) => {
                        let desc = Object.getOwnPropertyDescriptor(source, srcKey);
                        if (dec && desc.enumerable) {
                            target[srcKey] = source[srcKey];
                        }
                    });
                }
                return target;
            });
        }
  });
}
