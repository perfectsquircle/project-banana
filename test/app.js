window.onload = function() {
    console.debug(Banana);

    var bar =  ["a", "b", "c"];

    var x = new Banana.Model({
        foo: 0x123,
        bar: bar
    });
    console.debug(x);
    console.debug(x.bar);

    x.on("change", function(key, val) {
        console.debug("Somethin changed");
        console.debug(key, val);
    });

    x.foo = 0xdeadbeef;

    var Scooby = Banana.Model.extend({

        getSnacksPretty: function() {
            return "Scooby snacks are: " + this.snacks;
        }

    });

    console.debug(Scooby);
    var scooby = new Scooby({ snacks: "yummy" });
    console.debug(scooby);
    console.debug(scooby.snacks);
    console.debug(scooby.getSnacksPretty());

    var Scooby2 = function(attributes) {
        Banana.Model.call(this, attributes);
    };
    Scooby2.prototype = Object.create(Banana.Model.prototype);
    Scooby2.prototype.getSnacksPretty = function() {
        return "Scooby snacks are: " + this.snacks;
    };

    console.debug(Scooby2);
    var scooby2 = new Scooby2({ snacks: "yummy" });
    console.debug(scooby2);
    console.debug(scooby2.snacks);
    console.debug(scooby2.getSnacksPretty());

    var MonkeyView = Banana.View.extend({
        events: {
            "click": "handleClick"
        },

        handleClick: function(event) {
            console.debug(event);
        }
    });

    var monkeyView = new MonkeyView({ el: document.getElementById("monkey") });
};