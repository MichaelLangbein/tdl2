# Nextjs

## Useful components

- `Link`: in production build, code for all pages with a `Link` is being pre-fetched.
- `Image`: only loads image when entering viewport, optimizes image, ensures responsiveness for different screen sizes. Works with externally hosted images, too.
  - avoid layout shift
  - happens on-demand, not on-compile
- `Header`:

## Routing

- app
  - posts
    - page.tsx
    - loading.tsx
    - not-found.tsx
    - [id].tsx
  - layout.tsx

Route using the `Link` component

## Server- vs client-components

- Default: server-side
- Start file with `"use client";` -> becomes client side
- Start function with `"use server";` -> executed on server
  - common for server-actions

## Server-actions

- `form.action={onSubmit}` instead of `form.onSubmit(e => e.preventDefault; ...)`
- `onSubmit = async (formData) => { "use server"; await someServerAction(); revalidatePath("/posts"); }`
