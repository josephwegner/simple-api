/* Dependencies */
var http = require('http');

/* Node-API */

var API = function(options) {

	/* Do something with default options here */

	this.options = options;

}

API.prototype.private = {

	sendError: function(msg) {
		console.log(Date.now() + " API ERROR: " + msg);
	},

	isAPICall: function(req) {
		var url = req.url;
		var parts = url.split("/");
		//Get rid of the domain part of the URL.  That's not important here
		parts.shift();

		switch(typeof(this.options.prefix)) {

			case "string":
				//Rejoin the parts, because the user wants to use a simple string as a prefix
				return parts.join("").indexOf(this.options.prefix) === 0;

				break;

			case "object":

				if(typeof(this.options.prefix.length) === "undefined") {
					this.private.sendError("Prefix must be a string or array!");
					return false;
				}

				//We only want to check as much of the URL as the user provided in prefix.  Strip out anything else for now.
				var importantParts = parts.slice(0, this.options.prefix.length);

				return importantParts === this.options.prefix;

				break;

		}
	},

	handleHTTPRequest: function(req, res) {
		if(this.isAPICall(req)) {
			//Do controller+action checks
		} else if(typeof(this.options.fallback) === "function") {
			this.options.fallback(req, res);
		} else {
			this.fourOhFour();
		}
	}

}

API.prototype.fourOhFour = function(res) {
	res.statusCode = 404;
	res.end();
}

module.exports = exports = API;