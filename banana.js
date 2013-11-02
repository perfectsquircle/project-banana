(function() {
	var Banana = this.Banana = {};

	var EventEmitter = Banana.EventEmitter = function(obj) {
 		this.__proto__ = EventEmitter.prototype;
		this._node = document.createComment("My only purpose in life is to alert others.");
		return this;
	};

	EventEmitter.prototype.emit = EventEmitter.prototype.trigger = function(name) {
		var e = new CustomEvent(name, { detail: Array.prototype.slice.call(arguments, 1) });
		this._node.dispatchEvent(e);
	};

	EventEmitter.prototype.on = function(name, cb, context) {
		this._node.addEventListener(name, function(event) {
			cb.apply(context || this, event.detail);
		});
	};

	EventEmitter.prototype.off = function(name) {
		this._node.removeEventListener(name);
	};

	var Model = Banana.Model = function(obj) {
		for (var key in obj) {
			Object.defineProperty(this, key, {
				configurable: false,
				enumerable: true,
				// writable: true,
				get: function() {
					return obj[key];
				},
				set: function(val) {
					this.emit("change", key, val);
					obj[key] = val;
				}
			});
		}
		EventEmitter.call(this, this);
		return this;
	};

	/*Model.extend = function(proto) {
		var x = function() {
			return proto.constructor.apply(this, arguments);
		}
		proto.__proto__ = Model.prototype;
		x.__proto__ = proto;
		return x;

		var x = Object.create(Model.prototype, proto);
		if (!x.hasOwnProperty("constructor")) {
			x.constructor = function() {
				return Model.apply(this, arguments);
			};
		} 
		return x.constructor;
	};*/

	/*var View = Banana.View = function(options) {
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

	return Banana;
}).call(this);


