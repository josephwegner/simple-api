# Simple-API (v0.1)

Simple-API is an easy-to-use API scaffolding module for Node.js.  It creates a clean M ~~V~~ C structure for APIs and handles all the URL parsing and routing.

## Install
```
npm install simple-api
```

## Usage

### You and Your Server

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

#### Serving Non-API Requests

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


#### Before API Request Hook

Sometimes you might want to run some code before every API request.  Perhaps this is for authentication or session management.  Simple-API has a before hook that will let you run any code, including manipulation of the request and response objects.  It also allows you to abort the API request and go to the fallback option.

The following code will fallback all API requests to the `users` controller.  Returning any value other than `FALSE` will allow simple-api to continue the API call.  

```
var api = require("simple-api");

var v0 = new api({
	prefix: ["api", "v0"],
	port: 8080,
	host: "localhost",
	before: function(req, res, controller) {
		if(controller === "users") {
			return false;
		}
	},
	host: "localhost",
	logLevel: 5
});
```


#### A Word About Log Levels

The `logLevel` option when starting your server tells Simple-API what amount of logs you want to receive.  The higher the number you provide, the less logs you will receive.  Obviously, high priority logs are paired with high numbers.  

*I've done my best to not go over `4` with any of my logs.  Generally anything more important than that is really an error I should be throwing*

### Controllers

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

#### Options

There are no options yet.  See the [Contributing](https://github.com/josephwegner/simple-api#contributing) section for more info on that

#### Routes

A route should map to a single action on a controller.  Additionally, routes are filtered by the request method (GET, PUT, POST, DELETE).  If a user requests a page that doesn't match a route, they will be served a 404.

A routing entry is formatted as an array, where each element matches one _piece_ of the URL.  A piece is defined as something inbetween the slashes.  (ie: in http://github.com/go/get/some/work/done the pieces are go, get some, work, and done).  The routing mechanism automatically chooses the first piece (after the hostname) of the URL as the controller name.  Everything after that is used to match the route.

```
	...

	routes: {
		myGETControllerAction: {
			method: "GET",
			path: ["do", "stuff"] //Responds to http://hostname/api/controller/do/stuff
		}
	},

	...
```

##### Getting Parameters from the URL

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

Route paths can be defined either as an array or a string.  If you choose to use an array, each element should represent a piece of the path *(ie: the stuff between the slashes)*.  Each of the examples below will have the path defined both as an array and as a string.

###### String (:parameter)

Match string parameters by placing a colon ( `:` )

```
	...


	{
		method: "GET",
		path: [":username", "info"] //Matches http://hostname/api/user/Joe_Wegner/info
   //or path: ":username/info"
	}

	...
```

###### Numerical (%parameter)

Match string parameters by placing a colon ( `%` )

```
	...


	{
		method: "GET",
		path: ["%account_id", "status"] //Matches http://hostname/api/account/834987/status
   //or path: "%account_id/status"
	}

	...
```

###### Mixed (*parameter) _AlphaNumeric, including capitals and lowercase_

Match string parameters by placing a colon ( `*` )

```
	...


	{
		method: "GET",
		path: ["*hash", "diff"] //Matches http://hostname/api/revision/4d95a875d8c45aa228602a6de42a9c56e5b6a9a8/diff
   //or path: "*hash/diff"
	}

	...
```

###### RegExp ([[A-Z0-9]+]parameter)

Match string parameters by placing a colon ( `[regexp]` )

```
	...


	{
		method: "GET",
		path: ["[[A-Z0-9]+]code", "access"] //Matches http://hostname/api/secret/ABC123/access
   //or path: "[[A-Z0-9]+]code/access"
	}

	...
```

#### Actions

Actions get called by an associated route, and are called with three parameters:
	
- `req`: The [Node.js HTTP Server Request Object](http://nodejs.org/api/http.html#http_class_http_serverrequest)
- `res`: The [Node.js HTTP Server Response Object](http://nodejs.org/api/http.html#http_class_http_serverresponse)
- `params`: An object containing any matched params from the URL

Within the context of a controller action, `this` refers to the controller.  That means you can access any of your helper functions using `this.helpers`.  
You can also access the master API object from `this.api`.

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

#### Convenience Functions

Simple-API defines a number of convenient response functions that are commonly used in APIs.  All of the convience functions can be passed either a string or an object as an optional message; objects will be output as JSON.  Convenience functions are members of the `responses` key on the controller, so can be accessed within an action as `this.responses.response(res, ...);`.  As you can see, the first parameter for each convenience function is the HTTP response object.

- **notAvailable**: Returns a 404 ~ `(res, *message*)`
- **notAuth**: Returns a 404 ~ `(res, *message*)`
- **redirect**: Returns a 301/302 ~ `(res, destination, *permanent* (defaults to false)*)`
- **response**: Abstract response, you define everything ~ `(res, *message*, *statusCode*)`

These convenience functions also exist on the API object under the `responses` key so that you can access them from any event hooks.  They function identically as in controllers, so you would call `v0.responses.respond(res, ...);`.

### Models

I haven't really finalized my vision of Models yet, so I haven't fully implemented them.  Please see the [Contributing](https://github.com/josephwegner/simple-api#contributing) section to learn more

## Contributing

**Simple-API is young**.  So far it's only got one developer, which means only one brain feeding into what a great Node.js API Library looks like.

PLEASE contribute.  If that means spending hours churning out code, **awesome**.  If that means shooting me an email for a great feature, wonderful.  If that means putting in bug reports, splendid.  Best of all, if that means using Simple-API for a real project, and giving me feedback on where it lacked and where it was great, then I love you.

As you can see, entire sections of the codebase are currently left out waiting to hear back about real usage (controller options, models, convenience functions, etc.).  I need to hear from you!  Check out the Author section, or drop a note on the issues page.

## Thanks

- [@Joe_Wegner](http://www.twitter.com/Joe_Wegner) from [WegnerDesign](http://www.wegnerdesign.com).
- [@jessepollack](http://www.twitter.com/jessepollak) from [Clef](http://getclef.com)
