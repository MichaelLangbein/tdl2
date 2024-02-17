# Nextjs

## Useful components

- `Link`: in production build, code for all pages with a `Link` is being pre-fetched.
- `Image`: only loads image when entering viewport, optimizes image, ensures responsiveness for different screen sizes. Works with externally hosted images, too.
  - avoid layout shift
  - happens on-demand, not on-compile
- `Header`:

## Routing

- app (this name is required)
  - posts (any name)
    - page.tsx (this name is required to make this a page)
    - loading.tsx
    - not-found.tsx
    - [id].tsx (doesn't have to say `id`, could be anything, like `slug`)
  - layout.tsx
  - components: (not public)
    - any comps.tsx

Route using the `Link` component

Routing functions:

- `redirect from next/navigation`
  - Works both in server-side- and client-side-code.
- `revalidatePath from next/navigation`

## Server- vs client-components

- Default: server-side
  - cannot listen to events
  - cannot access browser-api's (localstore, webgl, ...)
  - cannot maintain state
  - cannot use effects
- Start file with `"use client";` -> becomes client side
- Start function with `"use server";` -> executed on server
  - common for server-actions

## Server-actions

- `form.action={onSubmit}` instead of `form.onSubmit(e => e.preventDefault; ...)` (JS) and instead of `form.action="someUrl"` (PHP)
- `onSubmit = async (formData) => { "use server"; await someServerAction(); revalidatePath("/posts"); }`

## Async components

Next allows `async` components. In standard react, here we'd have to use `useState` and `useEffect`; being able to `await` is a lot cleaner. This still happens on the server by default (but can be made to `"use client"`?).

```ts
const UserPage = async () => {
  const res = await fetch('myapi/users');
  const users = await res.json();
  return (
    <>
      <h2> Users </h2>
      {users.map((user) => (
        <div>{user.name}</div>
      ))}
    </>
  );
};
```

Fetches should be made server-side when possible:

- avoids an extra round-trip
- fetch data is automatically cached server-side
  - for this, nextjs has monkeypatched the `fetch` function.
  - configure cache life time with: `fetch("myurl", { cache: "no-store" })` or `{next: {revalidate: 10}}`

## Magic methods

- `generateStaticParams`: if you have a `src/[slug]/page.tsx` or a `src/[id].tsx` or such, those are pages that are created dynamically.
  - That means that they cannot be SSG'ed into static html at build-time.
  - To prevent that, return in this method a list of the possible values for `slug` (respectively `id`)

## SSG

- dev mode: everything dynamically generated
- prod build: static pre-generation where possible.
  - components that are discovered as not being SSG'able:
    - any client side component
    - any component that has `fetch("url", {cache: "no-store"})`

## CSS Modules

Next supports css _modules_: any css file ending in `.module.css` is going to be applied **only** to the component where its imported.

## Search

## Auth

## Security

## CRUD scaffolding
