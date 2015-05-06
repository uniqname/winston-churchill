(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
    //This is will be the WC distro.
    // import WC from './src/index';
    var WC = require('./src/wc'),
        renderOnData = function renderOnData(WC) {
        if (WC.missingDeps('renderOnData', ['on', 'templateFragment', 'data']).length) {
            return;
        }

        WC.extensions.on('data', function (data) {
            this.render(this.templateFragment, this.data);
        });
    },

    // import on from './extensions/on';
    // import render from './extensions/render';
    // import data from './extensions/data';
    // import template, { templateFragment} from './extensions/template';

    evts = require('./src/extensions/events/events'),
        render = require('./src/extensions/render/render'),
        data = require('./src/extensions/data/data'),
        templates = require('./src/extensions/template/template'),
        bindPropToAttr = require('./src/extensions/bindPropToAttr/bindPropToAttr'),
        polyfills = require('./src/utils.js').polyfills,

    // TODO: Find some way to do this better (async)
    assignPolyfill = require('./polyfills/object.assign.js');

    if (!Object.assign) {
        assignPolyfill();
    }

    WC.extendWith([evts.on, evts.trigger, evts.off, templates.template, templates.templateFragment, data, render, renderOnData, bindPropToAttr]);

    WC.polyfills = polyfills;
})();

},{"./polyfills/object.assign.js":2,"./src/extensions/bindPropToAttr/bindPropToAttr":3,"./src/extensions/data/data":4,"./src/extensions/events/events":5,"./src/extensions/render/render":7,"./src/extensions/template/template":8,"./src/utils.js":10,"./src/wc":11}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function () {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function value(target) {
            for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                sources[_key - 1] = arguments[_key];
            }

            if ([undefined, null].indexOf(target) >= 0) {
                throw new TypeError('Cannot convert first argument to object');
            }

            return sources.reduce(function (target, source) {
                if ([undefined, null].indexOf(source) < 0) {

                    Object.keys(Object(source)).forEach(function (srcKey) {
                        var desc = Object.getOwnPropertyDescriptor(source, srcKey);
                        if (dec && desc.enumerable) {
                            target[srcKey] = source[srcKey];
                        }
                    });
                }
                return target;
            });
        }
    });
};

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = data;

function data(WC) {

    if (!WC.missingDeps('bindAttrToProp', ['on', 'trigger']).length) {

        WC.extensions.on('created', function () {
            var compo = this;
            Object.defineProperty(compo, 'bindAttrToProp', {
                get: function get() {
                    return function (attr, prop) {
                        Object.defineProperty(compo, prop, {
                            enumerable: true,
                            get: function get() {
                                return compo.getAttribute(attr);
                            },
                            set: function set(val) {
                                return compo.setAttribute(val);
                            }
                        });
                    };
                }
            });
        });
    }
    return WC;
}

module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = data;

function data(WC) {

    if (WC.missingDeps('data', ['on', 'trigger']).length) {
        return;
    }

    WC.extensions.on('created', function () {
        var _this = this;

        var data = {};
        Object.defineProperty(this, 'data', {
            get: function get() {
                return data;
            },
            set: function set(dataObj) {
                data = dataObj;
                _this.trigger('data', dataObj);
            }
        });
        Object.observe(data, function (changes) {
            if (changes.length) {
                _this.trigger('data', dataObj);
            }
        }, ['add', 'update', 'delete']);
    });
}

module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

var _slice = Array.prototype.slice;
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.on = on;
exports.trigger = trigger;
exports.off = off;
var natives = {
    created: 'createdCallback',
    attached: 'attachedCallback',
    detached: 'detachedCallback',
    attributeChanged: 'attributeChangedCallback'
},
    events = {},
    initQueue = function initQueue(qName) {
    return events[qName] = [];
},
    onEvent = (function (_onEvent) {
    function onEvent(_x, _x2) {
        return _onEvent.apply(this, arguments);
    }

    onEvent.toString = function () {
        return _onEvent.toString();
    };

    return onEvent;
})(function (evtName, fn) {
    if (typeof fn !== 'function') {
        return;
    }
    var queue = events[evtName] || initQueue(evtName);
    queue.push(fn);

    //Auto prevent memory some leaks
    if (evtName === 'attached') {
        onEvent.call(this, 'detached', function () {
            this.off(evtName, fn);
        });
    }
}),
    trigger = function trigger(eventName) {
    var _this = this;

    var payload = arguments[1] === undefined ? {} : arguments[1];
    var bubbles = arguments[2] === undefined ? true : arguments[2];

    var queue = events[eventName] || [];
    queue.forEach(function (listener) {
        return listener.call(_this, payload);
    });
    this.dispatchEvent(new CustomEvent(eventName, { detail: payload,
        bubbles: bubbles }));
},
    off = function off(evtName, fn) {
    var queue = events[evtName];
    if (Array.isArray(queue)) {
        events[evtName] = queue.filter(function (listener) {
            return listener !== fn;
        });
    }
};

function on(WC) {
    if (WC.missingDeps('on', []).length) {
        return;
    }
    // Binding to the native Web Component lifecycle methods
    // causing them to trigger relevant callbacks.
    Object.keys(natives).forEach(function (key) {
        WC.extensions[natives[key]] = function () {
            trigger.call(this, key, [].concat(_slice.call(arguments)));
        };
    });
    WC.extensions.on = onEvent;
}

function trigger(WC) {
    if (WC.missingDeps('trigger', []).length) {
        return;
    }
    WC.extensions.trigger = trigger;
}

function off(WC) {
    if (WC.missingDeps('off', []).length) {
        return;
    }
    WC.extensions.off = off;
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = r;

function r(templateFrag, data) {

    [].slice.call(templateFrag.childNodes).map(function (node) {
        if (node.nodeType === 3) {
            renderTextNode(node, data);
        } else {
            r(node, data);
            renderElAttrs(node, data);
        }
    });

    return templateFrag;

    function renderTextNode(textNode, data) {
        textNode.textContent = renderString(textNode.textContent, data);
    }

    function renderElAttrs(fragment, data) {
        if (fragment.attributes) {
            [].slice.call(fragment.attributes).forEach(function (attr) {
                renderAttr(attr, data, fragment);
            });
        }
    }

    function renderAttr(attrObj, data, fragment) {
        var newAttr = renderString(attrObj.name, data),
            newVal = renderString(attrObj.value, data);

        if (attrObj.name !== newAttr) {
            fragment.removeAttribute(attrObj.name);
            fragment.setAttribute(newAttr, newVal);
        } else if (attrObj.value !== newVal) {
            fragment.setAttribute(newAttr, newVal);
        }
    }

    function renderString(string, data) {
        var delim = {
            open: '{{',
            close: '}}'
        },
            bindingRE = new RegExp('(' + delim.open + '\\s*)(.*?)(\\s*' + delim.close + ')', 'ig'),
            matches = string.match(bindingRE),
            replacements,
            newStr = string.slice();

        if (matches) {
            matches.map(function (binding) {
                var delimRE = new RegExp(delim.open + '\\s*(.*?)\\s*' + delim.close + '', 'i'),
                    bindingParts = binding.match(delimRE),
                    itm = bindingParts[1];
                if (itm === 'this') {
                    return data;
                } else {
                    return itm.split(/\.|\//g).reduce(function (val, segment) {
                        return val && val[segment] || '';
                    }, data);
                }
            }).forEach(function (item, idx) {
                newStr = newStr.replace(matches[idx], item);
            });
        }
        return newStr;
    }
}

module.exports = exports['default'];

},{}],7:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = render;

var _r = require('./domingo2');

var _r2 = _interopRequireWildcard(_r);

function render(WC) {

    if (WC.missingDeps('render', ['on', 'trigger']).length) {
        return;
    }

    Object.defineProperty(WC.extensions, 'render', {
        get: function get() {
            return function () {
                var _this = this;

                var shadowRoot = this.shadowRoot || this.createShadowRoot(),
                    data = Array.isArray(this.data) ? this.data : [this.data];

                [].concat(_toConsumableArray(shadowRoot.childNodes)).forEach(function (node) {
                    return shadowRoot.removeChild(node);
                });
                data.forEach(function (datum) {
                    var shadowFrag = _r2['default'](_this.templateFragment, datum);
                    return shadowRoot.appendChild(shadowFrag);
                });
                this.trigger('render');
            };
        },
        set: function set() {
            return console.error('templateFragment is not settable');
        }
    });
}

module.exports = exports['default'];

},{"./domingo2":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.template = template;
exports.templateFragment = templateFragment;

function template(WC) {
    if (WC.missingDeps('template', ['on']).length) {
        return;
    }

    var doc = document.currentScript.ownerDocument;
    WC.extensions.on('created', function () {
        var templateEl = doc.querySelector('template');

        Object.defineProperty(this, 'template', {
            get: function get() {
                return templateEl;
            },
            set: function set(templ) {
                return templateEl = templ;
            }
        });
    });
}

function templateFragment(WC) {

    if (WC.missingDeps('templateFragment', ['on']).length) {
        return;
    }

    WC.extensions.on('created', function () {
        var _this = this;

        Object.defineProperty(this, 'templateFragment', {
            get: function get() {
                return document.importNode(_this.template.content, true);
            },
            set: function set(templ) {
                return console.error('templateFragment is not settable');
            }
        });
    });
}

},{}],9:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _import = require('./utils');

var util = _interopRequireWildcard(_import);

var isString = function isString(thing) {
    return util.typeOf(thing) === 'string';
};

exports['default'] = function (name) {
    var config = arguments[1] === undefined ? {} : arguments[1];

    var proto = config.prototype || HTMLElement.prototype,
        ext = config['extends'];

    proto = isString(proto) ? document.createElement(proto) : proto;
    proto = util.protoChain(WC.extensions, proto);

    return document.registerElement(name, {
        prototype: Object.create(proto, {}),
        'extends': ext
    });
};

module.exports = exports['default'];

},{"./utils":10}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.typeOf = typeOf;
exports.protoChain = protoChain;

/*
    srcs: [srcObject]
    srcObject: {
        test: <Boolean || Function:Boolean>,
        src: <String:URL to polyfill>
    }
*/

exports.polyfills = polyfills;

function typeOf(thing) {
    return ({}).toString.call(thing).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function protoChain() {
    for (var _len = arguments.length, objs = Array(_len), _key = 0; _key < _len; _key++) {
        objs[_key] = arguments[_key];
    }

    return objs.reverse().reduce(function (proto, obj) {
        Object.setPrototypeOf(obj, proto);
        return obj;
    });
}

function polyfills() {
    for (var _len2 = arguments.length, srcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        srcs[_key2] = arguments[_key2];
    }

    return new Promise(function (res, rej) {
        srcs.forEach(function (src) {
            var test = typeof src.test === 'function' ? src.test() : !!src;

            if (test) {
                res();
            } else {
                var scrpt = document.createElement('script');
                scrpt.onerror = rej;
                scrpt.onload = res;
                scrpt.src = src;
                document.body.appendChild(scrpt);
            }
        });
    });
}

},{}],11:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _register = require('./register');

var _register2 = _interopRequireWildcard(_register);

// Array.from polyfill
// This is not a spec compliant polyfil but covers the vast
// majority of use cases. In particular it fills how Bable uses
// it to transpile the spread operator.

// TODO: Need to research why babel trys to use Array.from
//       without implementing a polyfil internally as they
//       do with other things. As of the time of this note,
//       Array.from is only implemented in FireFox.
if (!Array.from) Array.from = function (arrayLike) {
    return [].slice.call(arrayLike);
};

var extensions = {},
    WC = Object.create(null, {
    register: {
        enumerable: true,
        configurable: false,
        writable: false,
        value: _register2['default'].bind(WC)
    },

    // A dictionary of applied extensions.
    // Every applied extention will be available to each Winston Churchill
    // component in the app.
    extensions: {
        enumerable: true,
        get: function get() {
            return extensions;
        },
        set: function set(ext) {
            return new Error('Cannot overwrite `extensions` property on WC');
        }
    },

    extendWith: {
        enumerable: true,
        get: function get() {
            return function (extensionsList) {
                extensionsList = Array.isArray(extensionsList) ? extensionsList : [extensionsList];
                extensionsList.forEach(function (extension) {
                    extension(WC);
                });
            };
        }
    },

    missingDeps: {
        enumerable: true,
        get: function get() {
            return function (extention, deps) {
                var missings = deps.reduce(function (missing, curr) {
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
            };
        }
    }
});

exports['default'] = window.WC = WC;
module.exports = exports['default'];

},{"./register":9}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3BvbHlmaWxscy9vYmplY3QuYXNzaWduLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL2JpbmRQcm9wVG9BdHRyL2JpbmRQcm9wVG9BdHRyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL2RhdGEvZGF0YS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3JlbmRlci9kb21pbmdvMi5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9yZW5kZXIvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQVk7OztBQUdULFFBQUksRUFBRSxH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TyxRQUFRLENBQUM7YUFFbkI7U0FBQTtLQUNKO0NBQ0osQ0FBQyxDQUFDOztxQkFFUSxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAvL1RoaXMgaXMgd2lsbCBiZSB0aGUgV0MgZGlzdHJvLlxuICAgIC8vIGltcG9ydCBXQyBmcm9tICcuL3NyYy9pbmRleCc7XG4gICAgbGV0IFdDID0gcmVxdWlyZSgnLi9zcmMvd2MnKSxcblxuICAgICAgICByZW5kZXJPbkRhdGEgPSBmdW5jdGlvbiAoV0MpIHtcbiAgICAgICAgICAgIGlmIChXQy5taXNzaW5nRGVwcygncmVuZGVyT25EYXRhJywgWydvbicsICd0ZW1wbGF0ZUZyYWdtZW50JywgJ2RhdGEnXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cbiAgICAgICAgICAgIFdDLmV4dGVuc2lvbnMub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHRoaXMudGVtcGxhdGVGcmFnbWVudCwgdGhpcy5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgLy8gaW1wb3J0IG9uIGZyb20gJy4vZXh0ZW5zaW9ucy9vbic7XG4gICAgLy8gaW1wb3J0IHJlbmRlciBmcm9tICcuL2V4dGVuc2lvbnMvcmVuZGVyJztcbiAgICAvLyBpbXBvcnQgZGF0YSBmcm9tICcuL2V4dGVuc2lvbnMvZGF0YSc7XG4gICAgLy8gaW1wb3J0IHRlbXBsYXRlLCB7IHRlbXBsYXRlRnJhZ21lbnR9IGZyb20gJy4vZXh0ZW5zaW9ucy90ZW1wbGF0ZSc7XG5cbiAgICAgICAgZXZ0cyA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvZXZlbnRzL2V2ZW50cycpLFxuICAgICAgICByZW5kZXIgPSByZXF1aXJlKCcuL3NyYy9leHRlbnNpb25zL3JlbmRlci9yZW5kZXInKSxcbiAgICAgICAgZGF0YSA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvZGF0YS9kYXRhJyksXG4gICAgICAgIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvdGVtcGxhdGUvdGVtcGxhdGUnKSxcbiAgICAgICAgYmluZFByb3BUb0F0dHIgPSByZXF1aXJlKCcuL3NyYy9leHRlbnNpb25zL2JpbmRQcm9wVG9BdHRyL2JpbmRQcm9wVG9BdHRyJyksXG5cbiAgICAgICAgcG9seWZpbGxzID0gcmVxdWlyZSgnLi9zcmMvdXRpbHMuanMnKS5wb2x5ZmlsbHMsXG5cbiAgICAgICAgLy8gVE9ETzogRmluZCBzb21lIHdheSB0byBkbyB0aGlzIGJldHRlciAoYXN5bmMpXG4gICAgICAgIGFzc2lnblBvbHlmaWxsID0gcmVxdWlyZSgnLi9wb2x5ZmlsbHMvb2JqZWN0LmFzc2lnbi5qcycpO1xuXG4gICAgaWYgKCFPYmplY3QuYXNzaWduKSB7YXNzaWduUG9seWZpbGwoKTt9XG5cbiAgICBXQy5leHRlbmRXaXRoKFtldnRzLm9uLCBldnRzLnRyaWdnZXIsIGV2dHMub2ZmLFxuICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlcy50ZW1wbGF0ZSwgdGVtcGxhdGVzLnRlbXBsYXRlRnJhZ21lbnQsXG4gICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICByZW5kZXIsXG4gICAgICAgICAgICAgICAgICAgcmVuZGVyT25EYXRhLFxuICAgICAgICAgICAgICAgICAgIGJpbmRQcm9wVG9BdHRyXSk7XG5cbiAgICBXQy5wb2x5ZmlsbHMgPSBwb2x5ZmlsbHM7XG5cbn0pKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2Fzc2lnbicsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIHZhbHVlOiAodGFyZ2V0LCAuLi5zb3VyY2VzKSA9PiB7XG4gICAgICAgICAgICBpZiAoW3VuZGVmaW5lZCwgbnVsbF0uaW5kZXhPZih0YXJnZXQpID49IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBmaXJzdCBhcmd1bWVudCB0byBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZXMucmVkdWNlKCAodGFyZ2V0LCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoW3VuZGVmaW5lZCwgbnVsbF0uaW5kZXhPZihzb3VyY2UpIDwgMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKCAoc3JjS2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBzcmNLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlYyAmJiBkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbc3JjS2V5XSA9IHNvdXJjZVtzcmNLZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGF0YShXQykge1xuXG4gICAgaWYgKCFXQy5taXNzaW5nRGVwcygnYmluZEF0dHJUb1Byb3AnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7XG5cbiAgICAgICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBjb21wbyA9IHRoaXM7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29tcG8sICdiaW5kQXR0clRvUHJvcCcsIHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IGZ1bmN0aW9uIChhdHRyLCBwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb21wbywgcHJvcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gY29tcG8uZ2V0QXR0cmlidXRlKGF0dHIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0OiB2YWwgPT4gY29tcG8uc2V0QXR0cmlidXRlKHZhbClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gV0M7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRhKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ2RhdGEnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXRhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkYXRhLFxuICAgICAgICAgICAgc2V0OiAoZGF0YU9iaikgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhT2JqO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGFPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0Lm9ic2VydmUoZGF0YSwgY2hhbmdlcyA9PiB7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2RhdGEnLCBkYXRhT2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgWydhZGQnLCAndXBkYXRlJywgJ2RlbGV0ZSddKTtcbiAgICB9KTtcbn1cbiIsImxldCBuYXRpdmVzID0ge1xuICAgICAgICBjcmVhdGVkOiAnY3JlYXRlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0YWNoZWQ6ICdhdHRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgZGV0YWNoZWQ6ICdkZXRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZDogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaydcbiAgICB9LFxuICAgIGV2ZW50cyA9IHt9LFxuICAgIGluaXRRdWV1ZSA9IHFOYW1lID0+IGV2ZW50c1sgcU5hbWUgXSA9IFtdLFxuICAgIG9uRXZlbnQgPSBmdW5jdGlvbiAoIGV2dE5hbWUsIGZuICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHsgcmV0dXJuOyB9XG4gICAgICAgIGxldCBxdWV1ZSA9IGV2ZW50c1sgZXZ0TmFtZSBdIHx8IGluaXRRdWV1ZSggZXZ0TmFtZSk7XG4gICAgICAgIHF1ZXVlLnB1c2goIGZuICk7XG5cbiAgICAgICAgLy9BdXRvIHByZXZlbnQgbWVtb3J5IHNvbWUgbGVha3NcbiAgICAgICAgaWYgKGV2dE5hbWUgPT09ICdhdHRhY2hlZCcpIHtcbiAgICAgICAgICAgIG9uRXZlbnQuY2FsbCh0aGlzLCAnZGV0YWNoZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vZmYoZXZ0TmFtZSwgZm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXlsb2FkID0ge30sIGJ1YmJsZXM9dHJ1ZSkge1xuICAgICAgICBsZXQgcXVldWUgPSBldmVudHNbIGV2ZW50TmFtZSBdIHx8IFtdO1xuICAgICAgICBxdWV1ZS5mb3JFYWNoKCBsaXN0ZW5lciA9PiBsaXN0ZW5lci5jYWxsKCB0aGlzLCBwYXlsb2FkICkpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoIG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtkZXRhaWw6IHBheWxvYWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IGJ1YmJsZXN9KSApO1xuICAgIH0sXG4gICAgb2ZmID0gZnVuY3Rpb24gKGV2dE5hbWUsIGZuKSB7XG4gICAgICAgIGxldCBxdWV1ZSA9IGV2ZW50c1sgZXZ0TmFtZSBdO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShxdWV1ZSkpIHtcbiAgICAgICAgICAgIGV2ZW50c1tldnROYW1lXSA9IHF1ZXVlLmZpbHRlcihsaXN0ZW5lciA9PiBsaXN0ZW5lciAhPT0gZm4pO1xuICAgICAgICB9XG4gICAgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uKFdDKSB7XG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdvbicsIFtdKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG4gICAgLy8gQmluZGluZyB0byB0aGUgbmF0aXZlIFdlYiBDb21wb25lbnQgbGlmZWN5Y2xlIG1ldGhvZHNcbiAgICAvLyBjYXVzaW5nIHRoZW0gdG8gdHJpZ2dlciByZWxldmFudCBjYWxsYmFja3MuXG4gICAgT2JqZWN0LmtleXMobmF0aXZlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBXQy5leHRlbnNpb25zW25hdGl2ZXNba2V5XV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyLmNhbGwodGhpcywga2V5LCBbLi4uYXJndW1lbnRzXSk7XG4gICAgICAgIH07XG4gICAgfSk7XG4gICAgV0MuZXh0ZW5zaW9ucy5vbiA9IG9uRXZlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyKFdDKSB7XG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCd0cmlnZ2VyJywgW10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICBXQy5leHRlbnNpb25zLnRyaWdnZXIgPSB0cmlnZ2VyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2ZmKFdDKSB7XG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdvZmYnLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgIFdDLmV4dGVuc2lvbnMub2ZmID0gb2ZmO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcih0ZW1wbGF0ZUZyYWcsIGRhdGEpIHtcblxuICAgIFtdLnNsaWNlLmNhbGwodGVtcGxhdGVGcmFnLmNoaWxkTm9kZXMpLm1hcCggbm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICByZW5kZXJUZXh0Tm9kZShub2RlLCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHIobm9kZSwgZGF0YSk7XG4gICAgICAgICAgICByZW5kZXJFbEF0dHJzKG5vZGUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlRnJhZztcblxuICAgIGZ1bmN0aW9uIHJlbmRlclRleHROb2RlKHRleHROb2RlLCBkYXRhKSB7XG4gICAgICAgIHRleHROb2RlLnRleHRDb250ZW50ID0gcmVuZGVyU3RyaW5nKHRleHROb2RlLnRleHRDb250ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJFbEF0dHJzKGZyYWdtZW50LCBkYXRhKSB7XG4gICAgICAgIGlmIChmcmFnbWVudC5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBbXS5zbGljZS5jYWxsKGZyYWdtZW50LmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJBdHRyKGF0dHIsIGRhdGEsIGZyYWdtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyQXR0cihhdHRyT2JqLCBkYXRhLCBmcmFnbWVudCkge1xuICAgICAgICB2YXIgbmV3QXR0ciA9IHJlbmRlclN0cmluZyhhdHRyT2JqLm5hbWUsIGRhdGEpLFxuICAgICAgICAgICAgbmV3VmFsID0gcmVuZGVyU3RyaW5nKGF0dHJPYmoudmFsdWUsIGRhdGEpO1xuXG4gICAgICAgIGlmIChhdHRyT2JqLm5hbWUgIT09IG5ld0F0dHIpIHtcbiAgICAgICAgICAgIGZyYWdtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyT2JqLm5hbWUpO1xuICAgICAgICAgICAgZnJhZ21lbnQuc2V0QXR0cmlidXRlKG5ld0F0dHIsIG5ld1ZhbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0ck9iai52YWx1ZSAhPT0gbmV3VmFsKSB7XG4gICAgICAgICAgICBmcmFnbWVudC5zZXRBdHRyaWJ1dGUobmV3QXR0ciwgbmV3VmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclN0cmluZyhzdHJpbmcsIGRhdGEpIHtcbiAgICAgICAgdmFyIGRlbGltID0ge1xuICAgICAgICAgICAgICAgIG9wZW46ICd7eycsXG4gICAgICAgICAgICAgICAgY2xvc2U6ICd9fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kaW5nUkUgPSBuZXcgUmVnRXhwKCcoJyArIGRlbGltLm9wZW4gKyAnXFxcXHMqKSguKj8pKFxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcpJywgJ2lnJyksXG4gICAgICAgICAgICBtYXRjaGVzID0gc3RyaW5nLm1hdGNoKGJpbmRpbmdSRSksXG4gICAgICAgICAgICByZXBsYWNlbWVudHMsXG4gICAgICAgICAgICBuZXdTdHIgPSBzdHJpbmcuc2xpY2UoKTtcblxuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgbWF0Y2hlcy5tYXAoZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVsaW1SRSA9IG5ldyBSZWdFeHAoZGVsaW0ub3BlbiArICdcXFxccyooLio/KVxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcnLCAnaScpLFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nUGFydHMgPSBiaW5kaW5nLm1hdGNoKGRlbGltUkUpLFxuICAgICAgICAgICAgICAgICAgICBpdG0gPSBiaW5kaW5nUGFydHNbMV07XG4gICAgICAgICAgICAgICAgaWYgKGl0bSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdG0uc3BsaXQoL1xcLnxcXC8vZykucmVkdWNlKGZ1bmN0aW9uICh2YWwsIHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAodmFsICYmIHZhbFtzZWdtZW50XSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIH0sIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIG5ld1N0ciA9IG5ld1N0ci5yZXBsYWNlKG1hdGNoZXNbaWR4XSwgaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyO1xuICAgIH1cbn1cbiIsImltcG9ydCByIGZyb20gJy4vZG9taW5nbzInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW5kZXIoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygncmVuZGVyJywgWydvbicsICd0cmlnZ2VyJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXQy5leHRlbnNpb25zLCAncmVuZGVyJywge1xuICAgICAgICBnZXQ6ICgpID0+IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBzaGFkb3dSb290ID0gdGhpcy5zaGFkb3dSb290IHx8IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpLFxuICAgICAgICAgICAgZGF0YSA9IEFycmF5LmlzQXJyYXkodGhpcy5kYXRhKSA/IHRoaXMuZGF0YSA6IFt0aGlzLmRhdGFdO1xuXG4gICAgICAgICAgICBbLi4uc2hhZG93Um9vdC5jaGlsZE5vZGVzXVxuICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChub2RlID0+IHNoYWRvd1Jvb3QucmVtb3ZlQ2hpbGQobm9kZSkpO1xuICAgICAgICAgICAgZGF0YS5mb3JFYWNoKGRhdHVtID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2hhZG93RnJhZyA9IHIodGhpcy50ZW1wbGF0ZUZyYWdtZW50LCBkYXR1bSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoIHNoYWRvd0ZyYWcgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdyZW5kZXInKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiAoKSA9PiBjb25zb2xlLmVycm9yKCd0ZW1wbGF0ZUZyYWdtZW50IGlzIG5vdCBzZXR0YWJsZScpXG4gICAgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUoV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlJywgWydvbiddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBsZXQgZG9jID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5vd25lckRvY3VtZW50O1xuICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGVtcGxhdGVFbCxcbiAgICAgICAgICAgIHNldDogKHRlbXBsKSA9PiB0ZW1wbGF0ZUVsID0gdGVtcGxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUZyYWdtZW50KFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlRnJhZ21lbnQnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGVtcGxhdGVGcmFnbWVudCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgaXNTdHJpbmcgPSB0aGluZyA9PiB1dGlsLnR5cGVPZih0aGluZykgPT09ICdzdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgY29uZmlnID0ge30pID0+IHtcbiAgICBsZXQgcHJvdG8gPSBjb25maWcucHJvdG90eXBlIHx8IEhUTUxFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgZXh0ID0gY29uZmlnLmV4dGVuZHM7XG5cbiAgICBwcm90byA9IGlzU3RyaW5nKHByb3RvKSA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocHJvdG8pIDogcHJvdG87XG4gICAgcHJvdG8gPSB1dGlsLnByb3RvQ2hhaW4oV0MuZXh0ZW5zaW9ucywgcHJvdG8pO1xuXG4gICAgcmV0dXJuIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCB7XG4gICAgICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShwcm90bywge30pLFxuICAgICAgICBleHRlbmRzOiBleHRcbiAgICB9KTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gdHlwZU9mKHRoaW5nKSB7XG4gICAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbCh0aGluZykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3RvQ2hhaW4oLi4ub2Jqcykge1xuICAgIHJldHVybiBvYmpzLnJldmVyc2UoKS5yZWR1Y2UoKHByb3RvLCBvYmopID0+IHtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xufVxuXG5cbi8qXG4gICAgc3JjczogW3NyY09iamVjdF1cbiAgICBzcmNPYmplY3Q6IHtcbiAgICAgICAgdGVzdDogPEJvb2xlYW4gfHwgRnVuY3Rpb246Qm9vbGVhbj4sXG4gICAgICAgIHNyYzogPFN0cmluZzpVUkwgdG8gcG9seWZpbGw+XG4gICAgfVxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxscyguLi5zcmNzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXMsIHJlaikge1xuICAgICAgICBzcmNzLmZvckVhY2goc3JjID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXN0ID0gKHR5cGVvZiBzcmMudGVzdCA9PT0gJ2Z1bmN0aW9uJykgPyBzcmMudGVzdCgpIDogISFzcmM7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0KSB7XG4gICAgICAgICAgICAgICAgcmVzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzY3JwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgIHNjcnB0Lm9uZXJyb3IgPSByZWo7XG4gICAgICAgICAgICAgICAgc2NycHQub25sb2FkID0gcmVzO1xuICAgICAgICAgICAgICAgIHNjcnB0LnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcnB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5cbi8vIEFycmF5LmZyb20gcG9seWZpbGxcbi8vIFRoaXMgaXMgbm90IGEgc3BlYyBjb21wbGlhbnQgcG9seWZpbCBidXQgY292ZXJzIHRoZSB2YXN0XG4vLyBtYWpvcml0eSBvZiB1c2UgY2FzZXMuIEluIHBhcnRpY3VsYXIgaXQgZmlsbHMgaG93IEJhYmxlIHVzZXNcbi8vIGl0IHRvIHRyYW5zcGlsZSB0aGUgc3ByZWFkIG9wZXJhdG9yLlxuXG4vLyBUT0RPOiBOZWVkIHRvIHJlc2VhcmNoIHdoeSBiYWJlbCB0cnlzIHRvIHVzZSBBcnJheS5mcm9tXG4vLyAgICAgICB3aXRob3V0IGltcGxlbWVudGluZyBhIHBvbHlmaWwgaW50ZXJuYWxseSBhcyB0aGV5XG4vLyAgICAgICBkbyB3aXRoIG90aGVyIHRoaW5ncy4gQXMgb2YgdGhlIHRpbWUgb2YgdGhpcyBub3RlLFxuLy8gICAgICAgQXJyYXkuZnJvbSBpcyBvbmx5IGltcGxlbWVudGVkIGluIEZpcmVGb3guXG5pZiAoIUFycmF5LmZyb20pICBBcnJheS5mcm9tID0gYXJyYXlMaWtlID0+IFtdLnNsaWNlLmNhbGwoYXJyYXlMaWtlKTtcblxuXG5sZXQgZXh0ZW5zaW9ucyA9IHt9LFxuXG4gICAgV0MgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgcmVnaXN0ZXI6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHJlZ2lzdGVyLmJpbmQoV0MpXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQSBkaWN0aW9uYXJ5IG9mIGFwcGxpZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgLy8gRXZlcnkgYXBwbGllZCBleHRlbnRpb24gd2lsbCBiZSBhdmFpbGFibGUgdG8gZWFjaCBXaW5zdG9uIENodXJjaGlsbFxuICAgICAgICAvLyBjb21wb25lbnQgaW4gdGhlIGFwcC5cbiAgICAgICAgZXh0ZW5zaW9uczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZXh0ZW5zaW9ucyxcbiAgICAgICAgICAgIHNldDogKGV4dCkgPT4gbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIGBleHRlbnNpb25zYCBwcm9wZXJ0eSBvbiBXQycpXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kV2l0aDoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVuc2lvbnNMaXN0KSB7XG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uc0xpc3QgPSBBcnJheS5pc0FycmF5KGV4dGVuc2lvbnNMaXN0KSA/IGV4dGVuc2lvbnNMaXN0IDogW2V4dGVuc2lvbnNMaXN0XTtcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uKFdDKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtaXNzaW5nRGVwczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVudGlvbiwgZGVwcykge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5ncyA9IGRlcHMucmVkdWNlKChtaXNzaW5nLCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tjdXJyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKGN1cnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tleHRlbnRpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIFdDLmV4dGVuc2lvbnNbZXh0ZW50aW9uXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1pc3NpbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgV2luc290b24gQ2h1cmNoaWxsIGAnICsgZXh0ZW50aW9uICsgJ2AgZXh0ZW50aW9uIGlzIG1pc3NpbmcgdGhlc2UgZGVwZW5kZW5jaWVzOiBcXG4nICsgbWlzc2luZ3Muam9pbignXFxuLCcpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWlzc2luZ3M7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5leHBvcnQgZGVmYXVsdCB3aW5kb3cuV0MgPSBXQztcbiJdfQ==
