//This is will be the WC distro.
import WC from './src/wc';
import {on, trigger, off} from './src/extensions/events/events';
import render from './src/extensions/render/render';
import data from './src/extensions/data/data';
import { template, templateFragment } from './src/extensions/template/template';
import bindAttrToProp from './src/extensions/bindAttrToProp/bindAttrToProp';
import { polyfiller } from './src/utils';
import assign from './polyfills/object.assign-polyfill';


let renderOnData = function (proto) {
    proto.on('data', function () {
        this.render(this.data);
    });
};

polyfiller({
    test: !!Object.assign,
    fill: function () { assign(); }
}).then(function () {
    [on, trigger, off, data, template, templateFragment,
     render, renderOnData, bindAttrToProp].map(extension => {
        WC.extend(extension);
    });
});
