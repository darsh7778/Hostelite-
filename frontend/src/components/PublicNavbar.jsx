import { useState, useEffect } from "react";
import "../styles/PublicNavbar.css";

export default function PublicNavbar({ onLoginClick, onContactClick }) {
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
    if (!element) return;

    const navbarHeight = 80; // adjust if needed
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - navbarHeight,
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  return (
    <nav className={`public-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => scrollToSection("hero")}>
        Hostelite
      </div>

      {/* DESKTOP MENU */}
      <ul className="nav-links">
        <li onClick={() => scrollToSection("about")}>About</li>
        <li onClick={() => scrollToSection("services")}>Services</li>
        <li onClick={() => scrollToSection("testimonials")}>Testimonials</li>
        <li onClick={() => scrollToSection("features")}>Features</li>
      </ul>

      {/* ACTIONS */}
      <div className="nav-actions">
        <button className="signin-btn desktop-only" onClick={onContactClick}>Contact</button>

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
          <p onClick={() => scrollToSection("about")}>About</p>
          <p onClick={() => scrollToSection("services")}>Services</p>
          <p onClick={() => scrollToSection("testimonials")}>Testimonials</p>
          <p onClick={() => scrollToSection("features")}>Features</p>
          <p onClick={onContactClick}>Contact</p>

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
