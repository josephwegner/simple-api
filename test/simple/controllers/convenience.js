var ConvenienceController = {
	options: {
		
	},
	routes: {
		fourOhFour: {
			method: "GET",
			path: ["404"]
		},
		fourOhFourWithMessage: {
			method: "GET",
			path: ["404withMessage"]
		},
		intError: {
			method: "GET",
			path: ["500"]
		},
		intErrorWithMessage: {
			method: "GET",
			path: ["500withMessage"]
		},
		intErrorCode: {
			method: "GET",
			path: ["505"]
		},
		intErrorCodeWithMessage: {
			method: "GET",
			path: ["505withMessage"]
		},
		authError: {
			method: "GET",
			path: ["403"]
		},
		authErrorWithMessage: {
			method: "GET",
			path: ["403withMessage"]
		},
		tempRedirect: {
			method: "GET",
			path: ["301"]
		},
		permRedirect: {
			method: "GET",
			path: ["302"]

		},
		getJSON: {
			method: "GET",
			path: ["JSON"]
		}

	},
	actions: {
		fourOhFour: function(req, res, params) {
			this.responses.notAvailable(res);
		},
		fourOhFourWithMessage: function(req, res, params) {
			this.responses.notAvailable(res, "It's Not Here")
		},
		intError: function(req, res, params) {
			this.responses.internalError(res);
		},
		intErrorWithMessage: function(req, res, params) {
			this.responses.internalError(res, "You Broke It");
		},
		intErrorCode: function(req, res, params) {
			this.responses.internalError(res, 505);
		},
		intErrorCodeWithMessage: function(req, res, params) {
			this.responses.internalError(res, "You Broke It", 505);
		},
		authError: function(req, res, params) {
			this.responses.notAuth(res);
		},
		authErrorWithMessage: function(req, res, params) {
			this.responses.notAuth(res, "Not Permitted");
		},
		tempRedirect: function(req, res, params) {
			this.responses.redirect(res, "/red");
		},
		permRedirect: function(req, res, params) {
			this.responses.redirect(res, "/red", true);
		},
		getJSON: function(req, res, params) {
			this.responses.respond(res, {hello: "world"});
		}
	},
	helpers: {
	}
};

module.exports = exports = ConvenienceController;