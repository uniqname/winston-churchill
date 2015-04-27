export default function data(WC) {

    if (WC.missingDeps('data', ['on', 'trigger']).length) { return; }

    WC.extensions.on('created', function () {
        var data = {};
        Object.defineProperty(this, 'data', {
            get: () => data,
            set: (dataObj) => {
                data = dataObj;
                this.trigger('data', dataObj);
            }
        });
    });
}
