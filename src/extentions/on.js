let natives = {
        created: 'createdCallback',
        attached: 'attachedCallback',
        detached: 'detachedCallback',
        attributeChanged: 'attributeChangedCallback'
    },
    events = {},
    initQueue = qName => events[ qName ] = [],
    onEvent = function ( evtName, fn ) {
        let queue = events[ evtName ],
            componentInstance = this;

        if ( typeof fn === 'function' ) {
            if ( !queue ) {
                queue = initQueue( evtName );
            }

            queue.push( fn );
        }
    },
    trigger = function (eventName, payload) {
        let componentInstance = this,
            queue = events[ eventName ];

        if ( queue ) {
            queue.forEach( ( listener ) => {
                listener.call( componentInstance, payload );
            } );
        }
    };

export function on(WC) {

    if (WC.missingDeps('on', []).length) { return; }

    // Binding to the native Web Component lifecycle methods
    // causing them to trigger relevant callbacks.
    Object.keys(natives).forEach(key => {
        WC.extentions[natives[key]] = function () {
            trigger.call(this, key, ...arguments);
        };
    });

    WC.extentions.on = onEvent;
}

export function trigger(WC) {
    if (WC.missingDeps('trigger', []).length) { return; }
    WC.extentions.trigger = trigger;

}
