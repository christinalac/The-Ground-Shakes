import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="nav-button">
        Home
      </Link>

      <Link to="/About" className="nav-button">
        About
      </Link>

      <Link to="/Favorites" className="nav-button">
        Favorites
      </Link>

    </nav>
  );
}

export default Navbar;
