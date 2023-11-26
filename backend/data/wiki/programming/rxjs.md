# RXJS


## Reactivity

Traditional: 
```js
var a = 1;
var b = 2;
var c = a + b;
a = 4;
console.log(c); // yields 3
```

Reactive:
```js
var a = 1;
var b = 2;
var c = a + b;
a = 4;
console.log(c); // yields 6
```

Naive implementation:
```ts
interface Subscription<T> {
    onNewVal(currentValue: T): void;
}

function fromValue<T>(value: T) {
    return new Stream<T>(value);
}

function fromPulse<T>(loopTime: number, callback: (time: number) => T) {
    let time = 0;
    const initialValue = callback(time);
    const stream = new Stream(initialValue);
    function loop() {
        setTimeout(() => {
            time += loopTime;
            const newValue = callback(time);
            stream.update(newValue);
            loop();
        }, loopTime);
    }
    loop();
    return stream;
}

function add(a: Stream<any>, b: Stream<any>) {
    let aVal = a.currentValue();
    let bVal = b.currentValue();
    const newStream = new Stream(aVal + bVal);
    a.subscribe({
        onNewVal: (val) => {
            aVal = val;
            newStream.update(aVal + bVal);
        }
    });
    b.subscribe({
        onNewVal: (val) => {
            bVal = val;
            newStream.update(aVal + bVal);
        }
    });
    return newStream;
}

class Stream<T> {

    private subscriptions: Subscription<T>[] = [];
    constructor(private _currentValue: T) {}

    public update(newValue: T) {
        this._currentValue = newValue;
        for (const sub of this.subscriptions) {
            sub.onNewVal(this._currentValue);
        }
    }

    public currentValue(): T {
        return this._currentValue;
    }

    public subscribe(subscription: Subscription<T>) {
        this.subscriptions.push(subscription);
    }

}


const a = fromPulse(1000, (time) => time / 1000); 
const b = fromValue(1);
const c = add(a, b);
c.subscribe({
    onNewVal: (val) => console.log(val)
});


```



## Intention of functional reactive programming

- Create pipes of data-streams.
- Pass these streams - not the values - around in functions as first class citicens.

https://www.youtube.com/watch?v=Agu6jipKfYw
https://www.youtube.com/watch?v=DfLvDFxcAIA


## Observables

Overview: 
``` observable.subscribe(observer) ```


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






## Nomenclature

### Behaviour, event, observable
Originally, there were:
- Behaviors: continuous, time-varying values
- Events: discrete, time-stamped values

It has been argued that each one can be used to represent the other, which is why now one uses the discrete-only *signals* (or *observables* in some implementations, like rxjs) instead.

### Push vs pull
Originally, FRP was implemented as pull-only, nowadays rxjs is push-only.



## Summary
From **A Survey on Reactive Programming (2012)**:

|                                                                           | Haskell/Fran                                                                                                     | rxjs                                                                                                                                                                          |
|---------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| allows continuous behavior                                                | yes, behaviors and events                                                                                        | no, events only                                                                                                                                                               |
| Propagation of changes                                                    | target pulls when required  (Haskell is lazy, but can lead to long wait-times when suddenly needing to catch up) | source pushes (but only once subscribed to)  As done in all eager languages; but causes re-computation. Rxjs has no simple way to prevent re-computation, requires `share, shareReplay, publish` or `multicast`.                                                                      |
| Glitches                                                                  | Cannot happen in pull-systems                                                                                    | When a value is used while it hasn't yet received the latest updates from upstream. Example:  `var1 = 1; var2 = var1 * 1; var3 = var1 + var2;`  Rxjs has no solution to this. |
| Lifting: using operators (like +, *) on Observables/Behaviors/Events      | yes                                                                                                              | No, js allows no operator overloading.                                                                                                                                        |
| Multidirectionality: F = (C * 1.8) + 32 ... now does updating F update C? | No - currently no language known that does that. More of a constraint-solving thing.                             | Nope.                                                                                                                                                                         |
| Supports distribution:                                                    | over cores: yes, over machines: no                                                                               | No.                                                                                                                                                                           |
|Error-handling                                                                     |  Maybes, Optionals, Pattern-matching                                                                                                               |  `catchError`                                                                                                                                                                               |
|                                                                           |                                                                                                                  |                                                                                                                                                                               |

Some Rxjs idiomatics:

**Example of glitch in rxjs**:
```ts
const var1 = new BehaviorSubject(1);
const var2 = var1.pipe(map(v => v*1));
const var3 = combineLatest([var1, var2]).pipe(map(([v1, v2]) => v1+v2));
// would be fixed with var3 = var2.pipe(withLatestFrom(var2), map(([v1, v2]) => v1+v2));
var3.subscribe(v => console.log(v));
var1.next(2);
```

**Rxjs requires manual work to prevent re-calculating**:

https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/creating.md#cold-vs-hot-observables

Per default all rxjs observables are cold:
- produce only values when currently subscribed to 
- are re-executed for every subscriber (aka unicast)
Exceptions: `fromEvent(mouse)` is per default hot:
- hot observables produce data even when not subscribed to
- hot observables share run once and all subscribers share that one value (aka multicast)


```ts
const var1 = of({'first': 'Michael', 'last': 'Langbein'}).pipe(tap(v => console.log("called")));
const var2 = var1.pipe(map(v => v.first));
const var3 = var1.pipe(map(v => v.last));
var2.subscribe(val => console.log(val));
var3.subscribe(val => console.log(val));
// `called` being logged twice
```

There are *three* (!) mechanisms to avoid this:
- `.pipe(multicast(new Subject()))`: makes hot (+multicast)         
    - Imagine a live performance: if you come late, you'll miss a part
- `share`: shorthand for `.pipe(multicast(new Subject(), refCount())`, makes hot (+multicast) after first subscription and only while at least one subscribed           
    - Imagine a live performance where the artist take a break when there's noone in the audience
- `shareReplay`: shorthand for `.pipe(multicast(new Subject(), refCount(), cacheAll())` makes hot (+multicast) after first subscripion and only while at least one subscribed, all later subscriptions get the missed values replayed
    - Imagine a live performance where you can watch a video of what you've missed when you come late
- `publish` followed by `connect`: shorthand for `.pipe(multicast(new Subject()))`


... ugh, this has now been deprecated in version 8.
- `share`: turns hot (+multicast) after first subscription. Remains active as long as at least one subscriber.
    example code: ```ts
    const name = new BehaviorSubject({first: "Michael", last: "Langbein"})
    const sharedName = name.pipe(
        tap(v => console.log("called")),
        share()
    );
    const first = sharedName.pipe(map(v => v.first)).subscribe(v => console.log("first:", v));  
    // called first:michael 
    const last = sharedName.pipe(map(v => v.last)).subscribe(v => console.log("last:", v));
    // no output
    name.next({ first: "Detelev", last: "Vetten"}); 
    // called first:detlev last:vetten
    ```
- `shareReplay`: like `share`, but replays past events if a subscriber comes late.
    example code: ```ts    
    const name = new BehaviorSubject({first: "Michael", last: "Langbein"})
    const sharedName = name.pipe(
        tap(v => console.log("called")),
        shareReplay()
    );
    const first = sharedName.pipe(map(v => v.first)).subscribe(v => console.log("first:", v));  
    // called first:michael 
    const last = sharedName.pipe(map(v => v.last)).subscribe(v => console.log("last:", v));
    // last:langbein
    name.next({ first: "Detelev", last: "Vetten"}); 
    // called first:detlev last:vetten
    ```
- `connectable`: a cold observable for all subscriptions that subscribe before `connect()` is called, a hot one after that.
    example code: ```ts
    const source = new BehaviorSubject({first: "Michael", last: "Langbein"});
    const name = source//.pipe(tap(v => console.log("called")));
    const connable = connectable(name);
    const first = name.pipe(map(v => v.first)).subscribe(v => console.log("first:", v));  
    connable.connect();
    const last = name.pipe(map(v => v.last)).subscribe(v => console.log("last:", v));
    source.next({ first: "Detelev", last: "Vetten"}); 
    ```

## Common rxjs operators
<img width="50%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/rxjs1.jpg">
<img width="50%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/rxjs2.jpg">

Downstream observables, never mind if they are hot or cold, pull data from upstream observables.
- Hot upstream observables are shared between downstream observables, 
- cold upstream observables are created anew for each downstream subscriber 
    - even if those downstream subscribers are later merged together again.
<img width="50%" src="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/rxjs3.jpg">



## Other (arguably better) approaches
- Elm (https://elm-lang.org/assets/papers/concurrent-frp.pdf)
    - Identifies two problems:
        - global delays: the original FRP paper assumes that update times can approach zero, but that is an unrealistic assumption. In reality, long updates can slow down the whole program.
        - uneccessary re-computation: the original FRP paper assumes that continuous behavoirs are always changing, thus requireing a re-computation in every moment in time. A similar issue exists in rxjs, though for a different reason: rxjs doesn't have behaviors, but is *still* unicast by default.
    - Design:
        - no instant update assumption
        - only discrete signals
            - implemented with pushing from source
        - message-passing concurrency
            - compiler splits work in several workers so that independent ui-components may be updated independently
            - parts that don't need to happen in global order can be annotated with `async` and will run in a separate thread without the need for expensive synchronisation
        - safe signals: compiler allows no signals of signals
            - signals are functors, but not monads
        - no duplicate computation in signals:
            - compiler remembers old values
    - Elm has actually abandoned signals - and with them FRP - in release 0.17, in favor of subscriptions: https://elm-lang.org/news/farewell-to-frp 