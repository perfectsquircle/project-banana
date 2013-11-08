(function () {
    var Banana = {};

    function extend(a, b) {
        Object.getOwnPropertyNames(b).forEach(function (name) {
            a[name] = b[name];
        });
    }

    var EventEmitter = Banana.EventEmitter = {
        extend: function (obj) {
            obj.prototype.__proto__ = this;
        },
        emit: function (name) {
            var e = new CustomEvent(name, { detail: Array.prototype.slice.call(arguments, 1) });
            window.dispatchEvent(e);
        },
        trigger: this.emit,
        on: function (name, cb, context) {
            window.addEventListener(name, function (event) {
                cb.apply(context || this, event.detail);
            });
        },
        off: function (name) {
            window.removeEventListener(name);
        }
    };

    var List = Banana.List = function (arr) {
        this._arr = arr || [];
        Object.defineProperty(this, "length", {
            configurable: false,
            enumerable: false,
            get: function () {
                return this._arr.length;
            }
        });
        return this;
    };

    List.prototype = {
        __proto__: EventEmitter,
        toJSON: function () {
            var x = [];
            this.forEach(function (item) {
                x.push(item);
            }, this);
            return x;
        },
        get: function (index) {
            return this._arr[index];
        },
        set: function (index, value) {
            this.emit("change", index, value);
            this._arr[index] = value;
        }
    };

    [ "forEach", "map", "reduce", "reduceRight"].forEach(function (fn) {
        List.prototype[fn] = function () {
            return Array.prototype[fn].apply(this._arr, arguments);
        };
    });

    [ "push", "pop", "shift", "unshift" ].forEach(function (fn) {
        List.prototype[fn] = function () {
            this.emit("change", fn);
            return Array.prototype[fn].apply(this._arr, arguments);
        };
    });

    var Model = Banana.Model = function (obj) {
        smash(obj, this);
        return this;
    };

    function smash(obj, parent) {
        Object.keys(obj).forEach(function (key) {
            var val = obj[key];
            if (Array.isArray(val)) {
                val = new List(val);
            } else if (typeof val === "object") {
                return smash(val, this);
            }

            Object.defineProperty(this, key, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return val;
                },
                set: function (newVal) {
                    console.debug("Setting " + key + " to " + newVal);
                    this.emit("change", key, newVal);
                    val = newVal;
                }
            });
        }, parent);
    }

    Model.prototype.__proto__ = EventEmitter;

    Model.extend = function (proto) {
        var x = function () {
            return proto.constructor.apply(this, arguments);
        };
        proto.__proto__ = Model.prototype;
        x.prototype.__proto__ = proto;
        return x;
    };

    var View = Banana.View = function (options) {
        var el = this.el = options.el;
        if (el) {
            var events = this.events;
            for (var x in events) {
                el.addEventListener(x, this[events[x]]);
            }
        }
    };

    View.extend = function (proto) {
        var x = function () {
            return proto.constructor.apply(this, arguments);
        };
        proto.__proto__ = View.prototype;
        x.prototype.__proto__ = proto;
        return x;
    };

    window.Banana = Banana;
})();


