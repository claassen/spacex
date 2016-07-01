
//Shim for IE8
if (!Object.create) {
    Object.create = function (prototype) {
        var ctor = function () { };
        ctor.prototype = prototype;
        return new ctor();
    };
}

Function.prototype.extends = function (parent) {
    this.prototype = Object.create(parent.prototype);

    this._base = parent;

    return this;
};

var Util = {};

Util.extend = function (defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};
