(function(window) {
	var Banana = {};

	var EventEmitter = Banana.EventEmitter = {
		extend: function(obj) {
			obj.prototype.__proto__ = this;
		},
		emit: function(name) {
			var e = new CustomEvent(name, { detail: Array.prototype.slice.call(arguments, 1) });
			window.dispatchEvent(e);
		},
		trigger: this.emit,
		on: function(name, cb, context) {
			window.addEventListener(name, function(event) {
				cb.apply(context || this, event.detail);
			});
		},
		off: function(name) {
			window.removeEventListener(name);
		}
	}

	var Model = Banana.Model = function(obj) {
		Object.keys(obj).forEach(function(key) {
			Object.defineProperty(this, key, {
				configurable: false,
				enumerable: true,
				get: function() {
					return obj[key];
				},
				set: function(val) {
					console.debug("Setting " + key + " to " + val);
					this.emit("change", key, val);
					obj[key] = val;
				}
			});
		}, this);
		return this;
	};
	
	Model.prototype.__proto__ = EventEmitter;

	/*Model.extend = function(proto) {
		var x = function() {
			return proto.constructor.apply(this, arguments);
		}
		proto.__proto__ = Model.prototype;
		x.prototype.__proto__ = proto;
		return x;
	};

	var View = Banana.View = function(options) {
		var el = options.el;
		if (el) {
			var events = options.events;
			for (var x in events) {
				el.addEventListener(x, ?)
			}
		}
	};

	View.extend = function(obj) {
		obj.__proto__ = View.prototype;
		return obj;
	};*/

	window.Banana = Banana;
})(window);


