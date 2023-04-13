# RXJS

## Observables

```typescript
export interface Observer<T> {
    onNext: (val: T) => void,
    onCompleted: () => void,
    onError: (e: Error) => void
}


const nullObserver: Observer<any> = {
    onNext: (val: any) => {},
    onCompleted: () => {},
    onError: (e: Error) => {}
}


/**
 * Subscriptions are just handles to observers,
 * so that they can be unsubscribed if need be.
 */
export interface Subscription {
    unsubscribe: () => void;
}


export class SimpleSubscription<T> implements Subscription {
    constructor(
        private observer: Observer<T>
    ) {}

    unsubscribe () {
        // unsupscription == overwrite original observer
        this.observer = nullObserver;
    }
}


/**
 * 
 */
export class Observable<T> {

    constructor(
        private _subscribe: (observer: Observer<T>) => Subscription
    ) {}


    subscribe(downstreamObserver: Observer<T>): Subscription {
        return this._subscribe(downstreamObserver);
    }


    /**
     * List of static creational methods.
     * They each return new observables. 
     * Note that those new observables do not execute the _subscribe mehtod yet.
     * that method is only executed when subscribe is executed. 
     */

    static of<X>(args: X[]): Observable<X> {
        return new Observable<X>((downstreamObserver: Observer<X>) => {
            console.log(`executing subscription-body (returned from 'of' method)`)

            args.forEach(val => downstreamObserver.onNext(val));
            downstreamObserver.onCompleted();

            return new SimpleSubscription(downstreamObserver);
        })
    }


    static fromEvent(source: Element, event: string): Observable<Event> {
        return new Observable<Event>((downstreamObserver: Observer<Event>) => {
            console.log(`executing subscription-body (returned from 'fromEvent' method)`)

            const callback = (e: Event) => downstreamObserver.onNext(e);
            source.addEventListener(event, callback);
            return {
                unsubscribe: () => source.removeEventListener(event, callback)
            }
        });
    }

    /**
     * list of non-static creational methods.
     * They each return new observables.
     * Note that the subscribe methods are not called yet with this method.
     */

    map<Y>(mapFunc: (v: T) => Y): Observable<Y> {
        return new Observable<Y>((downstreamObserver: Observer<Y>) => {
            console.log(`executing subscription-body (returned from 'map' method)`)

            const mappingObserver: Observer<T> = {
                onNext: (val: T) => {
                    const y: Y = mapFunc(val);
                    downstreamObserver.onNext(y);
                },
                onCompleted: () => downstreamObserver.onCompleted(),
                onError: (e: Error) => downstreamObserver.onError(e)
            };

            return this.subscribe(mappingObserver);
        });
    }


    filter(filterFunc: (v: T) => boolean): Observable<T> {
        return new Observable<T>((downstreamObserver: Observer<T>) => {
            console.log(`executing subscription-body (returned from 'filter' method)`)

            const filteringObserver: Observer<T> = {
                onNext: (val: T) => {
                    if (filterFunc(val)) {
                        downstreamObserver.onNext(val);
                    }
                },
                onCompleted: () => downstreamObserver.onCompleted(),
                onError: (e: Error) => downstreamObserver.onError(e)
            };

            return this.subscribe(filteringObserver);
        });
    }


    take(nr: number): Observable<T> {
        return new Observable<T>((downstreamObserver: Observer<T>) => {
            console.log(`executing subscription-body (returned from 'take' method)`)

            let i = 0;
            const takingObserver: Observer<T> = {
                onNext: (val: T) => {
                    if (i < nr) {
                        downstreamObserver.onNext(val);
                        i += 1;
                    } else {
                        downstreamObserver.onCompleted();
                    }
                },
                onCompleted: () => downstreamObserver.onCompleted(),
                onError: (e: Error) => downstreamObserver.onError(e)
            };

            return this.subscribe(takingObserver);
        })
    }

}

const list$ = Observable.of([1, 2, 3, 4, 5, 6, 7, 8]);

const list2$ = list$.map((v) => v+1);

const list3$ = list2$.filter((v) => v % 2 === 1);

const list4$ = list3$.take(3);

list4$.subscribe({
  onNext: (val: number) => console.log(val),
  onCompleted: () => {}, 
  onError: () => {}
});
```


## Zones

Zones allow you to wrap multiple, potentially asynchronous call-frames in one common environment.

```typescript
interface ZoneSpec {
    name: string;
    props?: object;
    onFork?;
    onIntercept?;
    onInvoke?;
    onScheduleTask?;
    onInvokeTask?;
    onCancelTask?;
    onHasTask?;
}


class Zone {
  static current: Zone = new Zone(null, {name: 'Base'});
  readonly parent: Zone;
  private zoneSpec: ZoneSpec;
  
  constructor(parent: Zone, zoneSpec: ZoneSpec) {
      this.parent = parent;
      this.zoneSpec = zoneSpec;
  }
  
  get name() {
      return this.zoneSpec.name;
  }

  get(key: string) {
      return this.zoneSpec.props ? this.zoneSpec.props[key] : null;
  }
  
  fork(newZoneSpec: ZoneSpec) {
      for (const key in this.zoneSpec) {
      if (key != 'name') {
          if (!newZoneSpec[key]) {
          newZoneSpec[key] = this.zoneSpec[key];
          }
      }
      }
      return new Zone(Zone.current, newZoneSpec);
  }
  
  run(callback) {
      Zone.current = this;
      callback();
      Zone.current = this.parent;
  }
  
}


const _setTimeout = (callback, time) => {
    const zoneOnCreateTime = Zone.current;
    const wrappedCallback = () => {
        zoneOnCreateTime.run(callback);
    };
    setTimeout(wrappedCallback, time);
}


const zoneBC = Zone.current.fork({
    name: 'BC',
    props: {
        message: "Hi! You can only see me inside BC!"
    }
});


function c() {
    console.log("executing c in zone ", Zone.current.name);
    console.log("Here's the message data: ", Zone.current.get('message'));
}

function b() {
    console.log("executing b in zone ", Zone.current.name);
    console.log("Here's the message data: ", Zone.current.get('message'));
    _setTimeout(c, 2000);
    // c();
}

function a() {
    console.log("executing a in zone ", Zone.current.name);
    console.log("Here's the message data: ", Zone.current.get('message'));
    zoneBC.run(b);
}

a();
console.log("this is root, running in zone ", Zone.current.name);
```


## Common rxjs operators
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/rxjs1.jpg">
<img src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/rxjs2.jpg">
