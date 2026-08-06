import MapComponent from "../MapComponent";

function Home({ quakes, isLoading, errorMessage }) {
  return (
    <div className="page-container">
      <h1 className="page-title">The Ground Shakes</h1>

      {isLoading ? (
        <p className="page-content">Loading earthquakes...</p>
      ) : (
        <>
          <p className="page-content">
            Number of Earthquakes: {quakes.length}
          </p>

          {errorMessage && (
            <p className="page-error">{errorMessage}</p>
          )}
        </>
      )}

      <MapComponent
        quakes={quakes}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default Home;
