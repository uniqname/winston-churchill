(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//This is will be the WC distro.
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcWc = require('./src/wc');

var _srcWc2 = _interopRequireDefault(_srcWc);

var _srcExtensionsEventsEvents = require('./src/extensions/events/events');

var _srcExtensionsRenderRender = require('./src/extensions/render/render');

var _srcExtensionsRenderRender2 = _interopRequireDefault(_srcExtensionsRenderRender);

var _srcExtensionsDataData = require('./src/extensions/data/data');

var _srcExtensionsDataData2 = _interopRequireDefault(_srcExtensionsDataData);

var _srcExtensionsTemplateTemplate = require('./src/extensions/template/template');

var _srcExtensionsBindAttrToPropBindAttrToProp = require('./src/extensions/bindAttrToProp/bindAttrToProp');

var _srcExtensionsBindAttrToPropBindAttrToProp2 = _interopRequireDefault(_srcExtensionsBindAttrToPropBindAttrToProp);

var _srcUtils = require('./src/utils');

var _polyfillsObjectAssignPolyfill = require('./polyfills/object.assign-polyfill');

var _polyfillsObjectAssignPolyfill2 = _interopRequireDefault(_polyfillsObjectAssignPolyfill);

var renderOnData = function renderOnData(proto) {
    proto.on('data', function () {
        this.render(this.data);
    });
};

(0, _srcUtils.polyfiller)({
    test: !!Object.assign,
    fill: function fill() {
        (0, _polyfillsObjectAssignPolyfill2['default'])();
    }
}).then(function () {
    [_srcExtensionsEventsEvents.on, _srcExtensionsEventsEvents.trigger, _srcExtensionsEventsEvents.off, _srcExtensionsDataData2['default'], _srcExtensionsTemplateTemplate.template, _srcExtensionsTemplateTemplate.templateFragment, _srcExtensionsRenderRender2['default'], renderOnData, _srcExtensionsBindAttrToPropBindAttrToProp2['default']].map(function (extension) {
        _srcWc2['default'].extend(extension);
    });
});

},{"./polyfills/object.assign-polyfill":7,"./src/extensions/bindAttrToProp/bindAttrToProp":8,"./src/extensions/data/data":9,"./src/extensions/events/events":10,"./src/extensions/render/render":11,"./src/extensions/template/template":12,"./src/utils":14,"./src/wc":15}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = DOMingo;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _mapNode = require('./mapNode');

var _mapNode2 = _interopRequireDefault(_mapNode);

var _interleave = require('./interleave');

var _interleave2 = _interopRequireDefault(_interleave);

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
            var propVal = (0, _interleave2['default'])(bindObj.staticParts, bindObj.currentValues).join('');

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
    var str = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$openDelim = _ref.openDelim;
    var openDelim = _ref$openDelim === undefined ? '{{' : _ref$openDelim;
    var _ref$closeDelim = _ref.closeDelim;
    var closeDelim = _ref$closeDelim === undefined ? '}}' : _ref$closeDelim;

    var bindPattern = new RegExp(openDelim + '([^' + closeDelim + ']*)' + closeDelim, 'g'),
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

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = makeEntry;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bindingsInStr = require('./bindingsInStr');

var _bindingsInStr2 = _interopRequireDefault(_bindingsInStr);

function makeEntry(node) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$openDelim = _ref.openDelim;
    var openDelim = _ref$openDelim === undefined ? '{{' : _ref$openDelim;
    var _ref$closeDelim = _ref.closeDelim;
    var closeDelim = _ref$closeDelim === undefined ? '}}' : _ref$closeDelim;

    var bindPattern = new RegExp(openDelim + '[^' + closeDelim + ']*' + closeDelim, 'g'),
        prop = node.value ? 'value' : 'textContent',
        bindings = (0, _bindingsInStr2['default'])(node[prop], { openDelim: openDelim, closeDelim: closeDelim }),
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

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = mapNode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _makeEntry = require('./makeEntry');

var _makeEntry2 = _interopRequireDefault(_makeEntry);

function mapNode(map, node) {
    if (node.nodeType === 1) {
        return [].slice.call(node.childNodes).concat([].slice.call(node.attributes)).reduce(mapNode, map);
    } else {
        var entry = (0, _makeEntry2['default'])(node);
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

            if (target == null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            return sources.reduce(function (trgt, source) {
                if (source == null) {
                    Object.keys(Object(source)).forEach(function (srcKey) {
                        var desc = Object.getOwnPropertyDescriptor(source, srcKey);
                        if (desc && desc.enumerable) {
                            trgt[srcKey] = source[srcKey];
                        }
                    });
                }
                return trgt;
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

function data(wcProto) {

    wcProto.on('created', function () {
        var component = this;
        Object.defineProperty(component, 'bindAttrToProp', {
            get: function get() {
                return function (attr, prop, isBoolean) {
                    Object.defineProperty(component, prop, {
                        enumerable: true,
                        get: function get() {
                            return isBoolean ? component.hasAttribute(attr) : component.getAttribute(attr);
                        },
                        set: function set(val) {
                            var theProp = isBoolean && !!val ? 'setAttribute' : 'removeAttribute';
                            component[theProp](attr, val);
                        }
                    });
                };
            }
        });
    });
}

module.exports = exports['default'];

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = data;

function data(proto) {

    proto.on('created', function () {
        var _this = this;

        var theData = {};
        Object.defineProperty(this, 'data', {
            get: function get() {
                return theData;
            },
            set: function set(dataObj) {
                theData = dataObj;
                _this.trigger('data', dataObj);
            }
        });
        Object.observe(data, function (changes) {
            if (changes.length) {
                _this.trigger('data', data);
            }
        }, ['add', 'update', 'delete']);
    });
}

module.exports = exports['default'];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _slice = Array.prototype.slice;
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
    onEvent = function onEvent(evtName, fn) {
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
},
    triggerEvent = function triggerEvent(eventName) {
    var _this = this;

    var payload = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var bubbles = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var queue = events[eventName] || [];
    queue.forEach(function (listener) {
        return listener.call(_this, payload);
    });
    this.dispatchEvent(new CustomEvent(eventName, { detail: payload,
        bubbles: bubbles }));
},
    offEvent = function offEvent(evtName, fn) {
    var queue = events[evtName];
    if (Array.isArray(queue)) {
        events[evtName] = queue.filter(function (listener) {
            return listener !== fn;
        });
    }
};

function on(proto) {
    // Binding to the native Web Component lifecycle methods
    // causing them to trigger relevant callbacks.
    Object.keys(natives).forEach(function (key) {
        proto[natives[key]] = function () {
            triggerEvent.call.apply(triggerEvent, [this, key].concat(_slice.call(arguments)));
        };
    });
    proto.on = onEvent;
}

function trigger(proto) {
    proto.trigger = triggerEvent;
}

function off(proto) {
    proto.off = offEvent;
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = render;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bower_componentsDOMingoES6DOMingo = require('../../../bower_components/DOMingo/ES6/DOMingo');

var _bower_componentsDOMingoES6DOMingo2 = _interopRequireDefault(_bower_componentsDOMingoES6DOMingo);

function render(wcProto) {

    wcProto.on('created', function () {
        var shadowRoot = this.shadowRoot || this.createShadowRoot(),
            renderWith = (0, _bower_componentsDOMingoES6DOMingo2['default'])(this.templateFragment, shadowRoot);

        Object.defineProperty(this, 'render', {
            get: function get() {
                return function (data) {
                    renderWith(data);
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

function template(wcProto) {
    var doc = document.currentScript.ownerDocument;
    wcProto.on('created', function () {
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

function templateFragment(wcProto) {

    wcProto.on('created', function () {
        var _this = this;

        Object.defineProperty(this, 'templateFragment', {
            get: function get() {
                return document.importNode(_this.template.content, true);
            },
            set: function set() {
                return console.error('templateFragment is not settable');
            }
        });
    });
}

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _utils = require('./utils');

var util = _interopRequireWildcard(_utils);

var _wc = require('./wc');

var isString = function isString(thing) {
    return util.typeOf(thing) === 'string';
};

exports['default'] = function (name, options) {

    // Can't destructure `opts` argument since its
    // properties are reserved words.
    var opts = options || {};
    var proto = opts.prototype || HTMLElement.prototype;

    //if a string, assume it's the name of an element
    proto = isString(proto) ? document.createElement(proto).constructor.prototype : proto;

    proto = util.protoChain(_wc.proto, proto);

    return document.registerElement(name, {
        prototype: Object.create(proto),
        'extends': opts['extends']
    });
};

module.exports = exports['default'];

},{"./utils":14,"./wc":15}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.typeOf = typeOf;
exports.protoChain = protoChain;
exports.polyfiller = polyfiller;

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

/*
    srcs: [srcObject]
    srcObject: {
        test: <Boolean || Function:Boolean>,
        fill: <String:URL to polyfill>
    }
*/

function polyfiller() {
    for (var _len2 = arguments.length, tests = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        tests[_key2] = arguments[_key2];
    }

    return new Promise(function (res, rej) {
        tests.forEach(function (testObj) {
            var passes = typeof testObj.test === 'function' ? testObj.test() : testObj.test,
                filler = testObj.fill;

            if (passes) {
                res();
            } else if (typeof fill === 'function') {
                filler();
                res();
            } else {
                var scrpt = document.createElement('script');
                scrpt.onerror = rej;
                scrpt.onload = res;
                scrpt.src = testObj.fill;
                document.body.appendChild(scrpt);
            }
        });
    });
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _register = require('./register');

var _register2 = _interopRequireDefault(_register);

var _utils = require('./utils');

// Array.from polyfill
// This is not a spec compliant polyfil but covers the vast
// majority of use cases. In particular it fills how Bable uses
// it to transpile the spread operator.
(0, _utils.polyfiller)({
    test: !!Array.from,
    fill: function fill() {
        return Array.from = function (arrayLike) {
            return [].slice.call(arrayLike);
        };
    }
});

var proto = {},
    WC = Object.create(null, {
    register: {
        enumerable: true,
        configurable: false,
        writable: false,
        value: _register2['default']
    },

    extend: {
        enumerable: true,
        configurable: false,
        writable: false,
        value: function value(method) {
            method.call(null, proto);
        }
    },

    polyfiller: {
        enumerable: true,
        configurable: false,
        writable: false,
        value: _utils.polyfiller
    }
});

exports.proto = proto;
exports.WC = WC;
exports['default'] = window.WC = WC;

},{"./register":13,"./utils":14}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL2Jvd2VyX2NvbXBvbmVudHMvRE9NaW5nby9FUzYvRE9NaW5nby5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9ib3dlcl9jb21wb25lbnRzL0RPTWluZ28vRVM2L2JpbmRpbmdzSW5TdHIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvYm93ZXJfY29tcG9uZW50cy9ET01pbmdvL0VTNi9pbnRlcmxlYXZlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL2Jvd2VyX2NvbXBvbmVudHMvRE9NaW5nby9FUzYvbWFrZUVudHJ5LmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL2Jvd2VyX2NvbXBvbmVudHMvRE9NaW5nby9FUzYvbWFwTm9kZS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9wb2x5ZmlsbHMvb2JqZWN0LmFzc2lnbi1wb2x5ZmlsbC5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9iaW5kQXR0clRvUHJvcC9iaW5kQXR0clRvUHJvcC5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9kYXRhL2RhdGEuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVuc2lvbnMvZXZlbnRzL2V2ZW50cy5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9yZW5kZXIvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7cUJDQ2UsVUFBVTs7Ozt5Q0FDTSxnQ0FBZ0M7O3lDQUM1QyxnQ0FBZ0M7Ozs7cUNBQ2xDLDRCQUE0Qjs7Ozs2Q0FDRixvQ0FBb0M7O3lEQUNwRCxnREFBZ0Q7Ozs7d0JBQ2hELGFBQWE7OzZDQUNyQixvQ0FBb0M7Ozs7QUFHdkQsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQWEsS0FBSyxFQUFFO0FBQ2hDLFNBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVk7QUFDekIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUIsQ0FBQyxDQUFDO0NBQ04sQ0FBQzs7QUFFRiwwQkFBVztBQUNQLFFBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU07QUFDckIsUUFBSSxFQUFFLGdCQUFZO0FBQUUseURBQVEsQ0FBQztLQUFFO0NBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWTtBQUNoQiw4UUFDUyxZQUFZLHlEQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFBLFNBQVMsRUFBSTtBQUNwRCwyQkFBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDeEIsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDOzs7Ozs7OztxQkN0QnFCLE9BQU87Ozs7Ozt1QkFIWCxXQUFXOzs7OzBC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QUMsRUFBRSxHQUFHLEVBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy9UaGlzIGlzIHdpbGwgYmUgdGhlIFdDIGRpc3Ryby5cbmltcG9ydCBXQyBmcm9tICcuL3NyYy93Yyc7XG5pbXBvcnQge29uLCB0cmlnZ2VyLCBvZmZ9IGZyb20gJy4vc3JjL2V4dGVuc2lvbnMvZXZlbnRzL2V2ZW50cyc7XG5pbXBvcnQgcmVuZGVyIGZyb20gJy4vc3JjL2V4dGVuc2lvbnMvcmVuZGVyL3JlbmRlcic7XG5pbXBvcnQgZGF0YSBmcm9tICcuL3NyYy9leHRlbnNpb25zL2RhdGEvZGF0YSc7XG5pbXBvcnQgeyB0ZW1wbGF0ZSwgdGVtcGxhdGVGcmFnbWVudCB9IGZyb20gJy4vc3JjL2V4dGVuc2lvbnMvdGVtcGxhdGUvdGVtcGxhdGUnO1xuaW1wb3J0IGJpbmRBdHRyVG9Qcm9wIGZyb20gJy4vc3JjL2V4dGVuc2lvbnMvYmluZEF0dHJUb1Byb3AvYmluZEF0dHJUb1Byb3AnO1xuaW1wb3J0IHsgcG9seWZpbGxlciB9IGZyb20gJy4vc3JjL3V0aWxzJztcbmltcG9ydCBhc3NpZ24gZnJvbSAnLi9wb2x5ZmlsbHMvb2JqZWN0LmFzc2lnbi1wb2x5ZmlsbCc7XG5cblxubGV0IHJlbmRlck9uRGF0YSA9IGZ1bmN0aW9uIChwcm90bykge1xuICAgIHByb3RvLm9uKCdkYXRhJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlbmRlcih0aGlzLmRhdGEpO1xuICAgIH0pO1xufTtcblxucG9seWZpbGxlcih7XG4gICAgdGVzdDogISFPYmplY3QuYXNzaWduLFxuICAgIGZpbGw6IGZ1bmN0aW9uICgpIHsgYXNzaWduKCk7IH1cbn0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgIFtvbiwgdHJpZ2dlciwgb2ZmLCBkYXRhLCB0ZW1wbGF0ZSwgdGVtcGxhdGVGcmFnbWVudCxcbiAgICAgcmVuZGVyLCByZW5kZXJPbkRhdGEsIGJpbmRBdHRyVG9Qcm9wXS5tYXAoZXh0ZW5zaW9uID0+IHtcbiAgICAgICAgV0MuZXh0ZW5kKGV4dGVuc2lvbik7XG4gICAgfSk7XG59KTtcbiIsImltcG9ydCBtYXBOb2RlIGZyb20gJy4vbWFwTm9kZSc7XG5pbXBvcnQgaW50ZXJsZWF2ZSBmcm9tICcuL2ludGVybGVhdmUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBET01pbmdvKGZyYWcsIHNoYWRvd1Jvb3QpIHtcbiAgICBsZXQgc2hhZG93ID0gZnJhZy5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgIG1hcCA9IFsuLi5zaGFkb3cuY2hpbGROb2Rlc10ucmVkdWNlKG1hcE5vZGUsIFtdKTtcblxuICAgIHNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc2hhZG93KTtcblxuICAgIC8vdGhlIHJlbmRlciBmdW5jdGlvbi5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgbWFwID0gbWFwLm1hcCggKGJpbmRPYmopID0+IHtcbiAgICAgICAgICAgIGJpbmRPYmouY3VycmVudFZhbHVlcyA9IGJpbmRPYmouZGF0YVBhdGhzLm1hcCggKHBhdGgsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsID0gcGF0aC5zcGxpdCgvXFwufFxcLy9nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSggKHZhbCwgc2VnbWVudCkgPT4gKHZhbCAmJiB2YWxbc2VnbWVudF0pIHx8ICcnLCBkYXRhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCA/IHZhbCA6IGJpbmRPYmouY3VycmVudFZhbHVlc1tpXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbGV0IHByb3BWYWwgPSBpbnRlcmxlYXZlKGJpbmRPYmouc3RhdGljUGFydHMsIGJpbmRPYmouY3VycmVudFZhbHVlcykuam9pbignJyk7XG5cbiAgICAgICAgICAgIGxldCBwcm9wID0gYmluZE9iai5ub2RlLnZhbHVlICE9PSB1bmRlZmluZWQgPyAndmFsdWUnIDogJ3RleHRDb250ZW50JztcbiAgICAgICAgICAgIGJpbmRPYmoubm9kZVtwcm9wXSA9IHByb3BWYWw7XG5cbiAgICAgICAgICAgIHJldHVybiBiaW5kT2JqO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2hhZG93O1xuICAgIH07XG59XG5cbndpbmRvdy5ET01pbmdvID0gRE9NaW5nbztcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGJpbmRpbmdzSW5TdHIoc3RyPScnLCB7b3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319J30gPSB7fSkge1xuICAgIGxldCBiaW5kUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7b3BlbkRlbGltfShbXiR7Y2xvc2VEZWxpbX1dKikke2Nsb3NlRGVsaW19YCwgJ2cnKSxcbiAgICAgICAgbWF0Y2hlcyA9IHN0ci5tYXRjaChiaW5kUGF0dGVybikgfHwgW10sXG4gICAgICAgIGZpbmRMYWJlbCA9IFJlZ0V4cChiaW5kUGF0dGVybi5zb3VyY2UpO1xuICAgICAgICByZXR1cm4gbWF0Y2hlcy5tYXAobWF0Y2ggPT4gIG1hdGNoLm1hdGNoKGZpbmRMYWJlbClbMV0udHJpbSgpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhcnIxLCBhcnIyKSB7XG4gICAgcmV0dXJuIGFycjEucmVkdWNlKCAoaW50ZXJsZWF2ZWQsIGl0ZW0sIGkpID0+IHtcbiAgICAgICAgbGV0IGFycjJJdGVtID0gYXJyMltpXTtcbiAgICAgICAgaW50ZXJsZWF2ZWQucHVzaChpdGVtKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW50ZXJsZWF2ZWQpO1xuICAgICAgICBpZiAoYXJyMkl0ZW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaW50ZXJsZWF2ZWQucHVzaChhcnIySXRlbSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnRlcmxlYXZlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGludGVybGVhdmVkO1xuICAgIH0sIFtdKTtcbn1cbiIsImltcG9ydCBiaW5kaW5nc0luU3RyIGZyb20gJy4vYmluZGluZ3NJblN0cic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1ha2VFbnRyeShub2RlLCB7b3BlbkRlbGltPSd7eycsIGNsb3NlRGVsaW09J319J30gPSB7fSkge1xuICAgIGxldCBiaW5kUGF0dGVybiA9IG5ldyBSZWdFeHAoYCR7b3BlbkRlbGltfVteJHtjbG9zZURlbGltfV0qJHtjbG9zZURlbGltfWAsICdnJyksXG4gICAgICAgIHByb3AgPSBub2RlLnZhbHVlID8gJ3ZhbHVlJyA6ICd0ZXh0Q29udGVudCcsXG4gICAgICAgIGJpbmRpbmdzID0gYmluZGluZ3NJblN0cihub2RlW3Byb3BdLCB7b3BlbkRlbGltOm9wZW5EZWxpbSwgY2xvc2VEZWxpbTpjbG9zZURlbGltfSksXG4gICAgICAgIHN0YXRpY1BhcnRzID0gbm9kZVtwcm9wXS5zcGxpdChiaW5kUGF0dGVybik7XG4gICAgaWYgKGJpbmRpbmdzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZTogbm9kZSxcbiAgICAgICAgICAgIHN0YXRpY1BhcnRzOiBzdGF0aWNQYXJ0cyxcbiAgICAgICAgICAgIGRhdGFQYXRoczogYmluZGluZ3MsXG4gICAgICAgICAgICBjdXJyZW50VmFsdWVzOiBiaW5kaW5ncy5tYXAoYmluZGluZyA9PiAnJylcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8qXG57XG4gICAgbm9kZTogPHJlbmRlclRhcmdldE5vZGU+LFxuICAgIHN0YXRpY1BhcnRzOiBbU3RyaW5nXSxcbiAgICBkYXRhUGF0aHM6IFtTdHJpbmddLFxuICAgIGN1cnJlbnRWYWx1ZXM6IFtTdHJpbmddXG59XG4qL1xuIiwiaW1wb3J0IG1ha2VFbnRyeSBmcm9tICcuL21ha2VFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hcE5vZGUobWFwLCBub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwobm9kZS5jaGlsZE5vZGVzKVxuICAgICAgICAgICAgICAgICAuY29uY2F0KCBbXS5zbGljZS5jYWxsKG5vZGUuYXR0cmlidXRlcykgKVxuICAgICAgICAgICAgICAgICAucmVkdWNlKG1hcE5vZGUsIG1hcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGVudHJ5ID0gbWFrZUVudHJ5KG5vZGUpO1xuICAgICAgICBpZiAoZW50cnkgIT09IG51bGwpIHsgbWFwLnB1c2goZW50cnkpOyB9XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsICdhc3NpZ24nLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogKHRhcmdldCwgLi4uc291cmNlcykgPT4ge1xuICAgICAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VzLnJlZHVjZSgodHJndCwgc291cmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKChzcmNLZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHNyY0tleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzYyAmJiBkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmd0W3NyY0tleV0gPSBzb3VyY2Vbc3JjS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cmd0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRhdGEod2NQcm90bykge1xuXG4gICAgd2NQcm90by5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb21wb25lbnQsICdiaW5kQXR0clRvUHJvcCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGF0dHIsIHByb3AsIGlzQm9vbGVhbikge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb21wb25lbnQsIHByb3AsIHtcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiBpc0Jvb2xlYW4gPyBjb21wb25lbnQuaGFzQXR0cmlidXRlKGF0dHIpIDogY29tcG9uZW50LmdldEF0dHJpYnV0ZShhdHRyKSxcbiAgICAgICAgICAgICAgICAgICAgc2V0OiB2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRoZVByb3AgPSBpc0Jvb2xlYW4gJiYgISF2YWwgPyAnc2V0QXR0cmlidXRlJyA6ICdyZW1vdmVBdHRyaWJ1dGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50W3RoZVByb3BdKGF0dHIsIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRhKHByb3RvKSB7XG5cbiAgICBwcm90by5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRoZURhdGEgPSB7fTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXRhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGVEYXRhLFxuICAgICAgICAgICAgc2V0OiAoZGF0YU9iaikgPT4ge1xuICAgICAgICAgICAgICAgIHRoZURhdGEgPSBkYXRhT2JqO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGFPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0Lm9ic2VydmUoZGF0YSwgY2hhbmdlcyA9PiB7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2RhdGEnLCBkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgWydhZGQnLCAndXBkYXRlJywgJ2RlbGV0ZSddKTtcbiAgICB9KTtcbn1cbiIsImxldCBuYXRpdmVzID0ge1xuICAgICAgICBjcmVhdGVkOiAnY3JlYXRlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0YWNoZWQ6ICdhdHRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgZGV0YWNoZWQ6ICdkZXRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZDogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaydcbiAgICB9LFxuICAgIGV2ZW50cyA9IHt9LFxuICAgIGluaXRRdWV1ZSA9IHFOYW1lID0+IGV2ZW50c1sgcU5hbWUgXSA9IFtdLFxuICAgIG9uRXZlbnQgPSBmdW5jdGlvbiAoZXZ0TmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm47IH1cbiAgICAgICAgbGV0IHF1ZXVlID0gZXZlbnRzWyBldnROYW1lIF0gfHwgaW5pdFF1ZXVlKGV2dE5hbWUpO1xuICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcblxuICAgICAgICAvL0F1dG8gcHJldmVudCBtZW1vcnkgc29tZSBsZWFrc1xuICAgICAgICBpZiAoZXZ0TmFtZSA9PT0gJ2F0dGFjaGVkJykge1xuICAgICAgICAgICAgb25FdmVudC5jYWxsKHRoaXMsICdkZXRhY2hlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9mZihldnROYW1lLCBmbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdHJpZ2dlckV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGF5bG9hZCA9IHt9LCBidWJibGVzID0gdHJ1ZSkge1xuICAgICAgICBsZXQgcXVldWUgPSBldmVudHNbIGV2ZW50TmFtZSBdIHx8IFtdO1xuICAgICAgICBxdWV1ZS5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyLmNhbGwodGhpcywgcGF5bG9hZCkpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge2RldGFpbDogcGF5bG9hZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnViYmxlczogYnViYmxlc30pKTtcbiAgICB9LFxuICAgIG9mZkV2ZW50ID0gZnVuY3Rpb24gKGV2dE5hbWUsIGZuKSB7XG4gICAgICAgIGxldCBxdWV1ZSA9IGV2ZW50c1sgZXZ0TmFtZSBdO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShxdWV1ZSkpIHtcbiAgICAgICAgICAgIGV2ZW50c1tldnROYW1lXSA9IHF1ZXVlLmZpbHRlcihsaXN0ZW5lciA9PiBsaXN0ZW5lciAhPT0gZm4pO1xuICAgICAgICB9XG4gICAgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uKHByb3RvKSB7XG4gICAgLy8gQmluZGluZyB0byB0aGUgbmF0aXZlIFdlYiBDb21wb25lbnQgbGlmZWN5Y2xlIG1ldGhvZHNcbiAgICAvLyBjYXVzaW5nIHRoZW0gdG8gdHJpZ2dlciByZWxldmFudCBjYWxsYmFja3MuXG4gICAgT2JqZWN0LmtleXMobmF0aXZlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBwcm90b1tuYXRpdmVzW2tleV1dID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJpZ2dlckV2ZW50LmNhbGwodGhpcywga2V5LCAuLi5hcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0pO1xuICAgIHByb3RvLm9uID0gb25FdmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaWdnZXIocHJvdG8pIHtcbiAgICBwcm90by50cmlnZ2VyID0gdHJpZ2dlckV2ZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2ZmKHByb3RvKSB7XG4gICAgcHJvdG8ub2ZmID0gb2ZmRXZlbnQ7XG59XG4iLCJpbXBvcnQgZG9taW5nbyBmcm9tICcuLi8uLi8uLi9ib3dlcl9jb21wb25lbnRzL0RPTWluZ28vRVM2L0RPTWluZ28nO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVuZGVyKHdjUHJvdG8pIHtcblxuICAgIHdjUHJvdG8ub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzaGFkb3dSb290ID0gdGhpcy5zaGFkb3dSb290IHx8IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpLFxuICAgICAgICAgICAgcmVuZGVyV2l0aCA9IGRvbWluZ28odGhpcy50ZW1wbGF0ZUZyYWdtZW50LCBzaGFkb3dSb290KTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlbmRlcicsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJXaXRoKGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcigncmVuZGVyJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiAoKSA9PiBjb25zb2xlLmVycm9yKCd0ZW1wbGF0ZUZyYWdtZW50IGlzIG5vdCBzZXR0YWJsZScpXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlKHdjUHJvdG8pIHtcbiAgICBsZXQgZG9jID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5vd25lckRvY3VtZW50O1xuICAgIHdjUHJvdG8ub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGVtcGxhdGVFbCxcbiAgICAgICAgICAgIHNldDogKHRlbXBsKSA9PiB0ZW1wbGF0ZUVsID0gdGVtcGxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUZyYWdtZW50KHdjUHJvdG8pIHtcblxuICAgIHdjUHJvdG8ub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGVtcGxhdGVGcmFnbWVudCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpLFxuICAgICAgICAgICAgc2V0OiAoKSA9PiBjb25zb2xlLmVycm9yKCd0ZW1wbGF0ZUZyYWdtZW50IGlzIG5vdCBzZXR0YWJsZScpXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHByb3RvIGFzIHdjUHJvdG8gfSBmcm9tICcuL3djJztcblxuY29uc3QgaXNTdHJpbmcgPSB0aGluZyA9PiB1dGlsLnR5cGVPZih0aGluZykgPT09ICdzdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgb3B0aW9ucykgPT4ge1xuXG4gICAgLy8gQ2FuJ3QgZGVzdHJ1Y3R1cmUgYG9wdHNgIGFyZ3VtZW50IHNpbmNlIGl0c1xuICAgIC8vIHByb3BlcnRpZXMgYXJlIHJlc2VydmVkIHdvcmRzLlxuICAgIGxldCBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICBsZXQgcHJvdG8gPSBvcHRzLnByb3RvdHlwZSB8fCBIVE1MRWxlbWVudC5wcm90b3R5cGU7XG5cbiAgICAvL2lmIGEgc3RyaW5nLCBhc3N1bWUgaXQncyB0aGUgbmFtZSBvZiBhbiBlbGVtZW50XG4gICAgcHJvdG8gPSBpc1N0cmluZyhwcm90bykgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHByb3RvKS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgOiBwcm90bztcblxuICAgIHByb3RvID0gdXRpbC5wcm90b0NoYWluKHdjUHJvdG8sIHByb3RvKTtcblxuICAgIHJldHVybiBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwge1xuICAgICAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUocHJvdG8pLFxuICAgICAgICBleHRlbmRzOiBvcHRzLmV4dGVuZHNcbiAgICB9KTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gdHlwZU9mKHRoaW5nKSB7XG4gICAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbCh0aGluZykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3RvQ2hhaW4oLi4ub2Jqcykge1xuICAgIHJldHVybiBvYmpzLnJldmVyc2UoKS5yZWR1Y2UoKHByb3RvLCBvYmopID0+IHtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xufVxuXG5cbi8qXG4gICAgc3JjczogW3NyY09iamVjdF1cbiAgICBzcmNPYmplY3Q6IHtcbiAgICAgICAgdGVzdDogPEJvb2xlYW4gfHwgRnVuY3Rpb246Qm9vbGVhbj4sXG4gICAgICAgIGZpbGw6IDxTdHJpbmc6VVJMIHRvIHBvbHlmaWxsPlxuICAgIH1cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbGVyKC4uLnRlc3RzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXMsIHJlaikge1xuICAgICAgICB0ZXN0cy5mb3JFYWNoKHRlc3RPYmogPT4ge1xuICAgICAgICAgICAgbGV0IHBhc3NlcyA9ICh0eXBlb2YgdGVzdE9iai50ZXN0ID09PSAnZnVuY3Rpb24nKSA/IHRlc3RPYmoudGVzdCgpIDogdGVzdE9iai50ZXN0LFxuICAgICAgICAgICAgICAgIGZpbGxlciA9IHRlc3RPYmouZmlsbDtcblxuICAgICAgICAgICAgaWYgKHBhc3Nlcykge1xuICAgICAgICAgICAgICAgIHJlcygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZmlsbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGZpbGxlcigpO1xuICAgICAgICAgICAgICAgIHJlcygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc2NycHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgICBzY3JwdC5vbmVycm9yID0gcmVqO1xuICAgICAgICAgICAgICAgIHNjcnB0Lm9ubG9hZCA9IHJlcztcbiAgICAgICAgICAgICAgICBzY3JwdC5zcmMgPSB0ZXN0T2JqLmZpbGw7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JwdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHJlZ2lzdGVyIGZyb20gJy4vcmVnaXN0ZXInO1xuaW1wb3J0IHsgcG9seWZpbGxlciB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyBBcnJheS5mcm9tIHBvbHlmaWxsXG4vLyBUaGlzIGlzIG5vdCBhIHNwZWMgY29tcGxpYW50IHBvbHlmaWwgYnV0IGNvdmVycyB0aGUgdmFzdFxuLy8gbWFqb3JpdHkgb2YgdXNlIGNhc2VzLiBJbiBwYXJ0aWN1bGFyIGl0IGZpbGxzIGhvdyBCYWJsZSB1c2VzXG4vLyBpdCB0byB0cmFuc3BpbGUgdGhlIHNwcmVhZCBvcGVyYXRvci5cbnBvbHlmaWxsZXIoe1xuICAgIHRlc3Q6ICEhQXJyYXkuZnJvbSxcbiAgICBmaWxsOiAoKSA9PiBBcnJheS5mcm9tID0gYXJyYXlMaWtlID0+IFtdLnNsaWNlLmNhbGwoYXJyYXlMaWtlKVxufSk7XG5cbmV4cG9ydCBjb25zdCBwcm90byA9IHt9LFxuXG4gICAgV0MgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgcmVnaXN0ZXI6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHJlZ2lzdGVyXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgIG1ldGhvZC5jYWxsKG51bGwsIHByb3RvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwb2x5ZmlsbGVyOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiBwb2x5ZmlsbGVyXG4gICAgICAgIH1cbiAgICB9KTtcblxuZXhwb3J0IGRlZmF1bHQgd2luZG93LldDID0gV0M7XG4iXX0=
