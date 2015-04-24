export default function r(templateFrag, data) {

    [].slice.call(templateFrag.childNodes).map( node => {
        if (node.nodeType === 3) {
            renderTextNode(node, data);
        } else {
            r(node, data);
            renderElAttrs(node, data);
        }
    } );

    return templateFrag;

    function renderTextNode(textNode, data) {
        textNode.textContent = renderString(textNode.textContent, data);
    }

    function renderElAttrs(fragment, data) {
        if (fragment.attributes) {
            [].slice.call(fragment.attributes).forEach(function (attr) {
                renderAttr(attr, data, fragment);
            });
        }
    }

    function renderAttr(attrObj, data, fragment) {
        var newAttr = renderString(attrObj.name, data),
            newVal = renderString(attrObj.value, data);

        if (attrObj.name !== newAttr || attrObj.value !== newVal) {
            fragment.removeAttribute(attrObj.name);
            fragment.setAttribute(newAttr, newVal);
        }
    }

    function renderString(string, data) {
        var delim = {
                open: '{{',
                close: '}}'
            },
            bindingRE = new RegExp('(' + delim.open + '\\s*)(.*?)(\\s*' + delim.close + ')', 'ig'),
            matches = string.match(bindingRE),
            replacements,
            newStr = string.slice();

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
    }
}
