import React from "react";
import "./head.css";
import "./App.css";
import { Link } from "react-router-dom";


function Head() {


    return(
        <header>

            <h1 id="logo"><Link to="/home">SPORTIFY</Link></h1>

            <div className="menu">
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/topartists">Top Artistas</Link></li>
                    <li><Link to="/topmusics">Top Músicas</Link></li>
                    <li><Link to="/statistics">Estatísticas</Link></li>
                </ul>
            </div>
        </header >
    );
}

export default Head;