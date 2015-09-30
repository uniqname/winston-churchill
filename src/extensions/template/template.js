export function template(wcProto) {
    let doc = document.currentScript.ownerDocument;
    wcProto.on('created', function () {
        let templateEl = doc.querySelector('template');

        Object.defineProperty(this, 'template', {
            get: () => templateEl,
            set: (templ) => templateEl = templ
        });
    });
}

export function templateFragment(wcProto) {

    wcProto.on('created', function () {
        Object.defineProperty(this, 'templateFragment', {
            get: () => document.importNode(this.template.content, true),
            set: () => console.error('templateFragment is not settable')
        });
    });
}
