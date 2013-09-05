var http = require('http');
var assert = require("assert");
var api;

before(function() {
	//Start simple API server
	api = require(__dirname + "/simple/index.js");
});

describe("Initializations", function() {
	it("should set this.app to the HTTP server", function(done) {
		assert.equal(typeof(api.app), "object");
		done();
	})
})

describe("GET Requests", function() {
	it("should respond to routes with no parameters", function(done) {
		http.get("http://localhost:8080/api/v0/object/stringy/information", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				assert.strictEqual(data, "stringy");
				done();	
			})

		});
	});

	it("should respond to routes with string parameters", function(done) {
		http.get("http://localhost:8080/api/v0/object/property/teststring", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				assert.strictEqual(data, "property=teststring");
				done();	
			})

		});
		
	});

	it("should respond to routes with GET parameters", function(done) {
		http.get("http://localhost:8080/api/v0/object/property/teststring?test=test", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				assert.strictEqual(data, "property=teststring");
				done();	
			})

		});
		
	});

	it("should respond to routes with numerical parameters", function(done) {
		http.get("http://localhost:8080/api/v0/object/54782", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				assert.strictEqual(data, "id=54782");
				done();	
			})

		});
		
	});

	it("should respond to routes with mixed-type paramters", function(done) {
		http.get("http://localhost:8080/api/v0/object/hash/ABC987abc", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				assert.strictEqual(data, "hash=ABC987abc");
				done();	
			})

		});
		
	});

	it("should respond to routes with regexp parameters", function(done) {
		http.get("http://localhost:8080/api/v0/object/regexp/HJK729", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				assert.strictEqual(data, "regexp=HJK729");
				done();	
			})

		});
		
	});

	it("should respond to routes with multiple paramters", function(done) {
		http.get("http://localhost:8080/api/v0/object/mixed/teststring/other/1234/onemore/1337DaWg", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				assert.strictEqual(data, "stringy=teststring&numerical=1234&mixed=1337DaWg");
				done();	
			})

		});
		
	});

	it("should 404 for actions that don't exist", function(done) {
		http.get("http://localhost:8080/api/v0/object/thisactiondoesntexist", function(res) {
			assert.equal(res.statusCode, 404);
			done();
		});
	});

	it("should 404 for controllers that don't exist", function(done) {
		http.get("http://localhost:8080/api/v0/fakeController", function(res) {
			assert.equal(res.statusCode, 404);
			done();
		});
	});

	it("should fallback for requests that don't match the prefix", function(done) {
		http.get("http://localhost:8080/notanapirequest", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "fallback");

				done();
			});
		});
	});

	it("should run the before hook for all API requests", function(done) {
		http.get("http://localhost:8080/api/v0/object/breakBefore", function(res) {

			assert.equal(res.statusCode, 200);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "fallback");

				done();
			});
		});
	});
});

describe("Convenience Functions", function() {


	// 404s
	it("should send 404s", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/404", function(res) {
			assert.equal(res.statusCode, 404);
			res.on('data', function() {});
			done();
		});
	});

	it("should send 404s with messages", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/404withMessage", function(res) {

			assert.equal(res.statusCode, 404);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "It's Not Here");

				done();
			});
		});
	});


	// 500s
	it("should handle internal errors", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/500", function(res) {
			assert.equal(res.statusCode, 500);
			res.on('data', function() {});
			done();
		});
	});

	it("should handle internal errors with messages", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/500withMessage", function(res) {

			assert.equal(res.statusCode, 500);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "You Broke It");

				done();
			});
		});
	});

	it("should handle internal errors with status codes", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/505", function(res) {
			assert.equal(res.statusCode, 505);
			res.on('data', function() {});
			done();
		});
	});

	it("should handle internal errors with status codes and messages", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/505withMessage", function(res) {

			assert.equal(res.statusCode, 505);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "You Broke It");
				done();
			});
		});
	});

	//403s
	it("should handle authentication errors", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/403", function(res) {
			assert.equal(res.statusCode, 403);
			res.on('data', function() {});
			done();
		});
	});

	it("should handle authentication errors with messages", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/403withMessage", function(res) {

			assert.equal(res.statusCode, 403);

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "Not Permitted");

				done();
			});
		});
	});


	// 30*s
	it("should do temporary redirects", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/301", function(res) {
			assert.equal(res.statusCode, 301);
			assert.equal(res.headers.location, "/red")
			res.on('data', function() {});
			done();
		});
	});

	it("should do permanent redirects", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/302", function(res) {
			assert.equal(res.statusCode, 302);
			assert.equal(res.headers.location, "/red")
			res.on('data', function() {});
			done();
		});
	});

	// 200
	it("should get JSON with the correct content type", function(done) {
		http.get("http://localhost:8080/api/v0/convenience/JSON", function(res) {

			assert.equal(res.statusCode, 200);
			assert.equal(res.headers['content-type'], "application/json");

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.equal(data, JSON.stringify({hello: "world"}));

				done();
			});
		});
	});

});

describe("Controllers", function() {
	it("should be able to access the global api object", function(done) {
		http.get("http://localhost:8080/api/v0/object/testControllerScope", function(res) {

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "localhost");

				done();
			});

		});
	})
	it("should be able to access `this` from helpers", function(done) {
		http.get("http://localhost:8080/api/v0/object/testHelperScope", function(res) {

			var data = "";

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {

				assert.strictEqual(data, "localhost");

				done();
			});

		});
	});
});