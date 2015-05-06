(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target) {
        for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            sources[_key - 1] = arguments[_key];
        }

        if ([undefined, null].indexOf(target) >= 0) {
            throw new TypeError('Cannot convert first argument to object');
        }

        return sources.reduce(function (target, source) {
            if ([undefined, null].indexOf(source) < 0) {

                Object.keys(Object(source)).forEach(function (srcKey) {
                    var desc = Object.getOwnPropertyDescriptor(source, srcKey);
                    if (dec && desc.enumerable) {
                        target[srcKey] = source[srcKey];
                    }
                });
            }
            return target;
        });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvY29yeWJyb3duL2NvZGUvd2luc3Rvbi1jaHVyY2hpbGwvcG9seWZpbGxzL29iamVjdC5hc3NpZ24tcG9seWZpbGwuZXMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUNwQyxjQUFVLEVBQUUsS0FBSztBQUNqQixnQkFBWSxFQUFFLElBQUk7QUFDbEIsWUFBUSxFQUFFLElBQUk7QUFDZCxTQUFLLEVBQUUsZUFBQyxNQUFNLEVBQWlCOzBDQUFaLE9BQU87QUFBUCxtQkFBTzs7O0FBQ3RCLFlBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4QyxrQkFBTSxJQUFJLFNBQVMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQ2xFOztBQUVELGVBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBRSxVQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUs7QUFDdkMsZ0JBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTs7QUFFdkMsc0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFFLFVBQUMsTUFBTSxFQUFLO0FBQzdDLHdCQUFJLElBQUksR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNELHdCQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3hCLDhCQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNuQztpQkFDSixDQUFDLENBQUM7YUFDTjtBQUNELG1CQUFPLE1BQU0sQ0FBQztTQUNqQixDQUFDLENBQUM7S0FDTjtDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnYXNzaWduJywge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogKHRhcmdldCwgLi4uc291cmNlcykgPT4ge1xuICAgICAgICBpZiAoW3VuZGVmaW5lZCwgbnVsbF0uaW5kZXhPZih0YXJnZXQpID49IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZXMucmVkdWNlKCAodGFyZ2V0LCBzb3VyY2UpID0+IHtcbiAgICAgICAgICAgIGlmIChbdW5kZWZpbmVkLCBudWxsXS5pbmRleE9mKHNvdXJjZSkgPCAwKSB7XG5cbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaCggKHNyY0tleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBzcmNLZXkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGVjICYmIGRlc2MuZW51bWVyYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3NyY0tleV0gPSBzb3VyY2Vbc3JjS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG4iXX0=
