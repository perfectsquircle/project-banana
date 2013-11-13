(function () {
    function extend(a, b) {
        Object.getOwnPropertyNames(b).forEach(function (name) {
            a[name] = b[name];
        });
    }

    var EventEmitter = {
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

    var List = function (arr) {
        this._arr = arr || [];
        return this;
    };

    List.prototype = {
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
        },
        length: function () {
            return this._arr.length;
        }
    };

    extend(List.prototype, EventEmitter);

    [ "forEach", "map", "reduce", "reduceRight", "concat", "join", "slice", "every", "some", "filter"].forEach(function (fn) {
        List.prototype[fn] = function () {
            return Array.prototype[fn].apply(this._arr, arguments);
        };
    });

    [ "push", "pop", "shift", "unshift", "reverse", "sort", "splice" ].forEach(function (fn) {
        List.prototype[fn] = function () {
            this.emit("change", fn);
            return Array.prototype[fn].apply(this._arr, arguments);
        };
    });

    var Model = function (obj) {
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
                    this.emit("change", key, newVal);
                    val = newVal;
                }
            });
        }, parent);
    }

    extend(Model.prototype, EventEmitter);

    Model.extend = function (proto) {
        var x = function () {
            return Model.apply(this, arguments)
        };
        x.prototype = Object.create(Model.prototype);
        extend(x.prototype, proto);
        return x;
    };

    var View = function (options) {
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
            return View.apply(this, arguments);
        };
        x.prototype = Object.create(View.prototype);
        extend(x.prototype, proto);
        return x;
    };

    window.Banana = {
        EventEmitter: EventEmitter,
        List: List,
        Model: Model,
        View: View
    };
})();


