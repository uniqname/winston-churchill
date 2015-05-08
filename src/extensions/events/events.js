let natives = {
        created: 'createdCallback',
        attached: 'attachedCallback',
        detached: 'detachedCallback',
        attributeChanged: 'attributeChangedCallback'
    },
    events = {},
    initQueue = qName => events[ qName ] = [],
    onEvent = function ( evtName, fn ) {
        if ( typeof fn !== 'function' ) { return; }
        let queue = events[ evtName ] || initQueue( evtName);
        queue.push( fn );

        //Auto prevent memory some leaks
        if (evtName === 'attached') {
            onEvent.call(this, 'detached', function () {
                this.off(evtName, fn);
            });
        }
    },
    trigger = function (eventName, payload = [], bubbles=true) {
        let queue = events[ eventName ] || [];
        queue.forEach( listener => listener.apply( this, payload ));
        this.dispatchEvent( new CustomEvent(eventName, {detail: payload,
                                                        bubbles: bubbles}) );
    },
    off = function (evtName, fn) {
        let queue = events[ evtName ];
        if (Array.isArray(queue)) {
            events[evtName] = queue.filter(listener => listener !== fn);
        }
    };

export function on(WC) {
    if (WC.missingDeps('on', []).length) { return; }
    // Binding to the native Web Component lifecycle methods
    // causing them to trigger relevant callbacks.
    Object.keys(natives).forEach(key => {
        WC.extensions[natives[key]] = function () {
            trigger.call(this, key, [...arguments]);
        };
    });
    WC.extensions.on = onEvent;
}

export function trigger(WC) {
    if (WC.missingDeps('trigger', []).length) { return; }
    WC.extensions.trigger = trigger;
}

export function off(WC) {
    if (WC.missingDeps('off', []).length) { return; }
    WC.extensions.off = off;
}
