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