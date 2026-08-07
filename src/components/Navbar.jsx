import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          The Ground Shakes
        </div>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>

          <Link to="/About" className="navbar-link">
            About
          </Link>

          <Link to="/Favorites" className="navbar-link">
            Favorites
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;