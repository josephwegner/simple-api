var Controller = function(api, configuration) {
	this.api = api;
	this.options = {};
	this.routes = {};
	this.actions = {};
	this.helpers = {};

	this.responses = api.responses;

	if(typeof(configuration.options) === "object") this.options = configuration.options;
	if(typeof(configuration.routes) === "object") this.routes = configuration.routes;
	if(typeof(configuration.actions) === "object") this.actions = configuration.actions;
	if(typeof(configuration.helpers) === "object") this.helpers = configuration.helpers;

	for(var funcName in this.helpers) {
		this.helpers[funcName] = wrapFunction(this.helpers[funcName], this);
	}
};

Controller.prototype.checkRoute = function(req, urlParts) {
	var selectedRoute = false;
	var curAction = false;
	var params = {};

	for(var action in this.routes) {
		curAction = action;
		var route = this.routes[action];

		if(typeof(route.path) === "string" && route.path.substr(0, 1) === "/") {
			route.path = route.path.substr(1);
		}

		var routePieces = typeof(route.path) === "string" ? route.path.split("/") : route.path;

		//Before we get fancy, check to see if the url and the route have the same number of parts
		if(routePieces.length !== urlParts.length) {
			continue;
		}

		if(route.method.toUpperCase() !== req.method.toUpperCase()) {
			continue;
		}


		//Store any matched params here
		params = {};

		//If we determine that it's not this route somewhere in the inner loop
		//we will set cont = true, and then break the inner loop.  Then we can continue the outer loop
		var cont = false;
		var i, max;

		for(i=0, max=routePieces.length; i<max; i++) {
			var urlPart = urlParts[i];
			var routePart = routePieces[i];

			//Check if the route part is a property flag

			switch(routePart.substr(0, 1)) {

				case "*": //Mixed
					var replaced = urlPart.replace(/[A-Za-z0-9]/g, "");

					if(replaced.length === 0) {
						params[routePart.substr(1)] = urlPart;
					} else {
						cont = true;
					}
					break;

				case "%": //Number
					var replaced = urlPart.replace(/[0-9]/g, "");

					if(replaced.length === 0) {
						params[routePart.substr(1)] = urlPart;
					} else {
						cont = true;
					}

					break;

				case ":": //String
					var replaced = urlPart.replace(/[A-Za-z]/g, "");

					if(replaced.length === 0) {
						params[routePart.substr(1)] = urlPart;
					} else {
						cont = true;
					}

					break;

				case "[": //Probably regexp.  Need to check for outer bracket
						if(routePart.lastIndexOf("]") !== -1) {
							var reg = new RegExp(routePart.substr(routePart.indexOf("[") + 1, routePart.lastIndexOf("]") - 1));

							var exec = reg.exec(urlPart);

							if(exec.length > 0 && exec[0].length === urlPart.length) {
								params[routePart.substr(routePart.lastIndexOf("]") + 1)] = urlPart;
							} else {
								cont = true;
							}
						} else {
							//This doesn't actually look like a regexp, so just match it like a 1-to-1 string
							if(routePart !== urlPart) {
								cont = true;
							}
						}
					break;

				default: //1-to-1 string
					if(routePart !== urlPart) {
						cont = true;
					}

					break;

			}

			//If continue is true, then we break out of this loop, and continue on the next one.  This means
			//that the current route did not match
			if(cont) {
				this.api.private.debug("Route did not match "+curAction, 1);
				break;
			}

		}

		//The only way the code can get to here and cont still be false is if the previous route passed on all measures
		//If that's the case 'Move Along'
		if(cont) {
			continue;
		}

		//So, presumably, if we get to this point then we have the correct route.  Like I said, 'Move Along'
		selectedRoute = curAction;
		this.api.private.debug("Found matching route "+ curAction, 1);
		break;

	}

	if(selectedRoute === false) {
		return false;
	} else {
		return function(req, res) {
			if(typeof(this.actions[selectedRoute]) === "function") {
				this.actions[selectedRoute].call(this, req, res, params);
			} else {
				this.api.fiveHundred(res);
				this.api.private.debug("We found a matching route, but there is no action for that route!", 3);
				throw new Error("Simple-API: Selected Route has no matching Action: " + selectedRoute);
			}
		}
	}
}

/** Helper Functions **/
var wrapFunction = function(func, that) {
	return function() {
		return func.apply(that, arguments);
	}
}

module.exports = exports = Controller;