function About() {
  return (
    <main>
      <section>
        <h1 className="page-title">About This Project</h1>

        <p className="page-content">
          The Ground Shakes is a real-time earthquake visualization tool
          powered by USGS seismic data. Earthquakes are synced to a secure
          backend, normalized, and displayed on an interactive map with
          detailed information popups.
        </p>

        <p className="page-content">
          You can explore recent seismic activity, view detailed earthquake
          information, and save important events for later review.
        </p>

        <p className="page-content">
          This project combines a modern React frontend, a Node and Express
          backend, MongoDB storage, and an earthy modern design system with
          optional dark mode support.
        </p>
      </section>
    </main>
  );
}

export default About;