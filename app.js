console.debug(Banana);

var x = new Banana.Model({
	foo: 0x123,
	bar: ["a", "b", "c"]
});
console.debug(x);

x.on("change", function(key, val) {
	console.debug("Somethin changed");
	console.debug(key, val);
});

x.foo = 0xdeadbeef;


