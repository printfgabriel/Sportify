import React, { useEffect } from "react";
import Head from "../Header";
import { BrowserRouter as Link } from 'react-router-dom';



function TopArtists() {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])


    return (
        <div className="App">
            <Head />

            <main className="corpo">
                <div className="showOptions">
                    <h2>Escolha o período que deseja analisar seu Top Músicas:</h2>
                    <button><a href="/topmusics/short">Mensal</a></button>
                    <button><a href="/topmusics/medium">6 Meses</a></button>
                    <button><a href="/topmusics/long">Todo Período</a></button>
                </div>
            </main>


        </div>
    )
}

export default TopArtists;

