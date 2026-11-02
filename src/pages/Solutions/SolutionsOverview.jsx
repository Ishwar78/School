import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  GraduationCap,
  Sparkles,
  Users
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./SolutionsOverview.css";

const audiences = [
  {
    to: "/solutions/teacher",
    name: "Teachers",
    label: "FOR TEACHERS",
    title: "More time for teaching. Less time managing.",
    description:
      "Keep classroom routines organised, record attendance, share assignments and update student results through one dedicated workspace.",
    image: "/feature-attendance.jfif",
    imageAlt: "Teacher guiding students in a classroom",
    icon: BookOpen,
    color: "teacher",
    points: [
      "Manage class attendance",
      "Create and share assignments",
      "Record academic results"
    ],
    link: "Explore Teacher Features"
  },
  {
    to: "/solutions/student",
    name: "Students",
    label: "FOR STUDENTS",
    title: "Everything you need for a better school day.",
    description:
      "Stay on top of your learning with a clear view of homework, timetables, attendance, examination results and important notices.",
    image: "/features-students.jpeg",
    imageAlt: "Students learning together",
    icon: GraduationCap,
    color: "student",
    points: [
      "Follow assignments and due dates",
      "Check timetables and attendance",
      "View marks and school notices"
    ],
    link: "Explore Student Features"
  },
  {
    to: "/solutions/parent",
    name: "Parents",
    label: "FOR PARENTS",
    title: "Feel closer to your child's school journey.",
    description:
      "Follow your linked child's school information through a dedicated space for academic progress, attendance, assignments and fee details.",
    image: "/home-community.jfif",
    imageAlt: "School community supporting a student's education",
    icon: Users,
    color: "parent",
    points: [
      "Review attendance and results",
      "Follow class assignments",
      "Check fees and announcements"
    ],
    link: "Explore Parent Features"
  }
];

export default function SolutionsOverview() {
  return (
    <>
      <Navbar />

      <main className="solution-overview">

        {/* HERO */}

        <section className="solution-hero">
          <div className="solution-container solution-hero-grid">

            <div className="solution-hero-copy">
              <span className="solution-eyebrow">
                <Sparkles size={15} />
                THE EDUFLOW EXPERIENCE
              </span>

              <h1>
                Different roles.
                <em> One connected school.</em>
              </h1>

              <p>
                School life looks different for everyone. That's why
                EduFlow gives teachers, students and parents their
                own dedicated experience while keeping important
                school information connected.
              </p>

              <div className="solution-hero-actions">
                <a
                  href="#dashboard-solutions"
                  className="solution-primary-button"
                >
                  Explore Your Experience
                  <ArrowRight size={18} />
                </a>

                <Link
                  to="/working"
                  className="solution-secondary-button"
                >
                  How It Works
                  <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="solution-hero-note">
                <Check size={16} />
                Designed around the people who make school life happen.
              </div>
            </div>

            <div className="solution-hero-visual">
              <div className="solution-hero-shape" />

              <div className="solution-hero-photo">
                <img
                  src="/features-hero.jpeg"
                  alt="Students learning together in a classroom"
                />

                <div className="solution-hero-photo-caption">
                  <strong>A place for everyone.</strong>
                  <span>From the classroom to home.</span>
                </div>
              </div>

              <div className="solution-hero-floating">
                <span>
                  <GraduationCap size={23} />
                </span>

                <div>
                  <strong>Better connected</strong>
                  <small>One school community</small>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* THREE ROLE EXPERIENCES */}

        <section
          className="solution-roles"
          id="dashboard-solutions"
        >
          <div className="solution-container">

            <div className="solution-section-heading">
              <span className="solution-eyebrow">
                EXPLORE YOUR SPACE
              </span>

              <h2>
                Made for the way
                <em> your school day works.</em>
              </h2>

              <p>
                Choose your role to discover the features and
                information available in your EduFlow experience.
              </p>
            </div>

            <div className="solution-role-list">
              {audiences.map((audience, index) => {
                const AudienceIcon = audience.icon;

                return (
                  <article
                    className={`solution-role solution-${audience.color}`}
                    key={audience.to}
                  >
                    <div className="solution-role-visual">
                      <img
                        src={audience.image}
                        alt={audience.imageAlt}
                        loading="lazy"
                      />

                      <span className="solution-role-photo-label">
                        <AudienceIcon size={18} />
                        {audience.name}
                      </span>
                    </div>

                    <div className="solution-role-content">
                      <span className="solution-role-kicker">
                        {String(index + 1).padStart(2, "0")} / {audience.label}
                      </span>

                      <h3>{audience.title}</h3>

                      <p>{audience.description}</p>

                      <ul className="solution-role-points">
                        {audience.points.map((point) => (
                          <li key={point}>
                            <span>
                              <Check size={14} strokeWidth={3} />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={audience.to}
                        className="solution-role-link"
                      >
                        {audience.link}
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

          </div>
        </section>

        {/* HOW THEY CONNECT */}

        <section className="solution-connection">
          <div className="solution-container solution-connection-grid">

            <div className="solution-connection-copy">
              <span className="solution-eyebrow">
                ONE SHARED EXPERIENCE
              </span>

              <h2>
                Three perspectives.
                <em> One smoother school day.</em>
              </h2>

              <p>
                EduFlow is designed to connect everyday school
                activities. Information entered in one role can
                be viewed where it's relevant in another.
              </p>

              <Link to="/working" className="solution-text-link">
                See How EduFlow Works
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="solution-connection-flow">
              <div className="solution-flow-item">
                <span className="solution-flow-icon">
                  <BookOpen size={23} />
                </span>

                <div>
                  <strong>Teacher shares an update</strong>
                  <p>
                    Posts class assignments, marks attendance
                    or records examination results.
                  </p>
                </div>

                <span className="solution-flow-number">01</span>
              </div>

              <div className="solution-flow-item">
                <span className="solution-flow-icon">
                  <GraduationCap size={23} />
                </span>

                <div>
                  <strong>Student sees what's relevant</strong>
                  <p>
                    Checks classwork, attendance, results
                    and important school information.
                  </p>
                </div>

                <span className="solution-flow-number">02</span>
              </div>

              <div className="solution-flow-item">
                <span className="solution-flow-icon">
                  <Users size={23} />
                </span>

                <div>
                  <strong>Parent stays informed</strong>
                  <p>
                    Reviews their linked child's progress
                    and other relevant school records.
                  </p>
                </div>

                <span className="solution-flow-number">03</span>
              </div>
            </div>

          </div>
        </section>

        {/* COMPACT CLOSING */}

        <section className="solution-closing">
          <div className="solution-container solution-closing-inner">

            <div>
              <span>DISCOVER EDUFLOW</span>
              <h2>Explore school life from your perspective.</h2>
              <p>
                Choose a role above or visit the demonstration.
              </p>
            </div>

            <Link
              to="/login"
              className="solution-primary-button"
            >
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