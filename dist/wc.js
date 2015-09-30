(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./register":2,"./utils":3}],2:[function(require,module,exports){
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

},{"./utils":3,"./wc":undefined}],3:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvc3JjL3djLmpzIiwiL1VzZXJzL2Nvcnlicm93bi9jb2RlL3dpbnN0b24tY2h1cmNoaWxsL3NyYy9yZWdpc3Rlci5qcyIsIi9Vc2Vycy9jb3J5YnJvd24vY29kZS93aW5zdG9uLWNodXJjaGlsbC9zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozt3QkNBcUIsWUFBWTs7OztxQkFDTixTQUFTOzs7Ozs7QUFNcEMsdUJBQVc7QUFDUCxRQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJO0FBQ2xCLFFBQUksRUFBRTtlQUFNLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBQSxTQUFTO21CQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUFBO0tBQUE7Q0FDakUsQ0FBQyxDQUFDOztBQUVJLElBQU0sS0FBSyxHQUFHLEVBQUU7SUFFbkIsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3JCLFlBQVEsRUFBRTtBQUNOLGtCQUFVLEVBQUUsSUFBSTtBQUNoQixvQkFBWSxFQUFFLEtBQUs7QUFDbkIsZ0JBQVEsRUFBRSxLQUFLO0FBQ2YsYUFBSyx1QkFBVTtLQUNsQjs7QUFFRCxVQUFNLEVBQUU7QUFDSixrQkFBVSxFQUFFLElBQUk7QUFDaEIsb0JBQVksRUFBRSxLQUFLO0FBQ25CLGdCQUFRLEVBQUUsS0FBSztBQUNmLGFBQUssRUFBQSxlQUFDLE1BQU0sRUFBRTtBQUNWLGtCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QjtLQUNKOztBQUVELGNBQVUsRUFBRTtBQUNSLGtCQUFVLEVBQUUsSUFBSTtBQUNoQixvQkFBWSxFQUFFLEtB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IGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9yZWdpc3Rlcic7XG5pbXBvcnQgeyBwb2x5ZmlsbGVyIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIEFycmF5LmZyb20gcG9seWZpbGxcbi8vIFRoaXMgaXMgbm90IGEgc3BlYyBjb21wbGlhbnQgcG9seWZpbCBidXQgY292ZXJzIHRoZSB2YXN0XG4vLyBtYWpvcml0eSBvZiB1c2UgY2FzZXMuIEluIHBhcnRpY3VsYXIgaXQgZmlsbHMgaG93IEJhYmxlIHVzZXNcbi8vIGl0IHRvIHRyYW5zcGlsZSB0aGUgc3ByZWFkIG9wZXJhdG9yLlxucG9seWZpbGxlcih7XG4gICAgdGVzdDogISFBcnJheS5mcm9tLFxuICAgIGZpbGw6ICgpID0+IEFycmF5LmZyb20gPSBhcnJheUxpa2UgPT4gW10uc2xpY2UuY2FsbChhcnJheUxpa2UpXG59KTtcblxuZXhwb3J0IGNvbnN0IHByb3RvID0ge30sXG5cbiAgICBXQyA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuICAgICAgICByZWdpc3Rlcjoge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogcmVnaXN0ZXJcbiAgICAgICAgfSxcblxuICAgICAgICBleHRlbmQ6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWUobWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kLmNhbGwobnVsbCwgcHJvdG8pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBvbHlmaWxsZXI6IHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWU6IHBvbHlmaWxsZXJcbiAgICAgICAgfVxuICAgIH0pO1xuXG5leHBvcnQgZGVmYXVsdCB3aW5kb3cuV0MgPSBXQztcbiIsImltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBwcm90byBhcyB3Y1Byb3RvIH0gZnJvbSAnLi93Yyc7XG5cbmNvbnN0IGlzU3RyaW5nID0gdGhpbmcgPT4gdXRpbC50eXBlT2YodGhpbmcpID09PSAnc3RyaW5nJztcblxuZXhwb3J0IGRlZmF1bHQgKG5hbWUsIG9wdGlvbnMpID0+IHtcblxuICAgIC8vIENhbid0IGRlc3RydWN0dXJlIGBvcHRzYCBhcmd1bWVudCBzaW5jZSBpdHNcbiAgICAvLyBwcm9wZXJ0aWVzIGFyZSByZXNlcnZlZCB3b3Jkcy5cbiAgICBsZXQgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgbGV0IHByb3RvID0gb3B0cy5wcm90b3R5cGUgfHwgSFRNTEVsZW1lbnQucHJvdG90eXBlO1xuXG4gICAgLy9pZiBhIHN0cmluZywgYXNzdW1lIGl0J3MgdGhlIG5hbWUgb2YgYW4gZWxlbWVudFxuICAgIHByb3RvID0gaXNTdHJpbmcocHJvdG8pID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChwcm90bykuY29uc3RydWN0b3IucHJvdG90eXBlIDogcHJvdG87XG5cbiAgICBwcm90byA9IHV0aWwucHJvdG9DaGFpbih3Y1Byb3RvLCBwcm90byk7XG5cbiAgICByZXR1cm4gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIHtcbiAgICAgICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKHByb3RvKSxcbiAgICAgICAgZXh0ZW5kczogb3B0cy5leHRlbmRzXG4gICAgfSk7XG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIHR5cGVPZih0aGluZykge1xuICAgIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwodGhpbmcpLm1hdGNoKC9cXHMoW2EtekEtWl0rKS8pWzFdLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm90b0NoYWluKC4uLm9ianMpIHtcbiAgICByZXR1cm4gb2Jqcy5yZXZlcnNlKCkucmVkdWNlKChwcm90bywgb2JqKSA9PiB7XG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihvYmosIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbn1cblxuXG4vKlxuICAgIHNyY3M6IFtzcmNPYmplY3RdXG4gICAgc3JjT2JqZWN0OiB7XG4gICAgICAgIHRlc3Q6IDxCb29sZWFuIHx8IEZ1bmN0aW9uOkJvb2xlYW4+LFxuICAgICAgICBmaWxsOiA8U3RyaW5nOlVSTCB0byBwb2x5ZmlsbD5cbiAgICB9XG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxlciguLi50ZXN0cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzLCByZWopIHtcbiAgICAgICAgdGVzdHMuZm9yRWFjaCh0ZXN0T2JqID0+IHtcbiAgICAgICAgICAgIGxldCBwYXNzZXMgPSAodHlwZW9mIHRlc3RPYmoudGVzdCA9PT0gJ2Z1bmN0aW9uJykgPyB0ZXN0T2JqLnRlc3QoKSA6IHRlc3RPYmoudGVzdCxcbiAgICAgICAgICAgICAgICBmaWxsZXIgPSB0ZXN0T2JqLmZpbGw7XG5cbiAgICAgICAgICAgIGlmIChwYXNzZXMpIHtcbiAgICAgICAgICAgICAgICByZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbGwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBmaWxsZXIoKTtcbiAgICAgICAgICAgICAgICByZXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHNjcnB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgICAgICAgICAgc2NycHQub25lcnJvciA9IHJlajtcbiAgICAgICAgICAgICAgICBzY3JwdC5vbmxvYWQgPSByZXM7XG4gICAgICAgICAgICAgICAgc2NycHQuc3JjID0gdGVzdE9iai5maWxsO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NycHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiJdfQ==
