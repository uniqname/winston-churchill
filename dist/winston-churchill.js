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
            this.render(this.data);
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
        bindAttrToProp = require('./src/extensions/bindAttrToProp/bindAttrToProp'),
        polyfills = require('./src/utils.js').polyfills,

    // TODO: Find some way to do this better (async)
    assignPolyfill = require('./polyfills/object.assign.js');

    if (!Object.assign) {
        assignPolyfill();
    }

    WC.extendWith([evts.on, evts.trigger, evts.off, templates.template, templates.templateFragment, data, render, renderOnData, bindAttrToProp]);

    WC.polyfills = polyfills;
})();

},{"./polyfills/object.assign.js":7,"./src/extensions/bindAttrToProp/bindAttrToProp":8,"./src/extensions/data/data":9,"./src/extensions/events/events":10,"./src/extensions/render/render":11,"./src/extensions/template/template":12,"./src/utils.js":14,"./src/wc":15}],2:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = DOMingo;

var _mapNode = require('./mapNode');

var _mapNode2 = _interopRequireWildcard(_mapNode);

var _interleave = require('./interleave');

var _interleave2 = _interopRequireWildcard(_interleave);

function DOMingo(frag, shadowRoot) {
    var shadow = frag.cloneNode(true),
        map = [].concat(_toConsumableArray(shadow.childNodes)).reduce(_mapNode2['default'], []);

    shadowRoot.appendChild(shadow);

    //the render function.
    return function (data) {
        map = map.map(function (bindObj) {
            bindObj.currentValues = bindObj.dataPaths.map(function (path, i) {
                var val = path.split(/\.|\//g).reduce(function (val, segment) {
                    return val && val[segment] || '';
                }, data);

                return val !== undefined ? val : bindObj.currentValues[i];
            });
            var propVal = _interleave2['default'](bindObj.staticParts, bindObj.currentValues).join('');

            var prop = bindObj.node.value !== undefined ? 'value' : 'textContent';
            bindObj.node[prop] = propVal;

            return bindObj;
        });

        return shadow;
    };
}

window.DOMingo = DOMingo;
module.exports = exports['default'];

},{"./interleave":4,"./mapNode":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = bindingsInStr;

function bindingsInStr() {
    var str = arguments[0] === undefined ? '' : arguments[0];

    var _ref = arguments[1] === undefined ? {} : arguments[1];

    var _ref$openDelim = _ref.openDelim;
    var openDelim = _ref$openDelim === undefined ? '{{' : _ref$openDelim;
    var _ref$closeDelim = _ref.closeDelim;
    var closeDelim = _ref$closeDelim === undefined ? '}}' : _ref$closeDelim;

    var bindPattern = new RegExp('' + openDelim + '([^' + closeDelim + ']*)' + closeDelim, 'g'),
        matches = str.match(bindPattern) || [],
        findLabel = RegExp(bindPattern.source);
    return matches.map(function (match) {
        return match.match(findLabel)[1].trim();
    });
}

module.exports = exports['default'];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (arr1, arr2) {
    return arr1.reduce(function (interleaved, item, i) {
        var arr2Item = arr2[i];
        interleaved.push(item);
        // console.log(interleaved);
        if (arr2Item !== undefined) {
            interleaved.push(arr2Item);
            // console.log(interleaved);
        }
        return interleaved;
    }, []);
};

module.exports = exports["default"];

},{}],5:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = makeEntry;

var _bindingsInStr = require('./bindingsInStr');

var _bindingsInStr2 = _interopRequireWildcard(_bindingsInStr);

function makeEntry(node) {
    var _ref = arguments[1] === undefined ? {} : arguments[1];

    var _ref$openDelim = _ref.openDelim;
    var openDelim = _ref$openDelim === undefined ? '{{' : _ref$openDelim;
    var _ref$closeDelim = _ref.closeDelim;
    var closeDelim = _ref$closeDelim === undefined ? '}}' : _ref$closeDelim;

    var bindPattern = new RegExp('' + openDelim + '[^' + closeDelim + ']*' + closeDelim, 'g'),
        prop = node.value ? 'value' : 'textContent',
        bindings = _bindingsInStr2['default'](node[prop], { openDelim: openDelim, closeDelim: closeDelim }),
        staticParts = node[prop].split(bindPattern);
    if (bindings.length) {
        return {
            node: node,
            staticParts: staticParts,
            dataPaths: bindings,
            currentValues: bindings.map(function (binding) {
                return '';
            })
        };
    } else {
        return null;
    }
}

/*
{
    node: <renderTargetNode>,
    staticParts: [String],
    dataPaths: [String],
    currentValues: [String]
}
*/

module.exports = exports['default'];

},{"./bindingsInStr":3}],6:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapNode;

var _makeEntry = require('./makeEntry');

var _makeEntry2 = _interopRequireWildcard(_makeEntry);

function mapNode(map, node) {
    if (node.nodeType === 1) {
        return [].slice.call(node.childNodes).concat([].slice.call(node.attributes)).reduce(mapNode, map);
    } else {
        var entry = _makeEntry2['default'](node);
        if (entry !== null) {
            map.push(entry);
        }
        return map;
    }
}

module.exports = exports['default'];

},{"./makeEntry":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
                    return function (attr, prop, isBoolean) {
                        Object.defineProperty(compo, prop, {
                            enumerable: true,
                            get: function get() {
                                return isBoolean ? compo.hasAttribute(attr) : compo.getAttribute(attr);
                            },
                            set: function set(val) {
                                var prop = isBoolean && !!val ? 'setAttribute' : 'removeAttribute   ';
                                compo[prop](attr, val);
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

},{}],9:[function(require,module,exports){
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
            console.log('observed changes: ', changes);
            if (changes.length) {
                _this.trigger('data', data);
            }
        }, ['add', 'update', 'delete']);
    });
}

module.exports = exports['default'];

},{}],10:[function(require,module,exports){
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
            trigger.call.apply(trigger, [this, key].concat(_slice.call(arguments)));
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

},{}],11:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = render;

var _DOMingo = require('../../../bower_components/DOMingo/ES6/DOMingo');

var _DOMingo2 = _interopRequireWildcard(_DOMingo);

function render(WC) {

    if (WC.missingDeps('render', ['on', 'trigger', 'templateFragment']).length) {
        return;
    }

    WC.extensions.on('created', function () {
        var shadowRoot = this.shadowRoot || this.createShadowRoot(),
            render = _DOMingo2['default'](this.templateFragment, shadowRoot);

        Object.defineProperty(this, 'render', {
            get: function get() {
                return function (data) {
                    render(data);
                    this.trigger('render');
                };
            },
            set: function set() {
                return console.error('templateFragment is not settable');
            }
        });
    });
}

module.exports = exports['default'];

},{"../../../bower_components/DOMingo/ES6/DOMingo":2}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./utils":14}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./register":13}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL2Jvd2VyX2NvbXBvbmVudHMvRE9NaW5nby9FUzYvRE9NaW5nby5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9ib3dlcl9jb21wb25lbnRzL0RPTWluZ28vRVM2L2JpbmRpbmdzSW5TdHIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvYm93ZXJfY29tcG9uZW50cy9ET01pbmdvL0VTNi9pbnRlcmxlYXZlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL2Jvd2VyX2NvbXBvbmVudHMvRE9NaW5nby9FUzYvbWFrZUVudHJ5LmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL2Jvd2VyX2NvbXBvbmVudHMvRE9NaW5nby9FUzYvbWFwTm9kZS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9wb2x5ZmlsbHMvb2JqZWN0LmFzc2lnbi5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9iaW5kQXR0clRvUHJvcC9iaW5kQXR0clRvUHJvcC5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9kYXRhL2RhdGEuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVuc2lvbnMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9yZW5kZXIvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQVk7OztBQUdULFFBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFFeEIsWUFBWSxHQUFHLHNCQUFVLEVBQUUsRUFBRTtBQUN6QixZQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQUUsbUJBQU87U0FBRTs7QUFHMUYsVUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsSUFBSSxFQUFFO0FBQ3JDLGdCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQixDQUFDLENBQUM7S0FDTjs7Ozs7OztBQU9ELFFBQUksR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUM7UUFDaEQsTUFBTSxHQUFHLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQztRQUNsRCxJQUFJLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDO1FBQzVDLFNBQVMsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUM7UUFDekQsY0FBYyxHQUFHLE9BQU8sQ0FBQyxnREFBZ0QsQ0FBQztRQUUxRSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUzs7O0FBRy9D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RUFBRTtBQUMzQixzQkFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ25DOztBQUVELG9CQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDakIsMkJBQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEdBQUcsU0FBUyxHQUFHLCtDQUErQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDbEk7O0FBRUQsdUJBQU8sUUFBUSxDQUFDO2FBRW5CO1NBQUE7S0FDSjtDQUNKLENBQUMsQ0FBQzs7cUJBRVEsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XG4gICAgLy9UaGlzIGlzIHdpbGwgYmUgdGhlIFdDIGRpc3Ryby5cbiAgICAvLyBpbXBvcnQgV0MgZnJvbSAnLi9zcmMvaW5kZXgnO1xuICAgIGxldCBXQyA9IHJlcXVpcmUoJy4vc3JjL3djJyksXG5cbiAgICAgICAgcmVuZGVyT25EYXRhID0gZnVuY3Rpb24gKFdDKSB7XG4gICAgICAgICAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3JlbmRlck9uRGF0YScsIFsnb24nLCAndGVtcGxhdGVGcmFnbWVudCcsICdkYXRhJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuXG4gICAgICAgICAgICBXQy5leHRlbnNpb25zLm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcih0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAvLyBpbXBvcnQgb24gZnJvbSAnLi9leHRlbnNpb25zL29uJztcbiAgICAvLyBpbXBvcnQgcmVuZGVyIGZyb20gJy4vZXh0ZW5zaW9ucy9yZW5kZXInO1xuICAgIC8vIGltcG9ydCBkYXRhIGZyb20gJy4vZXh0ZW5zaW9ucy9kYXRhJztcbiAgICAvLyBpbXBvcnQgdGVtcGxhdGUsIHsgdGVtcGxhdGVGcmFnbWVudH0gZnJvbSAnLi9leHRlbnNpb25zL3RlbXBsYXRlJztcblxuICAgICAgICBldnRzID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW5zaW9ucy9ldmVudHMvZXZlbnRzJyksXG4gICAgICAgIHJlbmRlciA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvcmVuZGVyL3JlbmRlcicpLFxuICAgICAgICBkYXRhID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW5zaW9ucy9kYXRhL2RhdGEnKSxcbiAgICAgICAgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW5zaW9ucy90ZW1wbGF0ZS90ZW1wbGF0ZScpLFxuICAgICAgICBiaW5kQXR0clRvUHJvcCA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvYmluZEF0dHJUb1Byb3AvYmluZEF0dHJUb1Byb3AnKSxcblxuICAgICAgICBwb2x5ZmlsbHMgPSByZXF1aXJlKCcuL3NyYy91dGlscy5qcycpLnBvbHlmaWxscyxcblxuICAgICAgICAvLyBUT0RPOiBGaW5kIHNvbWUgd2F5IHRvIGRvIHRoaXMgYmV0dGVyIChhc3luYylcbiAgICAgICAgYXNzaWduUG9seWZpbGwgPSByZXF1aXJlKCcuL3BvbHlmaWxscy9vYmplY3QuYXNzaWduLmpzJyk7XG5cbiAgICBpZiAoIU9iamVjdC5hc3NpZ24pIHthc3NpZ25Qb2x5ZmlsbCgpO31cblxuICAgIFdDLmV4dGVuZFdpdGgoW2V2dHMub24sIGV2dHMudHJpZ2dlciwgZXZ0cy5vZmYsXG4gICAgICAgICAgICAgICAgICAgdGVtcGxhdGVzLnRlbXBsYXRlLCB0ZW1wbGF0ZXMudGVtcGxhdGVGcmFnbWVudCxcbiAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgIHJlbmRlcixcbiAgICAgICAgICAgICAgICAgICByZW5kZXJPbkRhdGEsXG4gICAgICAgICAgICAgICAgICAgYmluZEF0dHJUb1Byb3BdKTtcblxuICAgIFdDLnBvbHlmaWxscyA9IHBvbHlmaWxscztcblxufSkoKTtcbiIsImltcG9ydCBtYXBOb2RlIGZyb20gJy4vbWFwTm9kZSc7XG5pbXBvcnQgaW50ZXJsZWF2ZSBmcm9tICcuL2ludGVybGVhdmUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBET01pbmdvKGZyYWcsIHNoYWRvd1Jvb3QpIHtcbiAgICBsZXQgc2hhZG93ID0gZnJhZy5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgIG1hcCA9IFsuLi5zaGFkb3cuY2hpbGROb2Rlc10ucmVkdWNlKG1hcE5vZGUsIFtdKTtcblxuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc2hhZG93KTtcblxuICAgIC8vdGhlIHJlbmRlciBmdW5jdGlvbi5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgbWFwID0gbWFwLm1hcCggKGJpbmRPYmopID0+IHtcbiAgICAgICAgICAgIGJpbmRPYmouY3VycmVudFZhbHVlcyA9IGJpbmRPYmouZGF0YVBhdGhzLm1hcCggKHBhdGgsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gcGF0aC5zcGxpdCgvXFwufFxcLy9nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSggKHZhbCwgc2VnbWVudCkgPT4gKHZhbCAmJiB2YWxbc2VnbWVudF0pIHx8ICcnLCBkYXRhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCA/IHZhbCA6IGJpbmRPYmouY3VycmVudFZhbHVlc1tpXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGV0IHByb3BWYWwgPSBpbnRlcmxlYXZlKGJpbmRPYmouc3RhdGljUGFydHMsIGJpbmRPYmouY3VycmVudFZhbHVlcykuam9pbignJyk7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gYmluZE9iai5ub2RlLnZhbHVlICE9PSB1bmRlZmluZWQgPyAndmFsdWUnIDogJ3RleHRDb250ZW50JztcbiAgICAgICAgICAgIGJpbmRPYmoubm9kZVtwcm9wXSA9IHByb3BWYWw7XG5cbiAgICAgICAgICAgIHJldHVybiBiaW5kT2JqO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2hhZG93O1xuICAgIH07XG59XG5cbndpbmRvdy5ET01pbmdvID0gRE9NaW5nbztcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJpbmRpbmdzSW5TdHIoc3RyPScnLCB7b3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319J30gPSB7fSkge1xuICAgIGxldCBiaW5kUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7b3BlbkRlbGltfShbXiR7Y2xvc2VEZWxpbX1dKikke2Nsb3NlRGVsaW19YCwgJ2cnKSxcbiAgICAgICAgbWF0Y2hlcyA9IHN0ci5tYXRjaChiaW5kUGF0dGVybikgfHwgW10sXG4gICAgICAgIGZpbmRMYWJlbCA9IFJlZ0V4cChiaW5kUGF0dGVybi5zb3VyY2UpO1xuICAgICAgICByZXR1cm4gbWF0Y2hlcy5tYXAobWF0Y2ggPT4gIG1hdGNoLm1hdGNoKGZpbmRMYWJlbClbMV0udHJpbSgpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhcnIxLCBhcnIyKSB7XG4gICAgcmV0dXJuIGFycjEucmVkdWNlKCAoaW50ZXJsZWF2ZWQsIGl0ZW0sIGkpID0+IHtcbiAgICAgICAgbGV0IGFycjJJdGVtID0gYXJyMltpXTtcbiAgICAgICAgaW50ZXJsZWF2ZWQucHVzaChpdGVtKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW50ZXJsZWF2ZWQpO1xuICAgICAgICBpZiAoYXJyMkl0ZW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaW50ZXJsZWF2ZWQucHVzaChhcnIySXRlbSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnRlcmxlYXZlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGludGVybGVhdmVkO1xuICAgIH0sIFtdKTtcbn1cbiIsImltcG9ydCBiaW5kaW5nc0luU3RyIGZyb20gJy4vYmluZGluZ3NJblN0cic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VFbnRyeShub2RlLCB7b3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319J30gPSB7fSkge1xuICAgIGxldCBiaW5kUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7b3BlbkRlbGltfVteJHtjbG9zZURlbGltfV0qJHtjbG9zZURlbGltfWAsICdnJyksXG4gICAgICAgIHByb3AgPSBub2RlLnZhbHVlID8gJ3ZhbHVlJyA6ICd0ZXh0Q29udGVudCcsXG4gICAgICAgIGJpbmRpbmdzID0gYmluZGluZ3NJblN0cihub2RlW3Byb3BdLCB7b3BlbkRlbGltOm9wZW5EZWxpbSwgY2xvc2VEZWxpbTpjbG9zZURlbGltfSksXG4gICAgICAgIHN0YXRpY1BhcnRzID0gbm9kZVtwcm9wXS5zcGxpdChiaW5kUGF0dGVybik7XG4gICAgaWYgKGJpbmRpbmdzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgIHN0YXRpY1BhcnRzOiBzdGF0aWNQYXJ0cyxcbiAgICAgICAgICAgIGRhdGFQYXRoczogYmluZGluZ3MsXG4gICAgICAgICAgICBjdXJyZW50VmFsdWVzOiBiaW5kaW5ncy5tYXAoYmluZGluZyA9PiAnJylcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8qXG57XG4gICAgbm9kZTogPHJlbmRlclRhcmdldE5vZGU+LFxuICAgIHN0YXRpY1BhcnRzOiBbU3RyaW5nXSxcbiAgICBkYXRhUGF0aHM6IFtTdHJpbmddLFxuICAgIGN1cnJlbnRWYWx1ZXM6IFtTdHJpbmddXG59XG4qL1xuIiwiaW1wb3J0IG1ha2VFbnRyeSBmcm9tICcuL21ha2VFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hcE5vZGUobWFwLCBub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwobm9kZS5jaGlsZE5vZGVzKVxuICAgICAgICAgICAgICAgICAuY29uY2F0KCBbXS5zbGljZS5jYWxsKG5vZGUuYXR0cmlidXRlcykgKVxuICAgICAgICAgICAgICAgICAucmVkdWNlKG1hcE5vZGUsIG1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGVudHJ5ID0gbWFrZUVudHJ5KG5vZGUpO1xuICAgICAgICBpZiAoZW50cnkgIT09IG51bGwpIHsgbWFwLnB1c2goZW50cnkpOyB9XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsICdhc3NpZ24nLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogKHRhcmdldCwgLi4uc291cmNlcykgPT4ge1xuICAgICAgICAgICAgaWYgKFt1bmRlZmluZWQsIG51bGxdLmluZGV4T2YodGFyZ2V0KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VzLnJlZHVjZSggKHRhcmdldCwgc291cmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFt1bmRlZmluZWQsIG51bGxdLmluZGV4T2Yoc291cmNlKSA8IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaCggKHNyY0tleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgc3JjS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWMgJiYgZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3NyY0tleV0gPSBzb3VyY2Vbc3JjS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRhdGEoV0MpIHtcblxuICAgIGlmICghV0MubWlzc2luZ0RlcHMoJ2JpbmRBdHRyVG9Qcm9wJywgWydvbicsICd0cmlnZ2VyJ10pLmxlbmd0aCkge1xuXG4gICAgICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgY29tcG8gPSB0aGlzO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbXBvLCAnYmluZEF0dHJUb1Byb3AnLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiBmdW5jdGlvbiAoYXR0ciwgcHJvcCwgaXNCb29sZWFuKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb21wbywgcHJvcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gaXNCb29sZWFuID8gY29tcG8uaGFzQXR0cmlidXRlKGF0dHIpIDogY29tcG8uZ2V0QXR0cmlidXRlKGF0dHIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0OiB2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcm9wID0gaXNCb29sZWFuICYmICEhdmFsID8gJ3NldEF0dHJpYnV0ZScgOiAncmVtb3ZlQXR0cmlidXRlICAgJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb1twcm9wXShhdHRyLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBXQztcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRhdGEoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygnZGF0YScsIFsnb24nLCAndHJpZ2dlciddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBXQy5leHRlbnNpb25zLm9uKCdjcmVhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2RhdGEnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IGRhdGEsXG4gICAgICAgICAgICBzZXQ6IChkYXRhT2JqKSA9PiB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGFPYmo7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdkYXRhJywgZGF0YU9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3Qub2JzZXJ2ZShkYXRhLCBjaGFuZ2VzID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvYnNlcnZlZCBjaGFuZ2VzOiAnLCBjaGFuZ2VzKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBbJ2FkZCcsICd1cGRhdGUnLCAnZGVsZXRlJ10pO1xuICAgIH0pO1xufVxuIiwibGV0IG5hdGl2ZXMgPSB7XG4gICAgICAgIGNyZWF0ZWQ6ICdjcmVhdGVkQ2FsbGJhY2snLFxuICAgICAgICBhdHRhY2hlZDogJ2F0dGFjaGVkQ2FsbGJhY2snLFxuICAgICAgICBkZXRhY2hlZDogJ2RldGFjaGVkQ2FsbGJhY2snLFxuICAgICAgICBhdHRyaWJ1dGVDaGFuZ2VkOiAnYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrJ1xuICAgIH0sXG4gICAgZXZlbnRzID0ge30sXG4gICAgaW5pdFF1ZXVlID0gcU5hbWUgPT4gZXZlbnRzWyBxTmFtZSBdID0gW10sXG4gICAgb25FdmVudCA9IGZ1bmN0aW9uICggZXZ0TmFtZSwgZm4gKSB7XG4gICAgICAgIGlmICggdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICkgeyByZXR1cm47IH1cbiAgICAgICAgbGV0IHF1ZXVlID0gZXZlbnRzWyBldnROYW1lIF0gfHwgaW5pdFF1ZXVlKCBldnROYW1lKTtcbiAgICAgICAgcXVldWUucHVzaCggZm4gKTtcblxuICAgICAgICAvL0F1dG8gcHJldmVudCBtZW1vcnkgc29tZSBsZWFrc1xuICAgICAgICBpZiAoZXZ0TmFtZSA9PT0gJ2F0dGFjaGVkJykge1xuICAgICAgICAgICAgb25FdmVudC5jYWxsKHRoaXMsICdkZXRhY2hlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldnROYW1lLCBmbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHBheWxvYWQgPSB7fSwgYnViYmxlcz10cnVlKSB7XG4gICAgICAgIGxldCBxdWV1ZSA9IGV2ZW50c1sgZXZlbnROYW1lIF0gfHwgW107XG4gICAgICAgIHF1ZXVlLmZvckVhY2goIGxpc3RlbmVyID0+IGxpc3RlbmVyLmNhbGwoIHRoaXMsIHBheWxvYWQgKSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCggbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge2RldGFpbDogcGF5bG9hZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogYnViYmxlc30pICk7XG4gICAgfSxcbiAgICBvZmYgPSBmdW5jdGlvbiAoZXZ0TmFtZSwgZm4pIHtcbiAgICAgICAgbGV0IHF1ZXVlID0gZXZlbnRzWyBldnROYW1lIF07XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHF1ZXVlKSkge1xuICAgICAgICAgICAgZXZlbnRzW2V2dE5hbWVdID0gcXVldWUuZmlsdGVyKGxpc3RlbmVyID0+IGxpc3RlbmVyICE9PSBmbik7XG4gICAgICAgIH1cbiAgICB9O1xuXG5leHBvcnQgZnVuY3Rpb24gb24oV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ29uJywgW10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICAvLyBCaW5kaW5nIHRvIHRoZSBuYXRpdmUgV2ViIENvbXBvbmVudCBsaWZlY3ljbGUgbWV0aG9kc1xuICAgIC8vIGNhdXNpbmcgdGhlbSB0byB0cmlnZ2VyIHJlbGV2YW50IGNhbGxiYWNrcy5cbiAgICBPYmplY3Qua2V5cyhuYXRpdmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIFdDLmV4dGVuc2lvbnNbbmF0aXZlc1trZXldXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyaWdnZXIuY2FsbCh0aGlzLCBrZXksIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG4gICAgV0MuZXh0ZW5zaW9ucy5vbiA9IG9uRXZlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyKFdDKSB7XG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCd0cmlnZ2VyJywgW10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICBXQy5leHRlbnNpb25zLnRyaWdnZXIgPSB0cmlnZ2VyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2ZmKFdDKSB7XG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdvZmYnLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgIFdDLmV4dGVuc2lvbnMub2ZmID0gb2ZmO1xufVxuIiwiaW1wb3J0IERPTWluZ28gZnJvbSAnLi4vLi4vLi4vYm93ZXJfY29tcG9uZW50cy9ET01pbmdvL0VTNi9ET01pbmdvJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbmRlcihXQykge1xuXG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdyZW5kZXInLCBbJ29uJywgJ3RyaWdnZXInLCAndGVtcGxhdGVGcmFnbWVudCddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBXQy5leHRlbnNpb25zLm9uKCdjcmVhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc2hhZG93Um9vdCA9IHRoaXMuc2hhZG93Um9vdCB8fCB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKSxcbiAgICAgICAgICAgIHJlbmRlciA9IERPTWluZ28odGhpcy50ZW1wbGF0ZUZyYWdtZW50LCBzaGFkb3dSb290KTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlbmRlcicsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdyZW5kZXInKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6ICgpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUoV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlJywgWydvbiddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBsZXQgZG9jID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5vd25lckRvY3VtZW50O1xuICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGVtcGxhdGVFbCxcbiAgICAgICAgICAgIHNldDogKHRlbXBsKSA9PiB0ZW1wbGF0ZUVsID0gdGVtcGxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUZyYWdtZW50KFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlRnJhZ21lbnQnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGVtcGxhdGVGcmFnbWVudCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgaXNTdHJpbmcgPSB0aGluZyA9PiB1dGlsLnR5cGVPZih0aGluZykgPT09ICdzdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgY29uZmlnID0ge30pID0+IHtcbiAgICBsZXQgcHJvdG8gPSBjb25maWcucHJvdG90eXBlIHx8IEhUTUxFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgZXh0ID0gY29uZmlnLmV4dGVuZHM7XG5cbiAgICBwcm90byA9IGlzU3RyaW5nKHByb3RvKSA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocHJvdG8pIDogcHJvdG87XG4gICAgcHJvdG8gPSB1dGlsLnByb3RvQ2hhaW4oV0MuZXh0ZW5zaW9ucywgcHJvdG8pO1xuXG4gICAgcmV0dXJuIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCB7XG4gICAgICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShwcm90bywge30pLFxuICAgICAgICBleHRlbmRzOiBleHRcbiAgICB9KTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gdHlwZU9mKHRoaW5nKSB7XG4gICAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbCh0aGluZykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3RvQ2hhaW4oLi4ub2Jqcykge1xuICAgIHJldHVybiBvYmpzLnJldmVyc2UoKS5yZWR1Y2UoKHByb3RvLCBvYmopID0+IHtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xufVxuXG5cbi8qXG4gICAgc3JjczogW3NyY09iamVjdF1cbiAgICBzcmNPYmplY3Q6IHtcbiAgICAgICAgdGVzdDogPEJvb2xlYW4gfHwgRnVuY3Rpb246Qm9vbGVhbj4sXG4gICAgICAgIHNyYzogPFN0cmluZzpVUkwgdG8gcG9seWZpbGw+XG4gICAgfVxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxscyguLi5zcmNzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXMsIHJlaikge1xuICAgICAgICBzcmNzLmZvckVhY2goc3JjID0+IHtcbiAgICAgICAgICAgIGxldCB0ZXN0ID0gKHR5cGVvZiBzcmMudGVzdCA9PT0gJ2Z1bmN0aW9uJykgPyBzcmMudGVzdCgpIDogISFzcmM7XG5cbiAgICAgICAgICAgIGlmICh0ZXN0KSB7XG4gICAgICAgICAgICAgICAgcmVzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBzY3JwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICAgICAgICAgIHNjcnB0Lm9uZXJyb3IgPSByZWo7XG4gICAgICAgICAgICAgICAgc2NycHQub25sb2FkID0gcmVzO1xuICAgICAgICAgICAgICAgIHNjcnB0LnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcnB0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5cbi8vIEFycmF5LmZyb20gcG9seWZpbGxcbi8vIFRoaXMgaXMgbm90IGEgc3BlYyBjb21wbGlhbnQgcG9seWZpbCBidXQgY292ZXJzIHRoZSB2YXN0XG4vLyBtYWpvcml0eSBvZiB1c2UgY2FzZXMuIEluIHBhcnRpY3VsYXIgaXQgZmlsbHMgaG93IEJhYmxlIHVzZXNcbi8vIGl0IHRvIHRyYW5zcGlsZSB0aGUgc3ByZWFkIG9wZXJhdG9yLlxuXG4vLyBUT0RPOiBOZWVkIHRvIHJlc2VhcmNoIHdoeSBiYWJlbCB0cnlzIHRvIHVzZSBBcnJheS5mcm9tXG4vLyAgICAgICB3aXRob3V0IGltcGxlbWVudGluZyBhIHBvbHlmaWwgaW50ZXJuYWxseSBhcyB0aGV5XG4vLyAgICAgICBkbyB3aXRoIG90aGVyIHRoaW5ncy4gQXMgb2YgdGhlIHRpbWUgb2YgdGhpcyBub3RlLFxuLy8gICAgICAgQXJyYXkuZnJvbSBpcyBvbmx5IGltcGxlbWVudGVkIGluIEZpcmVGb3guXG5pZiAoIUFycmF5LmZyb20pICBBcnJheS5mcm9tID0gYXJyYXlMaWtlID0+IFtdLnNsaWNlLmNhbGwoYXJyYXlMaWtlKTtcblxuXG5sZXQgZXh0ZW5zaW9ucyA9IHt9LFxuXG4gICAgV0MgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgcmVnaXN0ZXI6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHJlZ2lzdGVyLmJpbmQoV0MpXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQSBkaWN0aW9uYXJ5IG9mIGFwcGxpZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgLy8gRXZlcnkgYXBwbGllZCBleHRlbnRpb24gd2lsbCBiZSBhdmFpbGFibGUgdG8gZWFjaCBXaW5zdG9uIENodXJjaGlsbFxuICAgICAgICAvLyBjb21wb25lbnQgaW4gdGhlIGFwcC5cbiAgICAgICAgZXh0ZW5zaW9uczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZXh0ZW5zaW9ucyxcbiAgICAgICAgICAgIHNldDogKGV4dCkgPT4gbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIGBleHRlbnNpb25zYCBwcm9wZXJ0eSBvbiBXQycpXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kV2l0aDoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVuc2lvbnNMaXN0KSB7XG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uc0xpc3QgPSBBcnJheS5pc0FycmF5KGV4dGVuc2lvbnNMaXN0KSA/IGV4dGVuc2lvbnNMaXN0IDogW2V4dGVuc2lvbnNMaXN0XTtcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uKFdDKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtaXNzaW5nRGVwczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVudGlvbiwgZGVwcykge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5ncyA9IGRlcHMucmVkdWNlKChtaXNzaW5nLCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tjdXJyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKGN1cnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tleHRlbnRpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIFdDLmV4dGVuc2lvbnNbZXh0ZW50aW9uXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1pc3NpbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgV2luc290b24gQ2h1cmNoaWxsIGAnICsgZXh0ZW50aW9uICsgJ2AgZXh0ZW50aW9uIGlzIG1pc3NpbmcgdGhlc2UgZGVwZW5kZW5jaWVzOiBcXG4nICsgbWlzc2luZ3Muam9pbignXFxuLCcpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWlzc2luZ3M7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5leHBvcnQgZGVmYXVsdCB3aW5kb3cuV0MgPSBXQztcbiJdfQ==
