var ObjectController = {
	options: {
		
	},
	routes: {
		getStringy: {
			method: "GET",
			path: ["stringy", "information"]
		},
		getObjectProperty: {
			method: "GET",
			path: "/property/:property" //string case
		},
		getById: {
			method: "GET",
			path: ["%id"] //number case
		},
		getByHash: {
			method: "GET",
			path: "hash/*hash" //mixed case
		},
		getByRegexp: {
			method: "GET",
			path: ["regexp", "[[A-Z0-9]+]regexp"] //regexp case
		},
		getMultipleParams: {
			method: "GET",
			path: "/mixed/:stringy/other/%numerical/onemore/*mixed"
		},
		testHelperScope: {
			method: "GET",
			path: ["testHelperScope"]

		},
		testControllerScope: {
			method: "GET",
			path: "testControllerScope"
		},
		breakBefore: {
			method : "GET",
			path: ["breakBefore"]
		}
	},
	actions: {
		getStringy: function(req, res, params) {
			res.end("stringy");
		},
		getObjectProperty: function(req, res, params) {
			if(typeof(params.property) !== "undefined") {
				res.end("property="+params.property);
			} else {
				this.responses.notAvailable(res);
			}
		},
		getById: function(req, res, params) {
			if(typeof(params.id) !== "undefined") {
				res.end("id="+params.id);
			} else {
				this.responses.notAvailable(res);
			}
		},
		getByHash: function(req, res, params) {
			if(typeof(params.hash) !== "undefined") {
				res.end("hash="+params.hash);
			} else {
				this.responses.notAvailable(res);
			}
		},
		getByRegexp: function(req, res, params) {
			if(typeof(params.regexp) !== "undefined") {
				res.end("regexp="+params.regexp);
			} else {
				this.responses.notAvailable(res);
			}
		},
		getMultipleParams: function(req, res, params) {
			if(typeof(params.stringy) !== "undefined" && typeof(params.numerical) !== "undefined" && typeof(params.mixed) !== "undefined") {
				res.end("stringy="+params.stringy+"&numerical="+params.numerical+"&mixed="+params.mixed);
			} else {
				this.responses.notAvailable(res);
			}
		},
		testHelperScope: function(req, res, params) {
			res.end(this.helpers.getTheHost());
		},
		testControllerScope: function(req, res, params) {
			res.end(this.api.options.host);
		},
		breakBefore: function(req, res, params) { } //This will never get called, because of the before hook
	},
	helpers: {
		getTheHost: function() {
			return this.api.options.host;
		}
	}
};

module.exports = exports = ObjectController;