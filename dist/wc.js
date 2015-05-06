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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7Ozs7Ozs7Ozs7OztBQVdqQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRyxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQUEsU0FBUztXQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztDQUFBLENBQUM7O0FBR3JFLElBQUksVUFBVSxHQUFHLEVBQUU7SUFFZixFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDckIsWUFBUSxFQUFFO0FBQ04sa0JBQVUsRUFBRSxJQUFJO0FBQ2hCLG9CQUFZLEVBQUUsS0FBSztBQUNuQixnQkFBUSxFQUFFLEtBQUs7QUFDZixhQUFLLEVBQUUsc0JBQVMsSUFBSSxDQUFDLEVBQUUsQ0FBQztLQUMzQjs7Ozs7QUFLRCxjQUFVLEVBQUU7QUFDUixrQkFBVSxFQUFFLElBQUk7QUFDaEIsV0FBRyxFQUFFO21CQUFNLFVBQVU7U0FBQTtBQUNyQixXQUFHLEVBQUUsYUFBQyxHQUFHO21CQUFLLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDO1NBQUE7S0FDMUU7O0FBRUQsY0FBVSxFQUFFO0FBQ1Isa0JBQVUsRUFBRSxJQUFJO0FBQ2hCLFdBQUcsRUFBRTttQkFBTSxVQUFVLGNBQWMsRUFBRTtBQUNqQyw4QkFBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdB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QUFKLFlBQUk7OztBQUM3QixXQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUNuQyxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2hCLGdCQUFJLElBQUksR0FBRyxBQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxVQUFVLEdBQUksR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUM7O0FBRWpFLGdCQUFJLElBQUksRUFBRTtBQUNOLG1CQUFHLEVBQUUsQ0FBQzthQUNULE1BQU07QUFDSCxvQkFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxxQkFBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDcEIscUJBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQ25CLHFCQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNoQix3QkFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEM7U0FDSixDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5cbi8vIEFycmF5LmZyb20gcG9seWZpbGxcbi8vIFRoaXMgaXMgbm90IGEgc3BlYyBjb21wbGlhbnQgcG9seWZpbCBidXQgY292ZXJzIHRoZSB2YXN0XG4vLyBtYWpvcml0eSBvZiB1c2UgY2FzZXMuIEluIHBhcnRpY3VsYXIgaXQgZmlsbHMgaG93IEJhYmxlIHVzZXNcbi8vIGl0IHRvIHRyYW5zcGlsZSB0aGUgc3ByZWFkIG9wZXJhdG9yLlxuXG4vLyBUT0RPOiBOZWVkIHRvIHJlc2VhcmNoIHdoeSBiYWJlbCB0cnlzIHRvIHVzZSBBcnJheS5mcm9tXG4vLyAgICAgICB3aXRob3V0IGltcGxlbWVudGluZyBhIHBvbHlmaWwgaW50ZXJuYWxseSBhcyB0aGV5XG4vLyAgICAgICBkbyB3aXRoIG90aGVyIHRoaW5ncy4gQXMgb2YgdGhlIHRpbWUgb2YgdGhpcyBub3RlLFxuLy8gICAgICAgQXJyYXkuZnJvbSBpcyBvbmx5IGltcGxlbWVudGVkIGluIEZpcmVGb3guXG5pZiAoIUFycmF5LmZyb20pICBBcnJheS5mcm9tID0gYXJyYXlMaWtlID0+IFtdLnNsaWNlLmNhbGwoYXJyYXlMaWtlKTtcblxuXG5sZXQgZXh0ZW5zaW9ucyA9IHt9LFxuXG4gICAgV0MgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgcmVnaXN0ZXI6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHJlZ2lzdGVyLmJpbmQoV0MpXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQSBkaWN0aW9uYXJ5IG9mIGFwcGxpZWQgZXh0ZW5zaW9ucy5cbiAgICAgICAgLy8gRXZlcnkgYXBwbGllZCBleHRlbnRpb24gd2lsbCBiZSBhdmFpbGFibGUgdG8gZWFjaCBXaW5zdG9uIENodXJjaGlsbFxuICAgICAgICAvLyBjb21wb25lbnQgaW4gdGhlIGFwcC5cbiAgICAgICAgZXh0ZW5zaW9uczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZXh0ZW5zaW9ucyxcbiAgICAgICAgICAgIHNldDogKGV4dCkgPT4gbmV3IEVycm9yKCdDYW5ub3Qgb3ZlcndyaXRlIGBleHRlbnNpb25zYCBwcm9wZXJ0eSBvbiBXQycpXG4gICAgICAgIH0sXG5cbiAgICAgICAgZXh0ZW5kV2l0aDoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVuc2lvbnNMaXN0KSB7XG4gICAgICAgICAgICAgICAgZXh0ZW5zaW9uc0xpc3QgPSBBcnJheS5pc0FycmF5KGV4dGVuc2lvbnNMaXN0KSA/IGV4dGVuc2lvbnNMaXN0IDogW2V4dGVuc2lvbnNMaXN0XTtcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uKFdDKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtaXNzaW5nRGVwczoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4gZnVuY3Rpb24gKGV4dGVudGlvbiwgZGVwcykge1xuICAgICAgICAgICAgICAgIGxldCBtaXNzaW5ncyA9IGRlcHMucmVkdWNlKChtaXNzaW5nLCBjdXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tjdXJyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoKGN1cnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtaXNzaW5nO1xuICAgICAgICAgICAgICAgIH0sIFtdKTtcblxuICAgICAgICAgICAgICAgIGlmICghV0MuZXh0ZW5zaW9uc1tleHRlbnRpb25dKSB7XG4gICAgICAgICAgICAgICAgICAgIFdDLmV4dGVuc2lvbnNbZXh0ZW50aW9uXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG1pc3NpbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGUgV2luc290b24gQ2h1cmNoaWxsIGAnICsgZXh0ZW50aW9uICsgJ2AgZXh0ZW50aW9uIGlzIG1pc3NpbmcgdGhlc2UgZGVwZW5kZW5jaWVzOiBcXG4nICsgbWlzc2luZ3Muam9pbignXFxuLCcpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWlzc2luZ3M7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG5leHBvcnQgZGVmYXVsdCB3aW5kb3cuV0MgPSBXQztcbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlscyc7XG5cbmxldCBpc1N0cmluZyA9IHRoaW5nID0+IHV0aWwudHlwZU9mKHRoaW5nKSA9PT0gJ3N0cmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0IChuYW1lLCBjb25maWcgPSB7fSkgPT4ge1xuICAgIGxldCBwcm90byA9IGNvbmZpZy5wcm90b3R5cGUgfHwgSFRNTEVsZW1lbnQucHJvdG90eXBlLFxuICAgICAgICBleHQgPSBjb25maWcuZXh0ZW5kcztcblxuICAgIHByb3RvID0gaXNTdHJpbmcocHJvdG8pID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChwcm90bykgOiBwcm90bztcbiAgICBwcm90byA9IHV0aWwucHJvdG9DaGFpbihXQy5leHRlbnNpb25zLCBwcm90byk7XG5cbiAgICByZXR1cm4gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcbiAgICAgICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKHByb3RvLCB7fSksXG4gICAgICAgIGV4dGVuZHM6IGV4dFxuICAgIH0pO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiB0eXBlT2YodGhpbmcpIHtcbiAgICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKHRoaW5nKS5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdG9DaGFpbiguLi5vYmpzKSB7XG4gICAgcmV0dXJuIG9ianMucmV2ZXJzZSgpLnJlZHVjZSgocHJvdG8sIG9iaikgPT4ge1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90byk7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG59XG5cblxuLypcbiAgICBzcmNzOiBbc3JjT2JqZWN0XVxuICAgIHNyY09iamVjdDoge1xuICAgICAgICB0ZXN0OiA8Qm9vbGVhbiB8fCBGdW5jdGlvbjpCb29sZWFuPixcbiAgICAgICAgc3JjOiA8U3RyaW5nOlVSTCB0byBwb2x5ZmlsbD5cbiAgICB9XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxzKC4uLnNyY3MpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlcywgcmVqKSB7XG4gICAgICAgIHNyY3MuZm9yRWFjaChzcmMgPT4ge1xuICAgICAgICAgICAgbGV0IHRlc3QgPSAodHlwZW9mIHNyYy50ZXN0ID09PSAnZnVuY3Rpb24nKSA/IHNyYy50ZXN0KCkgOiAhIXNyYztcblxuICAgICAgICAgICAgaWYgKHRlc3QpIHtcbiAgICAgICAgICAgICAgICByZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHNjcnB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgc2NycHQub25lcnJvciA9IHJlajtcbiAgICAgICAgICAgICAgICBzY3JwdC5vbmxvYWQgPSByZXM7XG4gICAgICAgICAgICAgICAgc2NycHQuc3JjID0gc3JjO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NycHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiJdfQ==
