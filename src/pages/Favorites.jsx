import { useFavorites } from "../hooks/useFavorites";

function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorites saved yet. Click a marker on the map and check the Favorite box to save one.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {favorites.map((quake) => {
            const id = quake._id || quake.usgsId;
            const place = quake.properties?.place || quake.place || "Earthquake";
            const magnitude = quake.magnitude ?? quake.properties?.mag ?? quake.mag ?? "N/A";

            return (
              <div
                key={id}
                style={{
                  padding: "14px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  background: "#f9f9f9",
                  fontSize: "14px",
                  lineHeight: "1.8",
                }}
              >
                {/* Header: place + remove button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "15px" }}>{place}</strong>
                  <button
                    onClick={() => toggleFavorite(quake)}
                    style={{
                      background: "none",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                      padding: "2px 8px",
                      fontSize: "12px",
                      color: "#c00",
                    }}
                  >
                    Remove
                  </button>
                </div>

                {/* Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 16px" }}>
                  <div><span style={{ color: "#555" }}>Magnitude:</span> <strong>{magnitude}</strong></div>
                  <div><span style={{ color: "#555" }}>Depth:</span> {quake.depth != null ? `${quake.depth} km` : "N/A"}</div>
                  <div><span style={{ color: "#555" }}>Lat:</span> {quake.lat ?? "N/A"}</div>
                  <div><span style={{ color: "#555" }}>Lon:</span> {quake.lon ?? quake.lng ?? "N/A"}</div>
                  {quake.time && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <span style={{ color: "#555" }}>Time:</span> {new Date(quake.time).toLocaleString()}
                    </div>
                  )}
                  {quake.url && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <a href={quake.url} target="_blank" rel="noreferrer" style={{ color: "#1a73e8" }}>
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
