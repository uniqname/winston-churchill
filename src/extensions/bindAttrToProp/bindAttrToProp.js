export default function data(WC) {

    if (!WC.missingDeps('bindAttrToProp', ['on', 'trigger']).length) {

        WC.extensions.on('created', function () {
            let compo = this;
            Object.defineProperty(compo, 'bindAttrToProp', {
                get: () => function (attr, prop, isBoolean) {
                    Object.defineProperty(compo, prop, {
                        enumerable: true,
                        get: () => isBoolean ? compo.hasAttribute(attr) : compo.getAttribute(attr),
                        set: val => {
                            let prop = isBoolean && !!val ? 'setAttribute' : 'removeAttribute   ';
                            compo[prop](attr, val);
                        }
                    });
                }
            });
        });
    }
    return WC;
}
