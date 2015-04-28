export function template(WC) {
    if (WC.missingDeps('template', ['on']).length) { return; }

    let doc = document.currentScript.ownerDocument;
    WC.extensions.on('created', function () {
        let templateEl = doc.querySelector('template');

        Object.defineProperty(this, 'template', {
            get: () => templateEl,
            set: (templ) => templateEl = templ
        });
    });
}

export function templateFragment(WC) {

    if (WC.missingDeps('templateFragment', ['on']).length) { return; }

    WC.extensions.on('created', function () {
        Object.defineProperty(this, 'templateFragment', {
            get: () => document.importNode(this.template.content, true),
            set: (templ) => console.error('templateFragment is not settable')
        });
    });
}
