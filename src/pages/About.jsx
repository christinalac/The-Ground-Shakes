function About() {
  return (
    <div className="page-container">
      <h1 className="page-title">About This Project</h1>

      <p className="page-content">
        The Ground Shakes is a real‑time earthquake visualization tool powered
        by USGS seismic data. Earthquakes are synced to a secure backend,
        normalized, and displayed on an interactive map with detailed popups.
      </p>

      <p className="page-content">
        You can explore recent seismic activity, view detailed quake
        information, and save your favorite events for later review.
      </p>

      <p className="page-content">
        This project combines a modern React frontend, a Node/Express backend,
        MongoDB storage, and a clean earthy‑modern design system with optional
        dark mode.
      </p>
    </div>
  );
}

export default About;
