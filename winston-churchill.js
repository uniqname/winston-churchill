"use strict";
(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a)
          return a(o, !0);
        if (i)
          return i(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }
      var f = n[o] = {exports: {}};
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++)
    s(r[o]);
  return s;
})({
  1: [function(require, module, exports) {
    var r = (function(templateFrag, data) {
      [].slice.call(templateFrag.childNodes).map((function(node) {
        if (node.nodeType === 3) {
          renderTextNode(node, data);
        } else {
          r(node, data);
          renderElAttrs(node, data);
        }
      }));
      return templateFrag;
      function renderTextNode(textNode, data) {
        textNode.textContent = renderString(textNode.textContent, data);
      }
      function renderElAttrs(fragment, data) {
        if (fragment.attributes) {
          [].slice.call(fragment.attributes).forEach(function(attr) {
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
          matches.map(function(binding) {
            var delimRE = new RegExp(delim.open + '\\s*(.*?)\\s*' + delim.close + '', 'i'),
                bindingParts = binding.match(delimRE),
                itm = bindingParts[1];
            if (itm === 'this') {
              return data;
            } else {
              return itm.split(/\.|\//g).reduce(function(val, segment) {
                return (val && val[segment]) || '';
              }, data);
            }
          }).forEach(function(item, idx) {
            newStr = newStr.replace(matches[idx], item);
          });
        }
        return newStr;
      }
    });
    module.exports = r;
  }, {}],
  2: [function(require, module, exports) {
    var render = require('./domingo2');
    window.wc = {
      componentDoc: document.currentScript.ownerDocument,
      register: function(name, config) {
        var $__0 = this;
        var importDoc = this.componentDoc,
            onCreates = [],
            onAttacheds = [],
            onDetatcheds = [],
            onAttrChgds = [],
            proto,
            protoSrc,
            WCComponent,
            createdCB = function() {
              var component = this,
                  args = [].slice.call(arguments);
              onCreates.forEach(function(cb) {
                cb.apply(component, args);
              });
            },
            attachedCB = function() {
              var component = this,
                  args = [].slice.call(arguments);
              onAttacheds.forEach(function(cb) {
                cb.apply(component, args);
              });
            },
            detachedCB = function() {
              var component = this,
                  args = [].slice.call(arguments);
              onDetatcheds.forEach(function(cb) {
                cb.apply(component, args);
              });
            },
            attributeChangedCB = function() {
              var component = this,
                  args = [].slice.call(arguments);
              onAttrChgds.forEach(function(cb) {
                cb.apply(component, args);
              });
            },
            onCreated = (function(fn) {
              onCreates.push(fn);
              return $__0;
            }),
            onAttached = (function(fn) {
              onAttacheds.push(fn);
              return $__0;
            }),
            onDetached = (function(fn) {
              onDetatcheds.push(fn);
              return $__0;
            }),
            onAttributeChanged = (function(fn) {
              onAttrChgds.push(fn);
              return $__0;
            });
        config = config || {};
        if (config.prototype) {
          if (typeof config.prototype === 'string') {
            protoSrc = document.createElement(config.prototype).constructor;
          } else {
            protoSrc = config.prototype;
          }
        } else {
          protoSrc = HTMLElement.prototype;
        }
        proto = ((function() {
          var templateEl = document.createElement('template'),
              data = {};
          templateEl.appendChild(document.createElement('content'));
          return Object.create(protoSrc, {
            createdCallback: {
              enumerable: false,
              configurable: false,
              writable: false,
              value: createdCB
            },
            attachedCallback: {
              enumerable: false,
              configurable: false,
              writable: false,
              value: attachedCB
            },
            detachedCallback: {
              enumerable: false,
              configurable: false,
              writable: false,
              value: detachedCB
            },
            attributeChangedCallback: {
              enumerable: false,
              configurable: false,
              writable: false,
              value: attributeChangedCB
            },
            onCreated: {
              enumerable: true,
              configurable: false,
              writable: false,
              value: onCreated
            },
            onAttached: {
              enumerable: true,
              configurable: false,
              writable: false,
              value: onAttached
            },
            onDetached: {
              enumerable: true,
              configurable: false,
              writable: false,
              value: onDetached
            },
            onAttributeChanged: {
              enumerable: true,
              configurable: false,
              writable: false,
              value: onAttributeChanged
            },
            render: {
              enumerable: false,
              configurable: false,
              writable: false,
              value: render
            },
            template: {
              get: (function() {
                return templateEl;
              }),
              set: function(templ) {
                var newShadowContent = this.render(document.importNode(templ.content, true), this.data);
                this.createShadowRoot().appendChild(newShadowContent);
                templateEl = templ;
              }
            },
            data: {
              get: (function() {
                return data;
              }),
              set: function(dataObj) {
                var newShadowContent = this.render(document.importNode(this.template.content, true), dataObj);
                this.createShadowRoot().appendChild(newShadowContent);
                data = dataObj;
              }
            }
          });
        }))();
        WCComponent = document.registerElement(name, {
          prototype: (function() {
            return proto;
          })(),
          extends: config.extends
        });
        WCComponent.template = (function(templateEl) {
          var thisComponent = $__0;
          thisComponent.template = templateEl;
          [].slice.call(document.querySelectorAll(name)).forEach((function(component) {
            component.template = templateEl;
          }));
        });
        WCComponent.onCreated = (function(fn, futureOnly) {
          var thisComponent = $__0;
          onCreated.call(thisComponent, fn);
          if (!futureOnly) {
            [].slice.call(document.querySelectorAll(name)).forEach((function(component) {
              fn.call(component);
            }));
          }
        });
        WCComponent.onAttached = onAttached;
        WCComponent.onDetached = onDetached;
        WCComponent.onAttributeChanged = onAttributeChanged;
        if (config.template) {
          var template = importDoc.querySelector(config.template);
          if (template) {
            WCComponent.onCreated(function() {
              this.template = template;
            });
          }
        }
        return WCComponent;
      }
    };
  }, {"./domingo2": 1}]
}, {}, [2]);
