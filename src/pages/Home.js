import React from "react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import "../App.css";
import "../head.css";
import Head from "../Header";
import { RadialChart } from 'react-vis';




function MainPage() {

    const [token, setToken] = useState("")

    useEffect(() => {

        const hash = window.location.hash
        let tok = window.localStorage.getItem("token")

        if (hash) {
            tok = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", tok)
        }

        setToken(tok)
    }, [])

    useEffect(() => {
        searchArtistsHome();
        searchTopTracks();
    }, [token])



    // I -- MOSTRA TODAS SUAS PLAYLISTS
    const [playlists, setPlaylists] = useState([])

    const searchPlaylists = async (e) => {
        // e.preventDefault()
        const { data } = await axios
            .get(
                'https://api.spotify.com/v1/me/playlists', {
                params: { offset: 0 },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            })

        setPlaylists(data.items)
        // try { console.log(data) } catch (error) { console.log(error); }
    }

    const renderPlaylists = () => {
        return playlists.map(playlist => (
            <article>
                <p className="showName">{playlist.name}</p>
                {playlist.images.length ? <img className="showImage" width={"40%"} src={playlist.images[0].url} alt="" /> : <div>No Image</div>}
            </article>
        ))
    }
    // F -- MOSTRA TODAS SUAS PLAYLISTS


    // I -- MOSTRA TOP 3 ARTISTAS
    const [artists, setArtists] = useState([])

    const searchArtistsHome = async (e) => {
        // e.preventDefault()

        const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
            }
        })
        setArtists(data.items);
        generosCalc(data.items);
        // console.log(data.items)
        const id_first = (data.items[0].id)
        fetchRecom(data.items[0].id+"%2C"+data.items[1].id);
    }

    const renderTop3Artists = () => {
        return artists.slice(0, 3).map(artist => (
            <div>
                <p className="showName">{artist.name}</p>
                {artist.images.length ? <img className="showImage" width={"40%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
            </div>
        ))
    }

    const [tracks, setTracks] = useState([])

    const searchTopTracks = async (e) => {
        // e.preventDefault()

        const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks/?time_range=short_term", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                limit: 3
            }
        })

        setTracks(data.items);
    }

    const renderTopTracks = () => {
        return tracks.map(artist => (
            <div>
                <p className="showName">  {artist.name}</p>
                {artist.album.images.length ? <img className="showImage" width={"40%"} src={artist.album.images[0].url} alt="" /> : <div>No Image</div>}
            </div>
        ))
    }


    const renderTopHome = () => {
        return (
            <div className="topHome">
                {renderTop3Artists()}
                {renderTopTracks()}
            </div>
        )
    }
    // F -- MOSTRA TOP 3 ARTISTAS

    // I -- CALCULAR GENEROS

    const [generos, setGeneros] = useState([]);

    const auxGeneros = []

    const generosCalc = async (data) => {

        var existe = false;

        try {

            for (let artist of data) {
                auxGeneros.forEach((nameGenre, index) => {
                    if (nameGenre.label === artist.genres[0]) {
                        auxGeneros[index].angle++;
                        existe = true;
                    }
                });

                if (!existe) {
                    auxGeneros.push({
                        label: artist.genres[0],
                        angle: 1
                    });
                }
                existe = false;

            }
        } catch (err) { console.log("seguinte --> " + err) }

        const opa = sortDesc(auxGeneros);



        for (let i = 0; i < 6; i++) {
            setGeneros(prevMsgs => [...prevMsgs, opa[i]])
        }

        let outros = opa.length - 5;

        if (outros > 0) {
            setGeneros(prevMsgs => [...prevMsgs, {
                label: "Outros",
                angle: outros
            }])
        }
        // setGeneros(auxGeneros)
        return;

    }

    const sortDesc = (data) => {

        let result = data;

        for (let i = 0; i < result.length; i++) {
            for (let j = i + 1; j < result.length; j++) {

                if (result[j].angle > result[i].angle) {
                    let aux = result[i];
                    result[i] = result[j];
                    result[j] = aux;
                }
            }
        }


        // return (result.slice(0, 5));
        return data;
    }

    const renderChart = () => {

        return (
            <div className="centralizar">
                {/* {genero.label} {genero.angle} */}
                <RadialChart animation data={generos} width={300} height={300} showLabels={true} />
            </div>
        )

    }
    // F -- CALCULAR GENEROS

    // I -- PEGAR RECOMENDAÇÕES

    let id_tate = "45dkTj5sMRSjrmBSBeiHym"
    let genre_tate = "pop"
    let ybmf = "45bE4HXI0AwGZXfZtMp8JR"

    const [recommendations, setRec] = useState([]);

    // get + seed_genres -- WORKING
    let seed = '&seed_artists=';
    // seed +=  '45dkTj5sMRSjrmBSBeiHym' + '&max_popularity=50';
    // artists[0].id
    // .slice(0, 3).map(rec => (

    let get = 'https://api.spotify.com/v1/recommendations?limit=15';
    // get += pop;
    // get += seed;

    const fetchRecom = async (id_seed) => {
        seed += id_seed + '&max_popularity=30';
        get += seed;
        console.log(get);
        console.log("START fetching rec")
        const data = await axios
            .get(
                get, {
                params: {
                    // "seed_artists": id_tate,
                    // seed_genres: [
                    //     'pop',
                    //     'rock'
                    // ],
                    // "seed_tracks" : ybmf 

                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            })


        try { console.log(data.data.tracks) } catch (err) { console.log(err) }

        setRec(data.data.tracks);
    }

    const renderRecommendations = () => {
        return recommendations.slice(0, 5).map(artist => (
            <div class="recomendacoes">
                <p className="showName">{artist.name}</p>
                {artist.album.images.length ? <img className="showImage" width={"40%"} src={artist.album.images[0].url} alt="" /> : <div>No Image</div>}
            </div>
        ))
    }


    // F -- PEGAR RECOMENDAÇÕES



    return (
        <div className="App">

            <Head />

            <main className="corpo">

                <h2>Resumo do Mês</h2>
                <br />
                <div className="showContainer">
                    {renderTopHome()}
                </div>


                <h2>Estatísticas</h2>
                {renderChart()}

                <br />
                <h2>Recomendações</h2>
                <div class="containerRecomendacoes">
                    {renderRecommendations()}
                </div>
                <br /><br /><br /><br />aaaa<br />          <br />https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations


            </main>

        </div >
    )

}

export default MainPage;