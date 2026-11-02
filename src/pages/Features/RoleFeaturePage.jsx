
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  GraduationCap,
  Sparkles
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./RoleFeaturePage.css";

export default function RoleFeaturePage({ content }) {
  const RoleIcon = content.icon;

  return (
    <>
      <Navbar />

      <main className={`role-features-page role-${content.accent}`}>
        {/* HERO */}
        <section className="role-hero">
          <div className="role-container role-hero-grid">
            <div className="role-hero-copy">
              <span className="role-eyebrow">
                <Sparkles size={16} />
                {content.eyebrow}
              </span>

              <h1>
                {content.title}
                <em> {content.highlight}</em>
              </h1>

              <p>{content.intro}</p>

              <div className="role-hero-actions">
                <a
                  href="#role-feature-list"
                  className="role-primary-button"
                >
                  Explore Your Features
                  <ArrowRight size={18} />
                </a>

                <Link
                  to="/features"
                  className="role-secondary-button"
                >
                  All Platform Features
                  <ArrowUpRight size={17} />
                </Link>
              </div>

              <div className="role-hero-footnote">
                <Check size={17} />
                A thoughtful experience, built around your school day.
              </div>
            </div>

            <div className="role-hero-art">
              <div className="role-hero-shape" />

              <div className="role-hero-photo">
                <img src={content.image} alt={content.imageAlt} />

                <span className="role-photo-shade" />

                <span className="role-photo-label">
                  <RoleIcon size={17} />
                  {content.badge}
                </span>

                <div className="role-photo-caption">
                  <strong>{content.imageLabel}</strong>
                  <span>{content.imageNote}</span>
                </div>
              </div>

              <div className="role-floating-card">
                <span className="role-floating-icon">
                  <RoleIcon size={21} />
                </span>

                <div>
                  <strong>{content.stat}</strong>
                  <small>{content.statLabel}</small>
                </div>

                <Check size={17} className="role-floating-check" />
              </div>
            </div>
          </div>
        </section>

        {/* ROLE OVERVIEW */}
        <section className="role-overview">
          <div className="role-container role-overview-layout">
            <div className="role-overview-copy">
              <span className="role-section-kicker">
                DESIGNED AROUND YOUR NEEDS
              </span>

              <h2>
                A better way to
                <em> experience school.</em>
              </h2>

              <p>
                Everything relevant to your role is organised
                into one connected space, making everyday
                information easier to access and understand.
              </p>

              <Link to="/working" className="role-text-link">
                Understand How EduFlow Works
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="role-summary-grid">
              {content.summary.map(([number, title, description]) => (
                <article className="role-summary-card" key={number}>
                  <span className="role-summary-number">{number}</span>

                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>

                  <Check size={18} className="role-summary-check" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PREMIUM FEATURE SHOWCASE */}
        <section
          className="role-feature-list"
          id="role-feature-list"
        >
          <div className="role-container">
            <div
              className="role-feature-decoration role-feature-decoration-one"
              aria-hidden="true"
            />

            <div
              className="role-feature-decoration role-feature-decoration-two"
              aria-hidden="true"
            />

            <div className="role-feature-heading">
              <span className="role-section-kicker">
                EXPLORE YOUR EXPERIENCE
              </span>

              <h2>
                The tools you need.
                <em> Nothing you don't.</em>
              </h2>

              <p>
                Take a closer look at what each feature does
                and how it makes your daily school experience simpler.
              </p>
            </div>

            <div className="role-feature-grid">
              {content.features.map((feature, index) => {
                const FeatureIcon = feature.icon;

                return (
                  <article
                    className="role-feature-card"
                    key={feature.title}
                  >
                    <div className="role-feature-image">
                      <span
                        className="role-feature-image-orbit"
                        aria-hidden="true"
                      />

                      <div className="role-feature-image-art">
                        <img
                          src={feature.image}
                          alt={feature.imageAlt}
                          loading="lazy"
                        />
                      </div>

                      <span className="role-feature-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="role-feature-body">
                      <span className="role-feature-tag">
                        <FeatureIcon size={17} />
                        {feature.tag}
                      </span>

                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>

                      <ul>
                        {feature.points.map((point) => (
                          <li key={point}>
                            <span>
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

        {/* CLOSING */}
        <section className="role-closing">
          <div className="role-container role-closing-inner">
            <div className="role-closing-icon">
              <GraduationCap size={29} />
            </div>

            <div>
              <span className="role-section-kicker">
                EXPERIENCE EDUFLOW
              </span>

              <h2>See how it all comes together.</h2>

              <p>
                Explore the demonstration and discover how
                the different school experiences connect.
              </p>
            </div>

            <Link to="/login" className="role-primary-button">
              Try EduFlow
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
