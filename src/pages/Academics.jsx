import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  GraduationCap,
  HeartHandshake,
  Layers,
  Lightbulb,
  Users
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import LocalImage from "../components/LocalImage";
import "./Academics.css";

/* =========================================================
   EDIT HERE: all the text on this page lives in this section.
   Replace the words with the school's approved information.
   Keep the subject lists in step with Classes.jsx.
========================================================= */

/* ---------- Quick facts in the introduction ---------- */

const QUICK_FACTS = [
  { icon: GraduationCap, title: "Classes 1 to 12", text: "One school for every stage" },
  { icon: Layers, title: "Four learning stages", text: "Primary to Senior Secondary" },
  { icon: CalendarDays, title: "Planned year", text: "A clear calendar with regular tests" }
];

/* ---------- Curriculum, stage by stage ---------- */

const CURRICULUM = [
  {
    stage: "Primary",
    classes: "Classes 1 to 5",
    summary:
      "Children learn to read, write and count with confidence, through stories, songs and hands-on activities.",
    subjects: ["English", "Hindi", "Maths", "EVS", "Art", "Computer", "GK"],
    teaching: [
      "Activity-based lessons that keep young learners curious",
      "Daily reading and handwriting practice",
      "Simple projects and show-and-tell sessions"
    ],
    assessment: "Class tests, oral work and activity records"
  },
  {
    stage: "Middle",
    classes: "Classes 6 to 8",
    summary:
      "Subject-wise teaching begins. Students build strong concepts in science, maths and languages.",
    subjects: ["English", "Hindi", "Maths", "Science", "Social Science", "Sanskrit", "Computer"],
    teaching: [
      "Concept-based teaching with experiments and models",
      "Regular homework and revision",
      "Group projects and class presentations"
    ],
    assessment: "Unit tests, projects and term examinations"
  },
  {
    stage: "Secondary",
    classes: "Classes 9 and 10",
    summary:
      "A focused stage with the board-level syllabus, regular tests and steady preparation for the Class 10 examination.",
    subjects: ["English", "Hindi", "Maths", "Science", "Social Science", "IT"],
    teaching: [
      "Chapter-wise teaching with worked examples",
      "Weekly practice papers and doubt sessions",
      "Mock tests before the board examination"
    ],
    assessment: "Unit tests, term examinations and pre-board papers"
  },
  {
    stage: "Senior Secondary",
    classes: "Classes 11 and 12",
    summary:
      "Students choose a stream, study subjects in depth and prepare for board examinations and what comes after school.",
    subjects: ["Science stream", "Commerce stream", "Arts stream", "English"],
    teaching: [
      "Deeper subject study with practical work",
      "Career guidance and college counselling",
      "Entrance examination support"
    ],
    assessment: "Term examinations, practicals and pre-board papers"
  }
];

/* ---------- Academic approach ---------- */

const APPROACH = [
  {
    icon: Lightbulb,
    title: "Understanding first",
    text: "We teach the idea behind the answer, so students can use what they learn instead of only memorising it."
  },
  {
    icon: BookOpen,
    title: "Learning by doing",
    text: "Experiments, projects and group work turn lessons into things students can see and try."
  },
  {
    icon: ClipboardCheck,
    title: "Regular checking",
    text: "Frequent tests and teacher feedback show where a child is doing well and where help is needed."
  },
  {
    icon: Users,
    title: "Individual attention",
    text: "Teachers know their students by name and support each child at their own pace."
  },
  {
    icon: Cpu,
    title: "Learning with technology",
    text: "Computer classes and digital tools prepare students for the world they will work in."
  },
  {
    icon: HeartHandshake,
    title: "Character and values",
    text: "Discipline, respect and teamwork are part of everyday school life, not a separate subject."
  }
];

/* ---------- Academic calendar (sample dates and events) ---------- */

const TERMS = ["All", "Term 1", "Term 2"];

const CALENDAR = [
  { month: "April", term: "Term 1", events: ["New session begins", "Parent orientation"] },
  { month: "May", term: "Term 1", events: ["Unit test 1", "Sports and activity week"] },
  { month: "June", term: "Term 1", events: ["Summer vacation", "Holiday homework given"] },
  { month: "July", term: "Term 1", events: ["School reopens", "Clubs and house activities begin"] },
  { month: "August", term: "Term 1", events: ["Independence Day programme", "Unit test 2"] },
  { month: "September", term: "Term 1", events: ["Half-yearly examinations", "Teachers' Day"] },
  { month: "October", term: "Term 2", events: ["Term 1 results and parent meeting", "Festival break"] },
  { month: "November", term: "Term 2", events: ["Children's Day", "Science and art exhibition"] },
  { month: "December", term: "Term 2", events: ["Winter break", "Pre-board practice for Classes 10 and 12"] },
  { month: "January", term: "Term 2", events: ["School reopens", "Republic Day programme"] },
  { month: "February", term: "Term 2", events: ["Annual day", "Pre-board examinations"] },
  { month: "March", term: "Term 2", events: ["Final examinations", "Results and promotion"] }
];

/* =========================================================
   SMALL PIECES OF THE PAGE
========================================================= */

/* The small gold line + title + short text above each section */
function SectionHeading({ label, title, highlight, lead }) {
  return (
    <div className="ac-heading">
      <div className="ac-eyebrow">
        <span />
        {label}
      </div>

      <h2>
        {title} <em>{highlight}</em>
      </h2>

      {lead && <p className="ac-lead">{lead}</p>}
    </div>
  );
}

/* A row of pill buttons used by both filters on this page */
function FilterButtons({ options, selected, onSelect, label }) {
  return (
    <div className="ac-filters" role="group" aria-label={label}>
      {options.map((name) => (
        <button
          key={name}
          type="button"
          className={`ac-filter ${selected === name ? "is-active" : ""}`}
          aria-pressed={selected === name}
          onClick={() => onSelect(name)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

/* =========================================================
   THE ACADEMICS PAGE
========================================================= */

function Academics() {
  // Which stage and which term button is selected
  const [stageName, setStageName] = useState(CURRICULUM[0].stage);
  const [term, setTerm] = useState("All");

  const stageNames = CURRICULUM.map((item) => item.stage);
  const activeStage = CURRICULUM.find((item) => item.stage === stageName);

  const visibleMonths =
    term === "All" ? CALENDAR : CALENDAR.filter((item) => item.term === term);

  return (
    <>
      <Navbar />

      <main className="veda-academics">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Academics" }]}
        />

        {/* 1. INTRODUCTION */}

        <section className="ac-intro">
          <div className="ac-container ac-intro-layout">

            <div className="ac-intro-text">
              <div className="ac-eyebrow">
                <span />
                ACADEMICS
              </div>

              <h1>
                Learning that makes <em> easy </em>
              </h1>

              <p className="ac-intro-description">
                At VEDA International School, academics is about more than
                marks. From Class 1 to Class 12, our teachers help students
                understand what they study, think for themselves and grow in
                confidence. Here you can see what each stage teaches, how we
                teach it and how it is
              </p>

              <div className="ac-facts">
                {QUICK_FACTS.map((fact) => (
                  <div className="ac-fact" key={fact.title}>
                    <fact.icon size={26} strokeWidth={1.7} />
                    <div>
                      <strong>{fact.title}</strong>
                      <span>{fact.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ac-photo">
              <LocalImage
                src="/images/highlight-academics.jpg"
                alt="Students learning in a VEDA classroom"
                loading="eager"
              />

              <div className="ac-photo-label">
                <GraduationCap size={18} />
                <span>
                  <small>LEARNING AT</small>
                  VEDA
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. CURRICULUM */}

        <section className="ac-curriculum">
          <div className="ac-container">

            <SectionHeading
              label="CURRICULUM"
              title="What students learn,"
              highlight="stage by stage"
              lead="Choose a stage to see its classes, subjects, teaching style and how we check progress."
            />

            <FilterButtons
              options={stageNames}
              selected={stageName}
              onSelect={setStageName}
              label="Choose a stage"
            />

            <article className="ac-stage">

              <div className="ac-stage-top">
                <span className="ac-label">{activeStage.classes.toUpperCase()}</span>
                <h3>{activeStage.stage}</h3>
                <p>{activeStage.summary}</p>
              </div>

              <div className="ac-stage-body">

                <div>
                  <div className="ac-block-title">
                    <BookOpen size={19} strokeWidth={1.8} />
                    Subjects
                  </div>

                  <ul className="ac-subjects">
                    {activeStage.subjects.map((subject) => (
                      <li key={subject}>{subject}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="ac-block-title">
                    <Lightbulb size={19} strokeWidth={1.8} />
                    How we teach
                  </div>

                  <ul className="ac-points">
                    {activeStage.teaching.map((point) => (
                      <li key={point}>
                        <CheckCircle2 size={19} strokeWidth={1.8} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ac-assessment">
                  <div className="ac-block-title">
                    <ClipboardCheck size={19} strokeWidth={1.8} />
                    How we assess
                  </div>

                  <p>{activeStage.assessment}</p>
                </div>

              </div>
            </article>

          </div>
        </section>

        {/* 3. ACADEMIC APPROACH */}

        <section className="ac-approach">
          <div className="ac-container">

            <SectionHeading
              label="ACADEMIC APPROACH"
              title="How we"
              highlight="teach at VEDA"
              lead="Six ideas guide every classroom, from the first day of Class 1 to the last day of Class 12."
            />

            <div className="ac-approach-grid">
              {APPROACH.map((item) => (
                <article className="ac-approach-card" key={item.title}>
                  <span className="ac-icon">
                    <item.icon size={26} strokeWidth={1.7} />
                  </span>

                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* 4. ACADEMIC CALENDAR */}

        <section className="ac-calendar">
          <div className="ac-container">

            <SectionHeading
              label="ACADEMIC CALENDAR"
              title="The school year,"
              highlight="month by month"
              lead="A look at how the session is planned. Please check school notices for confirmed dates."
            />

            <FilterButtons
              options={TERMS}
              selected={term}
              onSelect={setTerm}
              label="Choose a term"
            />

            <div className="ac-month-grid">
              {visibleMonths.map((item) => (
                <article className="ac-month" key={item.month}>
                  <span className="ac-label">{item.term.toUpperCase()}</span>
                  <h3>{item.month}</h3>

                  <ul>
                    {item.events.map((event) => (
                      <li key={event}>
                        <CalendarDays size={17} strokeWidth={1.8} />
                        {event}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* 5. CALL TO ACTION */}

        <section className="ac-cta">
          <div className="ac-container ac-cta-inner">
            <div>
              <h2>
                Want to see <em>VEDA for yourself?</em>
              </h2>
              <p>Send an admission enquiry and our team will get in touch.</p>
            </div>

            <Link to="/admissions#enquiry" className="ac-btn">
              Admission Enquiry <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Academics;