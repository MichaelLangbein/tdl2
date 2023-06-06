# HTTP

## Response codes

- `304`: **Not modified**
    - request has arrived at server
    - server has determined that the response has not changed since this particular client last requested it
        - to determine this the server *might* have re-executed the business-logic for that request
    - server responds with 302 and empty body
    - might not have saved server-computation-time, but does save on payload.



## Browser caching headers

Data from here: https://web.dev/http-cache/

<img src="https://web-dev.imgix.net/image/admin/htXr84PI8YR0lhgLPiqZ.png?auto=format&w=650">