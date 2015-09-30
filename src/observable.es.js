export default function (objIn) {
    let source = Object.preventExtensions(Object.assign({}, objIn)),
        objOut = Object.create(objIn.constructor.prototype),
        reservedKeys = ['on', 'trigger', 'off', 'one'],
        events = {},
        getQ = (evtName) => {
            if (!events[evtName]) {
                events[evtName] = [];
            }
            return events[evtName];
        };
    Object.keys(source).forEach(key => {
        if (reservedKeys.indexOf(key) >= 0) {
            //some error
        }
        Object.defineProperty(objOut, key, {
            enumerable: true,
            get: () => {
                objOut.trigger('access', {
                    name: key,
                    object: objOut,
                    type: 'access'
                });
                return source[key];
            },
            set: newVal => {
                let evt = {
                    name: key,
                    object: objOut,
                    type: 'update',
                    oldValue: source[key]
                };
                source[key] = newVal;
                objOut.trigger('update', evt);
            }
        });
    });

    Object.defineProperty(objOut, 'on', {
        get: () => function (evtName, fn) {
            if (typeof fn === 'function') {
                getQ(evtName).push(fn);
            }
        }
    });

    Object.defineProperty(objOut, 'off', {
        get: () => function (evtName, fn) {
            let q = getQ(evtName);
            events[evtName] = q.splice(q.indeOf(fn), 1);
        }
    });

    Object.defineProperty(objOut, 'one', {
        get: () => function (evtName, fn) {
            objOut.on(evtName, function on() {
                objOut.off(evtName, on);
                fn.apply(objOut, arguments);
            });
        }
    });

    Object.defineProperty(objOut, 'trigger', {
        get: () => function (evtName, data) {
            getQ(evtName).forEach(cb => cb.apply(objOut, [data]));
        }
    });
  return objOut;
}
