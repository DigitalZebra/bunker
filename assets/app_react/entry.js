require("./../vendor/bootstrap/dist/css/bootstrap.css");
require("!style!css!./../vendor/bootswatch/sandstone/bootstrap.css");
require("!style!css!./../vendor/font-awesome/css/font-awesome.css");
require("!style!css!./../vendor/highlightjs/styles/github.css");
require("!style!css!./../styles/default.css");

//der[
var Header = require("./components/Header.jsx");

React.render(React.createElement(Header), document.getElementById("header"));

