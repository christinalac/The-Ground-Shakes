import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Earthquake Data
  const [quakes, setQuakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchQuakes() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch("/api/quakes", {
          headers: {
            Authorization: "Bearer test-token",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch earthquake data");
        }

        const data = await response.json();
        setQuakes(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuakes();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="page-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  quakes={quakes}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                />
              }
            />

            <Route path="/about" element={<About />} />

            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
