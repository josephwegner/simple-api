Simple-API is an easy-to-use API scaffolding module for Node.js.  It creates a clean M ~~V~~ C structure for APIs and handles all the URL parsing and routing.

# Install
```
npm install simple-api
```

# Usage

## You and Your Server

A very basic API server is incredibly easy to start.

```
var api = require("simple-api");

var v0 = new api({
	prefix: ["api", "v0"],
	port: 8080,
	host: "localhost",
	logLevel: 5
});
```

You now have an API running on http://localhost:8080, responding to anything with the prefix [/api/v0](http://localhost:8080/api/v0).  Of course, your API doesn't do anything yet because you haven't built Models or Controllers, but we haven't gotten there yet.  We still have to get through these startup options.

### Serving Non-API Requests

Simple-API provides a `fallback` option in the case that your server receives a request that doesn't match the API prefix.  The fallback option defaults to sending a 404 request, but you can override that with anything you want.  Just provide a callback that receives a HTTPRequest and HTTPResponse paramters.

```
var api = require("simple-api");

var v0 = new api({
	prefix: ["api", "v0"],
	port: 8080,
	host: "localhost",
	fallback: function(req, res) {
		res.end("fallback");
		console.log("Fallback Hit");		
	},
	host: "localhost",
	logLevel: 5
});
```

Also as a convenience, `v0.app` is the [HTTP Server Object](http://nodejs.org/api/http.html#http_class_http_server).


### A Word About Log Levels

The `logLevel` option when starting your server tells Simple-API what amount of logs you want to receive.  The higher the number you provide, the less logs you will receive.  Obviously, high priority logs are paired with high numbers.  

*I've done my best to not go over `4` with any of my logs.  Generally anything more important than that is really an error I should be throwing*

## Controllers

This is where stuff gets fun.  Controllers are where you build in all of the routes and actions that will map to what your frontend system's require.  The basic structure of a controller is as follows.

```
var ObjectController = {
	options: {
		
	},
	routes: {

	},
	actions: {

	},
	helpers: {

	}
};

module.exports = exports = ObjectController;
```

### Options

There are no options yet.  See the [Contributing](https://github.com/josephwegner/simple-api#contributing) section for more info on that

### Routes

A route should map to a single action on a controller.  Additionally, routes are filtered by the request method (GET, PUT, POST, DELETE).  If a user requests a page that doesn't match a route, they will be served a 404.

A routing entry is formatted as an array, where each element matches one _piece_ of the URL.  A piece is defined as something inbetween the slashes.  (ie: in http://github.com/go/get/some/work/done the pieces are go, get some, work, and done).  The routing mechanism automatically chooses the first piece (after the hostname) of the URL as the controller name.  Everything after that is used to match the route.

```
	...

	routes: {
		myGETControllerAction: {
			method: "GET",
			pieces: ["do", "stuff"] //Responds to http://hostname/api/controller/do/stuff
		}
	},

	...
```

#### Getting Parameters from the URL

The routing mechanism can parse complex data out of portions of the URL to serve as parameters.  For example, on a social network an API endpoint might look like this:

`https://api.twitter.com/user/Joe_Wegner/follow/kwegner`

In that scenario, the API needs to be able to successfully route on dynamic URLs, but also gather that information ("Joe_Wegner" and "kwegner") so it can do work.

In order to increase the accuracy of the routes, Simple-API provides 4 match types.

- String
- Numerical
- Mixed (String & Numerical)
- RegExp

In your route you will choose a match type and then specify a name for that parameter.  When your controller action is called, it will be passed a third argument, which is an object containing all of the parameters

```
	...

	actions: {
		getObjectInfo: function(req, res, params) {

		}
	},

	...
```

##### String (:parameter)

Match string parameters by placing a colon ( `:` )

```
	...


	{
		method: "GET",
		pieces: [":username", "info"] //Matches http://hostname/api/user/Joe_Wegner/info
	}

	...
```

##### Numerical (%parameter)

Match string parameters by placing a colon ( `%` )

```
	...


	{
		method: "GET",
		pieces: ["%account_id", "status"] //Matches http://hostname/api/account/834987/status
	}

	...
```

##### Mixed (*parameter) _AlphaNumeric, including capitals and lowercase_

Match string parameters by placing a colon ( `*` )

```
	...


	{
		method: "GET",
		pieces: ["*hash", "diff"] //Matches http://hostname/api/revision/4d95a875d8c45aa228602a6de42a9c56e5b6a9a8/diff
	}

	...
```

##### RegExp ([[A-Z0-9]+]parameter)

Match string parameters by placing a colon ( `[regexp]` )

```
	...


	{
		method: "GET",
		pieces: ["[[A-Z0-9]+]code", "access"] //Matches http://hostname/api/secret/ABC123/access
	}

	...
```

### Actions

Actions get called by an associated route, and are called with three parameters:
	
- `req`: The [Node.js HTTP Server Request Object](http://nodejs.org/api/http.html#http_class_http_serverrequest)
- `res`: The [Node.js HTTP Server Response Object](http://nodejs.org/api/http.html#http_class_http_serverresponse)
- `params`: An object containing any matched params from the URL

Within the context of a controller action, `this` refers to the controller.  That means you can access any of your helper functions using `this.helpers`.  
You can also access the master API object from `this.api`.  This is helpful for some of the convenience functions available on the master API like `fourOhFour` and `fiveHundred`.

Obviously, because you are holding the HTTP request, actions are expected to call `res.end()` to finish the connection.

```
	...


	getObjectInfo: function(req, res, params) {

		var info;
		//Do some work to get the object info, and store it in var info

		res.write(JSON.stringify(info));
		res.end();

	}

	...
```

## Models

I haven't really finalized my vision of Models yet, so I haven't fully implemented them.  Please see the [Contributing](https://github.com/josephwegner/simple-api#contributing) section to learn more

# Contributing

**Simple-API is young**.  So far it's only got one developer, which means only one brain feeding into what a great Node.js API Library looks like.

PLEASE contribute.  If that means spending hours churning out code, **awesome**.  If that means shooting me an email for a great feature, wonderful.  If that means putting in bug reports, splendid.  Best of all, if that means using Simple-API for a real project, and giving me feedback on where it lacked and where it was great, then I love you.

As you can see, entire sections of the codebase are currently left out waiting to hear back about real usage (controller options, models, convenience functions, etc.).  I need to hear from you!  Check out the Author section, or drop a note on the issues page.

# Author

[@Joe_Wegner](http://www.twitter.com/Joe_Wegner) from [WegnerDesign](http://www.wegnerdesign.com).
