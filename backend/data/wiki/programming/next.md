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
    - [id].tsx   (doesn't have to say `id`, could be anything, like `slug`)
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



## Magic methods
- `generateStaticParams`: if you have a `src/[slug]/page.tsx` or a `src/[id].tsx` or such, those are pages that are created dynamically.
  - That means that they cannot be SSG'ed into static html at build-time.
  - To prevent that, return in this method a list of the possible values for `slug` (respectively `id`)
