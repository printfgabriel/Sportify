import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

function fetchHomeArtists(tok) {
  const [items, setItems] = useState(null)
  const teste = null;

  useEffect(() => {
    async function getItems() {
      try {
        const { data } = await axios
        .get("https://v2.jokeapi.dev/joke/Any");
        setItems(data);

      } catch (error) {
        console.log("Ocorreu um erro ao buscar os items");

      }
    }
    // chama a func async
    getItems();

  }, []);

  console.log(items);

  if (items)
    return (
      <div>
        {items.setup} 
      </div>
    );
  else
    return (<div>NAO DEU</div>)
}

export default fetchHomeArtists;