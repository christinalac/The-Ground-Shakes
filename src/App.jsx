import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import MapComponent from "./MapComponent";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Favorites" element={<Favorites />} />
        </Routes>

        <div style={{ padding: "20px" }}>
          <h2>Map</h2>
          <MapComponent />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
