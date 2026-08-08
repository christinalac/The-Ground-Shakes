import { useState } from "react";
import MapComponent from "../MapComponent";

function Home({ quakes, isLoading, errorMessage }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Quakes whose place field matches the search term (case-insensitive)
  const matchedQuakes = searchTerm.trim()
    ? quakes.filter((q) => {
        const place = q.properties?.place || q.place || "";
        return place.toLowerCase().includes(searchTerm.trim().toLowerCase());
      })
    : [];

  const hasSearch = searchTerm.trim().length > 0;

  return (
    <main>
      <section>
        <h1 className="page-title">The Ground Shakes</h1>

        <p className="page-content">
          Explore recent earthquake activity through an interactive seismic
          map powered by USGS data.
        </p>

        {/* Search bar */}
        <div className="search-bar">
          <label htmlFor="quake-search" className="search-label">
            Search by location
          </label>
          <div className="search-input-row">
            <input
              id="quake-search"
              type="search"
              className="search-input"
              placeholder="e.g. Hawaii, Europe, China, Alaska..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search earthquakes by location"
            />
            {hasSearch && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Result count */}
          {hasSearch && (
            <p className="search-results-count" role="status" aria-live="polite">
              {matchedQuakes.length > 0
                ? `${matchedQuakes.length} earthquake${matchedQuakes.length !== 1 ? "s" : ""} found in "${searchTerm}"`
                : `No earthquakes found matching "${searchTerm}"`}
            </p>
          )}
        </div>

        {/* Earthquake count / loading / error */}
        <section aria-label="Earthquake status" aria-live="polite">
          {isLoading ? (
            <p className="page-content">Loading earthquake data...</p>
          ) : (
            <p className="page-content">
              Total earthquakes loaded: {quakes.length}
            </p>
          )}
          {errorMessage && (
            <p className="page-error" role="alert">
              {errorMessage}
            </p>
          )}
        </section>

        <MapComponent
          quakes={quakes}
          isLoading={isLoading}
          errorMessage={errorMessage}
          searchTerm={searchTerm}
          matchedQuakes={matchedQuakes}
        />
      </section>
    </main>
  );
}

export default Home;
