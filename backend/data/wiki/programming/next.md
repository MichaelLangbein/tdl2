# Nextjs

## Useful components

-   `Link`: in production build, code for all pages with a `Link` is being pre-fetched.
-   `Image`: only loads image when entering viewport, optimizes image, ensures responsiveness for different screen sizes. Works with externally hosted images, too.
    -   avoid layout shift
    -   happens on-demand, not on-compile
-   `Header`:

## Fonts

-   Next has its own library of google fonts, which it adds to your public assets
-   Fonts are usually imported, configured and re-exported in `app/ui/fonts.ts`
-   They are then added to the body `<body className="${myFont.className}">`

## Routing

Some background: it used to be that nextjs used the `pages-router` instead of the app-router.
Back then instead of the app-dir, there was a pages dir.

-   app (this name is required)
    -   posts (any name, any nesting ... folders in (parenthesis) won't show up as part of route)
        -   page.tsx (this name is required to make this a page)
        -   loading.tsx
        -   not-found.tsx
        -   [id].tsx (doesn't have to say `id`, could be anything, like `slug`)
    -   layout.tsx
    -   components: (not public)
        -   any comps.tsx

Layouts: there can be at most one layout.tsx per directory. layouts must always have the `children` property. layouts won't be re-rendered on navigation.

Route using the `Link` component

Routing functions:

-   `redirect from next/navigation`
    -   Works both in server-side- and client-side-code.
-   `revalidatePath from next/navigation`

-   `generateStaticParams`: if you have a `src/[slug]/page.tsx` or a `src/[id].tsx` or such, those are pages that are created dynamically.
    -   That means that they cannot be SSG'ed into static html at build-time.
    -   To prevent that, return in this method a list of the possible values for `slug` (respectively `id`)

## Server- vs client-components

-   Default: server-side
    -   cannot listen to events
    -   cannot access browser-api's (localstore, webgl, ...)
    -   cannot maintain state
    -   cannot use effects (or any hooks)
    -   _can_ use async/await, which avoids the need for many useState or useEffect hooks.
-   Start file with `"use client";` -> becomes client side
-   Start function with `"use server";` -> executed on server
    -   common for server-actions

## Forms and server-actions

https://www.youtube.com/watch?v=O94ESaJtHtM
https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms

-   `form.action={onSubmit}` instead of `form.onSubmit(e => e.preventDefault; ...)` (JS) and instead of `form.action="someUrl"` (PHP)
-   `onSubmit = async (formData: FormData) => { "use server"; await someServerAction(); revalidatePath("/posts"); }`

```tsx
import { revalidatePath } from "next/cache";

const data = { body: "" };

export default function Jokes() {
    async function onSubmit(formdata: FormData) {
        "use server";
        data.body = formdata.get("body")!.toString();
        revalidatePath("jokes");
    }

    return (
        <>
            <h1>Jokes will be listed here</h1>

            {data.body && <div>Body already given: {data.body}</div>}

            <form action={onSubmit}>
                <input type="text" name="body" />
                <button type="submit">OK</button>
            </form>
        </>
    );
}
```

### Forms, more expansive:

page.tsx

```tsx
import { getJokes } from "../server/actions";
import AddJokeForm from "./AddJokeForm";

export default async function Jokes() {
    const jokes = await getJokes();

    return (
        <>
            <h1>Add new joke</h1>
            <div>
                <AddJokeForm></AddJokeForm>
            </div>

            <h1>Jokes will be listed here</h1>
            <div>
                <ul>
                    {jokes.map((j) => (
                        <li key={j.body}>{j.body}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}
```

AddJokeForm.tsx

```tsx
import { addJoke } from "../server/actions";
import FormSubmitButton from "./FormSubmitButton";

export default function AddJokeForm() {
    return (
        <form action={addJoke}>
            <input type="text" name="body" />
            <FormSubmitButton></FormSubmitButton>
        </form>
    );
}
```

FormSubmitButton.tsx

```tsx
"use client";
import { useFormStatus } from "react-dom";

/**
 * useFormStatus is weird.
 *
 * It must be used in a child component of a form
 * (*not* in the same component),
 * and that form must use the `action` attribute,
 * and it must be a client-component.
 * Talk about a leaky abstraction.
 */

export default function FormSubmitButton() {
    const status = useFormStatus();
    return (
        <button type="submit" aria-disabled={status.pending}>
            {status.pending ? "... pending ..." : "OK"}
        </button>
    );
}
```

## Async components

Next allows `async` components. In standard react, here we'd have to use `useState` and `useEffect`; being able to `await` is a lot cleaner. This still happens on the server by default (but can be made to `"use client"`?).

```ts
const UserPage = async () => {
    const res = await fetch("myapi/users");
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

-   avoids an extra round-trip
-   fetch data is automatically cached server-side
    -   for this, nextjs has monkeypatched the `fetch` function.
    -   configure cache life time with: `fetch("myurl", { cache: "no-store" })` or `{next: {revalidate: 10}}`

### Suspense

Async components can be wrapped in `Suspense` to show a fallback while async data is still loading:

```tsx
<Suspense fallback={<RevenueChartSkeleton />}>
    <RevenueChart />
</Suspense>
```

## SSG

-   dev mode: everything dynamically generated
-   prod build: static pre-generation where possible.
    -   components that are discovered as not being SSG'able:
        -   any client side component
        -   any component that has `fetch("url", {cache: "no-store"})`
        -   any component calling a function that has `unstable_noStore()` (I think?)

## CSS Modules

Next supports css _modules_: any css file ending in `.module.css` is going to be applied **only** to the component where its imported.

## Assets

## Markdown

## Strapi

## URL-Params

-   `useSearchParams`- Allows you to access the parameters of the current URL. For example, the search params for this URL /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}.
-   On server, use the `searchParams` prop instead (passed by default to all server-side components)
-   `usePathname` - Lets you read the current URL's pathname. For example, for the route /dashboard/invoices, usePathname would return '/dashboard/invoices'.
-   `useRouter` - Enables navigation between routes within client components programmatically. There are multiple methods you can use.

## Auth

https://www.youtube.com/watch?v=w2h54xz6Ndw&t=427s
https://www.youtube.com/watch?v=DJvM2lSPn6w

Add authentication with six simple steps :S

1. `npm add next-auth`
2. create `.env` with secrets from your provider(s)
3. register provider with your app and create an endpoint for the provider to talk to your app:

    ```ts
    // src/app/api/auth/[...nextauth]/route.ts
    import NextAuth from "next-auth";
    import GitHubProvider from "next-auth/providers/github";
    export const authOptions = {
        providers: [
            GitHubProvider({
                clientId: process.env.GITHUB_ID ?? "",
                clientSecret: process.env.GITHUB_SECRET ?? "",
            }),
        ],
    };

    export const handler = NextAuth(authOptions);

    // to make this an api endpoint:
    export { handler as GET, handler as POST };
    ```

    This already creates a sign-in page at `myurl.com/api/auth/signin`.

4. use a session so that your app remembers that the user is authorized:
    ```ts
    // src/app/components/SessionProvider.tsx
    "use client"; // must be client-side because it uses context
    import { SessionProvider } from "next-auth/react";
    export default SessionProvider;
    ```
5. Define the area of your app that is uses a session:

    ```ts
    // src/app/layout.tsx
    import { getServerSession } from "next-auth";
    import SessionProvider from "./components/SessionProvider";

    export default async function RootLayout({ children }) {
        const session = await getServerSession();
        return (
            <html>
                <body>
                    // session is provided as a context here
                    <SessionProvider session={session}> children </SessionProvider>
                </body>
            </html>
        );
    }
    ```

6. Make use of that session:

    ```ts
    // src/app/components/MyComponent.tsx
    "use client";

    import { signIn, signOut, useSession } from "next-auth/react";

    export default function MyComponent(args) {
        // useSession: only works on client
        const { data: session } = useSession();

        if (session) {
            {
                session?.user?.name;
            }
            <button onClick={() => signOut()}>Sign out</button>;
        } else {
            return (
                <>
                    Not signed in. <button onClick={() => signIn()}>Sign in</button>
                </>
            );
        }
    }
    ```

More on `useSession` vs `getServerSession` vs `getSession` [here](https://stackoverflow.com/questions/77093615/difference-between-usesession-getsession-and-getserversession-in-next-auth/77094871#77094871).

### Protected routes

```ts
// src/app/protected/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function ProtectedRoute() {
  // getServerSession: only works on server, I think?
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }
  ...
}
```

## Security

## CRUD scaffolding
