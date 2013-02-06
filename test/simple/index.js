var api = require(__dirname + "/../index.js");

var v0 = new api({
	prefix: ["api", "v0"],
	port: 8080,
	host: "localhost",
	fallback: function(req, res) {
			
	}
});

