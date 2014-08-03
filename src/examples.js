var _ = require("lodash");
var React = window.React = require("react");
var Components = {
    SimpleCSS: require("./components/SimpleCSS"),
    SimpleAnimation: require("./components/SimpleAnimation"),
    SimpleAnimationWithCSS: require("./components/SimpleAnimationWithCSS"),
    SpinWheel: require("./components/SpinWheel"),
};

function main() {
    "use strict";
    React.initializeTouchEvents(true);
    _.each(Components, function(Component, name) {
        var el = document.getElementById(name);
        if(el) {
            React.renderComponent(Component(), el);
        }
    });
}
main();