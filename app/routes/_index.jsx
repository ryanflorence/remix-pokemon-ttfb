import { defer } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import { PokemonList, Pokemon } from "../components.jsx";
import { Loading } from "../loading.jsx";

export async function loader({ context: { sql } }) {
  let query = sql`SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 12`;
  return defer({ query });
}

export default function Home() {
  let { query } = useLoaderData();

  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={query}>
        {query => (
          <PokemonList>
            {query.results.map(p => (
              <Pokemon key={p.id} id={p.id} name={p.name} />
            ))}
          </PokemonList>
        )}
      </Await>
    </Suspense>
  );
}
