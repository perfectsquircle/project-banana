console.debug(Banana);

var x = new Banana.Model({
	foo: 1234,
	bar: ["a", "b", "c"]
});
console.debug(x);

x.on("change", function(key, val) {
	console.debug("Somethin changed");
	console.debug(key, val);
});

x.foo = "monkey";