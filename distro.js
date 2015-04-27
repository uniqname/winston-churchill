(function () {
    //This is will be the WC distro.
    // import WC from './src/index';
    let WC = require('./src/wc'),

    // import on from './extensions/on';
    // import render from './extensions/render';
    // import data from './extensions/data';
    // import template, { templateFragment} from './extensions/template';

    evts = require('./src/extensions/events/events'),
    render = require('./src/extensions/render/render'),
    data = require('./src/extensions/data/data'),
    templates = require('./src/extensions/template/template');

    evts.on(WC);
    evts.trigger(WC);
    templates.template(WC);
    templates.templateFragment(WC);
    data(WC);
    render(WC);

})();
