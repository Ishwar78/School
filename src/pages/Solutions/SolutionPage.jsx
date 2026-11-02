import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./SolutionPages.css";

function HeroPhoto({ src, alt, Icon }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="sp-photo">
      {failed ? (
        <div className="sp-photo-fallback" aria-hidden="true">
          <Icon size={52} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function SolutionPage({ solution }) {
  const RoleIcon = solution.icon;

  return (
    <>
      <Navbar />

      <main className={`sp-page sp-role-${solution.role}`}>

        {/* HERO */}

        <section className="sp-hero">
          <div className="sp-container sp-hero-grid">

            <div className="sp-hero-copy">
              <span className="sp-eyebrow">
                <Sparkles size={15} />
                {solution.eyebrow}
              </span>

              <h1>
                {solution.title} <em>{solution.highlight}</em>
              </h1>

              <p className="sp-intro">{solution.intro}</p>

              <div className="sp-actions">
                <a href="#dashboard-details" className="sp-btn sp-btn-primary">
                  Explore Your Features
                  <ArrowRight size={18} />
                </a>

                <Link to="/solutions" className="sp-btn sp-btn-outline">
                  All Solutions
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="sp-trust">
                <span>
                  <Check size={16} />
                  Role-focused tools
                </span>

                <span>
                  <Check size={16} />
                  Connected school information
                </span>
              </div>
            </div>

            <div className="sp-visual">
              <div className="sp-visual-shape" />

              <HeroPhoto
                src={solution.image}
                alt={solution.imageAlt}
                Icon={RoleIcon}
              />

              <span className="sp-badge">
                <RoleIcon size={19} />
                {solution.roleLabel}
              </span>
            </div>

          </div>
        </section>

        {/* SHORT INTRODUCTION */}

        <section className="sp-introduction">
          <div className="sp-container sp-introduction-inner">

            <div className="sp-introduction-title">
              <span className="sp-label">
                YOUR EDUFLOW EXPERIENCE
              </span>

              <h2>
                A workspace built around
                <em> your everyday needs.</em>
              </h2>
            </div>

            <div className="sp-introduction-copy">
              <p>{solution.detailsIntro}</p>

              <a href="#dashboard-details" className="sp-text-link">
                Discover the Features
                <ArrowRight size={18} />
              </a>
            </div>

          </div>
        </section>

        {/* FEATURE DETAILS */}

        <section className="sp-details" id="dashboard-details">
          <div className="sp-container">

            <header className="sp-heading">
              <span className="sp-label">
                EXPLORE THE FEATURES
              </span>

              <h2>
                Everything you need to
                <em> {solution.headingEnd}</em>
              </h2>

              <p>
                Explore the tools and information available
                in your EduFlow workspace.
              </p>
            </header>

            <div className="sp-feature-list">
              {solution.features.map((feature, index) => {
                const FeatureIcon = feature.icon;

                return (
                  <article
                    className="sp-feature"
                    id={`sp-feature-${index}`}
                    key={feature.title}
                  >
                    <div className="sp-feature-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="sp-feature-main">
                      <span className="sp-feature-icon">
                        <FeatureIcon size={25} />
                      </span>

                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>

                    <div className="sp-feature-points">
                      <span className="sp-feature-points-label">
                        WHAT YOU CAN DO
                      </span>

                      <ul>
                        {feature.points.map((point) => (
                          <li key={point}>
                            <span className="sp-tick">
                              <Check size={14} strokeWidth={3} />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>

          </div>
        </section>

        {/* ROLE CONNECTION */}

        <section className="sp-connected">
          <div className="sp-container sp-connected-inner">

            <div className="sp-connected-icon">
              <RoleIcon size={29} />
            </div>

            <div>
              <span className="sp-label">
                PART OF ONE CONNECTED SCHOOL
              </span>

              <h2>
                Your own space. <em>One EduFlow.</em>
              </h2>

              <p>
                Each role has its own view of school life, while
                relevant information stays connected across
                the EduFlow experience.
              </p>
            </div>

            <Link to="/solutions" className="sp-text-link">
              Explore Other Roles
              <ArrowUpRight size={18} />
            </Link>

          </div>
        </section>

        {/* CALL TO ACTION */}

        <section className="sp-cta">
          <div className="sp-container">
            <div className="sp-cta-panel">

              <div className="sp-cta-copy">
                <span className="sp-cta-kicker">
                  DISCOVER EDUFLOW
                </span>

                <h2>{solution.ctaTitle}</h2>
                <p>{solution.ctaDescription}</p>
              </div>

              <div className="sp-cta-actions">
                <Link to="/login" className="sp-btn sp-btn-gold">
                  Explore EduFlow
                  <ArrowUpRight size={18} />
                </Link>

                <Link to="/contact" className="sp-btn sp-btn-glass">
                  Talk to Us
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}