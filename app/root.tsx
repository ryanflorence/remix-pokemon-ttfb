import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "./styles.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta = [
  { title: "Is this illegal?" },
  {
    name: "description",
    content:
      "Querying D1 and fully dynamic rendering at the edge with Remix and Cloudflare",
  },
];

export function loader() {
  return { datetime: new Date().toLocaleString() };
}

export default function App() {
  let { datetime } = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="flex min-h-screen flex-col items-center flex-start px-6 pt-6">
          <h1 className="text-3xl font-bold mb-3">Is this illegal?</h1>
          <p className="text-center">
            This page renders{" "}
            <code className="py-0.5 px-1 text-sm rounded-md border border-gray-300 bg-gray-100 dark:bg-[#444] dark:border-[#666]">
              SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12
            </code>{" "}
            from the edge, for every request.
          </p>
          <p className="mt-2">
            The time on the server is <em>{datetime}</em>.
          </p>
          <p className="mt-2 text-center">
            <a
              className="underline"
              href="https://github.com/ryanflorence/remix-cf-pokemon"
            >
              Source
            </a>
          </p>
          <Outlet />
        </main>

        <footer className="text-xs p-5 text-center text-gray-600">
          Images courtesy of{" "}
          <a
            className="underline"
            href="https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon"
          >
            PokeAPI
          </a>{" "}
          – Pokemon is © 1996-2023 Nintendo, Creatures, Inc., GAME FREAK
        </footer>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
