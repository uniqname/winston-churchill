import domingo from '../../../bower_components/DOMingo/ES6/DOMingo';
export default function render(wcProto) {

    wcProto.on('created', function () {
        let shadowRoot = this.shadowRoot || this.createShadowRoot(),
            renderWith = domingo(this.templateFragment, shadowRoot);

        Object.defineProperty(this, 'render', {
            get: () => function (data) {
                renderWith(data);
                this.trigger('render');
            },
            set: () => console.error('templateFragment is not settable')
        });
    });
}
