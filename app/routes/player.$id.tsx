import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const players = await context.env.DB.prepare(
    "SELECT * FROM Footballers WHERE PlayerID = ?1"
  )
    .bind(params.id)
    .all();
  console.log(players.results, "from players route");

  if (!players) throw new Response("", { status: 400 });

  return json(players);
}
export default function PlayerInfo() {
  const players = useLoaderData<typeof loader>();

  return (
    <>
      {players.results.map((player) => (
        <>
          <h1>{player.Name}</h1>
          <p>{player.Position}</p>
          <p>{player.Club}</p>
        </>
      ))}
    </>
  );
}
