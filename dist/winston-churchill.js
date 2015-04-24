(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
    //This is will be the WC distro.
    // import WC from './src/index';
    var WC = require('./src/wc'),

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

},{"./src/extentions/data":2,"./src/extentions/on":4,"./src/extentions/render":5,"./src/extentions/template":6,"./src/wc":9}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnRpb25zL2RhdGEuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvZG9taW5nbzIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvb24uanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnRpb25zL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQVk7OztBQUdULFFBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7Ozs7Ozs7QUFPNUIsUUFBSSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztRQUNyQyxNQUFNLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDO1FBQzNDLElBQUksR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUM7UUFDdkMsU0FBUyxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztBQUVqRCxRQUFJ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QyxNQUFNLEVBQUU7QUFDakIsMkJBQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEdBQUcsU0FBUyxHQUFHLCtDQUErQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDbEk7O0FBRUQsdUJBQU8sUUFBUSxDQUFDO2FBRW5CO1NBQUE7S0FDSjtDQUNKLENBQUMsQ0FBQzs7cUJBRVEsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoKSB7XG4gICAgLy9UaGlzIGlzIHdpbGwgYmUgdGhlIFdDIGRpc3Ryby5cbiAgICAvLyBpbXBvcnQgV0MgZnJvbSAnLi9zcmMvaW5kZXgnO1xuICAgIGxldCBXQyA9IHJlcXVpcmUoJy4vc3JjL3djJyksXG5cbiAgICAvLyBpbXBvcnQgb24gZnJvbSAnLi9leHRlbnRpb25zL29uJztcbiAgICAvLyBpbXBvcnQgcmVuZGVyIGZyb20gJy4vZXh0ZW50aW9ucy9yZW5kZXInO1xuICAgIC8vIGltcG9ydCBkYXRhIGZyb20gJy4vZXh0ZW50aW9ucy9kYXRhJztcbiAgICAvLyBpbXBvcnQgdGVtcGxhdGUsIHsgdGVtcGxhdGVGcmFnbWVudH0gZnJvbSAnLi9leHRlbnRpb25zL3RlbXBsYXRlJztcblxuICAgIGV2dHMgPSByZXF1aXJlKCcuL3NyYy9leHRlbnRpb25zL29uJyksXG4gICAgcmVuZGVyID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW50aW9ucy9yZW5kZXInKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW50aW9ucy9kYXRhJyksXG4gICAgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW50aW9ucy90ZW1wbGF0ZScpO1xuXG4gICAgZXZ0cy5vbihXQyk7XG4gICAgZXZ0cy50cmlnZ2VyKFdDKTtcbiAgICB0ZW1wbGF0ZXMudGVtcGxhdGUoV0MpO1xuICAgIHRlbXBsYXRlcy50ZW1wbGF0ZUZyYWdtZW50KFdDKTtcbiAgICBkYXRhKFdDKTtcbiAgICByZW5kZXIoV0MpO1xuXG59KSgpO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGF0YShXQykge1xuXG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdkYXRhJywgWydvbicsICd0cmlnZ2VyJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVudGlvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnZGF0YScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZGF0YSxcbiAgICAgICAgICAgIHNldDogKGRhdGFPYmopID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YU9iajtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2RhdGEnLCBkYXRhT2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByKHRlbXBsYXRlRnJhZywgZGF0YSkge1xuXG4gICAgW10uc2xpY2UuY2FsbCh0ZW1wbGF0ZUZyYWcuY2hpbGROb2RlcykubWFwKCBub2RlID0+IHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgICAgIHJlbmRlclRleHROb2RlKG5vZGUsIGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcihub2RlLCBkYXRhKTtcbiAgICAgICAgICAgIHJlbmRlckVsQXR0cnMobm9kZSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9ICk7XG5cbiAgICByZXR1cm4gdGVtcGxhdGVGcmFnO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyVGV4dE5vZGUodGV4dE5vZGUsIGRhdGEpIHtcbiAgICAgICAgdGV4dE5vZGUudGV4dENvbnRlbnQgPSByZW5kZXJTdHJpbmcodGV4dE5vZGUudGV4dENvbnRlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckVsQXR0cnMoZnJhZ21lbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKGZyYWdtZW50LmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIFtdLnNsaWNlLmNhbGwoZnJhZ21lbnQuYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xuICAgICAgICAgICAgICAgIHJlbmRlckF0dHIoYXR0ciwgZGF0YSwgZnJhZ21lbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJBdHRyKGF0dHJPYmosIGRhdGEsIGZyYWdtZW50KSB7XG4gICAgICAgIHZhciBuZXdBdHRyID0gcmVuZGVyU3RyaW5nKGF0dHJPYmoubmFtZSwgZGF0YSksXG4gICAgICAgICAgICBuZXdWYWwgPSByZW5kZXJTdHJpbmcoYXR0ck9iai52YWx1ZSwgZGF0YSk7XG5cbiAgICAgICAgaWYgKGF0dHJPYmoubmFtZSAhPT0gbmV3QXR0ciB8fCBhdHRyT2JqLnZhbHVlICE9PSBuZXdWYWwpIHtcbiAgICAgICAgICAgIGZyYWdtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyT2JqLm5hbWUpO1xuICAgICAgICAgICAgZnJhZ21lbnQuc2V0QXR0cmlidXRlKG5ld0F0dHIsIG5ld1ZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJTdHJpbmcoc3RyaW5nLCBkYXRhKSB7XG4gICAgICAgIHZhciBkZWxpbSA9IHtcbiAgICAgICAgICAgICAgICBvcGVuOiAne3snLFxuICAgICAgICAgICAgICAgIGNsb3NlOiAnfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmluZGluZ1JFID0gbmV3IFJlZ0V4cCgnKCcgKyBkZWxpbS5vcGVuICsgJ1xcXFxzKikoLio/KShcXFxccyonICsgZGVsaW0uY2xvc2UgKyAnKScsICdpZycpLFxuICAgICAgICAgICAgbWF0Y2hlcyA9IHN0cmluZy5tYXRjaChiaW5kaW5nUkUpLFxuICAgICAgICAgICAgcmVwbGFjZW1lbnRzLFxuICAgICAgICAgICAgbmV3U3RyID0gc3RyaW5nLnNsaWNlKCk7XG5cbiAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgIG1hdGNoZXMubWFwKGZ1bmN0aW9uIChiaW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlbGltUkUgPSBuZXcgUmVnRXhwKGRlbGltLm9wZW4gKyAnXFxcXHMqKC4qPylcXFxccyonICsgZGVsaW0uY2xvc2UgKyAnJywgJ2knKSxcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ1BhcnRzID0gYmluZGluZy5tYXRjaChkZWxpbVJFKSxcbiAgICAgICAgICAgICAgICAgICAgaXRtID0gYmluZGluZ1BhcnRzWzFdO1xuICAgICAgICAgICAgICAgIGlmIChpdG0gPT09ICd0aGlzJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRtLnNwbGl0KC9cXC58XFwvL2cpLnJlZHVjZShmdW5jdGlvbiAodmFsLCBzZWdtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHZhbCAmJiB2YWxbc2VnbWVudF0pIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB9LCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpZHgpIHtcbiAgICAgICAgICAgICAgICBuZXdTdHIgPSBuZXdTdHIucmVwbGFjZShtYXRjaGVzW2lkeF0sIGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld1N0cjtcbiAgICB9XG59XG4iLCJsZXQgbmF0aXZlcyA9IHtcbiAgICAgICAgY3JlYXRlZDogJ2NyZWF0ZWRDYWxsYmFjaycsXG4gICAgICAgIGF0dGFjaGVkOiAnYXR0YWNoZWRDYWxsYmFjaycsXG4gICAgICAgIGRldGFjaGVkOiAnZGV0YWNoZWRDYWxsYmFjaycsXG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWQ6ICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snXG4gICAgfSxcbiAgICBldmVudHMgPSB7fSxcbiAgICBpbml0UXVldWUgPSBxTmFtZSA9PiBldmVudHNbIHFOYW1lIF0gPSBbXSxcbiAgICBvbkV2ZW50ID0gZnVuY3Rpb24gKCBldnROYW1lLCBmbiApIHtcbiAgICAgICAgbGV0IHF1ZXVlID0gZXZlbnRzWyBldnROYW1lIF0sXG4gICAgICAgICAgICBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICAgICAgICBpZiAoICFxdWV1ZSApIHtcbiAgICAgICAgICAgICAgICBxdWV1ZSA9IGluaXRRdWV1ZSggZXZ0TmFtZSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBxdWV1ZS5wdXNoKCBmbiApO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB0cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGF5bG9hZCkge1xuICAgICAgICBsZXQgY29tcG9uZW50SW5zdGFuY2UgPSB0aGlzLFxuICAgICAgICAgICAgcXVldWUgPSBldmVudHNbIGV2ZW50TmFtZSBdO1xuXG4gICAgICAgIGlmICggcXVldWUgKSB7XG4gICAgICAgICAgICBxdWV1ZS5mb3JFYWNoKCAoIGxpc3RlbmVyICkgPT4ge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwoIGNvbXBvbmVudEluc3RhbmNlLCBwYXlsb2FkICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5leHBvcnQgZnVuY3Rpb24gb24oV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygnb24nLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgLy8gQmluZGluZyB0byB0aGUgbmF0aXZlIFdlYiBDb21wb25lbnQgbGlmZWN5Y2xlIG1ldGhvZHNcbiAgICAvLyBjYXVzaW5nIHRoZW0gdG8gdHJpZ2dlciByZWxldmFudCBjYWxsYmFja3MuXG4gICAgT2JqZWN0LmtleXMobmF0aXZlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBXQy5leHRlbnRpb25zW25hdGl2ZXNba2V5XV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cmlnZ2VyLmNhbGwodGhpcywga2V5LCAuLi5hcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgV0MuZXh0ZW50aW9ucy5vbiA9IG9uRXZlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyKFdDKSB7XG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCd0cmlnZ2VyJywgW10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICBXQy5leHRlbnRpb25zLnRyaWdnZXIgPSB0cmlnZ2VyO1xuXG59XG4iLCJpbXBvcnQgciBmcm9tICcuL2RvbWluZ28yJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVuZGVyKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3JlbmRlcicsIFsnb24nLCAndHJpZ2dlciddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBXQy5leHRlbnRpb25zLm9uKCdjcmVhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdyZW5kZXInLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kQ2hpbGQoIHIodGhpcy50ZW1wbGF0ZUZyYWdtZW50LCB0aGlzLmRhdGEpICk7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdyZW5kZXInKTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogKCkgPT4gY29uc29sZS5lcnJvcigndGVtcGxhdGVGcmFnbWVudCBpcyBub3Qgc2V0dGFibGUnKVxuXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlJywgWydvbiddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG4gICAgV0MuZXh0ZW50aW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlRWw7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGVtcGxhdGVFbCxcbiAgICAgICAgICAgIHNldDogKHRlbXBsKSA9PiB0ZW1wbGF0ZUVsID0gdGVtcGxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUZyYWdtZW50KFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlJywgWydvbiddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBXQy5leHRlbnRpb25zLm9uKCdjcmVhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RlbXBsYXRlRnJhZ21lbnQnLCB7XG4gICAgICAgICAgICBnZXQ6ICgpID0+IGRvY3VtZW50LmltcG9ydE5vZGUodGhpcy50ZW1wbGF0ZS5jb250ZW50LCB0cnVlKSxcbiAgICAgICAgICAgIHNldDogKHRlbXBsKSA9PiBjb25zb2xlLmVycm9yKCd0ZW1wbGF0ZUZyYWdtZW50IGlzIG5vdCBzZXR0YWJsZScpXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWxzJztcblxubGV0IGlzU3RyaW5nID0gdGhpbmcgPT4gdXRpbC50eXBlT2YodGhpbmcpID09PSAnc3RyaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgKG5hbWUsIGNvbmZpZyA9IHt9KSA9PiB7XG4gICAgbGV0IHByb3RvID0gY29uZmlnLnByb3RvdHlwZSB8fCBIVE1MRWxlbWVudC5wcm90b3R5cGUsXG4gICAgICAgIGV4dCA9IGNvbmZpZy5leHRlbmRzO1xuXG4gICAgcHJvdG8gPSBpc1N0cmluZyhwcm90bykgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHByb3RvKSA6IHByb3RvO1xuXG4gICAgcHJvdG8gPSB1dGlsLnByb3RvQ2hhaW4oV0MuZXh0ZW50aW9ucywgcHJvdG8pO1xuXG4gICAgcmV0dXJuIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCB7XG4gICAgICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShwcm90bywge30pLFxuICAgICAgICBleHRlbmRzOiBleHRcbiAgICB9KTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gdHlwZU9mKHRoaW5nKSB7XG4gICAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbCh0aGluZykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3RvQ2hhaW4oLi4ub2Jqcykge1xuICAgIHJldHVybiBvYmpzLnJldmVyc2UoKS5yZWR1Y2UoKHByb3RvLCBvYmopID0+IHtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHJlZ2lzdGVyIGZyb20gJy4vcmVnaXN0ZXInO1xuXG5sZXQgZXh0ZW50aW9ucyA9IHt9LFxuXG4gICAgV0MgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgcmVnaXN0ZXI6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHJlZ2lzdGVyLmJpbmQoV0MpXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQSBkaWN0aW9uYXJ5IG9mIGFwcGxpZWQgZXh0ZW50aW9ucy5cbiAgICAgICAgLy8gRXZlcnkgYXBwbGllZCBleHRlbnRpb24gd2lsbCBiZSBhdmFpbGFibGUgdG8gZWFjaCBXaW5zdG9uIENodXJjaGlsbFxuICAgICAgICAvLyBjb21wb25lbnQgaW4gdGhlIGFwcC5cbiAgICAgICAgZXh0ZW50aW9uczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZXh0ZW50aW9ucyxcbiAgICAgICAgICAgIHNldDogKGV4dCkgPT4gbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIGBleHRlbnRpb25zYCBwcm9wZXJ0eSBvbiBXQycpXG4gICAgICAgIH0sXG5cbiAgICAgICAgbWlzc2luZ0RlcHM6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6ICgpID0+IGZ1bmN0aW9uIChleHRlbnRpb24sIGRlcHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgbWlzc2luZ3MgPSBkZXBzLnJlZHVjZSgobWlzc2luZywgY3VycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVdDLmV4dGVudGlvbnNbY3Vycl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pc3NpbmcucHVzaChjdXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWlzc2luZztcbiAgICAgICAgICAgICAgICB9LCBbXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobWlzc2luZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBXaW5zb3RvbiBDaHVyY2hpbGwgYCcgKyBleHRlbnRpb24gKyAnYCBleHRlbnRpb24gaXMgbWlzc2luZyB0aGVzZSBkZXBlbmRlbmNpZXM6IFxcbicgKyBtaXNzaW5ncy5qb2luKCdcXG4sJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5ncztcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdpbmRvdy5XQyA9IFdDO1xuIl19
