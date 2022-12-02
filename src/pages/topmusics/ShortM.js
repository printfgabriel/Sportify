import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "../../Header";
import "../../App.css"

function ShortM() {
    const [token, setToken] = useState("")

    useEffect(() => {

        const hash = window.location.hash
        let tok = window.localStorage.getItem("token")

        if (!token && hash) {
            tok = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", tok)
        }

        setToken(tok)

    }, [])

    useEffect(() => {
        console.log("CHAMANDO API")
        searchArtists();
    }, [token])

    const [artists, setArtists] = useState([])

    const searchArtists = async (e) => {
        // e.preventDefault()

        const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks/?time_range=short_term", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                limit: 21
            }
        })

        console.log(data.items)
        console.log(data.items[0].album)
        setArtists(data.items)
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <article>
                <p className="showName">{artists.indexOf(artist)+1}.  {artist.name}</p>
                {artist.album.images.length ? <img className="showImage" width={"40%"} src={artist.album.images[0].url} alt="" /> : <div>No Image</div>}
            </article>
        ))
    }

    return (
        <div className="App">
            <Head />

            <main className="corpo">
                <h2>Top Músicas do Mês</h2>
                <div className="showContainer">
                    {renderArtists()}
                </div>
            </main>

        </div>
    )
}

export default ShortM;