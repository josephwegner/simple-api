var api = require(__dirname + "/../../index.js");

var v0 = new api({
	prefix: ["api", "v0"],
	port: 8080,
	host: "localhost",
	before: function(req, res, controller) {
		if(req.url === "/api/v0/object/breakBefore") {
			return false;
		}
	},
	fallback: function(req, res) {
		res.end("fallback");	
	},
	logLevel: 5
});

var ObjectController = v0.Controller("object", require(__dirname + "/controllers/object.js"));
var ConvenienceController = v0.Controller("convenience", require(__dirname + "/controllers/convenience.js"));
//var ObjectModel = v0.Model("object", require(__dirname + "/models/object.js"));

if(typeof(module.exports !== "undefined") || typeof(exports) !== "undefined") {
	module.exports = exports = v0;
}