var ObjectController = {
	options: {
		
	},
	routes: {
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
			pieces: "*hash" //mixed case
		},
		getByRegexp: {
			method: "GET",
			pieces: "[A-Z0-9]regexp" //regexp case
		}
	},
	actions: {
		getObjectProperty: function(req, res, params) {
			if(typeof(params.property) !== "undefined") {
				res.end(params.property);
			} else {
				v0.fourOhFour(res);
			}
		},
		getById: function(req, res, params) {
			if(typeof(params.id) !== "undefined") {
				res.end(params.id);
			} else {
				v0.fourOhFour(res);
			}
		},
		getByHash: function(req, res, params) {
			if(typeof(params.hash) !== "undefined") {
				res.end(params.hash);
			} else {
				v0.fourOhFour(res);
			}
		},
		getByRegexp: function(req, res, params) {
			if(typeof(params.regexp) !== "undefined") {
				res.end(params.regexp);
			} else {
				v0.fourOhFour(res);
			}
		}
	},
	helpers: {

	}
};

module.exports = exports = ObjectController;