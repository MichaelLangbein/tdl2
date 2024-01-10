# Nextjs

## Useful components

- `Link`: in production build, code for all pages with a `Link` is being pre-fetched.
- `Image`: only loads image when entering viewport, optimizes image, ensures responsiveness for different screen sizes. Works with externally hosted images, too.
  - avoid layout shift
  - happens on-demand, not on-compile
- `Header`:
