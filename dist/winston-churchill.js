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
        bindPropToAttr = require('./src/extensions/bindPropToAttr/bindPropToAttr');

    WC.extendWith([evts.on, evts.trigger, templates.template, templates.templateFragment, data, render, renderOnData, bindPropToAttr]);
})();

},{"./src/extensions/bindPropToAttr/bindPropToAttr":2,"./src/extensions/data/data":3,"./src/extensions/events/events":4,"./src/extensions/render/render":6,"./src/extensions/template/template":7,"./src/wc":10}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
    if (typeof fn !== 'function') {
        return;
    }
    var queue = events[evtName] || initQueue(evtName);
    queue.push(fn);
},
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./domingo2":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"./utils":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./register":8}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL2JpbmRQcm9wVG9BdHRyL2JpbmRQcm9wVG9BdHRyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL2RhdGEvZGF0YS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3JlbmRlci9kb21pbmdvMi5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9yZW5kZXIvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQVk7OztBQUdULFFBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFFeEIsWUFBWSxHQUFHLHNCQUFVLEVBQUUsRUFBRTtBQUN6QixZQUFJLEVB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O2lCQUNuQzs7QUFFRCxvQkFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ2pCLDJCQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixHQUFHLFNBQVMsR0FBRywrQ0FBK0MsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ2xJOztBQUVELHVCQUFPLFFBQVEsQ0FBQzthQUVuQjtTQUFBO0tBQ0o7Q0FDSixDQUFDLENBQUM7O3FCQUVRLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKCkge1xuICAgIC8vVGhpcyBpcyB3aWxsIGJlIHRoZSBXQyBkaXN0cm8uXG4gICAgLy8gaW1wb3J0IFdDIGZyb20gJy4vc3JjL2luZGV4JztcbiAgICBsZXQgV0MgPSByZXF1aXJlKCcuL3NyYy93YycpLFxuXG4gICAgICAgIHJlbmRlck9uRGF0YSA9IGZ1bmN0aW9uIChXQykge1xuICAgICAgICAgICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdyZW5kZXJPbkRhdGEnLCBbJ29uJywgJ3RlbXBsYXRlRnJhZ21lbnQnLCAnZGF0YSddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cblxuICAgICAgICAgICAgV0MuZXh0ZW5zaW9ucy5vbignZGF0YScsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIodGhpcy50ZW1wbGF0ZUZyYWdtZW50LCB0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAvLyBpbXBvcnQgb24gZnJvbSAnLi9leHRlbnNpb25zL29uJztcbiAgICAvLyBpbXBvcnQgcmVuZGVyIGZyb20gJy4vZXh0ZW5zaW9ucy9yZW5kZXInO1xuICAgIC8vIGltcG9ydCBkYXRhIGZyb20gJy4vZXh0ZW5zaW9ucy9kYXRhJztcbiAgICAvLyBpbXBvcnQgdGVtcGxhdGUsIHsgdGVtcGxhdGVGcmFnbWVudH0gZnJvbSAnLi9leHRlbnNpb25zL3RlbXBsYXRlJztcblxuICAgICAgICBldnRzID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW5zaW9ucy9ldmVudHMvZXZlbnRzJyksXG4gICAgICAgIHJlbmRlciA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvcmVuZGVyL3JlbmRlcicpLFxuICAgICAgICBkYXRhID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW5zaW9ucy9kYXRhL2RhdGEnKSxcbiAgICAgICAgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW5zaW9ucy90ZW1wbGF0ZS90ZW1wbGF0ZScpLFxuICAgICAgICBiaW5kUHJvcFRvQXR0ciA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvYmluZFByb3BUb0F0dHIvYmluZFByb3BUb0F0dHInKTtcblxuICAgIFdDLmV4dGVuZFdpdGgoW2V2dHMub24sIGV2dHMudHJpZ2dlcixcbiAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMudGVtcGxhdGUsIHRlbXBsYXRlcy50ZW1wbGF0ZUZyYWdtZW50LFxuICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgcmVuZGVyLFxuICAgICAgICAgICAgICAgICAgIHJlbmRlck9uRGF0YSxcbiAgICAgICAgICAgICAgICAgICBiaW5kUHJvcFRvQXR0cl0pO1xuXG59KSgpO1xuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGF0YShXQykge1xuXG4gICAgaWYgKCFXQy5taXNzaW5nRGVwcygnYmluZEF0dHJUb1Byb3AnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7XG5cbiAgICAgICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBjb21wbyA9IHRoaXM7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29tcG8sICdiaW5kQXR0clRvUHJvcCcsIHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IGZ1bmN0aW9uIChhdHRyLCBwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb21wbywgcHJvcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogKCkgPT4gY29tcG8uZ2V0QXR0cmlidXRlKGF0dHIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0OiB2YWwgPT4gY29tcG8uc2V0QXR0cmlidXRlKHZhbClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gV0M7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRhKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ2RhdGEnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXRhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkYXRhLFxuICAgICAgICAgICAgc2V0OiAoZGF0YU9iaikgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhT2JqO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGFPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImxldCBuYXRpdmVzID0ge1xuICAgICAgICBjcmVhdGVkOiAnY3JlYXRlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0YWNoZWQ6ICdhdHRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgZGV0YWNoZWQ6ICdkZXRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZDogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaydcbiAgICB9LFxuICAgIGV2ZW50cyA9IHt9LFxuICAgIGluaXRRdWV1ZSA9IHFOYW1lID0+IGV2ZW50c1sgcU5hbWUgXSA9IFtdLFxuICAgIG9uRXZlbnQgPSBmdW5jdGlvbiAoIGV2dE5hbWUsIGZuICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyApIHsgcmV0dXJuOyB9XG4gICAgICAgIGxldCBxdWV1ZSA9IGV2ZW50c1sgZXZ0TmFtZSBdIHx8IGluaXRRdWV1ZSggZXZ0TmFtZSk7XG4gICAgICAgIHF1ZXVlLnB1c2goIGZuICk7XG4gICAgfSxcbiAgICB0cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgcGF5bG9hZCA9IHt9LCBidWJibGVzPXRydWUpIHtcbiAgICAgICAgbGV0IHF1ZXVlID0gZXZlbnRzWyBldmVudE5hbWUgXSB8fCBbXTtcbiAgICAgICAgcXVldWUuZm9yRWFjaCggbGlzdGVuZXIgPT4gbGlzdGVuZXIuY2FsbCggdGhpcywgcGF5bG9hZCApKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7ZGV0YWlsOiBwYXlsb2FkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzOiBidWJibGVzfSkgKTtcbiAgICB9O1xuXG5leHBvcnQgZnVuY3Rpb24gb24oV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ29uJywgW10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICAvLyBCaW5kaW5nIHRvIHRoZSBuYXRpdmUgV2ViIENvbXBvbmVudCBsaWZlY3ljbGUgbWV0aG9kc1xuICAgIC8vIGNhdXNpbmcgdGhlbSB0byB0cmlnZ2VyIHJlbGV2YW50IGNhbGxiYWNrcy5cbiAgICBPYmplY3Qua2V5cyhuYXRpdmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIFdDLmV4dGVuc2lvbnNbbmF0aXZlc1trZXldXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyaWdnZXIuY2FsbCh0aGlzLCBrZXksIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG4gICAgV0MuZXh0ZW5zaW9ucy5vbiA9IG9uRXZlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyKFdDKSB7XG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCd0cmlnZ2VyJywgW10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICBXQy5leHRlbnNpb25zLnRyaWdnZXIgPSB0cmlnZ2VyO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcih0ZW1wbGF0ZUZyYWcsIGRhdGEpIHtcblxuICAgIFtdLnNsaWNlLmNhbGwodGVtcGxhdGVGcmFnLmNoaWxkTm9kZXMpLm1hcCggbm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICByZW5kZXJUZXh0Tm9kZShub2RlLCBkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHIobm9kZSwgZGF0YSk7XG4gICAgICAgICAgICByZW5kZXJFbEF0dHJzKG5vZGUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfSApO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlRnJhZztcblxuICAgIGZ1bmN0aW9uIHJlbmRlclRleHROb2RlKHRleHROb2RlLCBkYXRhKSB7XG4gICAgICAgIHRleHROb2RlLnRleHRDb250ZW50ID0gcmVuZGVyU3RyaW5nKHRleHROb2RlLnRleHRDb250ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXJFbEF0dHJzKGZyYWdtZW50LCBkYXRhKSB7XG4gICAgICAgIGlmIChmcmFnbWVudC5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBbXS5zbGljZS5jYWxsKGZyYWdtZW50LmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgICAgICAgICByZW5kZXJBdHRyKGF0dHIsIGRhdGEsIGZyYWdtZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyQXR0cihhdHRyT2JqLCBkYXRhLCBmcmFnbWVudCkge1xuICAgICAgICB2YXIgbmV3QXR0ciA9IHJlbmRlclN0cmluZyhhdHRyT2JqLm5hbWUsIGRhdGEpLFxuICAgICAgICAgICAgbmV3VmFsID0gcmVuZGVyU3RyaW5nKGF0dHJPYmoudmFsdWUsIGRhdGEpO1xuXG4gICAgICAgIGlmIChhdHRyT2JqLm5hbWUgIT09IG5ld0F0dHIgfHwgYXR0ck9iai52YWx1ZSAhPT0gbmV3VmFsKSB7XG4gICAgICAgICAgICBmcmFnbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck9iai5uYW1lKTtcbiAgICAgICAgICAgIGZyYWdtZW50LnNldEF0dHJpYnV0ZShuZXdBdHRyLCBuZXdWYWwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyU3RyaW5nKHN0cmluZywgZGF0YSkge1xuICAgICAgICB2YXIgZGVsaW0gPSB7XG4gICAgICAgICAgICAgICAgb3BlbjogJ3t7JyxcbiAgICAgICAgICAgICAgICBjbG9zZTogJ319J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJpbmRpbmdSRSA9IG5ldyBSZWdFeHAoJygnICsgZGVsaW0ub3BlbiArICdcXFxccyopKC4qPykoXFxcXHMqJyArIGRlbGltLmNsb3NlICsgJyknLCAnaWcnKSxcbiAgICAgICAgICAgIG1hdGNoZXMgPSBzdHJpbmcubWF0Y2goYmluZGluZ1JFKSxcbiAgICAgICAgICAgIHJlcGxhY2VtZW50cyxcbiAgICAgICAgICAgIG5ld1N0ciA9IHN0cmluZy5zbGljZSgpO1xuXG4gICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICBtYXRjaGVzLm1hcChmdW5jdGlvbiAoYmluZGluZykge1xuICAgICAgICAgICAgICAgIHZhciBkZWxpbVJFID0gbmV3IFJlZ0V4cChkZWxpbS5vcGVuICsgJ1xcXFxzKiguKj8pXFxcXHMqJyArIGRlbGltLmNsb3NlICsgJycsICdpJyksXG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdQYXJ0cyA9IGJpbmRpbmcubWF0Y2goZGVsaW1SRSksXG4gICAgICAgICAgICAgICAgICAgIGl0bSA9IGJpbmRpbmdQYXJ0c1sxXTtcbiAgICAgICAgICAgICAgICBpZiAoaXRtID09PSAndGhpcycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0bS5zcGxpdCgvXFwufFxcLy9nKS5yZWR1Y2UoZnVuY3Rpb24gKHZhbCwgc2VnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh2YWwgJiYgdmFsW3NlZ21lbnRdKSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgfSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaWR4KSB7XG4gICAgICAgICAgICAgICAgbmV3U3RyID0gbmV3U3RyLnJlcGxhY2UobWF0Y2hlc1tpZHhdLCBpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdTdHI7XG4gICAgfVxufVxuIiwiaW1wb3J0IHIgZnJvbSAnLi9kb21pbmdvMic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlbmRlcihXQykge1xuXG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdyZW5kZXInLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdDLmV4dGVuc2lvbnMsICdyZW5kZXInLCB7XG4gICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHNoYWRvd1Jvb3QgPSB0aGlzLnNoYWRvd1Jvb3QgfHwgdGhpcy5jcmVhdGVTaGFkb3dSb290KCksXG4gICAgICAgICAgICBkYXRhID0gQXJyYXkuaXNBcnJheSh0aGlzLmRhdGEpID8gdGhpcy5kYXRhIDogW3RoaXMuZGF0YV07XG5cbiAgICAgICAgICAgIFsuLi5zaGFkb3dSb290LmNoaWxkTm9kZXNdXG4gICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKG5vZGUgPT4gc2hhZG93Um9vdC5yZW1vdmVDaGlsZChub2RlKSk7XG4gICAgICAgICAgICBkYXRhLmZvckVhY2goXG4gICAgICAgICAgICAgICAgZGF0dW0gPT4gc2hhZG93Um9vdC5hcHBlbmRDaGlsZCggcih0aGlzLnRlbXBsYXRlRnJhZ21lbnQsIGRhdHVtKSApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdyZW5kZXInKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiAoKSA9PiBjb25zb2xlLmVycm9yKCd0ZW1wbGF0ZUZyYWdtZW50IGlzIG5vdCBzZXR0YWJsZScpXG4gICAgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUoV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlJywgWydvbiddKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBsZXQgZG9jID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5vd25lckRvY3VtZW50O1xuICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB0ZW1wbGF0ZUVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ3RlbXBsYXRlJyk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGVtcGxhdGVFbCxcbiAgICAgICAgICAgIHNldDogKHRlbXBsKSA9PiB0ZW1wbGF0ZUVsID0gdGVtcGxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUZyYWdtZW50KFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlRnJhZ21lbnQnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGVtcGxhdGVGcmFnbWVudCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgaXNTdHJpbmcgPSB0aGluZyA9PiB1dGlsLnR5cGVPZih0aGluZykgPT09ICdzdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgY29uZmlnID0ge30pID0+IHtcbiAgICBsZXQgcHJvdG8gPSBjb25maWcucHJvdG90eXBlIHx8IEhUTUxFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgZXh0ID0gY29uZmlnLmV4dGVuZHM7XG5cbiAgICBwcm90byA9IGlzU3RyaW5nKHByb3RvKSA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocHJvdG8pIDogcHJvdG87XG5cbiAgICBwcm90byA9IHV0aWwucHJvdG9DaGFpbihXQy5leHRlbnNpb25zLCBwcm90byk7XG5cbiAgICByZXR1cm4gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcbiAgICAgICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKHByb3RvLCB7fSksXG4gICAgICAgIGV4dGVuZHM6IGV4dFxuICAgIH0pO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodGhpbmcpIHtcbiAgICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKHRoaW5nKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdG9DaGFpbiguLi5vYmpzKSB7XG4gICAgcmV0dXJuIG9ianMucmV2ZXJzZSgpLnJlZHVjZSgocHJvdG8sIG9iaikgPT4ge1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90byk7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5cbi8vIEFycmF5LmZyb20gcG9seWZpbGxcbi8vIFRoaXMgaXMgbm90IGEgc3BlYyBjb21wbGlhbnQgcG9seWZpbCBidXQgY292ZXJzIHRoZSB2YXN0XG4vLyBtYWpvcml0eSBvZiB1c2UgY2FzZXMuIEluIHBhcnRpY3VsYXIgaXQgZmlsbHMgaG93IEJhYmxlIHVzZXNcbi8vIGl0IHRvIHRyYW5zcGlsZSB0aGUgc3ByZWFkIG9wZXJhdG9yLlxuXG4vLyBUT0RPOiBOZWVkIHRvIHJlc2VhcmNoIHdoeSBiYWJlbCB0cnlzIHRvIHVzZSBBcnJheS5mcm9tXG4vLyAgICAgICB3aXRob3V0IGltcGxlbWVudGluZyBhIHBvbHlmaWwgaW50ZXJuYWxseSBhcyB0aGV5XG4vLyAgICAgICBkbyB3aXRoIG90aGVyIHRoaW5ncy4gQXMgb2YgdGhlIHRpbWUgb2YgdGhpcyBub3RlLFxuLy8gICAgICAgQXJyYXkuZnJvbSBpcyBvbmx5IGltcGxlbWVudGVkIGluIEZpcmVGb3guXG5pZiAoIUFycmF5LmZyb20pICBBcnJheS5mcm9tID0gYXJyYXlMaWtlID0+IFtdLnNsaWNlLmNhbGwoYXJyYXlMaWtlKTtcblxuXG5sZXQgZXh0ZW5zaW9ucyA9IHt9LFxuXG4gICAgV0MgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgcmVnaXN0ZXI6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHJlZ2lzdGVyLmJpbmQoV0MpXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQSBkaWN0aW9uYXJ5IG9mIGFwcGxpZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgLy8gRXZlcnkgYXBwbGllZCBleHRlbnRpb24gd2lsbCBiZSBhdmFpbGFibGUgdG8gZWFjaCBXaW5zdG9uIENodXJjaGlsbFxuICAgICAgICAvLyBjb21wb25lbnQgaW4gdGhlIGFwcC5cbiAgICAgICAgZXh0ZW5zaW9uczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZXh0ZW5zaW9ucyxcbiAgICAgICAgICAgIHNldDogKGV4dCkgPT4gbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIGBleHRlbnNpb25zYCBwcm9wZXJ0eSBvbiBXQycpXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kV2l0aDoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVuc2lvbnNMaXN0KSB7XG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uc0xpc3QgPSBBcnJheS5pc0FycmF5KGV4dGVuc2lvbnNMaXN0KSA/IGV4dGVuc2lvbnNMaXN0IDogW2V4dGVuc2lvbnNMaXN0XTtcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uKFdDKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtaXNzaW5nRGVwczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVudGlvbiwgZGVwcykge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5ncyA9IGRlcHMucmVkdWNlKChtaXNzaW5nLCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tjdXJyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKGN1cnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tleHRlbnRpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIFdDLmV4dGVuc2lvbnNbZXh0ZW50aW9uXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1pc3NpbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgV2luc290b24gQ2h1cmNoaWxsIGAnICsgZXh0ZW50aW9uICsgJ2AgZXh0ZW50aW9uIGlzIG1pc3NpbmcgdGhlc2UgZGVwZW5kZW5jaWVzOiBcXG4nICsgbWlzc2luZ3Muam9pbignXFxuLCcpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWlzc2luZ3M7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5leHBvcnQgZGVmYXVsdCB3aW5kb3cuV0MgPSBXQztcbiJdfQ==
