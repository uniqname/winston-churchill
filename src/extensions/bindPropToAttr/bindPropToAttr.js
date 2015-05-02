export default function data(WC) {

    if (!WC.missingDeps('bindAttrToProp', ['on', 'trigger']).length) {

        WC.extensions.on('created', function () {
            let compo = this;
            Object.defineProperty(compo, 'bindAttrToProp', {
                get: () => function (attr, prop) {
                    Object.defineProperty(compo, prop, {
                        enumerable: true,
                        get: () => compo.getAttribute(attr),
                        set: val => compo.setAttribute(val)
                    });
                }
            });
        });
    }
    return WC;
}
