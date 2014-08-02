var React = window.React = require("react");
var SimpleCSS = require("./components/SimpleCSS");
var SimpleAnimation = require("./components/SimpleAnimation");
var SimpleAnimationWithCSS = require("./components/SimpleAnimationWithCSS");
var SpinWheel = require("./components/SpinWheel");

function main() {
    "use strict";
    React.renderComponent(SimpleCSS(), document.getElementById("SimpleCSS"));
    React.renderComponent(SimpleAnimation(), document.getElementById("SimpleAnimation"));
    React.renderComponent(SimpleAnimationWithCSS(), document.getElementById("SimpleAnimationWithCSS"));
    React.renderComponent(SpinWheel(), document.getElementById("SpinWheel"));
}
main();