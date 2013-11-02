(function(window) {
	var Banana = {};
	
	extend = function(a, b) {
		Object.getOwnPropertyNames(b).forEach(function(name) {
			a[name] = b[name];
		});
	}

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
	
	/*var List = function(arr) {	
		//extend(this, Array.prototype);
		extend(this, EventEmitter);
		Object.defineProperty(this, "length", {
			configurable: false,
			enumerable: false,
			set: function(val) {
				this.emit("lengthChanged");
				this._length = val;
			},
			get: function() {
				return this._length
			}
		});
		this._length = arr.length
		smash(arr, this);
		return this;
	};
	
	List.prototype = {	
		__proto__: Array.prototype,
		toJSON: function() {
			var x = [];
			Object.keys(this).forEach(function(key){
				x.push(this[key]);
			}, this);
			return x;
		}
	}*/
	
	function list(arr) {
		var list = Object.create(Array.prototype);
		extend(list, EventEmitter);
		
		var _length = arr.length;
		Object.defineProperty(list, "length", {
			configurable: false,
			enumerable: false,
			set: function(val) {
				this.emit("change", this, val);
				_length = val;
			},
			get: function() {
				return _length;
			}
		});
		smash(arr, list);
		return list;
	}

	var Model = Banana.Model = function(obj) {
		smash(obj, this);
		return this;
	};
	
	function smash(obj, parent) {
		Object.keys(obj).forEach(function(key) {
			var val = obj[key];
			if (Array.isArray(val)) {
				//val = new List(val);
				val = list(val);
			} else if (typeof val === "object") {
				return smash(val, this);
			} 
			
			Object.defineProperty(this, key, {
				configurable: true,
				enumerable: true,
				get: function() {
					return val;
				},
				set: function(newVal) {
					console.debug("Setting " + key + " to " + newVal);
					this.emit("change", key, newVal);
					val = newVal;
				}
			});
		}, parent);
	}
	
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


