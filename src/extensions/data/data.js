export default function data(proto) {

    proto.on('created', function () {
        let theData = {};
        Object.defineProperty(this, 'data', {
            get: () => theData,
            set: (dataObj) => {
                theData = dataObj;
                this.trigger('data', dataObj);
            }
        });
        Object.observe(data, changes => {
            if (changes.length) {
                this.trigger('data', data);
            }
        }, ['add', 'update', 'delete']);
    });
}
