# Web-parallelism



## Workers
Workers run on other threads than the main thread and communicate with the main thread asynchronously through a message-queue.

|              | Web Workers  | Service Workers  | Worklets    |
|--------------|--------------|------------------|-------------|
| Instances    | Many per tab | One for all tabs |             |
| Lifespan     | Same as tab  | Independent      |             |
| Intended use | Parallelism  | Offline support  |             |


### Web-workers
Most general purpose.
```js
// main.js
const myWorker = new Worker('worker.js');
myWorker.postMessage('Hi there');
myWorker.onmessage = function(m) {
    console.log(m.data);
}
```
```js
// worker.js
self.onmessage = function(e) {
  console.log(e.data);
  self.postMessage(workerResult);
}
```

### Service-workers
Specific type of web-worker that serve as proxy (and cache) between the browser and the network.
They can intercept any network request made from the main document.
As such they are often used for 'offline-first' apps.

```js
// main.js
navigator.serviceWorker.register('/service-worker.js');
```

```js
// service-worker.js
self.addEventListener('install', function(event) {
    // ...
});
self.addEventListener('activate', function(event) {
    // ...
});
self.addEventListener('fetch', function(event) {
    // ...
    // Return data from cache
    event.respondWith(
        caches.match(event.request);
    );
});

```

### Worklets
Worklets allow hooking into various parts of the browser's rendering-process.
Rendering-process stages:
 - style
 - layout
 - paint
 - composite

```js
// main.js
CSS.paintWorklet.addModule('worklet.js')
```

```js
// worklet.js
registerPaint()
```


