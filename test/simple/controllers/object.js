var ObjectController = {
	options: {
		
	},
	routes: {
		getStringy: {
			method: "GET",
			pieces: ["stringy", "information"]
		},
		getObjectProperty: {
			method: "GET",
			pieces: ["property", ":property"] //string case
		},
		getById: {
			method: "GET",
			pieces: ["%id"] //number case
		},
		getByHash: {
			method: "GET",
			pieces: ["hash", "*hash"] //mixed case
		},
		getByRegexp: {
			method: "GET",
			pieces: ["regexp", "[[A-Z0-9]+]regexp"] //regexp case
		},
		getMultipleParams: {
			method: "GET",
			pieces: ["mixed", ":stringy", "other", "%numerical", "onemore", "*mixed"]
		},
		testHelperScope: {
			method: "GET",
			pieces: ["testHelperScope"]
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
				this.api.fourOhFour(res);
			}
		},
		getById: function(req, res, params) {
			if(typeof(params.id) !== "undefined") {
				res.end("id="+params.id);
			} else {
				this.api.fourOhFour(res);
			}
		},
		getByHash: function(req, res, params) {
			if(typeof(params.hash) !== "undefined") {
				res.end("hash="+params.hash);
			} else {
				this.api.fourOhFour(res);
			}
		},
		getByRegexp: function(req, res, params) {
			if(typeof(params.regexp) !== "undefined") {
				res.end("regexp="+params.regexp);
			} else {
				this.api.fourOhFour(res);
			}
		},
		getMultipleParams: function(req, res, params) {
			if(typeof(params.stringy) !== "undefined" && typeof(params.numerical) !== "undefined" && typeof(params.mixed) !== "undefined") {
				res.end("stringy="+params.stringy+"&numerical="+params.numerical+"&mixed="+params.mixed);
			} else {
				this.api.fourOhFour(res);
			}
		},
		testHelperScope: function(req, res, params) {
			res.end(this.helpers.getTheHost());
		}
	},
	helpers: {
		getTheHost: function() {
			return this.api.options.host;
		}
	}
};

module.exports = exports = ObjectController;