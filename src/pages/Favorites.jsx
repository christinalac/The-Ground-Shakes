import { useFavorites } from "../hooks/useFavorites";

function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="page-container">
      <h1 className="page-title">Favorites</h1>

      {favorites.length === 0 ? (
        <p className="page-content">
          No favorites saved yet. Click a marker on the map and check the Favorite box to save one.
        </p>
      ) : (
        <div className="favorites-list">
          {favorites.map((quake) => {
            const id = quake._id || quake.usgsId;
            const place = quake.properties?.place || quake.place || "Earthquake";
            const magnitude =
              quake.magnitude ??
              quake.properties?.mag ??
              quake.mag ??
              "N/A";

            return (
              <div key={id} className="favorite-card">
                <div className="favorite-header">
                  <strong className="favorite-title">{place}</strong>
                  <button
                    className="favorite-remove-btn"
                    onClick={() => toggleFavorite(quake)}
                  >
                    Remove
                  </button>
                </div>

                <div className="favorite-grid">
                  <div>
                    <span className="favorite-label">Magnitude:</span>{" "}
                    <strong>{magnitude}</strong>
                  </div>
                  <div>
                    <span className="favorite-label">Depth:</span>{" "}
                    {quake.depth != null ? `${quake.depth} km` : "N/A"}
                  </div>
                  <div>
                    <span className="favorite-label">Lat:</span>{" "}
                    {quake.lat ?? "N/A"}
                  </div>
                  <div>
                    <span className="favorite-label">Lon:</span>{" "}
                    {quake.lon ?? quake.lng ?? "N/A"}
                  </div>

                  {quake.time && (
                    <div className="favorite-full">
                      <span className="favorite-label">Time:</span>{" "}
                      {new Date(quake.time).toLocaleString()}
                    </div>
                  )}

                  {quake.url && (
                    <div className="favorite-full">
                      <a
                        href={quake.url}
                        target="_blank"
                        rel="noreferrer"
                        className="favorite-link"
                      >
                        View on USGS →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favorites;
