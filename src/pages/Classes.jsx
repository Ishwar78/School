
import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Users,
  GraduationCap,
  Grid2X2,
  Layers,
  Star,
  CalendarDays,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./Classes.css";

const SUBJECTS_1_2 = [
  "English", "Hindi", "Maths", "EVS", "Art", "Computer"
];

const SUBJECTS_3_5 = [
  "English", "Hindi", "Maths", "EVS", "Computer", "GK"
];

const SUBJECTS_6_8 = [
  "English", "Hindi", "Maths", "Science",
  "Social Science", "Sanskrit", "Computer"
];

const SUBJECTS_9_10 = [
  "English", "Hindi", "Maths", "Science",
  "Social Science", "IT"
];

const SUBJECTS_11_12 = [
  "Science stream", "Commerce stream", "Arts stream", "English"
];

const STAGES = [
  { name: "All", icon: Grid2X2, detail: "All Classes" },
  { name: "Primary", icon: GraduationCap, detail: "Class 1 – 5" },
  { name: "Middle", icon: BookOpen, detail: "Class 6 – 8" },
  { name: "Secondary", icon: Layers, detail: "Class 9 – 10" },
  { name: "Senior Secondary", icon: Star, detail: "Class 11 – 12" },
];

const CLASSES = [
  {
    name: "Class 1",
    stage: "Primary",
    age: "6 to 7 years",
    subjects: SUBJECTS_1_2,
    focus: "Reading, writing and number basics through activities",
    illustration: "📚",
    illustrationLabel: "Books",
  },
  {
    name: "Class 2",
    stage: "Primary",
    age: "7 to 8 years",
    subjects: SUBJECTS_1_2,
    focus: "Stronger reading, simple sums and good classroom habits",
    illustration: "📖",
    illustrationLabel: "Reading",
  },
  {
    name: "Class 3",
    stage: "Primary",
    age: "8 to 9 years",
    subjects: SUBJECTS_3_5,
    focus: "Writing skills, tables and curiosity about the world",
    illustration: "🌍",
    illustrationLabel: "Learning",
  },
  {
    name: "Class 4",
    stage: "Primary",
    age: "9 to 10 years",
    subjects: SUBJECTS_3_5,
    focus: "Clear expression, problem solving and group activities",
    illustration: "🎨",
    illustrationLabel: "Creativity",
  },
  {
    name: "Class 5",
    stage: "Primary",
    age: "10 to 11 years",
    subjects: SUBJECTS_3_5,
    focus: "Confident reading and a smooth step into middle school",
    illustration: "⚛️",
    illustrationLabel: "Discovery",
  },
  {
    name: "Class 6",
    stage: "Middle",
    age: "11 to 12 years",
    subjects: SUBJECTS_6_8,
    focus: "Subject-wise teaching and concept-based learning",
    illustration: "📊",
    illustrationLabel: "Progress",
  },
  {
    name: "Class 7",
    stage: "Middle",
    age: "12 to 13 years",
    subjects: SUBJECTS_6_8,
    focus: "Science experiments, projects and regular practice",
    illustration: "🧪",
    illustrationLabel: "Science",
  },
  {
    name: "Class 8",
    stage: "Middle",
    age: "13 to 14 years",
    subjects: SUBJECTS_6_8,
    focus: "Strong foundation for secondary classes",
    illustration: "💻",
    illustrationLabel: "Technology",
  },
  {
    name: "Class 9",
    stage: "Secondary",
    age: "14 to 15 years",
    subjects: SUBJECTS_9_10,
    focus: "Board-level syllabus, tests and study habits",
    illustration: "📝",
    illustrationLabel: "Preparation",
  },
  {
    name: "Class 10",
    stage: "Secondary",
    age: "15 to 16 years",
    subjects: SUBJECTS_9_10,
    focus: "Board exam preparation, revision and mock tests",
    illustration: "🏆",
    illustrationLabel: "Achievement",
  },
  {
    name: "Class 11",
    stage: "Senior Secondary",
    age: "16 to 17 years",
    subjects: SUBJECTS_11_12,
    focus: "Stream choice, deeper subjects and career guidance",
    illustration: "🔬",
    illustrationLabel: "Exploration",
  },
  {
    name: "Class 12",
    stage: "Senior Secondary",
    age: "17 to 18 years",
    subjects: SUBJECTS_11_12,
    focus: "Board exams, entrance preparation and college counselling",
    illustration: "🎓",
    illustrationLabel: "Future",
  },
];

function Classes() {
  const [stage, setStage] = useState("All");

  const visibleClasses =
    stage === "All"
      ? CLASSES
      : CLASSES.filter((item) => item.stage === stage);

  return (
    <>
      <Navbar />

      <main className="veda-classes">
        {/* PAGE BANNER */}

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          breadcrumb={[
            { label: "Home", to: "/" },
            { label: "Classes" },
          ]}
        />

        {/* CLASS INTRODUCTION */}

        <section className="cl-hero">
          <div className="cl-container cl-hero-inner">
            <div className="cl-hero-content">
              <div className="cl-hero-eyebrow">
                <span></span>
                CLASS-WISE INFORMATION
              </div>

              <h1>
                Classes 1 to 12 <em>at VEDA</em>
              </h1>

              <p>
                Choose a stage to discover what each class studies
                and how we help students grow every year.
              </p>

              <div className="cl-hero-features">
                <div>
                  <GraduationCap size={22} />
                  <span>Well-Structured Curriculum</span>
                </div>

                <div>
                  <BookOpen size={22} />
                  <span>Skill Based Learning</span>
                </div>

                <div>
                  <Users size={22} />
                  <span>Holistic Development</span>
                </div>
              </div>
            </div>

            <div className="cl-hero-art" aria-hidden="true">
              <div className="cl-hero-glow"></div>
              <span className="cl-hero-book">📚</span>
              <span className="cl-hero-cap">🎓</span>
              <span className="cl-hero-globe">🌍</span>
              <span className="cl-hero-pencil">✏️</span>
            </div>
          </div>
        </section>

        {/* CLASS-WISE INFORMATION */}

        <section className="cl-classes">
          <div className="cl-container">
            <div className="cl-heading">
              <div className="cl-eyebrow">
                <span></span>
                EXPLORE OUR CLASSES
              </div>

              <h2>
                Learning at <em>Every Stage</em>
              </h2>

              <p className="cl-lead">
                Select your child's learning stage to explore subjects,
                age groups and the educational focus of each class.
              </p>
            </div>

            {/* FILTERS */}

            <div className="cl-filters" role="group" aria-label="Filter classes">
              {STAGES.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    type="button"
                    className={`cl-filter ${
                      stage === item.name ? "is-active" : ""
                    }`}
                    aria-pressed={stage === item.name}
                    onClick={() => setStage(item.name)}
                  >
                    <Icon size={22} />
                    <span>
                      <strong>{item.name}</strong>
                      {item.name !== "All" && (
                        <small>{item.detail}</small>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CLASS CARDS */}

            <div className="cl-grid">
              {visibleClasses.map((item, index) => (
                <article
                  className="cl-card"
                  key={item.name}
                  style={{ "--card-index": index }}
                >
                  <div className="cl-card-top">
                    <span className="cl-label">
                      {item.stage.toUpperCase()}
                    </span>

                    <div
                      className="cl-card-illustration"
                      aria-label={item.illustrationLabel}
                    >
                      <span>{item.illustration}</span>
                    </div>
                  </div>

                  <h3>{item.name}</h3>

                  <div className="cl-meta">
                    <Users size={18} />
                    <span>Age {item.age}</span>
                  </div>

                  <div className="cl-subjects-title">
                    <BookOpen size={19} />
                    <strong>Subjects</strong>
                  </div>

                  <ul className="cl-subjects">
                    {item.subjects.map((subject) => (
                      <li key={subject}>{subject}</li>
                    ))}
                  </ul>

                  <div className="cl-focus">
                    <CheckCircle2 size={20} />
                    <p>{item.focus}</p>
                  </div>
                </article>
              ))}
            </div>

            {visibleClasses.length === 0 && (
              <div className="cl-empty">
                No classes available in this category.
              </div>
            )}
          </div>
        </section>

        {/* ADMISSION CTA */}

        <section className="cl-cta">
          <div className="cl-container cl-cta-inner">
            <div className="cl-cta-icon">
              <GraduationCap size={35} />
            </div>

            <div className="cl-cta-content">
              <span>YOUR CHILD'S FUTURE STARTS HERE</span>

              <h2>
                Looking to <em>Join VEDA?</em>
              </h2>

              <p>
                Give your child the right environment to learn,
                grow and achieve more.
              </p>
            </div>

            <Link to="/admissions#enquiry" className="cl-btn">
              Admission Enquiry
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Classes;
