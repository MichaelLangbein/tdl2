# nginx
Based on [this article](https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms) by digital ocean.

## `server` block
A virtual server.
- `listen`: 
  - ip:port
  - ip (default 0.0.0.0)
  - port (default 80 - or 8080 if running as non-root)
  - path to a unix-socket
- `server_name`: 

### Server resolution
```js
function filterListen(candidates, ip, port) {
    // matching ip and port
    let filtered = candidates.filter(s => {
        return s.listen.ip === ip && s.listen.port === port;
    });

    // matching port, default ip
    if (!filtered.length) {
        filtered = filtered.filter(s => {
            return s.listen.ip === '0.0.0.0' && s.listen.port === port;
        });
    }

    return filtered;
}

function filterServerName(candidates, host) {
    let filtered;
    
    filtered = candidates.filter(c => {
        return c.server_name === host;
    });
    if (!filtered.length) {
        filtered = candidates
            .filter(hasLeadingWildcard)
            .filter(matches)
            .sort(byLength);
    }
    if (!filtered.length) {
        filtered = candidates
            .filter(hasTrailingWildcard)
            .filter(matches)
            .sort(byLength);
    }
    if (!filtered.length) {
        filtered = candidates
            .filter(hasRegexServerName)
            .filter(matches)
            .sort(byLength);
    }

    return filtered;
}

function resolveServer(ip, port, host){
    let candidates = filterListen(servers, ip, port);
    
    if (candidates.length > 1) {
        candidates = filterServerName(candidates, host);
    }

    return candidates[0];
}


const server = resolveServer(request.ip, request.port, request.host_header);
```


## `location` block
Lives within a server block. Defines how to handle requests for different URIs within the same parent-server.
- `location optional_modifier location_match {`
  - `location_match`
  - `optional_modifier`
    - `(none)`: If no modifiers are present, the location is interpreted as a prefix match. This means that the location given will be matched against the beginning of the request URI to determine a match.
    - `=`: If an equal sign is used, this block will be considered a match if the request URI exactly matches the location given.
    - `~`: If a tilde modifier is present, this location will be interpreted as a case-sensitive regular expression match.
    - `~*`: If a tilde and asterisk modifier is used, the location block will be interpreted as a case-insensitive regular expression match.
    - `^~`: If a carat and tilde modifier is present, and if this block is selected as the best non-regular expression match, regular expression matching will not take place.



### Location resolution

```js
function resolveLocation(uri, locations) {
    const exactMatch = locations
        .filter(exactMatchModifier)
        .find(c => matchesExactly(uri));
    if (exactMatch) return exactMatch;

    const prefixCandidates = locations
        .filter(!exactMatchModifier)
        .filter(c => matchesPrefix(uri))
        .sort(byLength);
    const longestMatchingPrefixLocation = prefixCandidates[0];

    if (longestMatchingPrefixLocation.location_modifier === '^~') {
        return longestMatchingPrefixLocation;
    }

    const regexCandidates = prefixCandidates
        .map(regexMatch)
        .sort(byStrength);

    // @TODO: further processing...
    
}

const location = resolveLocation(request.uri, matchedServer.locations);
```
It is important to understand that, by default, Nginx will serve regular expression matches in preference to prefix matches. However, it evaluates prefix locations first, allowing for the administer to override this tendency by specifying locations using the = and ^~ modifiers.

It is also important to note that, while prefix locations generally select based on the longest, most specific match, regular expression evaluation is stopped when the first matching location is found. This means that positioning within the configuration has vast implications for regular expression locations.

Finally, it it is important to understand that regular expression matches within the longest prefix match will “jump the line” when Nginx evaluates regex locations. These will be evaluated, in order, before any of the other regular expression matches are considered. Maxim Dounin, an incredibly helpful Nginx developer, explains in this post this portion of the selection algorithm.



## Root and alias
- `root`: full path is appended to the root including the location part
- `alias`: only the portion of the path NOT including the location part is appended to the alias.

That is: 
```
# myserver.com/a/args resolved to /rootpath/a/a/args
location /a/ {
    root /rootpath/a/
}


# myserver.com/b/args resolved to /aliaspath/b/args
location /b/ {
    alias /aliaspath/b/  
}
```

## Url and inbuilt parameters
```txt
       subdomain
         │     domainname
         │      │    top-level-domain
         │      │      │
         ▼── ───▼─── ──▼─
 https://www.youtube.com/watch?a1=v1&a2=v2
 ──▲─── ─────▲────────── ─▲──── ───▲──────
   │         │            │        │
   │         │            │     parameters aka query-string
protocol     │            │     $args[1] = $arg_a2
$scheme    hostname       │     $query_string = $args
           $hostname    path

                       ──▲─────────────────
───────────────────▲─────|─────────────────
                   │     │
                   │     │
               $request  │
                        $request_uri (=original)
                        $uri (=normalized, no ?, may have been changed)
```
Nginx has made some dubious decisions when it comes to naming.
URI's are a superset of URL's, but nginx uses `$request_uri` to mean path and parameters.

## Reverse- and forward-proxy
<img src="../assets/programming/../../programming/proxy_types.jpg" />

```nginx
# handling http to ws connection upgrade
# and ws connection close
map $http_upgrade $connection_upgrade {
    default Upgrade;
    ''      close;
}

server {
    listen 80 default_server;
    server_name _;
    resolver 127.0.0.11;  # docker-network's DNS server

    # serve frontend from frontend-container
    location / {
        proxy_pass http://frontend:80/;
    }

    # Forward-proxy to redirect all requests going to /proxy to the target-url
    # Based on https://forum.nginx.org/read.php?2,280672,280676
    # Not really a good solution. Nginx will not support https-forward-proxy'ing:
    # https://forum.nginx.org/read.php?2,15124,15256#msg-15256
    # But works for simple requests like:
    # http://localhost:8000/proxy/https://rz-vm140.gfz-potsdam.de/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=riesgos:primary3105729651608518938_e57c1.tif&WIDTH=256&HEIGHT=256&BBOX=-8061966.247294109,-3913575.8482010253,-7983694.730330089,-3835304.3312370046&SRS=EPSG:3857&STYLES=shakemap-pga 
    location ~ ^/proxy/(?<proto>\w+):/(?<redir>.+)$ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_intercept_errors on;
        proxy_redirect off;
        proxy_pass $proto://$redir$is_args$args;
    }

    # redirect all requests to /middleware to the middlware-container
    location /middleware {
        proxy_pass http://middleware:8888;
    }
    # redirect all requests to ws:middleware to the middleware-container
    # initial ws-handshake over http
    location /middleware/execute {
        proxy_pass http://middleware:8888/execute;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # Some headers must be re-applied on every hop: https://datatracker.ietf.org/doc/html/rfc2616#section-13.5.1
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # prove that you're alive
    location /test/ {
        root /usr/share/nginx/html/;
    }
}

```
=======
## Variables
https://nginx.org/en/docs/varindex.html



# Certbot & let's encrypt

```
snap install certbot
certbot --nginx
```
