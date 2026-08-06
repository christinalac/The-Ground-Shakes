function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} The Ground Shakes. Earthquake data
          provided by USGS.
        </p>

        <a
          href="https://www.usgs.gov/"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          Visit USGS
        </a>
      </div>
    </footer>
  );
}

export default Footer;