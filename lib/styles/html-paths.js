var _ = require("underscore");

var html = require("../html");

exports.topLevelElement = topLevelElement;
exports.elements = elements;
exports.element = element;

function topLevelElement(tagName, attributes) {
    return elements([element(tagName, attributes, {fresh: true})]);
}

function elements(elementStyles) {
    return new HtmlPath(elementStyles.map(function(elementStyle) {
        if (_.isString(elementStyle)) {
            return element(elementStyle);
        } else {
            return elementStyle;
        }
    }));
}

function HtmlPath(elements) {
    this._elements = elements;
}

HtmlPath.prototype.wrap = function wrap(children) {
    var result = children();
    for (var index = this._elements.length - 1; index >= 0; index--) {
        result = this._elements[index].wrapNodes(result);
    }
    return result;
};

HtmlPath.prototype.clone = function clone() {
    return new HtmlPath(this._elements.map(function(el){
        return el.clone();
    }));
};

function element(tagName, attributes, options) {
    options = options || {};
    return new Element(tagName, attributes, options);
}

function Element(tagName, attributes, options) {
    var tagNames = {};
    if (_.isArray(tagName)) {
        tagName.forEach(function(tagName) {
            tagNames[tagName] = true;
        });
        tagName = tagName[0];
    } else {
        tagNames[tagName] = true;
    }

    this.tagName = tagName;
    this.tagNames = tagNames;
    this.attributes = attributes || {};
    this.fresh = options.fresh;
    this.separator = options.separator;
}

Element.prototype.matchesElement = function(element) {
    // This is a hack to omit data-numbering when comparing/simplifying html.
    // A better solution would require a rewrite.
    return this.tagNames[element.tagName] &&
        _.isEqual(_.omit(this.attributes, ['data-numbering']) || {},
            _.omit(element.attributes, ['data-numbering']) || {});
};

Element.prototype.wrap = function wrap(generateNodes) {
    return this.wrapNodes(generateNodes());
};

Element.prototype.wrapNodes = function wrapNodes(nodes) {
    return [html.elementWithTag(this, nodes)];
};

Element.prototype.clone = function clone() {
    var tagName = _.clone(this.tagName);
    var tagNames = _.clone(this.tagNames);
    var attributes = _.clone(this.attributes);
    var fresh = _.clone(this.fresh);
    var separator = _.clone(this.separator);

    var el = new Element(tagName, attributes, {fresh: fresh, separator: separator});
    el.tagName = tagName;
    el.tagNames = tagNames;
    return el;
};

exports.empty = elements([]);
exports.ignore = {
    wrap: function() {
        return [];
    }
};
