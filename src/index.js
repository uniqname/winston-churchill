var render = require('./domingo2');

window.wc = {
    componentDoc: document.currentScript.ownerDocument,
    register: function (name, config) {
        var importDoc = this.componentDoc,
            onCreates = [],
            onAttacheds = [],
            onDetatcheds = [],
            onAttrChgds = [],
            proto,
            protoSrc,
            WCComponent,
            createdCB = function () {
                var component = this,
                    args = [].slice.call(arguments);
                onCreates.forEach( function (cb) { cb.apply(component, args); } );
            },
            attachedCB = function () {
                var component = this,
                    args = [].slice.call(arguments);
                onAttacheds.forEach( function (cb) { cb.apply(component, args); } );
            },
            detachedCB = function () {
                var component = this,
                    args = [].slice.call(arguments);
                onDetatcheds.forEach( function (cb) { cb.apply(component, args); } );
            },
            attributeChangedCB = function () {
                var component = this,
                    args = [].slice.call(arguments);
                onAttrChgds.forEach( function (cb) { cb.apply(component, args); } );
            },
            onCreated = (fn) => {
                onCreates.push(fn);
                return this;
            },
            onAttached = (fn) => {
                onAttacheds.push(fn);
                return this;
            },
            onDetached = (fn) => {
                onDetatcheds.push(fn);
                return this;
            },
            onAttributeChanged = (fn) => {
                onAttrChgds.push(fn);
                return this;
            };

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

        proto = ( () => {
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
                    get: () => templateEl,
                    set: function (templ) {
                        var newShadowContent = this.render(document.importNode(templ.content, true), this.data);
                        this.createShadowRoot().appendChild(newShadowContent);
                        templateEl = templ;
                    }
                },

                data: {
                    get: () => data,
                    set: function (dataObj) {
                        var newShadowContent = this.render(document.importNode(this.template.content, true), dataObj);
                        this.createShadowRoot().appendChild(newShadowContent);
                        data = dataObj;
                    }
                }

          });
        })();

        WCComponent = document.registerElement(name, {
            prototype: (function () {
                return proto;
            })(),
            extends: config.extends
        });

        WCComponent.template = templateEl => {
            var thisComponent = this;

            thisComponent.template = templateEl;

            [].slice.call(document.querySelectorAll(name)).forEach(component => {
                component.template = templateEl;
            });
        };

        WCComponent.onCreated = (fn, futureOnly) => {
            var thisComponent = this;
            onCreated.call(thisComponent, fn);
            if (!futureOnly) {
                [].slice.call(document.querySelectorAll(name)).forEach( component => {
                    fn.call(component);
                });
            }
        };

        // Do I need that future thing for attached as well?
        WCComponent.onAttached = onAttached;
        WCComponent.onDetached = onDetached;
        WCComponent.onAttributeChanged = onAttributeChanged;

        if (config.template) {
            let template = importDoc.querySelector(config.template);
            if (template) {
                WCComponent.onCreated(function () {
                    this.template = template;
                });
            }
        }
        return WCComponent;
    }
};
