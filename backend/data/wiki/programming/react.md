# React

React tries to make UI functional.
Every time something changes, the tree is regenerated based on the new state.
The idea is this:

- if you have n states, all of which can transition to each other, then there are n\*(n-1) possible transitions.
- if instead you create a new tree for any state, you don't need to care about transitions; only about n different ways of creating a tree from a state.
    The price for this is that the tree is re-created every time.
    But here the v-DOM helps us reduce the number of changes to a bearable amount.

React is not more performant than targeted DOM-manipulation, but if you have a complex application, it's state model is more tractable.

## Props

A component that get's props as an input is re-rendered every time the props change.
This causes a _one_-way data-flow. One of the props is called `children` and contains the element (if present) inside the given component.

```js
function myComponent(props) {
    return (
        <div>
            <p> Hello there, {props.name}! </p>
        </div>
    );
}
```

## JSX

- return must always be exactly one component
- js is included inside of curly braces
- some html-keywords are renamed:
  - class -> className
  - <input>sometext</input> -> <input value="sometext" />
  - <label for="inpt"> -> <label htmlFor="inpt">

## Hooks

Hooks must not be called inside conditionals. That's because they need to be guaranteed to be always called in the same order.

### State-handling hooks

- useState
- useRef
- useEffect
- useContext
- useReducer

### useRef

`useRef` helps you keep state across multiple re-renders.
You can put anything into `ref.current` and it will persist and be available the next time the component renders.
This way you can maintain a class-instance across re-renders (see following code example).

```ts
export function useTypeAhead<T>(delayMs: number, callback: (queue: T[]) => T[]) {
    const ref = useRef<TypeAhead<T>>();
    if (!ref.current) {
        ref.current = new TypeAhead(delayMs, callback);
    }
    return ref.current;
}
```

However, each component that makes a call to `useTypeAhead` will get it's _own_, different instance of that class.
If you want to have a global singleton, just do:

```ts
const stateMgmt = new StateMgmt(defaultState);

export function useWatchState<T>(filter: (s: State) => T, id: string) {
    const getCurrent = () => filter(stateMgmt.currentState());
    const [state, setState] = useState(getCurrent);
    stateMgmt.watch((state) => setState(filter(state)), id);
    return state;
}
```

### useState

`const [name, updateName] = useState('Enter your name here')`: For within-component-state

- Important note: `useState` is a hook and as such must only be called inside a react-component-function.
- _But_: `updateName` is _not_ a hook, and may be called from anywhere, including asynchronously.
- Causes a re-draw of the component.
- If you pass a function to `useState`:
  - the first time that function will be evaluated
  - after that the reference to the function is compared and no more evaluation is required
  - docs: `https://react.dev/reference/react/useState`, "there is a special behavior for functions. This argument is ignored after the initial render."

### useEffect

`useEffect((newName) => {api.call(newName)}, [name])`: for side-effects.

- Only called when one of the variables in the second argument (`[name]`) changes.
- If the second argument is `[]`, then the effect is only called upon construction.
- effect can return a `cleanup` function that gets called when component is unmounted or when a second effect is fired before the first one is complete.

Example:

```ts
export function useDebounce<T>(val: T, bufferTimeMS: number) {
    const [debouncedVal, setDebouncedVal] = useState(val);

    useEffect(() => {
        const handle$ = setTimeout(() => setDebouncedVal(val), bufferTimeMS);
        const cleanup = () => {
            clearTimeout(handle$);
        };
        return cleanup;
    }, [val]);

    return debouncedVal;
}
```

### useContext

`const user = useContext(globalUserContext)`: for global context (read-only)

Intended to have one controller-component, that changes the value using `useState`
and having all other components get the state as read-only

    ```ts
    import { createContext, useContext } from 'react';

    const ThemeContext = createContext(null);

    export default function MyApp() {
      return (
        <ThemeContext.Provider value="dark">
          <Form />
        </ThemeContext.Provider>
      )
    }

    function Form() {
      return (
        <Panel title="Welcome">
          <Button>Sign up</Button>
          <Button>Log in</Button>
        </Panel>
      );
    }

    function Panel({ title, children }) {
      const theme = useContext(ThemeContext);
      const className = 'panel-' + theme;
      return (
        <section className={className}>
          <h1>{title}</h1>
          {children}
        </section>
      )
    }

    function Button({ children }) {
      const theme = useContext(ThemeContext);
      const className = 'button-' + theme;
      return (
        <button className={className}>
          {children}
        </button>
      );
    }
    ```

- You can work with `createContext(initialValue)` and `useContext` only. But to cause a react-re-render, the `Provider` is required. Also, most commonly `createContext` gets no initial value, but receives it through `<Provider value={val}>`.
- <https://www.youtube.com/watch?v=5LrDIWkK_Bc>

### useReducer

`useReducer`: for global context (read/write)

- Remarkably, contrary to `useState`, `useReducer` doesn't require you to build a provider-component.

```jsx
import { userReducer } from "user.logic";
// (state, action): newState

const [state, dispatchChangeMessage] = useReducer(userReducer, initialState);

const action = { type: "rename", newName: "Johny" };
dispatchChangeMessage(action);
```

### UI-handling hooks

- `useRef`: like `useState` but doesn't cause re-render. Use this when using `useState` causes an infinite loop... and when you want to reference a DOM-element.
  - I think that a `ref` attribute on a DOM-element causes the element to be excluded from re-renders.

### Background

JS doesn't really have mixins, so class-components are a bit hard to compose.
Function-components, on the other hand, didn't have state.
We need easy composability and state.

```js
const React = (function () {
    const hooks = [];
    let idx = 0;

    function useState(initVal) {
        let _idx = idx;
        const state = hooks[_idx] || initVal;
        const setState = (newVal) => {
            hooks[_idx] = newVal;
        };
        idx++;
        return [state, setState];
    }

    function useRef(initVal) {
        let ref = { current: initVal };
        return ref;
    }

    function useEffect(cb, depArray) {
        let olDeps = hooks[idx];
        let hasChange = true;

        if (olDeps) {
            hasChange = depArray.some((dep, i) => !Object.is(dep, olDeps[i]));
        }

        if (hasChange) cb();
        hooks[idx] = depArray;
        idx++;
    }

    function render(Component) {
        idx = 0;
        const C = Component();
        C.render();
        return C;
    }

    return {
        useState,
        useRef,
        render,
        useEffect,
    };
})();

function Component() {
    const [count, setCount] = React.useState(1);
    const [text, setText] = React.useState("apple");
    const ref1 = React.useRef(2);
    const ref2 = React.useRef(1);

    React.useEffect(() => {
        console.log("jsconfffff");
    }, [count, text]);

    return {
        render: () => console.log({ count, text, ref1: ref1.current, ref2: ref2.current }),
        click: () => setCount(count + 1),
        type: () => setText("appear"),
    };
}

var App = React.render(Component);
App.click();
var App = React.render(Component);
App.type();
var App = React.render(Component);
// var App = React.render(Component)
// App.click()
// App.click()
```

# Common design patterns

## Using a global state manager

```ts
export function useRedux<T>(getVal: (state: State) => T) {
    const currentVal = getVal(stateMgmt.getState());

    const [val, setVal] = useState(currentVal);

    stateMgmt.watch((state) => {
        const newVal = getVal(state);
        setVal(newVal);
    });

    return val;
}
```

## Debounce

```ts
export function useDebounce<T>(val: T, bufferTimeMS: number) {
    const [debouncedVal, setDebouncedVal] = useState(val);

    useEffect(() => {
        const handle$ = setTimeout(() => setDebouncedVal(val), bufferTimeMS);
        const cleanup = () => {
            clearTimeout(handle$);
        };
        return cleanup;
    }, [val]);

    return debouncedVal;
}
```

## Sync size of images across app after loading

This is challanging, because:

- Requires a state manager `HeightSyncer`, provided with a `context`
- Requires components to subscribe and _un_subscribe... the latter forces a cleanup function, meaning it must be wrapped in `useEffect`

```ts
class HeightSyncer {
    private images: {[key: string]: HTMLElement} = [];
    private callbacks: {[key: string]: (height: number) => void} = {};

    watch(key: string, cb: (height: number) => void) {
        this.callbacks[key] = cb;
        const unwatchHandler = () => {
            delete(this.callbacks[key]);
            delete(this.images[key]);
        }
        return unwatchHandler;
    }

    registerImage(key: string, image: HTMLElement) {
        this.images[key] = image;
        let maxHeight = 0;
        for (const [key_, image] of Object.entries(this.images)) {
            if (image.clientHeight > maxHeight) maxHeight = image.clientHeight;
        }
        for (const [key_, cb] of Object.entries(this.callbacks)) {
            cb(maxHeight);
        }
    }  
}

export interface SizeSyncedImageProps {
    imgUrl: string,
    onError: () => void
}
export function SizeSyncedImage(props: SizeSyncedImageProps) {

    const context = useContext(ImageSizeContext);
    const id = useId();
    const [height, setHeight] = useState<number>(-Infinity);

    useEffect(() => {
        const unwatch = context.watch(id, (height) => setHeight(height));
        return unwatch;
    }, [context, id]);

    function handleLoad(evt: React.SyntheticEvent<HTMLImageElement, Event>): void {
        context.registerImage(id, evt.target as HTMLElement);
    }

    return <img 
        className="appTileImageImage" 
        width="100%"
        height={height > 0 ? height : 'auto'}
        src={props.imgUrl}
        onLoad={(evt) => handleLoad(evt)}        
        onError={props.onError} />
}

export function useSizeSyncer() {
    return useMemo((() => new HeightSyncer()), []);
}

export const ImageSizeContext = createContext<HeightSyncer>(null);

function ExampleComponent() {
    const syncer = useSizeSyncer();
    return <ImageSizeContext.Provider value={syncer}>
            <div>
                <SizeSyncedImage imgUrl="url/to/image1.jpg" alt="Image 1" />
                <SomeDeeplyNestedComponent />
            </div>
        </ImageSizeContext.Provider>
}

function SomeDeeplyNestedComponent() {
    return <SizeSyncedImage imgUrl="url/to/image2.jpg" alt="Image 2" />
}
```

## Handling re-renders

<https://www.debugbear.com/blog/react-rerenders>

## Stylable SVGs

1. as raw svg
   1.1. you can import an svg and immediately use it as a react-component with `vite-plugin-svgr`
   1.2. If you want to change the color and size of the svg,
2. if you want more fine grained control over the svg, create a react-component that returns the svg-code
   2.1. replace all relevant portions of the svg with props

## Draggable component

```tsx
import { MouseEvent as RMouseEvent, useState, PropsWithChildren, useRef, useEffect, RefObject } from "react";
import { State, stateMgmt } from "../services/state";
import ContextMenu from "./ContextMenu";
import ProcessNode from "./ProcessNode";

interface CHNProps {
    x: number;
    y: number;
    z: number;
    containerRef: RefObject<HTMLDivElement>;
    onMove?: (nodeRef: RefObject<HTMLDivElement>) => void;
    onMoveDone?: (nodeRef: RefObject<HTMLDivElement>) => void;
}
function CanvasHtmlNode(props: PropsWithChildren<CHNProps>) {
    // draggable: https://github.com/diveindev/dragme/blob/main/src/App.tsx
    const isClicked = useRef(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    function mouseDown(e: MouseEvent) {
        isClicked.current = true;
    }
    function mouseUp(e: MouseEvent) {
        if (isClicked.current === true) {
            if (props.onMoveDone) props.onMoveDone(nodeRef);
        }
        isClicked.current = false;
    }
    function mouseMove(e: MouseEvent) {
        if (!isClicked.current || !nodeRef.current) return;
        if (isClicked.current === true) {
            if (props.onMove) props.onMove(nodeRef);
        }
        const nextX = e.clientX;
        const nextY = e.clientY;
        nodeRef.current.style.top = `${nextY}px`;
        nodeRef.current.style.left = `${nextX}px`;
    }

    useEffect(() => {
        if (!nodeRef.current || !props.containerRef.current) return;

        // adding event listeners
        nodeRef.current.addEventListener("mousedown", mouseDown);
        props.containerRef.current.addEventListener("mouseup", mouseUp);
        props.containerRef.current.addEventListener("mousemove", mouseMove);
        props.containerRef.current.addEventListener("mouseleave", mouseUp);

        // cleanup function
        return () => {
            nodeRef.current?.removeEventListener("mousedown", mouseDown);
            nodeRef.current?.removeEventListener("mouseup", mouseUp);
            props.containerRef.current?.removeEventListener("mousemove", mouseMove);
            props.containerRef.current?.removeEventListener("mouseleave", mouseUp);
        };
    }, []);

    return (
        <div
            ref={nodeRef}
            style={{
                position: "absolute",
                top: `${props.y}px`,
                left: `${props.x}px`,
                zIndex: props.z,
                userSelect: "none",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {props.children}
        </div>
    );
}

function DrawingBoard() {
    const [contextMenu, setContextMenu] = useState(stateMgmt.getState().contextMenu);
    stateMgmt.watchState((s) => setContextMenu(s.contextMenu));

    function handleContextMenu(event: RMouseEvent<HTMLDivElement, MouseEvent>): boolean {
        event.preventDefault();
        stateMgmt.handleAction({ type: "canvas clicked", payload: event });
        return false;
    }

    const [processNodes, setProcessNodes] = useState<State["canvasData"]["processes"]>([]);
    stateMgmt.watchState((s) => setProcessNodes(s.canvasData.processes));

    const htmlContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div style={{ width: `100%`, height: `100vh`, position: "relative" }}>
            {/* svg layer for graphics */}
            <svg
                width="100%"
                height="100%"
                style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
                // viewBox="0,0,100,100" <-- actually no viewBox - don't want re-scaling, since html won't move either.
            ></svg>

            {/* html layer for text, forms */}
            <div
                ref={htmlContainerRef}
                style={{
                    width: `100%`,
                    height: `100%`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
                onContextMenu={handleContextMenu}
            >
                {contextMenu.show && (
                    <CanvasHtmlNode
                        x={contextMenu.x}
                        y={contextMenu.y}
                        z={2}
                        key="contextMenu"
                        containerRef={htmlContainerRef}
                    >
                        <ContextMenu></ContextMenu>
                    </CanvasHtmlNode>
                )}

                {processNodes.map((n) => (
                    <CanvasHtmlNode
                        x={n.x}
                        y={n.y}
                        z={1}
                        key={n.hash}
                        containerRef={htmlContainerRef}
                        onMoveDone={() =>
                            stateMgmt.handleAction({
                                type: "process-node updated",
                                payload: { ...n, x: 1, y: 1 },
                            })
                        }
                    >
                        <ProcessNode node={n}></ProcessNode>
                    </CanvasHtmlNode>
                ))}
            </div>
        </div>
    );
}

export default DrawingBoard;
```

# Common libraries

## Router

## Redux

```tsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BackendClient, Task, Tree } from "../svc/backendClient";

const dbClient = new BackendClient("http://localhost:3001");

const rootTask: Task = {
    title: "",
    description: "",
};

const tree: Tree<Task> = {
    id: 0,
    data: rootTask,
    children: [],
};

const initialState = {
    tree: tree,
    activeTask: rootTask,
};

export const loadData = createAsyncThunk("TaskTree/loadData", async (args, api) => {
    return await dbClient.getTree();
});

const slice = createSlice({
    name: "TaskTree",
    initialState: initialState,
    reducers: {},
    extraReducers: {
        [loadData.pending.toString()]: (state, action) => {
            return {
                ...state,
                activeTask: {
                    ...state.activeTask,
                    title: "...",
                },
            };
        },
        [loadData.fulfilled.toString()]: (state, action) => {
            return {
                ...state,
                tree: action.payload,
                activeTask: action.payload.data,
            };
        },
    },
});

export const taskTreeReducer = slice.reducer;
```

```tsx
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { taskTreeReducer } from "./TaskTree";

export const store = configureStore({
    reducer: {
        taskTree: taskTreeReducer,
    },
});

// Some TS-mumbo-jumbo to make type-inference work:
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
