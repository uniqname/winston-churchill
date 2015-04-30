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
        templates = require('./src/extensions/template/template');

    evts.on(WC);
    evts.trigger(WC);
    templates.template(WC);
    templates.templateFragment(WC);
    data(WC);
    render(WC);
    renderOnData(WC);
})();

},{"./src/extensions/data/data":2,"./src/extensions/events/events":3,"./src/extensions/render/render":5,"./src/extensions/template/template":6,"./src/wc":9}],2:[function(require,module,exports){
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
    });
}

module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

var _slice = Array.prototype.slice;
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.on = on;
exports.trigger = trigger;
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
},
    trigger = function trigger(eventName, payload) {
    var _this = this;

    var queue = events[eventName] || [];
    queue.forEach(function (listener) {
        return listener.call(_this, payload);
    });
    this.dispatchEvent(new CustomEvent(eventName, { detail: payload,
        bubbles: true }));
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

},{}],4:[function(require,module,exports){
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

        if (attrObj.name !== newAttr || attrObj.value !== newVal) {
            fragment.removeAttribute(attrObj.name);
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

},{}],5:[function(require,module,exports){
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
                    return shadowRoot.appendChild(_r2['default'](_this.templateFragment, datum));
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

},{"./domingo2":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./utils":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.typeOf = typeOf;
exports.protoChain = protoChain;

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

},{}],9:[function(require,module,exports){
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

},{"./register":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL2RhdGEvZGF0YS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3JlbmRlci9kb21pbmdvMi5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9yZW5kZXIvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQVk7OztBQUdULFFBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFFeEIsWUFBWSxHQUFHLHNCQUFVLEVBQUUsRUFBRTtBQUN6QixZQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQUUs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QkFBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxTQUFTLEdBQUcsK0NBQStDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNsSTs7QUFFRCx1QkFBTyxRQUFRLENBQUM7YUFFbkI7U0FBQTtLQUNKO0NBQ0osQ0FBQyxDQUFDOztxQkFFUSxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAvL1RoaXMgaXMgd2lsbCBiZSB0aGUgV0MgZGlzdHJvLlxuICAgIC8vIGltcG9ydCBXQyBmcm9tICcuL3NyYy9pbmRleCc7XG4gICAgbGV0IFdDID0gcmVxdWlyZSgnLi9zcmMvd2MnKSxcblxuICAgICAgICByZW5kZXJPbkRhdGEgPSBmdW5jdGlvbiAoV0MpIHtcbiAgICAgICAgICAgIGlmIChXQy5taXNzaW5nRGVwcygncmVuZGVyT25EYXRhJywgWydvbicsICd0ZW1wbGF0ZUZyYWdtZW50JywgJ2RhdGEnXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cbiAgICAgICAgICAgIFdDLmV4dGVuc2lvbnMub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHRoaXMudGVtcGxhdGVGcmFnbWVudCwgdGhpcy5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgLy8gaW1wb3J0IG9uIGZyb20gJy4vZXh0ZW5zaW9ucy9vbic7XG4gICAgLy8gaW1wb3J0IHJlbmRlciBmcm9tICcuL2V4dGVuc2lvbnMvcmVuZGVyJztcbiAgICAvLyBpbXBvcnQgZGF0YSBmcm9tICcuL2V4dGVuc2lvbnMvZGF0YSc7XG4gICAgLy8gaW1wb3J0IHRlbXBsYXRlLCB7IHRlbXBsYXRlRnJhZ21lbnR9IGZyb20gJy4vZXh0ZW5zaW9ucy90ZW1wbGF0ZSc7XG5cbiAgICAgICAgZXZ0cyA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvZXZlbnRzL2V2ZW50cycpLFxuICAgICAgICByZW5kZXIgPSByZXF1aXJlKCcuL3NyYy9leHRlbnNpb25zL3JlbmRlci9yZW5kZXInKSxcbiAgICAgICAgZGF0YSA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvZGF0YS9kYXRhJyksXG4gICAgICAgIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvdGVtcGxhdGUvdGVtcGxhdGUnKTtcblxuICAgIGV2dHMub24oV0MpO1xuICAgIGV2dHMudHJpZ2dlcihXQyk7XG4gICAgdGVtcGxhdGVzLnRlbXBsYXRlKFdDKTtcbiAgICB0ZW1wbGF0ZXMudGVtcGxhdGVGcmFnbWVudChXQyk7XG4gICAgZGF0YShXQyk7XG4gICAgcmVuZGVyKFdDKTtcbiAgICByZW5kZXJPbkRhdGEoV0MpO1xuXG5cbn0pKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRhKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ2RhdGEnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXRhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkYXRhLFxuICAgICAgICAgICAgc2V0OiAoZGF0YU9iaikgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhT2JqO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGFPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImxldCBuYXRpdmVzID0ge1xuICAgICAgICBjcmVhdGVkOiAnY3JlYXRlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0YWNoZWQ6ICdhdHRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgZGV0YWNoZWQ6ICdkZXRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZDogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaydcbiAgICB9LFxuICAgIGV2ZW50cyA9IHt9LFxuICAgIGluaXRRdWV1ZSA9IHFOYW1lID0+IGV2ZW50c1sgcU5hbWUgXSA9IFtdLFxuICAgIG9uRXZlbnQgPSBmdW5jdGlvbiAoIGV2dE5hbWUsIGZuICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHsgcmV0dXJuOyB9XG4gICAgICAgIGxldCBxdWV1ZSA9IGV2ZW50c1sgZXZ0TmFtZSBdIHx8IGluaXRRdWV1ZSggZXZ0TmFtZSk7XG4gICAgICAgIHF1ZXVlLnB1c2goIGZuICk7XG4gICAgfSxcbiAgICB0cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGF5bG9hZCkge1xuICAgICAgICBsZXQgcXVldWUgPSBldmVudHNbIGV2ZW50TmFtZSBdIHx8IFtdO1xuICAgICAgICBxdWV1ZS5mb3JFYWNoKCBsaXN0ZW5lciA9PiBsaXN0ZW5lci5jYWxsKCB0aGlzLCBwYXlsb2FkICkpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoIG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtkZXRhaWw6IHBheWxvYWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWV9KSApO1xuICAgIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBvbihXQykge1xuICAgIGlmIChXQy5taXNzaW5nRGVwcygnb24nLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgIC8vIEJpbmRpbmcgdG8gdGhlIG5hdGl2ZSBXZWIgQ29tcG9uZW50IGxpZmVjeWNsZSBtZXRob2RzXG4gICAgLy8gY2F1c2luZyB0aGVtIHRvIHRyaWdnZXIgcmVsZXZhbnQgY2FsbGJhY2tzLlxuICAgIE9iamVjdC5rZXlzKG5hdGl2ZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgV0MuZXh0ZW5zaW9uc1tuYXRpdmVzW2tleV1dID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJpZ2dlci5jYWxsKHRoaXMsIGtleSwgLi4uYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcbiAgICBXQy5leHRlbnNpb25zLm9uID0gb25FdmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaWdnZXIoV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RyaWdnZXInLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgIFdDLmV4dGVuc2lvbnMudHJpZ2dlciA9IHRyaWdnZXI7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByKHRlbXBsYXRlRnJhZywgZGF0YSkge1xuXG4gICAgW10uc2xpY2UuY2FsbCh0ZW1wbGF0ZUZyYWcuY2hpbGROb2RlcykubWFwKCBub2RlID0+IHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIHJlbmRlclRleHROb2RlKG5vZGUsIGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcihub2RlLCBkYXRhKTtcbiAgICAgICAgICAgIHJlbmRlckVsQXR0cnMobm9kZSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICByZXR1cm4gdGVtcGxhdGVGcmFnO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyVGV4dE5vZGUodGV4dE5vZGUsIGRhdGEpIHtcbiAgICAgICAgdGV4dE5vZGUudGV4dENvbnRlbnQgPSByZW5kZXJTdHJpbmcodGV4dE5vZGUudGV4dENvbnRlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckVsQXR0cnMoZnJhZ21lbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKGZyYWdtZW50LmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIFtdLnNsaWNlLmNhbGwoZnJhZ21lbnQuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgIHJlbmRlckF0dHIoYXR0ciwgZGF0YSwgZnJhZ21lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJBdHRyKGF0dHJPYmosIGRhdGEsIGZyYWdtZW50KSB7XG4gICAgICAgIHZhciBuZXdBdHRyID0gcmVuZGVyU3RyaW5nKGF0dHJPYmoubmFtZSwgZGF0YSksXG4gICAgICAgICAgICBuZXdWYWwgPSByZW5kZXJTdHJpbmcoYXR0ck9iai52YWx1ZSwgZGF0YSk7XG5cbiAgICAgICAgaWYgKGF0dHJPYmoubmFtZSAhPT0gbmV3QXR0ciB8fCBhdHRyT2JqLnZhbHVlICE9PSBuZXdWYWwpIHtcbiAgICAgICAgICAgIGZyYWdtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyT2JqLm5hbWUpO1xuICAgICAgICAgICAgZnJhZ21lbnQuc2V0QXR0cmlidXRlKG5ld0F0dHIsIG5ld1ZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJTdHJpbmcoc3RyaW5nLCBkYXRhKSB7XG4gICAgICAgIHZhciBkZWxpbSA9IHtcbiAgICAgICAgICAgICAgICBvcGVuOiAne3snLFxuICAgICAgICAgICAgICAgIGNsb3NlOiAnfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmluZGluZ1JFID0gbmV3IFJlZ0V4cCgnKCcgKyBkZWxpbS5vcGVuICsgJ1xcXFxzKikoLio/KShcXFxccyonICsgZGVsaW0uY2xvc2UgKyAnKScsICdpZycpLFxuICAgICAgICAgICAgbWF0Y2hlcyA9IHN0cmluZy5tYXRjaChiaW5kaW5nUkUpLFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLFxuICAgICAgICAgICAgbmV3U3RyID0gc3RyaW5nLnNsaWNlKCk7XG5cbiAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgIG1hdGNoZXMubWFwKGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGltUkUgPSBuZXcgUmVnRXhwKGRlbGltLm9wZW4gKyAnXFxcXHMqKC4qPylcXFxccyonICsgZGVsaW0uY2xvc2UgKyAnJywgJ2knKSxcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ1BhcnRzID0gYmluZGluZy5tYXRjaChkZWxpbVJFKSxcbiAgICAgICAgICAgICAgICAgICAgaXRtID0gYmluZGluZ1BhcnRzWzFdO1xuICAgICAgICAgICAgICAgIGlmIChpdG0gPT09ICd0aGlzJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRtLnNwbGl0KC9cXC58XFwvL2cpLnJlZHVjZShmdW5jdGlvbiAodmFsLCBzZWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHZhbCAmJiB2YWxbc2VnbWVudF0pIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB9LCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpZHgpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHIgPSBuZXdTdHIucmVwbGFjZShtYXRjaGVzW2lkeF0sIGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cjtcbiAgICB9XG59XG4iLCJpbXBvcnQgciBmcm9tICcuL2RvbWluZ28yJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVuZGVyKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3JlbmRlcicsIFsnb24nLCAndHJpZ2dlciddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV0MuZXh0ZW5zaW9ucywgJ3JlbmRlcicsIHtcbiAgICAgICAgZ2V0OiAoKSA9PiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgc2hhZG93Um9vdCA9IHRoaXMuc2hhZG93Um9vdCB8fCB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKSxcbiAgICAgICAgICAgIGRhdGEgPSBBcnJheS5pc0FycmF5KHRoaXMuZGF0YSkgPyB0aGlzLmRhdGEgOiBbdGhpcy5kYXRhXTtcblxuICAgICAgICAgICAgWy4uLnNoYWRvd1Jvb3QuY2hpbGROb2Rlc11cbiAgICAgICAgICAgICAgICAgICAgLmZvckVhY2gobm9kZSA9PiBzaGFkb3dSb290LnJlbW92ZUNoaWxkKG5vZGUpKTtcbiAgICAgICAgICAgIGRhdGEuZm9yRWFjaChcbiAgICAgICAgICAgICAgICBkYXR1bSA9PiBzaGFkb3dSb290LmFwcGVuZENoaWxkKCByKHRoaXMudGVtcGxhdGVGcmFnbWVudCwgZGF0dW0pIClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3JlbmRlcicpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6ICgpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZShXQykge1xuICAgIGlmIChXQy5taXNzaW5nRGVwcygndGVtcGxhdGUnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIGxldCBkb2MgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQ7XG4gICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlRWwgPSBkb2MucXVlcnlTZWxlY3RvcigndGVtcGxhdGUnKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RlbXBsYXRlJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB0ZW1wbGF0ZUVsLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IHRlbXBsYXRlRWwgPSB0ZW1wbFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlRnJhZ21lbnQoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygndGVtcGxhdGVGcmFnbWVudCcsIFsnb24nXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZUZyYWdtZW50Jywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkb2N1bWVudC5pbXBvcnROb2RlKHRoaXMudGVtcGxhdGUuY29udGVudCwgdHJ1ZSksXG4gICAgICAgICAgICBzZXQ6ICh0ZW1wbCkgPT4gY29uc29sZS5lcnJvcigndGVtcGxhdGVGcmFnbWVudCBpcyBub3Qgc2V0dGFibGUnKVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlscyc7XG5cbmxldCBpc1N0cmluZyA9IHRoaW5nID0+IHV0aWwudHlwZU9mKHRoaW5nKSA9PT0gJ3N0cmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0IChuYW1lLCBjb25maWcgPSB7fSkgPT4ge1xuICAgIGxldCBwcm90byA9IGNvbmZpZy5wcm90b3R5cGUgfHwgSFRNTEVsZW1lbnQucHJvdG90eXBlLFxuICAgICAgICBleHQgPSBjb25maWcuZXh0ZW5kcztcblxuICAgIHByb3RvID0gaXNTdHJpbmcocHJvdG8pID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChwcm90bykgOiBwcm90bztcblxuICAgIHByb3RvID0gdXRpbC5wcm90b0NoYWluKFdDLmV4dGVuc2lvbnMsIHByb3RvKTtcblxuICAgIHJldHVybiBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwge1xuICAgICAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUocHJvdG8sIHt9KSxcbiAgICAgICAgZXh0ZW5kczogZXh0XG4gICAgfSk7XG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih0aGluZykge1xuICAgIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwodGhpbmcpLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm90b0NoYWluKC4uLm9ianMpIHtcbiAgICByZXR1cm4gb2Jqcy5yZXZlcnNlKCkucmVkdWNlKChwcm90bywgb2JqKSA9PiB7XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihvYmosIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbn1cbiIsImltcG9ydCByZWdpc3RlciBmcm9tICcuL3JlZ2lzdGVyJztcblxuLy8gQXJyYXkuZnJvbSBwb2x5ZmlsbFxuLy8gVGhpcyBpcyBub3QgYSBzcGVjIGNvbXBsaWFudCBwb2x5ZmlsIGJ1dCBjb3ZlcnMgdGhlIHZhc3Rcbi8vIG1ham9yaXR5IG9mIHVzZSBjYXNlcy4gSW4gcGFydGljdWxhciBpdCBmaWxscyBob3cgQmFibGUgdXNlc1xuLy8gaXQgdG8gdHJhbnNwaWxlIHRoZSBzcHJlYWQgb3BlcmF0b3IuXG5cbi8vIFRPRE86IE5lZWQgdG8gcmVzZWFyY2ggd2h5IGJhYmVsIHRyeXMgdG8gdXNlIEFycmF5LmZyb21cbi8vICAgICAgIHdpdGhvdXQgaW1wbGVtZW50aW5nIGEgcG9seWZpbCBpbnRlcm5hbGx5IGFzIHRoZXlcbi8vICAgICAgIGRvIHdpdGggb3RoZXIgdGhpbmdzLiBBcyBvZiB0aGUgdGltZSBvZiB0aGlzIG5vdGUsXG4vLyAgICAgICBBcnJheS5mcm9tIGlzIG9ubHkgaW1wbGVtZW50ZWQgaW4gRmlyZUZveC5cbmlmICghQXJyYXkuZnJvbSkgIEFycmF5LmZyb20gPSBhcnJheUxpa2UgPT4gW10uc2xpY2UuY2FsbChhcnJheUxpa2UpO1xuXG5cbmxldCBleHRlbnNpb25zID0ge30sXG5cbiAgICBXQyA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuICAgICAgICByZWdpc3Rlcjoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogcmVnaXN0ZXIuYmluZChXQylcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBBIGRpY3Rpb25hcnkgb2YgYXBwbGllZCBleHRlbnNpb25zLlxuICAgICAgICAvLyBFdmVyeSBhcHBsaWVkIGV4dGVudGlvbiB3aWxsIGJlIGF2YWlsYWJsZSB0byBlYWNoIFdpbnN0b24gQ2h1cmNoaWxsXG4gICAgICAgIC8vIGNvbXBvbmVudCBpbiB0aGUgYXBwLlxuICAgICAgICBleHRlbnNpb25zOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiAoKSA9PiBleHRlbnNpb25zLFxuICAgICAgICAgICAgc2V0OiAoZXh0KSA9PiBuZXcgRXJyb3IoJ0Nhbm5vdCBvdmVyd3JpdGUgYGV4dGVuc2lvbnNgIHByb3BlcnR5IG9uIFdDJylcbiAgICAgICAgfSxcblxuICAgICAgICBtaXNzaW5nRGVwczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVudGlvbiwgZGVwcykge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5ncyA9IGRlcHMucmVkdWNlKChtaXNzaW5nLCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tjdXJyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKGN1cnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tleHRlbnRpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIFdDLmV4dGVuc2lvbnNbZXh0ZW50aW9uXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1pc3NpbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgV2luc290b24gQ2h1cmNoaWxsIGAnICsgZXh0ZW50aW9uICsgJ2AgZXh0ZW50aW9uIGlzIG1pc3NpbmcgdGhlc2UgZGVwZW5kZW5jaWVzOiBcXG4nICsgbWlzc2luZ3Muam9pbignXFxuLCcpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWlzc2luZ3M7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5leHBvcnQgZGVmYXVsdCB3aW5kb3cuV0MgPSBXQztcbiJdfQ==
