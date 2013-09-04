var ConvenienceController = {
	options: {
		
	},
	routes: {
		fourOhFour: {
			method: "GET",
			pieces: ["404"]
		},
		fourOhFourWithMessage: {
			method: "GET",
			pieces: ["404withMessage"]
		},
		intError: {
			method: "GET",
			pieces: ["500"]
		},
		intErrorWithMessage: {
			method: "GET",
			pieces: ["500withMessage"]
		},
		intErrorCode: {
			method: "GET",
			pieces: ["505"]
		},
		intErrorCodeWithMessage: {
			method: "GET",
			pieces: ["505withMessage"]
		},
		authError: {
			method: "GET",
			pieces: ["403"]
		},
		authErrorWithMessage: {
			method: "GET",
			pieces: ["403withMessage"]
		},
		tempRedirect: {
			method: "GET",
			pieces: ["301"]
		},
		permRedirect: {
			method: "GET",
			pieces: ["302"]
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
		}
	},
	helpers: {
	}
};

module.exports = exports = ConvenienceController;