import { useState, useEffect } from "react";
import "../styles/PublicNavbar.css";

export default function PublicNavbar({
  onLoginClick,
  onAboutClick,
  onServicesClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`public-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => scrollToSection("hero")}>Hostelite</div>

      {/* DESKTOP MENU */}
      <ul className="nav-links">
        <li onClick={() => scrollToSection("about")}>About</li>
        <li onClick={() => scrollToSection("facilities-carousel")}>Facilities</li>
        <li onClick={() => scrollToSection("services")}>Services</li>
        <li onClick={() => scrollToSection("testimonials")}>Testimonials</li>
        <li onClick={() => scrollToSection("services")}>Features</li>
        <li onClick={() => scrollToSection("about")}>Support</li>
      </ul>

      {/* SEARCH AND ACTIONS */}
      <div className="nav-actions">
        <button className="contact-btn">Contact</button>
        <button className="signin-btn desktop-only" onClick={onLoginClick}>
          Sign In
        </button>
      </div>

      {/* HAMBURGER */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <p
            onClick={() => {
              scrollToSection("about");
              setMenuOpen(false);
            }}
          >
            About
          </p>
          <p
            onClick={() => {
              scrollToSection("facilities-carousel");
              setMenuOpen(false);
            }}
          >
            Facilities
          </p>
          <p
            onClick={() => {
              scrollToSection("services");
              setMenuOpen(false);
            }}
          >
            Services
          </p>
          <p
            onClick={() => {
              scrollToSection("testimonials");
              setMenuOpen(false);
            }}
          >
            Testimonials
          </p>
          <p
            onClick={() => {
              scrollToSection("services");
              setMenuOpen(false);
            }}
          >
            Features
          </p>
          <p
            onClick={() => {
              scrollToSection("about");
              setMenuOpen(false);
            }}
          >
            Support
          </p>
          <p
            onClick={() => {
              setMenuOpen(false);
              // Open contact modal or scroll to contact section
            }}
          >
            Contact
          </p>
          <button
            className="signin-btn"
            onClick={() => {
              onLoginClick();
              setMenuOpen(false);
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}