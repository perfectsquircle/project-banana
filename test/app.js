window.onload = function() {
    console.debug(Banana);

    var bar =  ["a", "b", "c"];

    var x = new Banana.Model({
        foo: 0x123,
        bar: bar
    });
    console.debug(x);

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