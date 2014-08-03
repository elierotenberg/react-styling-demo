/** @jsx React.DOM */
var React = require("react");
var AnimateMixin = require("react-animate");

var SimpleAnimation = React.createClass({
    mixins: [AnimateMixin],
    getInitialState: function getInitialState() {
        return {
            showoff: false,
        };
    },
    showOff: function showOff() {
        this.animate("my-custom-animation", {
            opacity: 0,
        }, {
            opacity: 1,
        }, "cubic-in-out", 5000, this.stopShowingOff);
        this.setState({
            showoff: true,
        });
    },
    stopShowingOff: function stopShowingOff() {
        this.setState({
            showoff: false,
        });
    },
    render: function render() {
        return (
            <div>
                <a onClick={this.showOff}>Click to show off !</a>
                { this.state.showoff ? (
                    <div style={this.getAnimatedStyle("my-custom-animation")}>What a show off !</div>
                ) : null }
            </div>
        );
    },
});

module.exports = SimpleAnimation;
