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

- `const [name, updateName] = useState('Enter your name here')`: For within-component-state

  - Important note: `useState` is a hook and as such must only be called inside a react-component-function.
  - _But_: `updateName` is _not_ a hook, and may be called from anywhere, including asynchronously.

- `useEffect((newName) => {api.call(newName)}, [name])`: for side-effects.

  - Only called when one of the variables in the second argument (`[name]`) changes.
  - If the second argument is `[]`, then the effect is only called upon construction.

- `const user = useContext(globalUserContext)`: for global context (read-only)

  - Intended to have one controller-component, that changes the value using `useState`
    and having all other components get the state as read-only
  - Context must have been created before: ```jsx
    export const numberContext = createContext()
    export function NumberProvider ({ children }) {
    const [currentNumber, setCurrentNumber] = useState(1)
    return (
    <numberContext.Provider value={currentNumber}>
    { children }
    <button onClick={() => setCurrentNumber(currentNumber + 1)}>Global increment</button>
    </numberContext.Provider>
    )
    }
    ```

    ```
  - You can work with `createContext(initialValue)` and `useContext` only. But to cause a react-re-render, the `Provider` is required. Also, most commonly `createContext` gets no initial value, but receives it through `<Provider value={val}>`.
  - https://www.youtube.com/watch?v=5LrDIWkK_Bc

- `useReducer`: for global context (read/write)

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
    render: () =>
      console.log({ count, text, ref1: ref1.current, ref2: ref2.current }),
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

## Handling re-renders

https://www.debugbear.com/blog/react-rerenders

## Stylable SVGs

1. as raw svg
   1.1. you can import an svg and immediately use it as a react-component with `vite-plugin-svgr`
   1.2. If you want to change the color and size of the svg,
2. if you want more fine grained control over the svg, create a react-component that returns the svg-code
   2.1. replace all relevant portions of the svg with props

## Draggable component

```tsx
import {
  MouseEvent as RMouseEvent,
  useState,
  PropsWithChildren,
  useRef,
  useEffect,
  RefObject,
} from "react";
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
  const [contextMenu, setContextMenu] = useState(
    stateMgmt.getState().contextMenu
  );
  stateMgmt.watchState((s) => setContextMenu(s.contextMenu));

  function handleContextMenu(
    event: RMouseEvent<HTMLDivElement, MouseEvent>
  ): boolean {
    event.preventDefault();
    stateMgmt.handleAction({ type: "canvas clicked", payload: event });
    return false;
  }

  const [processNodes, setProcessNodes] = useState<
    State["canvasData"]["processes"]
  >([]);
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

export const loadData = createAsyncThunk(
  "TaskTree/loadData",
  async (args, api) => {
    return await dbClient.getTree();
  }
);

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
