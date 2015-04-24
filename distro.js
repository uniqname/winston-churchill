(function () {
    //This is will be the WC distro.
    // import WC from './src/index';
    let WC = require('./src/wc'),

    // import on from './extentions/on';
    // import render from './extentions/render';
    // import data from './extentions/data';
    // import template, { templateFragment} from './extentions/template';

    evts = require('./src/extentions/on'),
    render = require('./src/extentions/render'),
    data = require('./src/extentions/data'),
    templates = require('./src/extentions/template');

    evts.on(WC);
    evts.trigger(WC);
    templates.template(WC);
    templates.templateFragment(WC);
    data(WC);
    render(WC);

})();
