import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.js"
import Home from "./pages/Home.js"
import TopArtists from "./pages/TopArtists"
import TopMusics from "./pages/TopMusics"
import Statistics from './pages/statistics';
import Short from './pages/topartistas/ShortA';
import MediumA from './pages/topartistas/MediumA';
import LongA from './pages/topartistas/LongA';
import ShortM from './pages/topmusics/ShortM';
import MediumM from './pages/topmusics/MediumM';
import LongM from './pages/topmusics/LongM';

function App() {


  
  return (
    <div>
      <div></div>
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />

          <Route path="/topartists" element={<TopArtists />} />
          <Route path="/topartists/short" element={<Short />} />
          <Route path="/topartists/medium" element={<MediumA />} />
          <Route path="/topartists/long" element={<LongA />} />
          
          <Route path="/topmusics" element={<TopMusics />} />
          <Route path="/topmusics/short" element={<ShortM />} />
          <Route path="/topmusics/medium" element={<MediumM />} />
          <Route path="/topmusics/long" element={<LongM />} />

          <Route path="/statistics" element={<Statistics />} />

        </Routes>
    </Router>
    </div>
  );
}

export default App;
