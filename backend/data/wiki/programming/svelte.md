# Svelte

## Init

With vite:
```bash
    npm init vite my-app -- --template svelte
```

With svelte-kit:
```bash
    npm init svelte my-app
```

## HTML syntax

```jsx
// escaping html
<p>This is raw html without escaping: {@html someText}</p>


// conditions
<button>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>


// events
<button on:click={incrementCount}>

// event modifiers:
<button on:click|once={handleClick}>
	Click me
</button>
// `preventDefault` — calls event.preventDefault() before running the handler. Useful for client-side form handling, for example.
// `stopPropagation` — calls event.stopPropagation(), preventing the event reaching the next element
// `passive` — improves scrolling performance on touch/wheel events (Svelte will add it automatically where it's safe to do so)
// `nonpassive` — explicitly set passive: false
// `capture` — fires the handler during the capture phase instead of the bubbling phase
// `once` — remove the handler after the first time it runs
// `self` — only trigger handler if event.target is the element itself
// `trusted` — only trigger handler if event.isTrusted is true. I.e. if the event is triggered by a user action.


// logic
// A `#` character always indicates a block opening tag. 
// A `/` character always indicates a block closing tag. 
// A `:` character, as in {:else}, indicates a block continuation tag.
{#if x > 10}
	<p>{x} is greater than 10</p>
{:else if 5 > x}
	<p>{x} is less than 5</p>
{:else}
	<p>{x} is between 5 and 10</p>
{/if}


// looping
{#each cats as cat, i (cat.id)}  // (cat.id) adds a key to the list items (very much like react)
	<li><a target="_blank" href="https://www.youtube.com/watch?v={cat.id}">
		{i + 1}: {cat.name}
	</a></li>
{/each}


// promises
{#await promise}
	<p>...waiting</p>
{:then number}
	<p>The number is {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

```


## Scripts

- `<script>`
    - Content of this script will be compiled into the component-class.
    - Will be executed any time a component-instance is initialized.
- `<script context="module">` 
    - Context of this script will be compiled into the head of the file that contains the component-class.
    - Will be executed once when the file is imported.


## Nesting components 
```js
<script>
    import Nested from './Nested.svelte';
</script>

<p>This is a paragraph.</p>
<Nested/>
```

Setting values from outside as component attributes or as content.

Component:
```js
<script>export let name;</script>
<h1>Hello, {name}!</h1>
<div>
    <slot></slot>
</div>
```
Parent:
```js
<script>
    import ChildComponent from 'ChildComponent.svelte';
</script>
<ChildComponent name='Michael'>
    <p>That's my name</p>
</ChildComponent>
```

## Bindings

- `on:<event-type>|preventDefault={}`: event binding
- `bind:<input-attribute>={value}`: form two-way binding

Bind can have min- and max-values:
```html
<input type=number bind:value={a} min=0 max=10>
```


## Reactivity

Any `let` variable in `script` is component-state that causes the markup to be re-drawn.

```js
<script>
	let count = 0;
	function incrementCount() {
        count += 1;  // no return statement! This is a side-effect!
	}
</script>

<button on:click={incrementCount}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
```

Any `$:` variable depends reactively on component-state.
```js
<script>
	let count = 0;
	$: doubled = count * 2;

	function handleClick() {
		count += 1;
	}
</script>

<button on:click={handleClick}>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
Doubled: {doubled}
```

Statements, too, can be reactive: 
```
$: console.log('the count is ' + count);
$: if (count >= 10) {
	alert('count is dangerously high!');
	count = 9;
}
```

Svelte's reactivity is triggered by assignments. Methods that *mutate* arrays or objects will not trigger updates by themselves.

But: assignments to properties of objects *will*.

But but: assignements to proprties of properties of objects *won't*.

A simple rule of thumb: **the updated variable must directly appear on the left hand side of the assignment**.

```js

let numbers = [1, 2, 3];

// doesn't work because mutation, not assignment.
function addNumber() {
		numbers.push(numbers.length + 1);
}

// works because new assignment.
function addNumber() {
		numbers = [... numbers, numbers.length + 1];
}

// works because new assignment to property of object.
function addNumber() {
	numbers[numbers.length] = numbers.length + 1;
}

// doesn't work because assignment to property of property of object.
function quox(thing) {
	thing.foo.bar = 'baz';
}

```

## Directives



## Lifecycle
- `onMount`


## Stores
stores.js
```js
import { writable } from 'svelte/store';
export const count = writable(0);
```

App.svelte
```js
<script>
import {count} from 'stores.js';

$: storeValue = count.subscribe;

const increment = () => {
    count.update(n => n+1);
}
</script>

<p>value: {storeValue}</p>
<button on:click={increment}>increment</button>
```


## Forms 


## Svelte kit
Creates ssr pages from any component found in `src/routes`.
