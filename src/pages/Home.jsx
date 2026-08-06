import MapComponent from "../MapComponent";

function Home({ quakes, isLoading, errorMessage }) {
  return (
    <main>
      <section>
        <h1 className="page-title">The Ground Shakes</h1>

        <p className="page-content">
          Explore recent earthquake activity through an interactive seismic
          map powered by USGS data.
        </p>

        <section aria-label="Earthquake status" aria-live="polite">
          {isLoading ? (
            <p className="page-content">
              Loading earthquake data...
            </p>
          ) : (
            <p className="page-content">
              Number of earthquakes displayed: {quakes.length}
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
        />
      </section>
    </main>
  );
}

export default Home;