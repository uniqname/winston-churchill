export function template(WC) {

    if (WC.missingDeps('template', ['on']).length) { return; }
    WC.extensions.on('created', function () {
        var templateEl;

        Object.defineProperty(this, 'template', {
            get: () => templateEl,
            set: (templ) => templateEl = templ
        });
    });
}

export function templateFragment(WC) {

    if (WC.missingDeps('template', ['on']).length) { return; }

    WC.extensions.on('created', function () {
        Object.defineProperty(this, 'templateFragment', {
            get: () => document.importNode(this.template.content, true),
            set: (templ) => console.error('templateFragment is not settable')
        });
    });
}
