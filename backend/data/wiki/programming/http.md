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


## Encoding of data

Http can transport binary data without problems. 
However, there are protocols which are built on top of http that are text-only.
If those protocols want to transfer binary data in their text-only bodies, they must encode the binary as text.
Note, however, that this adds about 30% of additional volume to the data.

There are two common options for this:
    - utf-8: not recommended; some binary values will not have a utf-8 equivalent and will be replaced with something else.
    - base 64: kind of recomended; will reproduce binary faithfully. 
        - If the data comes as a `data-url`, it will have a clear-text in front of the base-64-string: `data:[<mediatype>][;base64],<actual base64 string>`, which must be stripped away before using the data
        - Needs padding at end 

