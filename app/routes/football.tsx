import type { MetaFunction } from "@remix-run/cloudflare";
import { json, useLoaderData } from "@remix-run/react";

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

export async function loader({ context: { env } }) {
  let data = await env.DB.prepare("SELECT * FROM Footballers").all();
  console.log(data.results[0], "data from server");

  return { data };
}
export default function Home() {
  let players = useLoaderData();
  console.log(players, "in the browser");

  // if (!players.results) throw new Response(null, { status: 404 });
  return (
    <>
      <h1>Seventh Heaven</h1>
      {players &&
        players.data.results.map((player) => (
          <p key={player.PlayerID}>{player.Name}</p>
        ))}
    </>
  );
}
