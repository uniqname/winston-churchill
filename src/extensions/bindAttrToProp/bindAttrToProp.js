export default function data(wcProto) {

    wcProto.on('created', function () {
        let component = this;
        Object.defineProperty(component, 'bindAttrToProp', {
            get: () => function (attr, prop, isBoolean) {
                Object.defineProperty(component, prop, {
                    enumerable: true,
                    get: () => isBoolean ? component.hasAttribute(attr) : component.getAttribute(attr),
                    set: val => {
                        let theProp = isBoolean && !!val ? 'setAttribute' : 'removeAttribute';
                        component[theProp](attr, val);
                    }
                });
            }
        });
    });
}
