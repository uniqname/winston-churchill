(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./register":2}],2:[function(require,module,exports){
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

},{"./utils":3}],3:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7Ozs7Ozs7Ozs7OztBQVdqQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRyxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQUEsU0FBUztXQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztDQUFBLENBQUM7O0FBR3JFLElBQUksVUFBVSxHQUFHLEVBQUU7SUFFZixFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIsWUFBUSxFQUFFO0FBQ04sa0JBQVUsRUFBRSxJQUFJO0FBQ2hCLG9CQUFZLEVBQUUsS0FBSztBQUNuQixnQkFBUSxFQUFFLEtBQUs7QUFDZixhQUFLLEVBQUUsc0JBQVMsSUFBSSxDQUFDLEVBQUUsQ0FBQztLQUMzQjs7Ozs7QUFLRCxjQUFVLEVBQUU7QUFDUixrQkFBVSxFQUFFLElBQUk7QUFDaEIsV0FBRyxFQUFFO21CQUFNLFVBQVU7U0FBQTtBQUNyQixXQUFHLEVBQUUsYUFBQyxHQUFHO21CQUFLLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDO1NBQUE7S0FDMUU7O0FBRUQsZUFBVyxFQUFFO0FBQ1Qsa0JBQVUsRUFBRSxJQUFJO0FBQ2hCLFdBQUcsRUFBRTttQkFBTSxVQUFVLFNBQVMsRUFBRSxJQUFJLEVBQUU7QUFDbEMsb0JBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFLO0FBQzFDLHdCQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN0QiwrQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdEI7QUFDRCwyQkFBTyxPQUFPLENBQUM7aUJBQ2xCLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRVAsb0JBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzNCLHNCQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDbkM7O0FBRUQsb0JBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtBQUNqQiwyQkFBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxTQUFTLEdBQUcsK0NBQStDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNsSTs7QUFFRCx1QkFBTyxRQUFRLENBQUM7YUFFbkI7U0FBQTtLQUNKO0NBQ0osQ0FBQyxDQUFDOztxQkFFUSxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7Ozs7Ozs7Ozs7OztzQkN6RFAsU0FBUzs7SUFBbkIsSUFBSTs7QUFFaEIsSUFBSSxRQUFRLEdBQUcsa0JBQUEsS0FBSztXQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUTtDQUFBLENBQUM7O3FCQUV6QyxVQUFDLElBQUksRUFBa0I7UUFBaEIsTUFBTSxnQ0FBRyxFQUFFOztBQUM3QixRQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxJQUFJLFdBQVcsQ0FBQyxTQUFTO1FBQ2pELEdBQUcsR0FBRyxNQUFNLFdBQVEsQ0FBQzs7QUFFekIsU0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQzs7QUFFaEUsU0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFOUMsV0FBTyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRTtBQUNsQyxpQkFBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQztBQUNuQyxtQkFBUyxHQUFHO0tBQ2YsQ0FBQyxDQUFDO0NBQ047Ozs7Ozs7Ozs7UUNoQmUsTUFBTSxHQUFOLE1BQU07UUFJTixVQUFVLEdBQVYsVUFBVTs7QUFKbkIsU0FBUyxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQzFCLFdBQU8sQ0FBQyxHQUFFLENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7Q0FDNUU7O0FBRU0sU0FBUyxVQUFVLEdBQVU7c0NBQU4sSUFBSTtBQUFKLFlBQUk7OztBQUM5QixXQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFLO0FBQ3pDLGNBQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2xDLGVBQU8sR0FBRyxDQUFDO0tBQ2QsQ0FBQyxDQUFDO0NBQ04iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHJlZ2lzdGVyIGZyb20gJy4vcmVnaXN0ZXInO1xuXG4vLyBBcnJheS5mcm9tIHBvbHlmaWxsXG4vLyBUaGlzIGlzIG5vdCBhIHNwZWMgY29tcGxpYW50IHBvbHlmaWwgYnV0IGNvdmVycyB0aGUgdmFzdFxuLy8gbWFqb3JpdHkgb2YgdXNlIGNhc2VzLiBJbiBwYXJ0aWN1bGFyIGl0IGZpbGxzIGhvdyBCYWJsZSB1c2VzXG4vLyBpdCB0byB0cmFuc3BpbGUgdGhlIHNwcmVhZCBvcGVyYXRvci5cblxuLy8gVE9ETzogTmVlZCB0byByZXNlYXJjaCB3aHkgYmFiZWwgdHJ5cyB0byB1c2UgQXJyYXkuZnJvbVxuLy8gICAgICAgd2l0aG91dCBpbXBsZW1lbnRpbmcgYSBwb2x5ZmlsIGludGVybmFsbHkgYXMgdGhleVxuLy8gICAgICAgZG8gd2l0aCBvdGhlciB0aGluZ3MuIEFzIG9mIHRoZSB0aW1lIG9mIHRoaXMgbm90ZSxcbi8vICAgICAgIEFycmF5LmZyb20gaXMgb25seSBpbXBsZW1lbnRlZCBpbiBGaXJlRm94LlxuaWYgKCFBcnJheS5mcm9tKSAgQXJyYXkuZnJvbSA9IGFycmF5TGlrZSA9PiBbXS5zbGljZS5jYWxsKGFycmF5TGlrZSk7XG5cblxubGV0IGV4dGVuc2lvbnMgPSB7fSxcblxuICAgIFdDID0gT2JqZWN0LmNyZWF0ZShudWxsLCB7XG4gICAgICAgIHJlZ2lzdGVyOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiByZWdpc3Rlci5iaW5kKFdDKVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEEgZGljdGlvbmFyeSBvZiBhcHBsaWVkIGV4dGVuc2lvbnMuXG4gICAgICAgIC8vIEV2ZXJ5IGFwcGxpZWQgZXh0ZW50aW9uIHdpbGwgYmUgYXZhaWxhYmxlIHRvIGVhY2ggV2luc3RvbiBDaHVyY2hpbGxcbiAgICAgICAgLy8gY29tcG9uZW50IGluIHRoZSBhcHAuXG4gICAgICAgIGV4dGVuc2lvbnM6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6ICgpID0+IGV4dGVuc2lvbnMsXG4gICAgICAgICAgICBzZXQ6IChleHQpID0+IG5ldyBFcnJvcignQ2Fubm90IG92ZXJ3cml0ZSBgZXh0ZW5zaW9uc2AgcHJvcGVydHkgb24gV0MnKVxuICAgICAgICB9LFxuXG4gICAgICAgIG1pc3NpbmdEZXBzOiB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiAoKSA9PiBmdW5jdGlvbiAoZXh0ZW50aW9uLCBkZXBzKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1pc3NpbmdzID0gZGVwcy5yZWR1Y2UoKG1pc3NpbmcsIGN1cnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFXQy5leHRlbnNpb25zW2N1cnJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaXNzaW5nLnB1c2goY3Vycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1pc3Npbmc7XG4gICAgICAgICAgICAgICAgfSwgW10pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFXQy5leHRlbnNpb25zW2V4dGVudGlvbl0pIHtcbiAgICAgICAgICAgICAgICAgICAgV0MuZXh0ZW5zaW9uc1tleHRlbnRpb25dID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWlzc2luZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBXaW5zb3RvbiBDaHVyY2hpbGwgYCcgKyBleHRlbnRpb24gKyAnYCBleHRlbnRpb24gaXMgbWlzc2luZyB0aGVzZSBkZXBlbmRlbmNpZXM6IFxcbicgKyBtaXNzaW5ncy5qb2luKCdcXG4sJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5ncztcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IHdpbmRvdy5XQyA9IFdDO1xuIiwiaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWxzJztcblxubGV0IGlzU3RyaW5nID0gdGhpbmcgPT4gdXRpbC50eXBlT2YodGhpbmcpID09PSAnc3RyaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgKG5hbWUsIGNvbmZpZyA9IHt9KSA9PiB7XG4gICAgbGV0IHByb3RvID0gY29uZmlnLnByb3RvdHlwZSB8fCBIVE1MRWxlbWVudC5wcm90b3R5cGUsXG4gICAgICAgIGV4dCA9IGNvbmZpZy5leHRlbmRzO1xuXG4gICAgcHJvdG8gPSBpc1N0cmluZyhwcm90bykgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHByb3RvKSA6IHByb3RvO1xuXG4gICAgcHJvdG8gPSB1dGlsLnByb3RvQ2hhaW4oV0MuZXh0ZW5zaW9ucywgcHJvdG8pO1xuXG4gICAgcmV0dXJuIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCB7XG4gICAgICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShwcm90bywge30pLFxuICAgICAgICBleHRlbmRzOiBleHRcbiAgICB9KTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gdHlwZU9mKHRoaW5nKSB7XG4gICAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbCh0aGluZykubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV0udG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3RvQ2hhaW4oLi4ub2Jqcykge1xuICAgIHJldHVybiBvYmpzLnJldmVyc2UoKS5yZWR1Y2UoKHByb3RvLCBvYmopID0+IHtcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG9iaiwgcHJvdG8pO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xufVxuIl19
