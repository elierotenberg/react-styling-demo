/** @jsx React.DOM */
var React = require("react");
var AnimateMixin = require("react-animate");
var fromCSS = require("react-css").fromCSS;

var from = fromCSS("{" +
    "transform: rotate(0deg);" +
    "background-color: blue;" +
    "margin: 50px;" +
    "width: 200px;" +
"}");

var to = fromCSS("{" +
    "transform: rotate(359.9deg);" +
    "background-color: blue;" +
    "margin: 50px;" +
    "width: 200px;" +
"}");

var SpinWheel = React.createClass({
    mixins: [AnimateMixin],
    getInitialState: function getInitialState() {
        return {
            spinning: false,
        };
    },
    spin: function spin() {
        this.animate("spinning", from, to, "linear", 5000, this.spin);
        this.setState({
            spinning: true,
        });
    },
    render: function render() {
        return (
            <div>
                <a onClick={this.spin}  onTouchStart={this.spin}>Click to spin !</a>
                { this.state.spinning ? (
                    <div style={this.getAnimatedStyle("spinning")}>Spin to win</div>
                ) : null }
            </div>
        );
    },
});

module.exports = SpinWheel;
