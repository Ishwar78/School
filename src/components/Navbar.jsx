import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, MapPin, Menu, X } from "lucide-react";

import "./Navbar.css";

/*
  EDIT HERE: the menu is built from these lists.
  Add a new page by adding one line.
*/
const LINKS_BEFORE = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/academics", label: "Academics" }
];

const SCHOOL_LINKS = [
  { to: "/classes", label: "Classes" },
  { to: "/faculty", label: "Faculty" },
  { to: "/facilities", label: "Facilities" },
  { to: "/fee-structure", label: "Fee Structure" }
];

const LINKS_AFTER = [
  { to: "/admissions", label: "Admissions" },
  { to: "/blog", label: "Blog" },
  { to: "/blog-news", label: "News" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact Us" }
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const { pathname } = useLocation();

  // Highlights "Our School" when one of its pages is open.
  const schoolActive = SCHOOL_LINKS.some((link) => pathname.startsWith(link.to));

  const closeMenu = () => {
    setMenuOpen(false);
    setDropOpen(false);
  };

  // Close the dropdown when the visitor clicks anywhere else.
  useEffect(() => {
    const handleClick = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setDropOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const renderLink = (link) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      className="veda-link"
      onClick={closeMenu}
    >
      {link.label}
    </NavLink>
  );

  return (
    <>

      {/* TOP INFORMATION BAR */}
      <div className="veda-topbar">
        <div className="veda-topbar-inner">

          <span className="veda-motto">
            Discipline <span>•</span> Knowledge <span>•</span> Character <span>•</span> Success
          </span>

          <span className="veda-topbar-place">
            <MapPin size={14} />
            Thurana (Hansi), Haryana
          </span>

        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <header
        className="veda-header"
        onKeyDown={(event) => {
          if (event.key === "Escape") closeMenu();
        }}
      >
        <nav className="veda-navbar" aria-label="Main navigation">
          <div className="veda-navbar-inner">

            <Link to="/" className="veda-brand" onClick={closeMenu}>
              <img
                src="/veda-logo.webp"
                alt="VEDA International School Logo"
                className="veda-logo"
              />

              {/* <div className="veda-brand-text">
                <span className="veda-brand-name">VEDA</span>
                <span className="veda-brand-subtitle">INTERNATIONAL SCHOOL</span>
                <span className="veda-brand-location">THURANA (HANSI)</span>
              </div> */}
            </Link>

            <div
              id="veda-primary-navigation"
              className={`veda-nav-links ${menuOpen ? "veda-nav-open" : ""}`}
            >

              {LINKS_BEFORE.map(renderLink)}

              <div
                ref={dropRef}
                className={`veda-dropdown ${dropOpen ? "is-open" : ""}`}
              >
                <button
                  type="button"
                  className={`veda-link veda-dropdown-toggle ${schoolActive ? "active" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={dropOpen}
                  onClick={() => setDropOpen(!dropOpen)}
                >
                  Our School
                  <ChevronDown size={16} />
                </button>

                <div className="veda-dropdown-menu">
                  {SCHOOL_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="veda-sub-link"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {LINKS_AFTER.map(renderLink)}

              <Link to="/login" className="veda-login-btn" onClick={closeMenu}>
                School Portal
                <ArrowUpRight size={17} />
              </Link>

            </div>

            <button
              type="button"
              className="veda-mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="veda-primary-navigation"
            >
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>

          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;