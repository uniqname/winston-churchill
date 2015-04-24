(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
    //This is will be the WC distro.
    // import WC from './src/index';
    var WC = require('./src/winston-churchill'),

    // import on from './extentions/on';
    // import render from './extentions/render';
    // import data from './extentions/data';
    // import template, { templateFragment} from './extentions/template';

    evts = require('./src/extentions/on'),
        render = require('./src/extentions/render'),
        data = require('./src/extentions/data'),
        templates = require('./src/extentions/template');

    evts.on(WC);
    evts.trigger(WC);
    templates.template(WC);
    templates.templateFragment(WC);
    data(WC);
    render(WC);
})();

},{"./src/extentions/data":2,"./src/extentions/on":4,"./src/extentions/render":5,"./src/extentions/template":6,"./src/winston-churchill":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = data;

function data(WC) {

    if (WC.missingDeps('data', ['on', 'trigger']).length) {
        return;
    }

    WC.extentions.on('created', function () {
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

},{}],4:[function(require,module,exports){
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
    var queue = events[evtName],
        componentInstance = this;

    if (typeof fn === 'function') {
        if (!queue) {
            queue = initQueue(evtName);
        }

        queue.push(fn);
    }
},
    trigger = function trigger(eventName, payload) {
    var componentInstance = this,
        queue = events[eventName];

    if (queue) {
        queue.forEach(function (listener) {
            listener.call(componentInstance, payload);
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
        WC.extentions[natives[key]] = function () {
            trigger.call.apply(trigger, [this, key].concat(_slice.call(arguments)));
        };
    });

    WC.extentions.on = onEvent;
}

function trigger(WC) {
    if (WC.missingDeps('trigger', []).length) {
        return;
    }
    WC.extentions.trigger = trigger;
}

},{}],5:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

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

    WC.extentions.on('created', function () {
        var data = {};
        Object.defineProperty(this.constructor.prototype, 'render', {
            get: function get() {
                return function () {
                    this.createShadowRoot().appendChild(_r2['default'](this.templateFragment, this.data));
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

},{"./domingo2":3}],6:[function(require,module,exports){
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
    WC.extentions.on('created', function () {
        var templateEl;

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

    if (WC.missingDeps('template', ['on']).length) {
        return;
    }

    WC.extentions.on('created', function () {
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

    proto = util.protoChain(WC.extentions, proto);

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

var extentions = {},
    WC = Object.create(null, {
    register: {
        enumerable: true,
        configurable: false,
        writable: false,
        value: _register2['default'].bind(WC)
    },

    // A dictionary of applied extentions.
    // Every applied extention will be available to each Winston Churchill
    // component in the app.
    extentions: {
        enumerable: true,
        get: function get() {
            return extentions;
        },
        set: function set(ext) {
            return new Error('Cannot overwrite `extentions` property on WC');
        }
    },

    missingDeps: {
        enumerable: true,
        get: function get() {
            return function (extention, deps) {
                var missings = deps.reduce(function (missing, curr) {
                    if (!WC.extentions[curr]) {
                        missing.push(curr);
                    }
                    return missing;
                }, []);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvYXBwLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnRpb25zL2RhdGEuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvZG9taW5nbzIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvb24uanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnRpb25zL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3dpbnN0b24tY2h1cmNoaWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQVk7OztBQUdULFFBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQzs7Ozs7OztBQU8zQyxRQUFJLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDO1FBQ3JDLE1BQU0sR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUM7UUFDM0MsSUFBSSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztRQUN2QyxTQUFTLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENB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b0JBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNqQiwyQkFBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxTQUFTLEdBQUcsK0NBQStDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNsSTs7QUFFRCx1QkFBTyxRQUFRLENBQUM7YUFFbkI7U0FBQTtLQUNKO0NBQ0osQ0FBQyxDQUFDOztxQkFFUSxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAvL1RoaXMgaXMgd2lsbCBiZSB0aGUgV0MgZGlzdHJvLlxuICAgIC8vIGltcG9ydCBXQyBmcm9tICcuL3NyYy9pbmRleCc7XG4gICAgbGV0IFdDID0gcmVxdWlyZSgnLi9zcmMvd2luc3Rvbi1jaHVyY2hpbGwnKSxcblxuICAgIC8vIGltcG9ydCBvbiBmcm9tICcuL2V4dGVudGlvbnMvb24nO1xuICAgIC8vIGltcG9ydCByZW5kZXIgZnJvbSAnLi9leHRlbnRpb25zL3JlbmRlcic7XG4gICAgLy8gaW1wb3J0IGRhdGEgZnJvbSAnLi9leHRlbnRpb25zL2RhdGEnO1xuICAgIC8vIGltcG9ydCB0ZW1wbGF0ZSwgeyB0ZW1wbGF0ZUZyYWdtZW50fSBmcm9tICcuL2V4dGVudGlvbnMvdGVtcGxhdGUnO1xuXG4gICAgZXZ0cyA9IHJlcXVpcmUoJy4vc3JjL2V4dGVudGlvbnMvb24nKSxcbiAgICByZW5kZXIgPSByZXF1aXJlKCcuL3NyYy9leHRlbnRpb25zL3JlbmRlcicpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL3NyYy9leHRlbnRpb25zL2RhdGEnKSxcbiAgICB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3NyYy9leHRlbnRpb25zL3RlbXBsYXRlJyk7XG5cbiAgICBldnRzLm9uKFdDKTtcbiAgICBldnRzLnRyaWdnZXIoV0MpO1xuICAgIHRlbXBsYXRlcy50ZW1wbGF0ZShXQyk7XG4gICAgdGVtcGxhdGVzLnRlbXBsYXRlRnJhZ21lbnQoV0MpO1xuICAgIGRhdGEoV0MpO1xuICAgIHJlbmRlcihXQyk7XG5cbn0pKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRhKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ2RhdGEnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgV0MuZXh0ZW50aW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXRhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkYXRhLFxuICAgICAgICAgICAgc2V0OiAoZGF0YU9iaikgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhT2JqO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGFPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHIodGVtcGxhdGVGcmFnLCBkYXRhKSB7XG5cbiAgICBbXS5zbGljZS5jYWxsKHRlbXBsYXRlRnJhZy5jaGlsZE5vZGVzKS5tYXAoIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgcmVuZGVyVGV4dE5vZGUobm9kZSwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByKG5vZGUsIGRhdGEpO1xuICAgICAgICAgICAgcmVuZGVyRWxBdHRycyhub2RlLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZUZyYWc7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJUZXh0Tm9kZSh0ZXh0Tm9kZSwgZGF0YSkge1xuICAgICAgICB0ZXh0Tm9kZS50ZXh0Q29udGVudCA9IHJlbmRlclN0cmluZyh0ZXh0Tm9kZS50ZXh0Q29udGVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyRWxBdHRycyhmcmFnbWVudCwgZGF0YSkge1xuICAgICAgICBpZiAoZnJhZ21lbnQuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgW10uc2xpY2UuY2FsbChmcmFnbWVudC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyQXR0cihhdHRyLCBkYXRhLCBmcmFnbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckF0dHIoYXR0ck9iaiwgZGF0YSwgZnJhZ21lbnQpIHtcbiAgICAgICAgdmFyIG5ld0F0dHIgPSByZW5kZXJTdHJpbmcoYXR0ck9iai5uYW1lLCBkYXRhKSxcbiAgICAgICAgICAgIG5ld1ZhbCA9IHJlbmRlclN0cmluZyhhdHRyT2JqLnZhbHVlLCBkYXRhKTtcblxuICAgICAgICBpZiAoYXR0ck9iai5uYW1lICE9PSBuZXdBdHRyIHx8IGF0dHJPYmoudmFsdWUgIT09IG5ld1ZhbCkge1xuICAgICAgICAgICAgZnJhZ21lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJPYmoubmFtZSk7XG4gICAgICAgICAgICBmcmFnbWVudC5zZXRBdHRyaWJ1dGUobmV3QXR0ciwgbmV3VmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclN0cmluZyhzdHJpbmcsIGRhdGEpIHtcbiAgICAgICAgdmFyIGRlbGltID0ge1xuICAgICAgICAgICAgICAgIG9wZW46ICd7eycsXG4gICAgICAgICAgICAgICAgY2xvc2U6ICd9fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kaW5nUkUgPSBuZXcgUmVnRXhwKCcoJyArIGRlbGltLm9wZW4gKyAnXFxcXHMqKSguKj8pKFxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcpJywgJ2lnJyksXG4gICAgICAgICAgICBtYXRjaGVzID0gc3RyaW5nLm1hdGNoKGJpbmRpbmdSRSksXG4gICAgICAgICAgICByZXBsYWNlbWVudHMsXG4gICAgICAgICAgICBuZXdTdHIgPSBzdHJpbmcuc2xpY2UoKTtcblxuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgbWF0Y2hlcy5tYXAoZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVsaW1SRSA9IG5ldyBSZWdFeHAoZGVsaW0ub3BlbiArICdcXFxccyooLio/KVxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcnLCAnaScpLFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nUGFydHMgPSBiaW5kaW5nLm1hdGNoKGRlbGltUkUpLFxuICAgICAgICAgICAgICAgICAgICBpdG0gPSBiaW5kaW5nUGFydHNbMV07XG4gICAgICAgICAgICAgICAgaWYgKGl0bSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdG0uc3BsaXQoL1xcLnxcXC8vZykucmVkdWNlKGZ1bmN0aW9uICh2YWwsIHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAodmFsICYmIHZhbFtzZWdtZW50XSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIH0sIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIG5ld1N0ciA9IG5ld1N0ci5yZXBsYWNlKG1hdGNoZXNbaWR4XSwgaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyO1xuICAgIH1cbn1cbiIsImxldCBuYXRpdmVzID0ge1xuICAgICAgICBjcmVhdGVkOiAnY3JlYXRlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0YWNoZWQ6ICdhdHRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgZGV0YWNoZWQ6ICdkZXRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZDogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaydcbiAgICB9LFxuICAgIGV2ZW50cyA9IHt9LFxuICAgIGluaXRRdWV1ZSA9IHFOYW1lID0+IGV2ZW50c1sgcU5hbWUgXSA9IFtdLFxuICAgIG9uRXZlbnQgPSBmdW5jdGlvbiAoIGV2dE5hbWUsIGZuICkge1xuICAgICAgICBsZXQgcXVldWUgPSBldmVudHNbIGV2dE5hbWUgXSxcbiAgICAgICAgICAgIGNvbXBvbmVudEluc3RhbmNlID0gdGhpcztcblxuICAgICAgICBpZiAoIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgIGlmICggIXF1ZXVlICkge1xuICAgICAgICAgICAgICAgIHF1ZXVlID0gaW5pdFF1ZXVlKCBldnROYW1lICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHF1ZXVlLnB1c2goIGZuICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXlsb2FkKSB7XG4gICAgICAgIGxldCBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXMsXG4gICAgICAgICAgICBxdWV1ZSA9IGV2ZW50c1sgZXZlbnROYW1lIF07XG5cbiAgICAgICAgaWYgKCBxdWV1ZSApIHtcbiAgICAgICAgICAgIHF1ZXVlLmZvckVhY2goICggbGlzdGVuZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCggY29tcG9uZW50SW5zdGFuY2UsIHBheWxvYWQgKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBvbihXQykge1xuXG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdvbicsIFtdKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBCaW5kaW5nIHRvIHRoZSBuYXRpdmUgV2ViIENvbXBvbmVudCBsaWZlY3ljbGUgbWV0aG9kc1xuICAgIC8vIGNhdXNpbmcgdGhlbSB0byB0cmlnZ2VyIHJlbGV2YW50IGNhbGxiYWNrcy5cbiAgICBPYmplY3Qua2V5cyhuYXRpdmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIFdDLmV4dGVudGlvbnNbbmF0aXZlc1trZXldXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyaWdnZXIuY2FsbCh0aGlzLCBrZXksIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBXQy5leHRlbnRpb25zLm9uID0gb25FdmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaWdnZXIoV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RyaWdnZXInLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgIFdDLmV4dGVudGlvbnMudHJpZ2dlciA9IHRyaWdnZXI7XG5cbn1cbiIsImltcG9ydCByIGZyb20gJy4vZG9taW5nbzInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW5kZXIoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygncmVuZGVyJywgWydvbicsICd0cmlnZ2VyJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVudGlvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ3JlbmRlcicsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRDaGlsZCggcih0aGlzLnRlbXBsYXRlRnJhZ21lbnQsIHRoaXMuZGF0YSkgKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3JlbmRlcicpO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiAoKSA9PiBjb25zb2xlLmVycm9yKCd0ZW1wbGF0ZUZyYWdtZW50IGlzIG5vdCBzZXR0YWJsZScpXG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygndGVtcGxhdGUnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICBXQy5leHRlbnRpb25zLm9uKCdjcmVhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGVFbDtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RlbXBsYXRlJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB0ZW1wbGF0ZUVsLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IHRlbXBsYXRlRWwgPSB0ZW1wbFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlRnJhZ21lbnQoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygndGVtcGxhdGUnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVudGlvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGVtcGxhdGVGcmFnbWVudCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgaXNTdHJpbmcgPSB0aGluZyA9PiB1dGlsLnR5cGVPZih0aGluZykgPT09ICdzdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgY29uZmlnID0ge30pID0+IHtcbiAgICBsZXQgcHJvdG8gPSBjb25maWcucHJvdG90eXBlIHx8IEhUTUxFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgZXh0ID0gY29uZmlnLmV4dGVuZHM7XG5cbiAgICBwcm90byA9IGlzU3RyaW5nKHByb3RvKSA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocHJvdG8pIDogcHJvdG87XG5cbiAgICBwcm90byA9IHV0aWwucHJvdG9DaGFpbihXQy5leHRlbnRpb25zLCBwcm90byk7XG5cbiAgICByZXR1cm4gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcbiAgICAgICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKHByb3RvLCB7fSksXG4gICAgICAgIGV4dGVuZHM6IGV4dFxuICAgIH0pO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodGhpbmcpIHtcbiAgICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKHRoaW5nKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdG9DaGFpbiguLi5vYmpzKSB7XG4gICAgcmV0dXJuIG9ianMucmV2ZXJzZSgpLnJlZHVjZSgocHJvdG8sIG9iaikgPT4ge1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90byk7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5cbmxldCBleHRlbnRpb25zID0ge30sXG5cbiAgICBXQyA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuICAgICAgICByZWdpc3Rlcjoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogcmVnaXN0ZXIuYmluZChXQylcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBBIGRpY3Rpb25hcnkgb2YgYXBwbGllZCBleHRlbnRpb25zLlxuICAgICAgICAvLyBFdmVyeSBhcHBsaWVkIGV4dGVudGlvbiB3aWxsIGJlIGF2YWlsYWJsZSB0byBlYWNoIFdpbnN0b24gQ2h1cmNoaWxsXG4gICAgICAgIC8vIGNvbXBvbmVudCBpbiB0aGUgYXBwLlxuICAgICAgICBleHRlbnRpb25zOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiAoKSA9PiBleHRlbnRpb25zLFxuICAgICAgICAgICAgc2V0OiAoZXh0KSA9PiBuZXcgRXJyb3IoJ0Nhbm5vdCBvdmVyd3JpdGUgYGV4dGVudGlvbnNgIHByb3BlcnR5IG9uIFdDJylcbiAgICAgICAgfSxcblxuICAgICAgICBtaXNzaW5nRGVwczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVudGlvbiwgZGVwcykge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5ncyA9IGRlcHMucmVkdWNlKChtaXNzaW5nLCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW50aW9uc1tjdXJyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKGN1cnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgICAgIGlmIChtaXNzaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhlIFdpbnNvdG9uIENodXJjaGlsbCBgJyArIGV4dGVudGlvbiArICdgIGV4dGVudGlvbiBpcyBtaXNzaW5nIHRoZXNlIGRlcGVuZGVuY2llczogXFxuJyArIG1pc3NpbmdzLmpvaW4oJ1xcbiwnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1pc3NpbmdzO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuZXhwb3J0IGRlZmF1bHQgd2luZG93LldDID0gV0M7XG4iXX0=
