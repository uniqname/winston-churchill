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
                this.createShadowRoot().appendChild(_r2['default'](this.templateFragment, this.data));
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

        console.log('doc:', doc.documentElement);

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

        console.log('this: ', this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL2RhdGEvZGF0YS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9ldmVudHMvZXZlbnRzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3JlbmRlci9kb21pbmdvMi5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW5zaW9ucy9yZW5kZXIvcmVuZGVyLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnNpb25zL3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxDQUFDLFlBQVk7OztBQUdULFFBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFFeEIsWUFBWSxHQUFHLHNCQUFVLEVBQUUsRUFBRTtBQUN6QixZQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQUUs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QztLQUMzQjs7Ozs7QUFLRCxjQUFVLEVBQUU7QUFDUixrQkFBVSxFQUFFLElBQUk7QUFDaEIsV0FBRyxFQUFFO21CQUFNLFVBQVU7U0FBQTtBQUNyQixXQUFHLEVBQUUsYUFBQyxHQUFHO21CQUFLLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDO1NBQUE7S0FDMUU7O0FBRUQsZUFBVyxFQUFFO0FBQ1Qsa0JBQVUsRUFBRSxJQUFJO0FBQ2hCLFdBQUcsRUFBRTttQkFBTSxVQUFVLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDbEMsb0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFLO0FBQzFDLHdCQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN0QiwrQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdEI7QUFDRCwyQkFBTyxPQUFPLENBQUM7aUJBQ2xCLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRVAsb0JBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzNCLHNCQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbkM7O0FBRUQsb0JBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNqQiwyQkFBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxTQUFTLEdBQUcsK0NBQStDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNsSTs7QUFFRCx1QkFBTyxRQUFRLENBQUM7YUFFbkI7U0FBQTtLQUNKO0NBQ0osQ0FBQyxDQUFDOztxQkFFUSxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAvL1RoaXMgaXMgd2lsbCBiZSB0aGUgV0MgZGlzdHJvLlxuICAgIC8vIGltcG9ydCBXQyBmcm9tICcuL3NyYy9pbmRleCc7XG4gICAgbGV0IFdDID0gcmVxdWlyZSgnLi9zcmMvd2MnKSxcblxuICAgICAgICByZW5kZXJPbkRhdGEgPSBmdW5jdGlvbiAoV0MpIHtcbiAgICAgICAgICAgIGlmIChXQy5taXNzaW5nRGVwcygncmVuZGVyT25EYXRhJywgWydvbicsICd0ZW1wbGF0ZUZyYWdtZW50JywgJ2RhdGEnXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG5cbiAgICAgICAgICAgIFdDLmV4dGVuc2lvbnMub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHRoaXMudGVtcGxhdGVGcmFnbWVudCwgdGhpcy5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgLy8gaW1wb3J0IG9uIGZyb20gJy4vZXh0ZW5zaW9ucy9vbic7XG4gICAgLy8gaW1wb3J0IHJlbmRlciBmcm9tICcuL2V4dGVuc2lvbnMvcmVuZGVyJztcbiAgICAvLyBpbXBvcnQgZGF0YSBmcm9tICcuL2V4dGVuc2lvbnMvZGF0YSc7XG4gICAgLy8gaW1wb3J0IHRlbXBsYXRlLCB7IHRlbXBsYXRlRnJhZ21lbnR9IGZyb20gJy4vZXh0ZW5zaW9ucy90ZW1wbGF0ZSc7XG5cbiAgICAgICAgZXZ0cyA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvZXZlbnRzL2V2ZW50cycpLFxuICAgICAgICByZW5kZXIgPSByZXF1aXJlKCcuL3NyYy9leHRlbnNpb25zL3JlbmRlci9yZW5kZXInKSxcbiAgICAgICAgZGF0YSA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvZGF0YS9kYXRhJyksXG4gICAgICAgIHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vc3JjL2V4dGVuc2lvbnMvdGVtcGxhdGUvdGVtcGxhdGUnKTtcblxuICAgIGV2dHMub24oV0MpO1xuICAgIGV2dHMudHJpZ2dlcihXQyk7XG4gICAgdGVtcGxhdGVzLnRlbXBsYXRlKFdDKTtcbiAgICB0ZW1wbGF0ZXMudGVtcGxhdGVGcmFnbWVudChXQyk7XG4gICAgZGF0YShXQyk7XG4gICAgcmVuZGVyKFdDKTtcbiAgICByZW5kZXJPbkRhdGEoV0MpO1xuXG5cbn0pKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRhKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ2RhdGEnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgV0MuZXh0ZW5zaW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXRhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkYXRhLFxuICAgICAgICAgICAgc2V0OiAoZGF0YU9iaikgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhT2JqO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGFPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImxldCBuYXRpdmVzID0ge1xuICAgICAgICBjcmVhdGVkOiAnY3JlYXRlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0YWNoZWQ6ICdhdHRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgZGV0YWNoZWQ6ICdkZXRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZDogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaydcbiAgICB9LFxuICAgIGV2ZW50cyA9IHt9LFxuICAgIGluaXRRdWV1ZSA9IHFOYW1lID0+IGV2ZW50c1sgcU5hbWUgXSA9IFtdLFxuICAgIG9uRXZlbnQgPSBmdW5jdGlvbiAoIGV2dE5hbWUsIGZuICkge1xuICAgICAgICBsZXQgcXVldWUgPSBldmVudHNbIGV2dE5hbWUgXSxcbiAgICAgICAgICAgIGNvbXBvbmVudEluc3RhbmNlID0gdGhpcztcblxuICAgICAgICBpZiAoIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgIGlmICggIXF1ZXVlICkge1xuICAgICAgICAgICAgICAgIHF1ZXVlID0gaW5pdFF1ZXVlKCBldnROYW1lICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHF1ZXVlLnB1c2goIGZuICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXlsb2FkKSB7XG4gICAgICAgIGxldCBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXMsXG4gICAgICAgICAgICBxdWV1ZSA9IGV2ZW50c1sgZXZlbnROYW1lIF07XG5cbiAgICAgICAgaWYgKCBxdWV1ZSApIHtcbiAgICAgICAgICAgIHF1ZXVlLmZvckVhY2goICggbGlzdGVuZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCggY29tcG9uZW50SW5zdGFuY2UsIHBheWxvYWQgKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBvbihXQykge1xuXG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdvbicsIFtdKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBCaW5kaW5nIHRvIHRoZSBuYXRpdmUgV2ViIENvbXBvbmVudCBsaWZlY3ljbGUgbWV0aG9kc1xuICAgIC8vIGNhdXNpbmcgdGhlbSB0byB0cmlnZ2VyIHJlbGV2YW50IGNhbGxiYWNrcy5cbiAgICBPYmplY3Qua2V5cyhuYXRpdmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIFdDLmV4dGVuc2lvbnNbbmF0aXZlc1trZXldXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyaWdnZXIuY2FsbCh0aGlzLCBrZXksIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBXQy5leHRlbnNpb25zLm9uID0gb25FdmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaWdnZXIoV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RyaWdnZXInLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgIFdDLmV4dGVuc2lvbnMudHJpZ2dlciA9IHRyaWdnZXI7XG5cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHIodGVtcGxhdGVGcmFnLCBkYXRhKSB7XG5cbiAgICBbXS5zbGljZS5jYWxsKHRlbXBsYXRlRnJhZy5jaGlsZE5vZGVzKS5tYXAoIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgcmVuZGVyVGV4dE5vZGUobm9kZSwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByKG5vZGUsIGRhdGEpO1xuICAgICAgICAgICAgcmVuZGVyRWxBdHRycyhub2RlLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZUZyYWc7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJUZXh0Tm9kZSh0ZXh0Tm9kZSwgZGF0YSkge1xuICAgICAgICB0ZXh0Tm9kZS50ZXh0Q29udGVudCA9IHJlbmRlclN0cmluZyh0ZXh0Tm9kZS50ZXh0Q29udGVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyRWxBdHRycyhmcmFnbWVudCwgZGF0YSkge1xuICAgICAgICBpZiAoZnJhZ21lbnQuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgW10uc2xpY2UuY2FsbChmcmFnbWVudC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyQXR0cihhdHRyLCBkYXRhLCBmcmFnbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckF0dHIoYXR0ck9iaiwgZGF0YSwgZnJhZ21lbnQpIHtcbiAgICAgICAgdmFyIG5ld0F0dHIgPSByZW5kZXJTdHJpbmcoYXR0ck9iai5uYW1lLCBkYXRhKSxcbiAgICAgICAgICAgIG5ld1ZhbCA9IHJlbmRlclN0cmluZyhhdHRyT2JqLnZhbHVlLCBkYXRhKTtcblxuICAgICAgICBpZiAoYXR0ck9iai5uYW1lICE9PSBuZXdBdHRyIHx8IGF0dHJPYmoudmFsdWUgIT09IG5ld1ZhbCkge1xuICAgICAgICAgICAgZnJhZ21lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJPYmoubmFtZSk7XG4gICAgICAgICAgICBmcmFnbWVudC5zZXRBdHRyaWJ1dGUobmV3QXR0ciwgbmV3VmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclN0cmluZyhzdHJpbmcsIGRhdGEpIHtcbiAgICAgICAgdmFyIGRlbGltID0ge1xuICAgICAgICAgICAgICAgIG9wZW46ICd7eycsXG4gICAgICAgICAgICAgICAgY2xvc2U6ICd9fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kaW5nUkUgPSBuZXcgUmVnRXhwKCcoJyArIGRlbGltLm9wZW4gKyAnXFxcXHMqKSguKj8pKFxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcpJywgJ2lnJyksXG4gICAgICAgICAgICBtYXRjaGVzID0gc3RyaW5nLm1hdGNoKGJpbmRpbmdSRSksXG4gICAgICAgICAgICByZXBsYWNlbWVudHMsXG4gICAgICAgICAgICBuZXdTdHIgPSBzdHJpbmcuc2xpY2UoKTtcblxuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgbWF0Y2hlcy5tYXAoZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVsaW1SRSA9IG5ldyBSZWdFeHAoZGVsaW0ub3BlbiArICdcXFxccyooLio/KVxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcnLCAnaScpLFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nUGFydHMgPSBiaW5kaW5nLm1hdGNoKGRlbGltUkUpLFxuICAgICAgICAgICAgICAgICAgICBpdG0gPSBiaW5kaW5nUGFydHNbMV07XG4gICAgICAgICAgICAgICAgaWYgKGl0bSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdG0uc3BsaXQoL1xcLnxcXC8vZykucmVkdWNlKGZ1bmN0aW9uICh2YWwsIHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAodmFsICYmIHZhbFtzZWdtZW50XSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIH0sIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIG5ld1N0ciA9IG5ld1N0ci5yZXBsYWNlKG1hdGNoZXNbaWR4XSwgaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyO1xuICAgIH1cbn1cbiIsImltcG9ydCByIGZyb20gJy4vZG9taW5nbzInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW5kZXIoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygncmVuZGVyJywgWydvbicsICd0cmlnZ2VyJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXQy5leHRlbnNpb25zLCAncmVuZGVyJywge1xuICAgICAgICBnZXQ6ICgpID0+IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpXG4gICAgICAgICAgICAgICAgLmFwcGVuZENoaWxkKCByKHRoaXMudGVtcGxhdGVGcmFnbWVudCwgdGhpcy5kYXRhKSApO1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCdyZW5kZXInKTtcblxuICAgICAgICB9LFxuICAgICAgICBzZXQ6ICgpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZShXQykge1xuICAgIGlmIChXQy5taXNzaW5nRGVwcygndGVtcGxhdGUnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIGxldCBkb2MgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0Lm93bmVyRG9jdW1lbnQ7XG5cbiAgICBXQy5leHRlbnNpb25zLm9uKCdjcmVhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdGVtcGxhdGVFbCA9IGRvYy5xdWVyeVNlbGVjdG9yKCd0ZW1wbGF0ZScpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdkb2M6JywgZG9jLmRvY3VtZW50RWxlbWVudCk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZScsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gdGVtcGxhdGVFbCxcbiAgICAgICAgICAgIHNldDogKHRlbXBsKSA9PiB0ZW1wbGF0ZUVsID0gdGVtcGxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUZyYWdtZW50KFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RlbXBsYXRlRnJhZ21lbnQnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVuc2lvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGlzOiAnLCB0aGlzKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0ZW1wbGF0ZUZyYWdtZW50Jywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkb2N1bWVudC5pbXBvcnROb2RlKHRoaXMudGVtcGxhdGUuY29udGVudCwgdHJ1ZSksXG4gICAgICAgICAgICBzZXQ6ICh0ZW1wbCkgPT4gY29uc29sZS5lcnJvcigndGVtcGxhdGVGcmFnbWVudCBpcyBub3Qgc2V0dGFibGUnKVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlscyc7XG5cbmxldCBpc1N0cmluZyA9IHRoaW5nID0+IHV0aWwudHlwZU9mKHRoaW5nKSA9PT0gJ3N0cmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0IChuYW1lLCBjb25maWcgPSB7fSkgPT4ge1xuICAgIGxldCBwcm90byA9IGNvbmZpZy5wcm90b3R5cGUgfHwgSFRNTEVsZW1lbnQucHJvdG90eXBlLFxuICAgICAgICBleHQgPSBjb25maWcuZXh0ZW5kcztcblxuICAgIHByb3RvID0gaXNTdHJpbmcocHJvdG8pID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChwcm90bykgOiBwcm90bztcblxuICAgIHByb3RvID0gdXRpbC5wcm90b0NoYWluKFdDLmV4dGVuc2lvbnMsIHByb3RvKTtcblxuICAgIHJldHVybiBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwge1xuICAgICAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUocHJvdG8sIHt9KSxcbiAgICAgICAgZXh0ZW5kczogZXh0XG4gICAgfSk7XG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih0aGluZykge1xuICAgIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwodGhpbmcpLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm90b0NoYWluKC4uLm9ianMpIHtcbiAgICByZXR1cm4gb2Jqcy5yZXZlcnNlKCkucmVkdWNlKChwcm90bywgb2JqKSA9PiB7XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihvYmosIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbn1cbiIsImltcG9ydCByZWdpc3RlciBmcm9tICcuL3JlZ2lzdGVyJztcblxubGV0IGV4dGVuc2lvbnMgPSB7fSxcblxuICAgIFdDID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG4gICAgICAgIHJlZ2lzdGVyOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiByZWdpc3Rlci5iaW5kKFdDKVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEEgZGljdGlvbmFyeSBvZiBhcHBsaWVkIGV4dGVuc2lvbnMuXG4gICAgICAgIC8vIEV2ZXJ5IGFwcGxpZWQgZXh0ZW50aW9uIHdpbGwgYmUgYXZhaWxhYmxlIHRvIGVhY2ggV2luc3RvbiBDaHVyY2hpbGxcbiAgICAgICAgLy8gY29tcG9uZW50IGluIHRoZSBhcHAuXG4gICAgICAgIGV4dGVuc2lvbnM6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6ICgpID0+IGV4dGVuc2lvbnMsXG4gICAgICAgICAgICBzZXQ6IChleHQpID0+IG5ldyBFcnJvcignQ2Fubm90IG92ZXJ3cml0ZSBgZXh0ZW5zaW9uc2AgcHJvcGVydHkgb24gV0MnKVxuICAgICAgICB9LFxuXG4gICAgICAgIG1pc3NpbmdEZXBzOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiAoKSA9PiBmdW5jdGlvbiAoZXh0ZW50aW9uLCBkZXBzKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1pc3NpbmdzID0gZGVwcy5yZWR1Y2UoKG1pc3NpbmcsIGN1cnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFXQy5leHRlbnNpb25zW2N1cnJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaXNzaW5nLnB1c2goY3Vycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1pc3Npbmc7XG4gICAgICAgICAgICAgICAgfSwgW10pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFXQy5leHRlbnNpb25zW2V4dGVudGlvbl0pIHtcbiAgICAgICAgICAgICAgICAgICAgV0MuZXh0ZW5zaW9uc1tleHRlbnRpb25dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWlzc2luZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBXaW5zb3RvbiBDaHVyY2hpbGwgYCcgKyBleHRlbnRpb24gKyAnYCBleHRlbnRpb24gaXMgbWlzc2luZyB0aGVzZSBkZXBlbmRlbmNpZXM6IFxcbicgKyBtaXNzaW5ncy5qb2luKCdcXG4sJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5ncztcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdpbmRvdy5XQyA9IFdDO1xuIl19
