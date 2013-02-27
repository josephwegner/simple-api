var api = require(__dirname + "/../../index.js");

v0 = new api({
	prefix: ["api", "v0"],
	port: 8080,
	host: "localhost",
	fallback: function(req, res) {
		res.end("fallback");
		console.log("Fallback Hit");		
	},
	logLevel: 1
});

var ObjectController = v0.Controller("object", require(__dirname + "/controllers/object.js"));
//var ObjectModel = v0.Model("object", require(__dirname + "/models/object.js"));