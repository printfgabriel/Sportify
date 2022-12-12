import React, { useEffect } from "react";
import { BrowserRouter as Link } from 'react-router-dom';
import Head from "../Header";


function TopArtists() {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (
        <div className="App">
            <Head />

            <main className="corpo">
                <div className="showOptions">
                    <h2>Escolha o período que deseja analisar:</h2>
                    <button><a href="/topartists/short">Mensal</a></button>
                    <button><a href="/topartists/medium">6 Meses</a></button>
                    {/* <button><a href="/short">AA</a></button> */}
                    <button><a href="/topartists/long">Todo Período</a></button>
                </div>
            </main>

        </div>
    )
}

export default TopArtists;

