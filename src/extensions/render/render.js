import DOMingo from '../../../bower_components/DOMingo/ES6/DOMingo';
export default function render(WC) {

    if (WC.missingDeps('render', ['on', 'trigger', 'templateFragment']).length) { return; }

    WC.extensions.on('created', function () {
        let shadowRoot = this.shadowRoot || this.createShadowRoot(),
            render = DOMingo(this.templateFragment, shadowRoot);

        Object.defineProperty(this, 'render', {
            get: () => function (data) {
                render(data);
                this.trigger('render');
            },
            set: () => console.error('templateFragment is not settable')
        });
    });
}
