let natives = {
        created: 'createdCallback',
        attached: 'attachedCallback',
        detached: 'detachedCallback',
        attributeChanged: 'attributeChangedCallback'
    },
    events = {},
    initQueue = qName => events[ qName ] = [],
    onEvent = function (evtName, fn) {
        if (typeof fn !== 'function') { return; }
        let queue = events[ evtName ] || initQueue(evtName);
        queue.push(fn);

        //Auto prevent memory some leaks
        if (evtName === 'attached') {
            onEvent.call(this, 'detached', function () {
                this.off(evtName, fn);
            });
        }
    },
    triggerEvent = function (eventName, payload = {}, bubbles = true) {
        let queue = events[ eventName ] || [];
        queue.forEach(listener => listener.call(this, payload));
        this.dispatchEvent(new CustomEvent(eventName, {detail: payload,
                                                        bubbles: bubbles}));
    },
    offEvent = function (evtName, fn) {
        let queue = events[ evtName ];
        if (Array.isArray(queue)) {
            events[evtName] = queue.filter(listener => listener !== fn);
        }
    };

export function on(proto) {
    // Binding to the native Web Component lifecycle methods
    // causing them to trigger relevant callbacks.
    Object.keys(natives).forEach(key => {
        proto[natives[key]] = function () {
            triggerEvent.call(this, key, ...arguments);
        };
    });
    proto.on = onEvent;
}

export function trigger(proto) {
    proto.trigger = triggerEvent;
}

export function off(proto) {
    proto.off = offEvent;
}
