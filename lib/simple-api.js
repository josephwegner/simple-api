/* Dependencies */
var http = require('http');
var url = require('url');
var Controller = require(__dirname + "/Controller.js");
var Model = require(__dirname + "/Model.js");

/* Simple-API */

var API = function(options) {

	/* Do something with default options here */

	this.options = options;
	this.controllers = {};
	this.models = {};
	this.private.API = this;

	var that = this;
	this.app = http.createServer(function(req, res) {
		that.private.handleHTTPRequest.call(that, req, res);
	}).listen(this.options.port, this.options.host);
	this.private.debug("simple-api listening on http://"+this.options.host+":"+this.options.port, 4);

	return this;
}

API.prototype.private = {

	sendError: function(msg) {
		console.log(Date.now() + " API ERROR: " + msg);
	},

	//This function will return false if it is not an API call, or a string containing the remainder of the URL if it is an API call
	isAPICall: function(req) {
		var urlObj = url.parse(req.url);
		var parts = urlObj.pathname.split("/");
		//Get rid of the empty element because of the leading slash
		parts.shift();

		switch(typeof(this.options.prefix)) {

			case "string":
				//Rejoin the parts, because the user wants to use a simple string as a prefix
				if(parts.join("").indexOf(this.options.prefix) === 0) {
					return parts.join("").substr(this.options.prefix.length);
				} else {
					return false;
				}

				break;

			case "object":
				if(typeof(this.options.prefix.length) === "undefined") {
					this.private.sendError("Prefix must be a string or array!");
					return false;
				}

				//We only want to check as much of the URL as the user provided in prefix.  Strip out anything else for now.
				var importantParts = parts.slice(0, this.options.prefix.length);

				//So, we rejoin them here just like they're a string.  However, I still thing the array option
				//Provides a little bit more accuracy.  WE'RE LEAVING IT IN!
				if(importantParts.join("/") === this.options.prefix.join("/")) {
					return parts.slice(this.options.prefix.length).join("/");
				} else {
					return false;
				}

				break;

		}
	},

	handleHTTPRequest: function(req, res) {
		this.private.debug("Got HTTP Request", 1);

		var url;
		if((url = this.private.isAPICall.call(this, req)) !== false) {
			this.private.debug("HTTP Request is API related", 2);
			//Do controller+action checks
			var parts = url.split("/");

			/**
			 * At this point, parts should look something like this
			 *
			 * ["<controller>", "parts", "to", "route"]
			 *
			**/

			var controllerName = parts.shift();

			//First check if the controller exists
			if(typeof(this.controllers[controllerName]) !== "undefined") {
				//OK, the controller exists. Now lets check if it matches a route
				var controller = this.controllers[controllerName];

				//controller.checkRoute will return us a function that expects req,res as paramters.
				//It handles internally pulling the paramaters out of the route
				var route;
				if(typeof(route = controller.checkRoute(req, parts)) === "function") {
					this.private.debug("Found matching route for API request", 2);

					var cont = true;
					if(typeof(this.options.before) === "function") {
						this.private.debug("Running API Before Hook");
						cont = !(this.options.before(req, res, controllerName) === false);
					}

					if(cont) {
						route.call(controller, req, res);
					} else {
						this.private.debug("API Before Hook returned false.  Skipping API", 1);
						this.doFallback(res, res);
					}
				} else {
					this.private.debug("Route does not exist", 2);
					this.responses.notAvailable(res);
				}

			} else {
				this.private.debug("Controller " + controllerName + " does not exist", 2);
				this.responses.notAvailable(res);
			}

		} else {
			this.private.debug("This is not an API request", 2);
			this.doFallback(req, res);
		}
	},

	debug: function(msg, level) {
		if(level >= this.API.options.logLevel) {
			console.log(Date.now() + " --> " + msg);
		}
	}

}

API.prototype.Controller = function(name, configuration) {
	this.controllers[name] = new Controller(this, configuration);
	this.private.debug("Created controller: " + name, 3);
	return this.controllers[name];
};

API.prototype.doFallback = function(req, res) {
	if(typeof(this.options.fallback) === "function") {
		this.private.debug("Falling Back", 2);
		this.options.fallback(req, res);
	} else {
		this.private.debug("No fallback option.  Sending 404", 2);
		this.responses.notAvailable(res);
	}
}

API.prototype.responses = {
	notAvailable: function(res, message) {
		if(typeof(message) === "object") {
			res.setHeader("Content-Type", "application/json");
			message = JSON.stringify(message);
		}

		res.statusCode = 404;
		res.end(message);
	},
	internalError: function(res, message, statusCode) {
		//Message AND status code are optional, so handle the case where only statusCode is given
		if(typeof(message) === "number" && typeof(statusCode === "undefined")) {
			statusCode = message;
			message = undefined;
		}

		if(typeof(statusCode) === "undefined") {
			statusCode = 500;
		}

		this.respond(res, message, statusCode);
	},
	respond: function(res, message, statusCode) {
		//Message AND status code are optional, so handle the case where only statusCode is given
		if(typeof(message) === "number" && typeof(statusCode === "undefined")) {
			statusCode = message;
			message = undefined;
		}

		if(typeof(message) === "object") {
			res.setHeader("Content-Type", "application/json");
			message = JSON.stringify(message);
		}

		if(typeof(statusCode) !== "undefined") {
			res.statusCode = statusCode;
		}

		res.end(message);
	},
	notAuth: function(res, message, statusCode) {
		//Message AND status code are optional, so handle the case where only statusCode is given
		if(typeof(message) === "number" && typeof(statusCode === "undefined")) {
			statusCode = message;
			message = undefined;
		}

		if(typeof(statusCode) === "undefined") {
			statusCode = 403;
		}

		this.respond(res, message, statusCode);
	},
	redirect: function(res, destination, permanent) {
		if(typeof(permanent) === "undefined") {
			permanent = false;
		}

		res.setHeader("Location", destination);

		var statusCode = permanent ? 302 : 301;
		res.statusCode = statusCode;
		
		res.end();
	}
}

module.exports = exports = API;