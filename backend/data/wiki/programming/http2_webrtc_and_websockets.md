# HTTP/2

## General

- Instead of making many single requests to a server, one TCP connection is opened and never closed.
- Within that connection, multiple streams may happen concurrently.
- Requires TLS
- Starts as http/1.1, then with `Upgrade` request turns into http/2.
  - Thus, if server doesn't support it, just continues to use http/1.1
  - But: `Upgrade` is hop-by-hop, which means that every proxy on the way to your server must be configured to set the `Upgrade` header anew.

## Compression
- Zips not only body, but also headers.

## Push
Usually a browser requests index.html and then separately requests styles and js files.
The server can create a push-package that sends those secondary files to the browser before it has even asked for them.
(Requires explicit enabling on the server-side, I think)

## HTTP/2 streaming vs websockets
[stackoverflow](https://stackoverflow.com/questions/28582935/does-http-2-make-websockets-obsolete) makes it pretty clear that http/2 does not replace websockets.







# Websockets
Websockets are persistent TCP connections between a server and a client.
They first need to be mediated from HTTP.
The http-request's TCP connection is being reused for the further communication.
This is an upgrade of the existing connection; that means all further communication stays on the same port (which is great, because its hard to get firewall- and proxy-admins to open new ports for you).

```ascii
┌────────┐                                                     ┌────────┐
│        │           HTTP GET ws://server.com                  │        │
│        │           HTTP/1.1                                  │        │
│        │           Connection: Upgrade                       │        │
│        │           Upgrade: websocket                        │        │
│        │ ──────────────────────────────────────────────────► │        │
│        │                                                     │        │
│        │           HTTP/1.1 101 Switching Protocols          │        │
│        │           Connection: Upgrade                       │        │
│        │           Upgrade: websocket                        │        │
│ client │ ◄────────────────────────────────────────────────── │ server │
│        │                                                     │        │
│        │                                                     │        │
│        │           TCP connection remains intact             │        │
│        │  ─────────────────────────────────────────────────► │        │
│        │  ◄───────────────────────────────────────────────── │        │
│        │                                                     │        │
│        │                                                     │        │
└────────┘                                                     └────────┘
```

Code example.
Server:
```js
const ws = require('ws');

const server = new ws.Server({port: 8080});
server.on('connection', socket => {
    socket.on('message', message => {
        socket.send(`Roger that! ${message}`);
    })
});
```

Client:
```js
const socket = new WebSocket('ws://localhost:8080');
socket.send('Hey there!');
socket.onmessage = response => {
    console.log(`Server responded with ${response.data}`)
};
```

**Important caveat**: `Upgrade` is hop-by-hop, which means that every proxy on the way to your server must be configured to set the `Upgrade` header anew.
Otherwise, a websocket-connection will not be established.
Nginx, for example, sets that header like this: 
```nginx
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
```

Fortunately, this caveat [mostly doesn't hold when your you use TLS](https://stackoverflow.com/questions/11318197/i-am-trying-to-understand-how-websockets-work-to-the-extent-that-they-are-depe). Because here the proxy cannot read any headers and therefore isn't capable of adding or stripping the `Connection: Upgrade` header. 


# WebRTC

## WebRTC vs Websocket

Websockets create a 1-1 TCP connection between a client and a server.

```txt

          HTTP handshake
client  ────────────────► server
        ◄────────────────

client  ◄────────────────►  server
         TCP
```

WebRTC creates a 1-1 UDP connection between two clients (through the brief mediation of a server).
```txt
           signaling server
     ...............................
     :                             :
     :                             :
     :   │ │               │ │     :
     :   │ │   UDP         │ │     :
client1──┼─┼───────────────┼─┼──► client2
         │ │               │ │
         │ │               │ │
         │ │               │ │
         │ │               │ │
   firewall│               │ firewall
           NAT             NAT

```

## Internet topology and security mechanisms that we need to be able to bypass

### Firewalls
Contain tables of rules about which IPs/ports on the outside may send/receive data to/from which ports on the inside.

### NAT 
Almost everybody with a router is behind NAT.
Only router has a public IP-address.
Router replaces internal IP with its own IP and internal port with an own port.
Translates this through NAT-Table.


PC P / router R / server S

Establishing a data-connection through a NAT-ing router (aka hole-punching):
- One-to-one NAT aka. full cone. Default.
- Address restricted NAT. R will only allow incoming data from S through to P if P has previously sent some request to S.
- Port restricted NAT. Same as address restricted NAT, but also includes port, not just IP.
- Symmetric NAT <-- WebRTC doesn't work here



## WebRTC
Needs to create a UDP-connection through firewalls and NATs.
Info from [here](https://fireship.io/lessons/webrtc-firebase-video-chat/).

- p1 connects to a signaling server. There p1 leaves information about...
    - ... what data p1 wants to transfer (the SDP-offer-description): `db.offer = pc.createOffer()`
    - ... how to reach p1 (the ICE-candidates): `pc.onicecandidate = candidate => db.offerIceCandidates.push(candidate)`
- p2 connects to a signaling server. There ...
    - ... it choses a peer (p1) from the SDP-offer-descriptions, `pc.setRemoteDescription(db.offer)`
    - ... and it finds the ICE-candidates for the chosen peer.  `db.offerIceCandidates.change = candidate => pc.setIceCandidate(candidate)`
- p2 now makes itself known, too.
    - ... it publishes its answer to the db: `db.answer = pc.createAnswer()`
    - ... it publishes its own ice-candidates: `pc.onicecandidate = candidate => db.answerIceCandidates.push(candidate)`
- p1 accepts p1's answer:
    - ... it accepts p2's SDP-answer-description: `pc.setRemoteDescription(db.answer)`
    - ... it reads p2's ICE-candidates: `db.answerIceCandidates.change = candidate => pc.setIceCandidate(candidate)`
- p1 and p2 are now directly connected.

<image src="../assets/webrtc.png" />


### Signaling
A server that allows peers to expose themselves and others to select appropriate peers.

### ICE
For signaling to work, peers need to be able to address each other with consistent IP/port pairs.
NAT and firewalls make this difficult, however.
But everyone can use the ICE-protocol to connect to a STUN-server.
That STUN-server will basically port-scan your router to see which IP/port combinations will remain consistent. 
The results of this audit are encoded in a file called the "ICE-candidates".


<image src="../assets/webrtc_handshake.png" />

### Summary

In total, two servers are - briefly - involved in setting up a WebRTC-connection.
- Each peer first connects to a STUN-server to find out how it can be reached from the outside
- Peers that want to make connections also need to publish information about themselves on a signaling-server, so that others can find them.


WebRTC is like online-dating.

- ICE-candidates (obtained from a STUN server) are your contact-details (phone, email, ...)
- You put these onto tinder (the signaling server) together with your dating-preferences (the offer-description)
- Once another peer has selected and contacted you, what happens between the two peers is completely unbeknown to the server.




### TURN Server
When your router uses symmetric NAT, no ICE candidate will ever be persistent.
To work around this, there are TURN servers. 
Instead of having a continuous connection to your peer, all traffic is relayed through a TURN server.






# Example

## peer 1: offering a call
```js

// webrtc api
const iceConfig = {
    iceServers: [{
        urls: ['stun:stun1.l.google.com:19302', 'stun:stung2.l.google.com:19302']
    }],
    iceCandidatePoolSize: 10
};
const pc = new RTCPeerConnection(iceConfig);


// display media
const outgoingStream = document.getElement...;
const incomingStream = document.getElement...;
outgoingStream.getTracks().forEach(track => {
    pc.addTrack(track, outgoingStream);
});
pc.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
        incomingSteam.addTrack(track);
    });
};


// get references to a signalling-server-db-document
const callDoc = firestore.collection('calls').doc();
const offerCandidates = callDoc.collection('offerCandidates');
const answerCandidates = callDoc.collection('answerCandidates');
const callUid = callDoc.id;


// create and publish offer-description
const offerDescription = await pc.createOffer();
pc.setLocalDescription(offerDescription); // using offer-description locally
await callDoc.set({                       // publishing offer-description to signalling-server-db
    sdp: offerDescription.sdp,
    type: offerDescription.type
});
// publish ice-candidates
pc.onicecandidate = event => {
    if (event.candidate) {
        offerCandidates.add(event.candidate.toJSON());
    }
};



// listen for changes on database
callDoc.onSnapshot(callDocSnapshot => {
    const data = callDocSnapshot.data();
    
    // listen for remote offer-descriptions
    if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);    // use remote description locally
    }

    // listen for remote ice-candidates
    answerCandidates.onSnapshot(answerCandidatesSnapshot => {
        answerCandidatesSnapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const iceCandidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(iceCandidate);    // use remote ice-candidate locally.
            }
        });
    });
});





```