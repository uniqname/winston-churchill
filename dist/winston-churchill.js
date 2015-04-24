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

    evts = require('./src/extentions/events'),
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

},{"./src/extentions/data":2,"./src/extentions/events":4,"./src/extentions/render":5,"./src/extentions/template":6,"./src/wc":9}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvZGlzdHJvLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnRpb25zL2RhdGEuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvZG9taW5nbzIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL2V4dGVudGlvbnMvZXZlbnRzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9leHRlbnRpb25zL3JlbmRlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvZXh0ZW50aW9ucy90ZW1wbGF0ZS5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvcmVnaXN0ZXIuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3V0aWxzLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy93Yy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsQ0FBQyxZQUFZOzs7QUFHVCxRQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDOzs7Ozs7O0FBTzVCLFFBQUksR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUM7UUFDekMsTUFBTSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQztRQUMzQyxJQUFJLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDO1FBQ3ZDLFNBQVMsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFakQsUUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNaLFFBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakIsYUFBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2QixhQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0IsUUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsVUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBRWQsQ0FBQSxFQUFHLENBQUM7Ozs7Ozs7O3FCQ3RCbUIsSUFBSTs7QUFBYixTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7O0FBRTdCLFFBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFPO0tBQUU7O0FBRWpFLE1BQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxZQUFZOzs7QUFDcEMsWUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsY0FBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ2hDLGVBQUcsRUFBRTt1QkFBTSxJQUFJO2FBQUE7QUFDZixlQUFHLEVBQUUsYUFBQyxPQUFPLEVBQUs7QUFDZCxvQkFBSSxHQUFHLE9BQU8sQ0FBQztBQUNmLHNCQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDakM7U0FDSixDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTjs7Ozs7Ozs7OztxQkNkdUIsQ0FBQzs7QUFBVixTQUFTLENBQUMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFOztBQUUxQyxNQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSSxFQUFJO0FBQ2hELFlBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7QUFDckIsMEJBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDOUIsTUFBTTtBQUNILGFBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDZCx5QkFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3QjtLQUNKLENBQUUsQ0FBQzs7QUFFSixXQUFPLFlBQVksQ0FBQzs7QUFFcEIsYUFBUyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRTtBQUNwQyxnQkFBUSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNuRTs7QUFFRCxhQUFTLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQ25DLFlBQUksUUFBUSxDQUFDLFVBQVUsRUFBRTtBQUNyQixjQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQ3ZELDBCQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzthQUNwQyxDQUFDLENBQUM7U0FDTjtLQUNKOztBQUVELGFBQVMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ3pDLFlBQUksT0FBTyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztZQUMxQyxNQUFNLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRS9DLFlBQUksT0FBTyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssS0FBSyxNQUFNLEVBQUU7QUFDdEQsb0JBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztTQUMxQztLQUNKOztBQUVELGFBQVMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDaEMsWUFBSSxLQUFLLEdBQUc7QUFDSixnQkFBSSxFQUFFLElBQUk7QUFDVixpQkFBSyxFQUFFLElBQUk7U0FDZDtZQUNELFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUM7WUFDdEYsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ2pDLFlBQVk7WUFDWixNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUU1QixZQUFJLE9BQU8sRUFBRTtBQUNULG1CQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsT0FBTyxFQUFFO0FBQzNCLG9CQUFJLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLGVBQWUsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUM7b0JBQzFFLFlBQVksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztvQkFDckMsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixvQkFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO0FBQ2hCLDJCQUFPLElBQUksQ0FBQztpQkFDZixNQUFNO0FBQ0gsMkJBQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsT0FBTyxFQUFFO0FBQ3RELCtCQUFPLEFBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSyxFQUFFLENBQUM7cUJBQ3RDLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ1o7YUFDSixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUM1QixzQkFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQy9DLENBQUMsQ0FBQztTQUNOO0FBQ0QsZUFBTyxNQUFNLENBQUM7S0FDakI7Q0FDSjs7Ozs7Ozs7Ozs7UUNoQ2UsRUFBRSxHQUFGLEVBQUU7UUFlRixPQUFPLEdBQVAsT0FBTztBQTlDdkIsSUFBSSxPQUFPLEdBQUc7QUFDTixXQUFPLEVBQUUsaUJBQWlCO0FBQzFCLFlBQVEsRUFBRSxrQkFBa0I7QUFDNUIsWUFBUSxFQUFFLGtCQUFrQjtBQUM1QixvQkFBZ0IsRUFBRSwwQkFBMEI7Q0FDL0M7SUFDRCxNQUFNLEdBQUcsRUFBRTtJQUNYLFNBQVMsR0FBRyxtQkFBQSxLQUFLO1dBQUksTUFBTSxDQUFFLEtBQUssQ0FBRSxHQUFHLEVBQUU7Q0FBQTtJQUN6QyxPQUFPLEdBQUcsaUJBQVcsT0FBTyxFQUFFLEVBQUUsRUFBRztBQUMvQixRQUFJLEtBQUssR0FBRyxNQUFNLENBQUUsT0FBTyxDQUFFO1FBQ3pCLGlCQUFpQixHQUFHLElBQUksQ0FBQzs7QUFFN0IsUUFBSyxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQUc7QUFDNUIsWUFBSyxDQUFDLEtBQUssRUFBRztBQUNWLGlCQUFLLEdBQUcsU0FBUyxDQUFFLE9BQU8sQ0FBRSxDQUFDO1NBQ2hDOztBQUVELGFBQUssQ0FBQyxJQUFJLENBQUUsRUFBRSxDQUFFLENBQUM7S0FDcEI7Q0FDSjtJQUNELE9BQU8sR0FBRyxpQkFBVSxTQUFTLEVBQUUsT0FBTyxFQUFFO0FBQ3BDLFFBQUksaUJBQWlCLEdBQUcsSUFBSTtRQUN4QixLQUFLLEdBQUcsTUFBTSxDQUFFLFNBQVMsQ0FBRSxDQUFDOztBQUVoQyxRQUFLLEtBQUssRUFBRztBQUNULGFBQUssQ0FBQyxPQUFPLENBQUUsVUFBRSxRQUFRLEVBQU07QUFDM0Isb0JBQVEsQ0FBQyxJQUFJLENBQUUsaUJBQWlCLEVBQUUsT0FBTyxDQUFFLENBQUM7U0FDL0MsQ0FBRSxDQUFDO0tBQ1A7Q0FDSixDQUFDOztBQUVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFFbkIsUUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFBRSxlQUFPO0tBQUU7Ozs7QUFJaEQsVUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDaEMsVUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxZQUFZO0FBQ3RDLG1CQUFPLENBQUMsSUFBSSxNQUFBLENBQVosT0FBTyxHQUFNLElBQUksRUFBRSxHQUFHLHFCQUFLLFNBQVMsR0FBQyxDQUFDO1NBQ3pDLENBQUM7S0FDTCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO0NBQzlCOztBQUVNLFNBQVMsT0FBTyxDQUFDLEVBQUUsRUFBRTtBQUN4QixRQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUFFLGVBQU87S0FBRTtBQUNyRCxNQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FFbkM7Ozs7Ozs7Ozs7cUJDaER1QixNQUFNOztpQkFGaEIsWUFBWTs7OztBQUVYLFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRTs7QUFFL0IsUUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUFFLGVBQU87S0FBRTs7QUFFbkUsTUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDcEMsWUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsY0FBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUU7QUFDeEQsZUFBRyxFQUFFO3VCQUFNLFlBQVk7QUFDbkIsd0JBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUNsQixXQUFXLENBQUUsZUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFFLENBQUM7QUFDeEQsd0JBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBRTFCO2FBQUE7QUFDRCxlQUFHLEVBQUU7dUJBQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQzthQUFBOztTQUUvRCxDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTjs7Ozs7Ozs7OztRQ25CZSxRQUFRLEdBQVIsUUFBUTtRQWFSLGdCQUFnQixHQUFoQixnQkFBZ0I7O0FBYnpCLFNBQVMsUUFBUSxDQUFDLEVBQUUsRUFBRTs7QUFFekIsUUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQUUsZUFBTztLQUFFO0FBQzFELE1BQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxZQUFZO0FBQ3BDLFlBQUksVUFBVSxDQUFDOztBQUVmLGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUNwQyxlQUFHLEVBQUU7dUJBQU0sVUFBVTthQUFBO0FBQ3JCLGVBQUcsRUFBRSxhQUFDLEtBQUs7dUJBQUssVUFBVSxHQUFHLEtBQUs7YUFBQTtTQUNyQyxDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTjs7QUFFTSxTQUFTLGdCQUFnQixDQUFDLEVBQUUsRUFBRTs7QUFFakMsUUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQUUsZUFBTztLQUFFOztBQUUxRCxNQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsWUFBWTs7O0FBQ3BDLGNBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO0FBQzVDLGVBQUcsRUFBRTt1QkFBTSxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQUssUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7YUFBQTtBQUMzRCxlQUFHLEVBQUUsYUFBQyxLQUFLO3VCQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUM7YUFBQTtTQUNwRSxDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTjs7Ozs7Ozs7Ozs7c0JDdkJxQixTQUFTOztJQUFuQixJQUFJOztBQUVoQixJQUFJLFFBQVEsR0FBRyxrQkFBQSxLQUFLO1dBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRO0NBQUEsQ0FBQzs7cUJBRXpDLFVBQUMsSUFBSSxFQUFrQjtRQUFoQixNQUFNLGdDQUFHLEVBQUU7O0FBQzdCLFFBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDLFNBQVM7UUFDakQsR0FBRyxHQUFHLE1BQU0sV0FBUSxDQUFDOztBQUV6QixTQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDOztBQUVoRSxTQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUU5QyxXQUFPLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFO0FBQ2xDLGlCQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO0FBQ25DLG1CQUFTLEdBQUc7S0FDZixDQUFDLENBQUM7Q0FDTjs7Ozs7Ozs7OztRQ2hCZSxNQUFNLEdBQU4sTUFBTTtRQUlOLFVBQVUsR0FBVixVQUFVOztBQUpuQixTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDMUIsV0FBTyxDQUFDLEdBQUUsQ0FBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztDQUM1RTs7QUFFTSxTQUFTLFVBQVUsR0FBVTtzQ0FBTixJQUFJO0FBQUosWUFBSTs7O0FBQzlCLFdBQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxHQUFHLEVBQUs7QUFDekMsY0FBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEMsZUFBTyxHQUFHLENBQUM7S0FDZCxDQUFDLENBQUM7Q0FDTjs7Ozs7Ozs7Ozs7d0JDVG9CLFlBQVk7Ozs7QUFFakMsSUFBSSxVQUFVLEdBQUcsRUFBRTtJQUVmLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtBQUNyQixZQUFRLEVBQUU7QUFDTixrQkFBVSxFQUFFLElBQUk7QUFDaEIsb0JBQVksRUFBRSxLQUFLO0FBQ25CLGdCQUFRLEVBQUUsS0FBSztBQUNmLGFBQUssRUFBRSxzQkFBUyxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQzNCOzs7OztBQUtELGNBQVUsRUFBRTtBQUNSLGtCQUFVLEVBQUUsSUFBSTtBQUNoQixXQUFHLEVBQUU7bUJBQU0sVUFBVTtTQUFBO0FBQ3JCLFdBQUcsRUFBRSxhQUFDLEdBQUc7bUJBQUssSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUM7U0FBQTtLQUMxRTs7QUFFRCxlQUFXLEVBQUU7QUFDVCxrQkFBVSxFQUFFLElBQUk7QUFDaEIsV0FBRyxFQUFFO21CQUFNLFVBQVUsU0FBUyxFQUFFLElBQUksRUFBRTtBQUNsQyxvQkFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUs7QUFDMUMsd0JBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3RCLCtCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN0QjtBQUNELDJCQUFPLE9BQU8sQ0FBQztpQkFDbEIsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFUCxvQkFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ2pCLDJCQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixHQUFHLFNBQVMsR0FBRywrQ0FBK0MsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ2xJOztBQUVELHVCQUFPLFFBQVEsQ0FBQzthQUVuQjtTQUFBO0tBQ0o7Q0FDSixDQUFDLENBQUM7O3FCQUVRLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKCkge1xuICAgIC8vVGhpcyBpcyB3aWxsIGJlIHRoZSBXQyBkaXN0cm8uXG4gICAgLy8gaW1wb3J0IFdDIGZyb20gJy4vc3JjL2luZGV4JztcbiAgICBsZXQgV0MgPSByZXF1aXJlKCcuL3NyYy93YycpLFxuXG4gICAgLy8gaW1wb3J0IG9uIGZyb20gJy4vZXh0ZW50aW9ucy9vbic7XG4gICAgLy8gaW1wb3J0IHJlbmRlciBmcm9tICcuL2V4dGVudGlvbnMvcmVuZGVyJztcbiAgICAvLyBpbXBvcnQgZGF0YSBmcm9tICcuL2V4dGVudGlvbnMvZGF0YSc7XG4gICAgLy8gaW1wb3J0IHRlbXBsYXRlLCB7IHRlbXBsYXRlRnJhZ21lbnR9IGZyb20gJy4vZXh0ZW50aW9ucy90ZW1wbGF0ZSc7XG5cbiAgICBldnRzID0gcmVxdWlyZSgnLi9zcmMvZXh0ZW50aW9ucy9ldmVudHMnKSxcbiAgICByZW5kZXIgPSByZXF1aXJlKCcuL3NyYy9leHRlbnRpb25zL3JlbmRlcicpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL3NyYy9leHRlbnRpb25zL2RhdGEnKSxcbiAgICB0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3NyYy9leHRlbnRpb25zL3RlbXBsYXRlJyk7XG5cbiAgICBldnRzLm9uKFdDKTtcbiAgICBldnRzLnRyaWdnZXIoV0MpO1xuICAgIHRlbXBsYXRlcy50ZW1wbGF0ZShXQyk7XG4gICAgdGVtcGxhdGVzLnRlbXBsYXRlRnJhZ21lbnQoV0MpO1xuICAgIGRhdGEoV0MpO1xuICAgIHJlbmRlcihXQyk7XG5cbn0pKCk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRhKFdDKSB7XG5cbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ2RhdGEnLCBbJ29uJywgJ3RyaWdnZXInXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgV0MuZXh0ZW50aW9ucy5vbignY3JlYXRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdkYXRhJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiBkYXRhLFxuICAgICAgICAgICAgc2V0OiAoZGF0YU9iaikgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhT2JqO1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcignZGF0YScsIGRhdGFPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHIodGVtcGxhdGVGcmFnLCBkYXRhKSB7XG5cbiAgICBbXS5zbGljZS5jYWxsKHRlbXBsYXRlRnJhZy5jaGlsZE5vZGVzKS5tYXAoIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgcmVuZGVyVGV4dE5vZGUobm9kZSwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByKG5vZGUsIGRhdGEpO1xuICAgICAgICAgICAgcmVuZGVyRWxBdHRycyhub2RlLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH0gKTtcblxuICAgIHJldHVybiB0ZW1wbGF0ZUZyYWc7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJUZXh0Tm9kZSh0ZXh0Tm9kZSwgZGF0YSkge1xuICAgICAgICB0ZXh0Tm9kZS50ZXh0Q29udGVudCA9IHJlbmRlclN0cmluZyh0ZXh0Tm9kZS50ZXh0Q29udGVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyRWxBdHRycyhmcmFnbWVudCwgZGF0YSkge1xuICAgICAgICBpZiAoZnJhZ21lbnQuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgW10uc2xpY2UuY2FsbChmcmFnbWVudC5hdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyQXR0cihhdHRyLCBkYXRhLCBmcmFnbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlckF0dHIoYXR0ck9iaiwgZGF0YSwgZnJhZ21lbnQpIHtcbiAgICAgICAgdmFyIG5ld0F0dHIgPSByZW5kZXJTdHJpbmcoYXR0ck9iai5uYW1lLCBkYXRhKSxcbiAgICAgICAgICAgIG5ld1ZhbCA9IHJlbmRlclN0cmluZyhhdHRyT2JqLnZhbHVlLCBkYXRhKTtcblxuICAgICAgICBpZiAoYXR0ck9iai5uYW1lICE9PSBuZXdBdHRyIHx8IGF0dHJPYmoudmFsdWUgIT09IG5ld1ZhbCkge1xuICAgICAgICAgICAgZnJhZ21lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJPYmoubmFtZSk7XG4gICAgICAgICAgICBmcmFnbWVudC5zZXRBdHRyaWJ1dGUobmV3QXR0ciwgbmV3VmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclN0cmluZyhzdHJpbmcsIGRhdGEpIHtcbiAgICAgICAgdmFyIGRlbGltID0ge1xuICAgICAgICAgICAgICAgIG9wZW46ICd7eycsXG4gICAgICAgICAgICAgICAgY2xvc2U6ICd9fSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiaW5kaW5nUkUgPSBuZXcgUmVnRXhwKCcoJyArIGRlbGltLm9wZW4gKyAnXFxcXHMqKSguKj8pKFxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcpJywgJ2lnJyksXG4gICAgICAgICAgICBtYXRjaGVzID0gc3RyaW5nLm1hdGNoKGJpbmRpbmdSRSksXG4gICAgICAgICAgICByZXBsYWNlbWVudHMsXG4gICAgICAgICAgICBuZXdTdHIgPSBzdHJpbmcuc2xpY2UoKTtcblxuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgbWF0Y2hlcy5tYXAoZnVuY3Rpb24gKGJpbmRpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVsaW1SRSA9IG5ldyBSZWdFeHAoZGVsaW0ub3BlbiArICdcXFxccyooLio/KVxcXFxzKicgKyBkZWxpbS5jbG9zZSArICcnLCAnaScpLFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nUGFydHMgPSBiaW5kaW5nLm1hdGNoKGRlbGltUkUpLFxuICAgICAgICAgICAgICAgICAgICBpdG0gPSBiaW5kaW5nUGFydHNbMV07XG4gICAgICAgICAgICAgICAgaWYgKGl0bSA9PT0gJ3RoaXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdG0uc3BsaXQoL1xcLnxcXC8vZykucmVkdWNlKGZ1bmN0aW9uICh2YWwsIHNlZ21lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAodmFsICYmIHZhbFtzZWdtZW50XSkgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIH0sIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIG5ld1N0ciA9IG5ld1N0ci5yZXBsYWNlKG1hdGNoZXNbaWR4XSwgaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3U3RyO1xuICAgIH1cbn1cbiIsImxldCBuYXRpdmVzID0ge1xuICAgICAgICBjcmVhdGVkOiAnY3JlYXRlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0YWNoZWQ6ICdhdHRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgZGV0YWNoZWQ6ICdkZXRhY2hlZENhbGxiYWNrJyxcbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZDogJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjaydcbiAgICB9LFxuICAgIGV2ZW50cyA9IHt9LFxuICAgIGluaXRRdWV1ZSA9IHFOYW1lID0+IGV2ZW50c1sgcU5hbWUgXSA9IFtdLFxuICAgIG9uRXZlbnQgPSBmdW5jdGlvbiAoIGV2dE5hbWUsIGZuICkge1xuICAgICAgICBsZXQgcXVldWUgPSBldmVudHNbIGV2dE5hbWUgXSxcbiAgICAgICAgICAgIGNvbXBvbmVudEluc3RhbmNlID0gdGhpcztcblxuICAgICAgICBpZiAoIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgICAgIGlmICggIXF1ZXVlICkge1xuICAgICAgICAgICAgICAgIHF1ZXVlID0gaW5pdFF1ZXVlKCBldnROYW1lICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHF1ZXVlLnB1c2goIGZuICk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyaWdnZXIgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBwYXlsb2FkKSB7XG4gICAgICAgIGxldCBjb21wb25lbnRJbnN0YW5jZSA9IHRoaXMsXG4gICAgICAgICAgICBxdWV1ZSA9IGV2ZW50c1sgZXZlbnROYW1lIF07XG5cbiAgICAgICAgaWYgKCBxdWV1ZSApIHtcbiAgICAgICAgICAgIHF1ZXVlLmZvckVhY2goICggbGlzdGVuZXIgKSA9PiB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCggY29tcG9uZW50SW5zdGFuY2UsIHBheWxvYWQgKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBvbihXQykge1xuXG4gICAgaWYgKFdDLm1pc3NpbmdEZXBzKCdvbicsIFtdKS5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBCaW5kaW5nIHRvIHRoZSBuYXRpdmUgV2ViIENvbXBvbmVudCBsaWZlY3ljbGUgbWV0aG9kc1xuICAgIC8vIGNhdXNpbmcgdGhlbSB0byB0cmlnZ2VyIHJlbGV2YW50IGNhbGxiYWNrcy5cbiAgICBPYmplY3Qua2V5cyhuYXRpdmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIFdDLmV4dGVudGlvbnNbbmF0aXZlc1trZXldXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyaWdnZXIuY2FsbCh0aGlzLCBrZXksIC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBXQy5leHRlbnRpb25zLm9uID0gb25FdmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaWdnZXIoV0MpIHtcbiAgICBpZiAoV0MubWlzc2luZ0RlcHMoJ3RyaWdnZXInLCBbXSkubGVuZ3RoKSB7IHJldHVybjsgfVxuICAgIFdDLmV4dGVudGlvbnMudHJpZ2dlciA9IHRyaWdnZXI7XG5cbn1cbiIsImltcG9ydCByIGZyb20gJy4vZG9taW5nbzInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW5kZXIoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygncmVuZGVyJywgWydvbicsICd0cmlnZ2VyJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVudGlvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ3JlbmRlcicsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRDaGlsZCggcih0aGlzLnRlbXBsYXRlRnJhZ21lbnQsIHRoaXMuZGF0YSkgKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3JlbmRlcicpO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiAoKSA9PiBjb25zb2xlLmVycm9yKCd0ZW1wbGF0ZUZyYWdtZW50IGlzIG5vdCBzZXR0YWJsZScpXG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygndGVtcGxhdGUnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cbiAgICBXQy5leHRlbnRpb25zLm9uKCdjcmVhdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGVFbDtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3RlbXBsYXRlJywge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB0ZW1wbGF0ZUVsLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IHRlbXBsYXRlRWwgPSB0ZW1wbFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlRnJhZ21lbnQoV0MpIHtcblxuICAgIGlmIChXQy5taXNzaW5nRGVwcygndGVtcGxhdGUnLCBbJ29uJ10pLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIFdDLmV4dGVudGlvbnMub24oJ2NyZWF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGVtcGxhdGVGcmFnbWVudCcsIHtcbiAgICAgICAgICAgIGdldDogKCkgPT4gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0aGlzLnRlbXBsYXRlLmNvbnRlbnQsIHRydWUpLFxuICAgICAgICAgICAgc2V0OiAodGVtcGwpID0+IGNvbnNvbGUuZXJyb3IoJ3RlbXBsYXRlRnJhZ21lbnQgaXMgbm90IHNldHRhYmxlJylcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbHMnO1xuXG5sZXQgaXNTdHJpbmcgPSB0aGluZyA9PiB1dGlsLnR5cGVPZih0aGluZykgPT09ICdzdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgY29uZmlnID0ge30pID0+IHtcbiAgICBsZXQgcHJvdG8gPSBjb25maWcucHJvdG90eXBlIHx8IEhUTUxFbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgZXh0ID0gY29uZmlnLmV4dGVuZHM7XG5cbiAgICBwcm90byA9IGlzU3RyaW5nKHByb3RvKSA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocHJvdG8pIDogcHJvdG87XG5cbiAgICBwcm90byA9IHV0aWwucHJvdG9DaGFpbihXQy5leHRlbnRpb25zLCBwcm90byk7XG5cbiAgICByZXR1cm4gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcbiAgICAgICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKHByb3RvLCB7fSksXG4gICAgICAgIGV4dGVuZHM6IGV4dFxuICAgIH0pO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodGhpbmcpIHtcbiAgICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKHRoaW5nKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdG9DaGFpbiguLi5vYmpzKSB7XG4gICAgcmV0dXJuIG9ianMucmV2ZXJzZSgpLnJlZHVjZSgocHJvdG8sIG9iaikgPT4ge1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90byk7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5cbmxldCBleHRlbnRpb25zID0ge30sXG5cbiAgICBXQyA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuICAgICAgICByZWdpc3Rlcjoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogcmVnaXN0ZXIuYmluZChXQylcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBBIGRpY3Rpb25hcnkgb2YgYXBwbGllZCBleHRlbnRpb25zLlxuICAgICAgICAvLyBFdmVyeSBhcHBsaWVkIGV4dGVudGlvbiB3aWxsIGJlIGF2YWlsYWJsZSB0byBlYWNoIFdpbnN0b24gQ2h1cmNoaWxsXG4gICAgICAgIC8vIGNvbXBvbmVudCBpbiB0aGUgYXBwLlxuICAgICAgICBleHRlbnRpb25zOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiAoKSA9PiBleHRlbnRpb25zLFxuICAgICAgICAgICAgc2V0OiAoZXh0KSA9PiBuZXcgRXJyb3IoJ0Nhbm5vdCBvdmVyd3JpdGUgYGV4dGVudGlvbnNgIHByb3BlcnR5IG9uIFdDJylcbiAgICAgICAgfSxcblxuICAgICAgICBtaXNzaW5nRGVwczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVudGlvbiwgZGVwcykge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5ncyA9IGRlcHMucmVkdWNlKChtaXNzaW5nLCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW50aW9uc1tjdXJyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKGN1cnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgICAgIGlmIChtaXNzaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGhlIFdpbnNvdG9uIENodXJjaGlsbCBgJyArIGV4dGVudGlvbiArICdgIGV4dGVudGlvbiBpcyBtaXNzaW5nIHRoZXNlIGRlcGVuZGVuY2llczogXFxuJyArIG1pc3NpbmdzLmpvaW4oJ1xcbiwnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1pc3NpbmdzO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuZXhwb3J0IGRlZmF1bHQgd2luZG93LldDID0gV0M7XG4iXX0=
