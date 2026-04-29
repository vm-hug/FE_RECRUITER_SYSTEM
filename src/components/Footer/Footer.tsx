import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">CareerFlow</div>
        <div className="footer__copyright">
          © 2024 CareerFlow Inc. All rights reserved.
        </div>
        <nav className="footer__links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Contact Us</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
