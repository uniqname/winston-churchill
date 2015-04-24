import r from './domingo2';

export default function render(WC) {

    if (WC.missingDeps('render', ['on', 'trigger']).length) { return; }

    WC.extentions.on('created', function () {
        var data = {};
        Object.defineProperty(this.constructor.prototype, 'render', {
            get: () => function () {
                this.createShadowRoot()
                    .appendChild( r(this.templateFragment, this.data) );
                this.trigger('render');

            },
            set: () => console.error('templateFragment is not settable')

        });
    });
}
