/** @jsx React.DOM */
var React = require("react");
var fromCSS = require("react-css").fromCSS;

var myStyle = fromCSS("{" +
    "transform: rotate(20deg);" +
    "background-color: red;" +
    "width: 100px;" +
    "margin: 50px;" +
"}");

var SimpleCSS = React.createClass({
    render: function render() {
        return (
            <div style={myStyle}>Simple CSS Transformation.</div>
        );
    }
});

module.exports = SimpleCSS;
