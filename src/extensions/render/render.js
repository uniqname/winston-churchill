import r from './domingo2';

export default function render(WC) {

    if (WC.missingDeps('render', ['on', 'trigger']).length) { return; }

    Object.defineProperty(WC.extensions, 'render', {
        get: () => function () {
            let shadowRoot = this.shadowRoot || this.createShadowRoot();

            [...shadowRoot.childNodes]
                    .forEach(node => shadowRoot.removeChild(node));
            shadowRoot.appendChild( r(this.templateFragment, this.data) );
            this.trigger('render');
        },
        set: () => console.error('templateFragment is not settable')
    });
}
