
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  LayoutDashboard
} from "lucide-react";

import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="veda-footer">

      {/* TOP CTA */}

      <div className="vf-top">
        <div className="vf-container vf-top-inner">
          <div className="vf-top-icon">
            <GraduationCap size={28} strokeWidth={1.5} />
          </div>

          <div className="vf-top-text">
            <span>BEGIN YOUR JOURNEY WITH VEDA</span>
            <h2>Discover a world of learning and opportunity.</h2>
          </div>

          <Link to="/admissions" className="vf-admission-btn">
            Explore Admissions
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* MAIN FOOTER */}

      <div className="vf-main">
        <div className="vf-container vf-grid">

          {/* SCHOOL IDENTITY */}

          <div className="vf-brand-column">
            <Link to="/" className="vf-brand">
              <img
                src="/veda-logo.webp"
                alt="VEDA International School logo"
              />

              <div>
                <strong>VEDA</strong>
                <span>INTERNATIONAL SCHOOL</span>
                <small>THURANA (HANSI)</small>
              </div>
            </Link>

            <p className="vf-description">
              An educational environment dedicated to inspiring
              curiosity, encouraging growth and nurturing strong
              values in every learner.
            </p>

            <div className="vf-motto">
              DISCIPLINE <span>•</span> KNOWLEDGE <span>•</span> CHARACTER <span>•</span> SUCCESS
            </div>

            <div className="vf-socials">
              {/*
                Replace # with the school's official social media links.
                Until then, these are visual placeholders.
              */}

              <span aria-label="Facebook link pending">
                <Facebook size={17} />
              </span>

              <span aria-label="Instagram link pending">
                <Instagram size={17} />
              </span>

              <span aria-label="YouTube link pending">
                <Youtube size={18} />
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}

          <div className="vf-column">
            <h3>Explore VEDA</h3>
            <span className="vf-heading-line" />

            <Link to="/">Home</Link>
            <Link to="/about">About VEDA</Link>
            <Link to="/admissions">Admissions</Link>
            <Link to="/gallery">School Gallery</Link>
            <Link to="/blog-news">Blog & News</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* USEFUL LINKS */}

          <div className="vf-column">
            <h3>Useful Links</h3>
            <span className="vf-heading-line" />

            <Link to="/login">School Portal</Link>
            <Link to="/admissions">Admission Information</Link>
            <Link to="/blog-news">Latest Announcements</Link>
            <Link to="/gallery">School Activities</Link>
            <Link to="/contact">Contact & Location</Link>
            <Link to="/about">About VEDA</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>

          {/* CONTACT */}

          <div className="vf-column vf-contact">
            <h3>Get in Touch</h3>
            <span className="vf-heading-line" />

            <div className="vf-contact-item">
              <MapPin size={19} />

              <div>
                <strong>Our Location</strong>
                <p>
                  VEDA International School
                  <br />
                  Thurana (Hansi), Haryana, India
                </p>
              </div>
            </div>

            <div className="vf-contact-item">
              <Phone size={18} />

              <div>
                <strong>Phone</strong>
                <p>Official school number to be added</p>
              </div>
            </div>

            <div className="vf-contact-item">
              <Mail size={18} />

              <div>
                <strong>Email</strong>
                <p>Official school email to be added</p>
              </div>
            </div>

            <Link to="/contact" className="vf-contact-link">
              Send an Enquiry <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>

      {/* BOTTOM */}

      <div className="vf-bottom">
        <div className="vf-container vf-bottom-inner">
          <p>
            © {year} VEDA International School. All rights reserved.
          </p>

          <div className="vf-bottom-links">
            <Link to="/dashboard" className="vf-dashboard-btn">
              <LayoutDashboard size={15} aria-hidden="true" />
              Dashboard
            </Link>
            <span />
            <Link to="/about">About VEDA</Link>
            <span />
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
