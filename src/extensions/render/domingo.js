var render = function rendre(template, data) {
        var frag = document.createDocumentFragment(),
            typeOf = function (thing) {
                return [].toString.call({}).replace(/\[object\s(.*)\]/, '$1').toLowerCase();
            };

        if (typeOf(data) === 'string') {
            data = JSON.parse(data);
        }

        if (typeOf(data) !== 'array') {
            data = [data];
        }

        data.forEach(function (datum) {
            var els = [].slice.call(template.cloneNode(true).children);

            els.forEach(function (el) {

                if (el.children.length) {
                    frag.appendChild(rendre(el, datum));
                } else {
                    frag.appendChild(processEl(el, datum));
                }
            });
        });
        return frag;
    },
    processEl = function (el, data) {
        processText(el, data);
        processAttrs(el, data);

        return el;
    },
    processAttrs = function (el, data) {
        var attrs;
        if (el.attributes) {
            attrs = [].slice.call(el.attributes);

            attrs.forEach(function (attr) {
                processAttr(attr, data, el);
            });
        }
    },
    processAttr = function (attr, data, el) {
        var newAttr = renderTemplateString(attr.name, data),
            newVal = renderTemplateString(attr.value, data);

        if (attr.name !== newAttr || attr.value !== newVal) {
            el.removeAttribute(attr.name);
            el.setAttribute(newAttr, newVal);
        }
    },
    processText = function (el, data) {
        el.textContent = renderTemplateString(el.textContent, data);
    },
    renderTemplateString = function (template, data) {
        var delim = {
                open: '{{',
                close: '}}'
            },
            bindingRE = new RegExp('(' + delim.open + '\\s*)(.*?)(\\s*' + delim.close + ')', 'ig'),
            matches = template.match(bindingRE),
            replacements,
            newStr = template.slice();

        if (matches) {
            matches.map(function (binding) {
                var delimRE = new RegExp(delim.open + '\\s*(.*?)\\s*' + delim.close + '', 'i'),
                    bindingParts = binding.match(delimRE),
                    itm = bindingParts[1];
                if (itm === 'this') {
                    return data;
                } else {
                    return itm.split(/\.|\//g).reduce(function (val, segment) {
                        return (val && val[segment]) || '';
                    }, data);
                }
            }).forEach(function (item, idx) {
                newStr = newStr.replace(matches[idx], item);
            });
        }
        return newStr;
    };

module.exports = render;
