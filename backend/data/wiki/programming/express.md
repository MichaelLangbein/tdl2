# Express

## middleware

`app.use(myMiddlewareFunction)` can modify the `(request, response, nextMiddlewareFunction)` tuple before it arrives at a route. If the `myMiddlewareFunction` does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

- application level: `app.use(myMiddlewareFunction)` - called for each request
- route level: `app.get('user/:id', myMiddlewareFunction)` - called for each request to `user/:id`

## authentication and authorization

### JWT

A user obtains a JWT through simple-auth. 
That means that at least once the user must send his plain-text password to your server.
So always use https!

The server then returns a token that contains the minimum amount of information about the user that the server needs
to properly handle the users access-rights... such as groups, username, etc. But never send the actual password inside that token! JWT tokens are encoded as base64-strings ... but not encrypted! So don't put any sensitive information in them.

The client usually sends a JWT token as a header:
    `content-type: application/json`
    `Authorization: Bearer fafdasgdfajgdöai5j432q5treasgfdls`

They do have checksums to make sure they haven't been modified on the user-side.
Always set their expiration-time to less than one hour.

How are JWT's better than basic-auth?
https://security.stackexchange.com/questions/248195/what-are-the-advantages-of-using-jwt-over-basic-auth-with-https