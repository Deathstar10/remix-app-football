import { Form, Link, json, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export async function loader({ request, context }) {
  let q = new URL(request.url).searchParams.get("q");

  if (!q) return [];

  q = `${q.replace(/"/g, '""')}`;
  q = "%" + q + "%";

  const data = await context.env.DB.prepare(
    "SELECT * FROM Footballers WHERE Name LIKE ?1 LIMIT 5"
  )
    .bind(q)
    .all();
  console.log(data);

  return data.results;
}

export default function Search() {
  const search = useFetcher();
  // const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.select();
        }
        console.log("open search ");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <search.Form action="/search" method="get">
      <input
        type="search"
        name="q"
        ref={inputRef}
        placeholder="Enter a name"
        onChange={(e) => {
          search.submit(e.currentTarget.form);
        }}
      />
      <ul>
        {search.data &&
          search.data.map((player) => (
            <li key={player.PlayerID}>
              {" "}
              <Link to={`player/${player.PlayerID}`}>{player.Name}</Link>
            </li>
          ))}
      </ul>
    </search.Form>
  );
}
