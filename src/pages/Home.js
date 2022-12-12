import React from "react";
import axios from 'axios';
import { useEffect, useState } from 'react';
import "../App.css";
import "../head.css";
import Head from "../Header";
import { RadialChart, PolygonSeries, LabelSeries } from 'react-vis';




function MainPage() {

    const [token, setToken] = useState("")

    useEffect(() => {

        window.scrollTo(0, 0)
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

        const id_first = (data.items[0].id)
        fetchRecom(data.items[0].id + "%2C" + data.items[1].id);
    }

    const renderTop3Artists = () => {
        return artists.slice(0, 3).map(artist => (
            <div>
                <p className="showName">{artist.name}</p>
                {artist.images.length ? <a href={artist.external_urls.spotify} target="_blank"><img className="showImage" width={"40%"} src={artist.images[0].url} alt="" /></a> : <div>No Image</div>}
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
                <p> {artist.name}</p>
                {artist.album.images.length ? <a href={artist.external_urls.spotify} target="_blank"><img width={"40%"} src={artist.album.images[0].url} alt="" /></a> : <div>No Image</div>}
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

    const [totalAngle, setTA] = useState(0);;

    const sortDesc = (data) => {

        let result = data;
        let saveTotal = 0;

        for (let i = 0; i < result.length; i++) {
            for (let j = i + 1; j < result.length; j++) {
                if (result[j].angle > result[i].angle) {
                    let aux = result[i];
                    result[i] = result[j];
                    result[j] = aux;
                }
            }

            saveTotal += result[i].angle;
        }

        setTA(saveTotal);

        // return (result.slice(0, 5));
        return data;
    }

    // F -- CALCULAR GENEROS




    // I -- FAZER GRÁFICOS

    const renderChart = () => {


        return generos.slice(0, 3).map(genre => (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <RadialChart
                    className={'grafico'}
                    innerRadius={90}
                    radius={130}
                    getAngle={d => d.theta}
                    data={[{ theta: genre.angle, color: '#1ed760' }, { theta: (totalAngle - genre.angle), color: '#0000001f' }]}
                    width={300}
                    height={300}
                    padAngle={0.04}
                    colorType="literal"
                    center={{ x: 0, y: 0 }}

                />
                <div style={{
                    position: 'absolute',
                    padding: '5px',
                    'font-size': '20px',
                }}>
                    {genre.label.toUpperCase()}
                </div>
            </div>
        ))

    }
    // F -- FAZER GRÁFICOS


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
        seed += id_seed + '&max_popularity=35&min_popularity=20';
        get += seed;
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


        try { } catch (err) { console.log(err) }

        setRec(data.data.tracks);
        console.log(data.data.tracks[0].external_urls.spotify)
    }

    const renderRecommendations = () => {
        return recommendations.slice(0, 5).map(artist => (
            // <div className="recomendacoes">
            <article>
                <p className="showName">{artist.name}</p>
                {artist.album.images.length ? <a href={artist.external_urls.spotify} target="_blank"><img className="showImage" src={artist.album.images[0].url} alt="" /></a> : <div>No Image</div>}
            </article>
            // </div>
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
                <p className="textinho">Estes foram seus gêneros mais ouvidos este mês:</p>
                <div className={"containerRecomendacoes"} >
                    {renderChart()}
                </div>



                <br />
                <h2>Recomendações</h2>
                <p className="textinho">Aqui estão algumas recomendações para você curtir no próximo mês:</p>
                <div className="containerRecomendacoes">
                    {renderRecommendations()}
                </div>



            </main>

        </div >
    )

}

export default MainPage;