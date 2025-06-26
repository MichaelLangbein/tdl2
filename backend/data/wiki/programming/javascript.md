# Javascript

## This

`This` refers to the object on which a function has been called.
This rule always holds true for arrow-functions.
In old-style functions, however, two exceptions exist:

- when an event has been triggered, `this` references the element on which the event was triggered. (That comes up sometimes in d3.js)
- when the function is used as a constructor,  `this` inside of it no longer refers to the object from which the function was called, but to the new object that is being created.

In my book there are only two reasons to use old-style functions:

- old-style functions allow `yield` (though you can probably use observables instead)
- old-style functions are often expected in d3 (especially where there is event-handling d3 sometimes tries to set this on a function)

## Prototypes

Javascript per se doesn't know about classes. But every object has a prototype - which in the worst case is just the built-in `Object`.
If an object doesn't find some key in it's own properties, it moves down the prototype chain looking for that key.
So prototypes are just fallbacks.

Here we create `newObject` with a prototype equal to `prototypicalObject`:

```js
const michael = {
    name: 'Michael',
    sayHi: function() {
        return `Hi, I'm ${this.name}!`;
    }
};

const andreas = Object.create(michael);
andreas.name = 'Andreas';
andreas.sayHi();   // 'Hi, I'm Andreas'
andreas.__proto__; // michael
michael.__proto__; // Object
```

### Built in hierarchy

<img scr="https://raw.githubusercontent.com/MichaelLangbein/tdl2/main/backend/data/assets/programming/js_builtin_hierarchy.jpg" />

### Function constructors

As a note beforehand: never, ever, ever use function constructors. They were built into JS against even the inventors own will. They are a really stupid construct.

The `Function` type (see the built in hierarchy) has a special property named `prototype`. Only `Function`s and `Object`s have that - **no types that inherit from them do**. This is a non-inherited property.
When a function `Foo` is called with `new`, the returned object gets as its `__proto__` the value of `Foo`'s `prototype`.

```js
function Foo(name) {
    this.name = name;
}
Foo.__proto__                   // ƒ () { [native code] }
Foo.prototype                   // {constructor: ƒ}
const bar = new Foo('Michael')
bar.name                        // 'Michael'
bar.__proto__                   // {constructor: ƒ}
bar.prototype                   // undefined
```

`__proto__` is the actual object that is used in the lookup chain to resolve methods, etc. `prototype` is the object that is used to build `__proto__` when you create an object with `new`. But the instance then loses the `prototype` property and only retains `__proto__`. (See [here](https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript))

Why was that weird, ephemeral `prototype` property invented in the first place? Because it allows for non-instance (i.e. class-wide) methods.
Example:

```js
function Vector3D(x, y, z) {
    this.x = x;
    this.y = y
    this.z = z;
}
// this function exists only once
Vector3D.prototype.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
```

Vs:

```js
function Vector3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    // this function exists as a new object in every instance
    this.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
}
```

I personally think that this taints js-functions to do things that are not the job of a function, but that of a class.
As was eloquently stated [here](https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e):
> In JavaScript, any function can return a new object. When it’s not a constructor function or class, it’s called a factory function.

Honestly, that same effect could have been achieved with a factory method:

```js
// function only exists once
function magnitude(x, y, z) {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
const createVector3D = (x, y, z) => {
    return {
        x, y, z, magnitude
    }
}
// use this in combination with Object.create if you want deeper inheritance
```

That said, it is kind of neat how the curly braces of a function can be seen as the curly braces of the object that is being spawned.

## Modules

### Commonjs

Used in node

### ASM: Asynchronous module definition

Old-style browser modules, still common in ArcGIS.

Defining a module:

```js
define("esri/core/reactiveUtils", ["require", "exports", "esri/core/Accessor"], function(require, exports, Accessor) {
    // Module implementation here
    const whenOnce = (watcher) => { /* ... */ };
    const watch = (target, prop, callback) => { /* ... */ };

    exports.whenOnce = whenOnce;
    exports.watch = watch;
    // ... other reactiveUtils exports
});
```

Loading a module:

```js
if (typeof window.require !== 'undefined') {
    window.require(["esri/core/reactiveUtils"], function(reactiveUtils) {
        window.console.log("got reactive utils", reactiveUtils);
    });
}
```

If you're injecting your code into a running application that has been built with ASM, you can actually use `window.require` to fetch dependencies, even from the already minified code!
But you must hope that:

- `reactiveUtils` has indeed been registered under the key "esri/core/reactiveUtils"
- and that this module has been bundled with the rest of the js.
  - ... though maybe ASM can actually fetch missing code from the server if it finds a not-yet-loaded library?

### ESM (Ecma-Script modules): the modern way

Used in webpack et.al. This is what Ruby on Rails now uses.
JS now may contain `import` statements, and the browser itself resolves them. Modern browsers have a built-in JavaScript module loader. When a browser encounters a script tag with type="module" (e.g., <script type="module" src="./main.js"></script>), it parses that script for import and export statements.
If it finds a non-resolved import, it can even fetch that import from the server (or other urls).
To do that, it uses an import map - those are js-tags of type `importmap`:

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://unpkg.com/react@18/index.js",
      "react-dom": "https://unpkg.com/react-dom@18/index.js",
      "lodash/": "https://unpkg.com/lodash-es@4.17.21/"
    }
  }
</script>
<script type="module">
  import React from 'react'; // Browser looks up 'react' in the map
  import { render } from 'react-dom'; // Browser looks up 'react-dom'
  import { debounce } from 'lodash/debounce'; // Browser uses the 'lodash/' prefix mapping
  // ...
</script>
```

If no import map is given, standard browser-relative paths or URLs are used.

## Binary data

- Blob: read-only container for binary.
- Array-Buffer: editable container for binary. `const response = await fetch("alf.png"); const buffer = await response.arrayBuffer();`
- TypedArray: Adds type-information to a buffer. `const arr = new Uint8Array(buffer);`
