(function () {
    //This is will be the WC distro.
    // import WC from './src/index';
    let WC = require('./src/wc'),

        renderOnData = function (WC) {
            if (WC.missingDeps('renderOnData', ['on', 'templateFragment', 'data']).length) { return; }


            WC.extensions.on('data', function (data) {
                this.render(this.templateFragment, this.data);
            });
        },

    // import on from './extensions/on';
    // import render from './extensions/render';
    // import data from './extensions/data';
    // import template, { templateFragment} from './extensions/template';

        evts = require('./src/extensions/events/events'),
        render = require('./src/extensions/render/render'),
        data = require('./src/extensions/data/data'),
        templates = require('./src/extensions/template/template'),
        bindPropToAttr = require('./src/extensions/bindPropToAttr/bindPropToAttr'),

        polyfills = require('./src/utils.js').polyfills,

        // TODO: Find some way to do this better (async)
        assignPolyfill = require('./polyfills/object.assign.js');

    if (!Object.assign) {assignPolyfill();}

    WC.extendWith([evts.on, evts.trigger, evts.off,
                   templates.template, templates.templateFragment,
                   data,
                   render,
                   renderOnData,
                   bindPropToAttr]);

    WC.polyfills = polyfills;

})();
