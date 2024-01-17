import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Link, json, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Await } from "@remix-run/react";
import { defer } from "@remix-run/cloudflare";
// export const meta: MetaFunction = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

// export interface Env {
//   // If you set another name in wrangler.toml as the value for 'binding',
//   // replace "DB" with the variable name you defined.
//   DB: D1Database;
// }

interface Footballer {
  PlayerID: number;
  Name: string;
  Position: string;
  Nationality: string;
  DateOfBirth: Date;
  Club: string;
}

export async function loader({ context: { env } }: LoaderFunctionArgs) {
  const data = env.DB.prepare(
    "SELECT * FROM Footballers  ORDER BY RANDOM() LIMIT 10"
  ).all();

  return defer({ data });
}
export default function Home() {
  let { data } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Seventh Heaven</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data}>
          {(data) => (
            <ul>
              {data.results.map((player) => (
                <li key={player.PlayerID}>
                  <Link to={`/player/${player.PlayerID}`}>{player.Name}</Link>
                </li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </>
  );
}
