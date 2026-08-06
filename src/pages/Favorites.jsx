import { useFavorites } from "../hooks/useFavorites";

function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <main>
      <section>
        <h1 className="page-title">Favorite Earthquakes</h1>

        {favorites.length === 0 ? (
          <p className="page-content">
            No favorite earthquakes saved yet. Select an earthquake marker
            and choose the favorite option to save it here.
          </p>
        ) : (
          <ul className="favorites-list">
            {favorites.map((quake) => {
              const id = quake._id || quake.usgsId;

              const place =
                quake.properties?.place ||
                quake.place ||
                "Earthquake";

              const magnitude =
                quake.magnitude ??
                quake.properties?.mag ??
                quake.mag ??
                "N/A";

              return (
                <li key={id}>
                  <article className="favorite-card">
                    <header className="favorite-header">
                      <h2 className="favorite-title">{place}</h2>

                      <button
                        onClick={() => toggleFavorite(quake)}
                        className="favorite-remove-btn"
                        aria-label={`Remove ${place} from favorites`}
                      >
                        Remove
                      </button>
                    </header>

                    <dl className="favorite-grid">
                      <div>
                        <dt>Magnitude</dt>
                        <dd>{magnitude}</dd>
                      </div>

                      <div>
                        <dt>Depth</dt>
                        <dd>
                          {quake.depth != null
                            ? `${quake.depth} km`
                            : "N/A"}
                        </dd>
                      </div>

                      <div>
                        <dt>Latitude</dt>
                        <dd>{quake.lat ?? "N/A"}</dd>
                      </div>

                      <div>
                        <dt>Longitude</dt>
                        <dd>{quake.lon ?? quake.lng ?? "N/A"}</dd>
                      </div>

                      {quake.time && (
                        <div>
                          <dt>Time</dt>
                          <dd>
                            {new Date(quake.time).toLocaleString()}
                          </dd>
                        </div>
                      )}
                    </dl>

                    {quake.url && (
                      <a
                        href={quake.url}
                        target="_blank"
                        rel="noreferrer"
                        className="favorite-link"
                      >
                        View earthquake details on USGS
                      </a>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Favorites;