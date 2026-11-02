import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Users
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./Classes.css";

/*
  EDIT HERE: all the text on this page lives in this section.
  The subject lists are written once and reused, so change them in one place.
  Replace the words with the school's approved information.
*/
const SUBJECTS_1_2 = ["English", "Hindi", "Maths", "EVS", "Art", "Computer"];
const SUBJECTS_3_5 = ["English", "Hindi", "Maths", "EVS", "Computer", "GK"];
const SUBJECTS_6_8 = ["English", "Hindi", "Maths", "Science", "Social Science", "Sanskrit", "Computer"];
const SUBJECTS_9_10 = ["English", "Hindi", "Maths", "Science", "Social Science", "IT"];
const SUBJECTS_11_12 = ["Science stream", "Commerce stream", "Arts stream", "English"];

const STAGES = ["All", "Primary", "Middle", "Secondary", "Senior Secondary"];

const CLASSES = [
  { name: "Class 1", stage: "Primary", age: "6 to 7 years", subjects: SUBJECTS_1_2, focus: "Reading, writing and number basics through activities" },
  { name: "Class 2", stage: "Primary", age: "7 to 8 years", subjects: SUBJECTS_1_2, focus: "Stronger reading, simple sums and good classroom habits" },
  { name: "Class 3", stage: "Primary", age: "8 to 9 years", subjects: SUBJECTS_3_5, focus: "Writing skills, tables and curiosity about the world" },
  { name: "Class 4", stage: "Primary", age: "9 to 10 years", subjects: SUBJECTS_3_5, focus: "Clear expression, problem solving and group activities" },
  { name: "Class 5", stage: "Primary", age: "10 to 11 years", subjects: SUBJECTS_3_5, focus: "Confident reading and a smooth step into middle school" },
  { name: "Class 6", stage: "Middle", age: "11 to 12 years", subjects: SUBJECTS_6_8, focus: "Subject-wise teaching and concept-based learning" },
  { name: "Class 7", stage: "Middle", age: "12 to 13 years", subjects: SUBJECTS_6_8, focus: "Science experiments, projects and regular practice" },
  { name: "Class 8", stage: "Middle", age: "13 to 14 years", subjects: SUBJECTS_6_8, focus: "Strong foundation for secondary classes" },
  { name: "Class 9", stage: "Secondary", age: "14 to 15 years", subjects: SUBJECTS_9_10, focus: "Board-level syllabus, tests and study habits" },
  { name: "Class 10", stage: "Secondary", age: "15 to 16 years", subjects: SUBJECTS_9_10, focus: "Board exam preparation, revision and mock tests" },
  { name: "Class 11", stage: "Senior Secondary", age: "16 to 17 years", subjects: SUBJECTS_11_12, focus: "Stream choice, deeper subjects and career guidance" },
  { name: "Class 12", stage: "Senior Secondary", age: "17 to 18 years", subjects: SUBJECTS_11_12, focus: "Board exams, entrance preparation and college counselling" }
];

function Classes() {
  const [stage, setStage] = useState("All");

  const visibleClasses =
    stage === "All" ? CLASSES : CLASSES.filter((item) => item.stage === stage);

  return (
    <>
      <Navbar />

      <main className="veda-classes">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          // label="CLASSES"
          // caption="Learning at Every Stage"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Classes" }]}
        />

        {/* 2. CLASS-WISE INFORMATION */}

        <section className="cl-classes">
          <div className="cl-container">

            <div className="cl-heading">
              <div className="cl-eyebrow">
                <span />
                CLASS-WISE INFORMATION
              </div>

              <h2>
                Classes 1 to 12 <em>at VEDA</em>
              </h2>

              <p className="cl-lead">
                Choose a stage to see what each class studies and what we
                focus on in that year.
              </p>
            </div>

            <div className="cl-filters" role="group" aria-label="Filter by stage">
              {STAGES.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`cl-filter ${stage === name ? "is-active" : ""}`}
                  aria-pressed={stage === name}
                  onClick={() => setStage(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="cl-grid">
              {visibleClasses.map((item) => (
                <article className="cl-card" key={item.name}>
                  <span className="cl-label">{item.stage.toUpperCase()}</span>
                  <h3>{item.name}</h3>

                  <span className="cl-meta">
                    <Users size={17} strokeWidth={1.8} />
                    Age {item.age}
                  </span>

                  <div className="cl-subjects-title">
                    <BookOpen size={17} strokeWidth={1.8} />
                    Subjects
                  </div>

                  <ul className="cl-subjects">
                    {item.subjects.map((subject) => (
                      <li key={subject}>{subject}</li>
                    ))}
                  </ul>

                  <p className="cl-focus">
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                    {item.focus}
                  </p>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* 3. CALL TO ACTION */}

        <section className="cl-cta">
          <div className="cl-container cl-cta-inner">
            <div>
              <h2>
                Looking to <em>Join VEDA?</em>
              </h2>
              <p>Send an admission enquiry and our team will get in touch.</p>
            </div>

            <Link to="/admissions#enquiry" className="cl-btn">
              Admission Enquiry <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Classes;