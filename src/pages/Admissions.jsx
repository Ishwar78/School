
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   BookOpen,
//   CalendarCheck2,
//   Check,
//   ClipboardList,
//   GraduationCap,
//   Megaphone,
//   Sparkles,
//   Users,
//   Wallet
// } from "lucide-react";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import "./Admissions.css";

// const modules = [
//   {
//     number: "01",
//     icon: Users,
//     title: "Student Management",
//     description:
//       "Bring essential student information together in one organised space. EduFlow makes it easier to manage student profiles, view class information and keep school records accessible.",
//     points: [
//       "Organised student profiles",
//       "Class and section information",
//       "Student record management"
//     ],
//     image: "/features-students.jpeg",
//     alt: "Students participating in classroom learning",
//     theme: "blue"
//   },
//   {
//     number: "02",
//     icon: CalendarCheck2,
//     title: "Smart Attendance",
//     description:
//       "Make attendance a straightforward part of the school routine. Teachers can mark student attendance, while students and parents can review the records relevant to them.",
//     points: [
//       "Daily attendance marking",
//       "Class-wise attendance records",
//       "Student attendance history"
//     ],
//     image: "/feature-attendance.jfif",
//     alt: "Teacher working with students in a classroom",
//     theme: "yellow"
//   },
//   {
//     number: "03",
//     icon: Wallet,
//     title: "Fee Management",
//     description:
//       "Keep school fee information organised through clear records. View payment details, amounts paid and outstanding balances without searching through disconnected information.",
//     points: [
//       "Student fee records",
//       "Paid and pending amounts",
//       "Clear payment status"
//     ],
//     image: "/feature-fees.jfif",
//     alt: "School documents and a laptop on a desk",
//     theme: "blue"
//   },
//   {
//     number: "04",
//     icon: BookOpen,
//     title: "Academics & Exams",
//     description:
//       "Connect assignments and examination results in a structured academic experience. Teachers can add classwork and marks, while students and parents can follow the shared information.",
//     points: [
//       "Class assignments and due dates",
//       "Subject-wise examination results",
//       "Connected academic records"
//     ],
//     image: "/feature-academics.jfif",
//     alt: "Books and study materials on a desk",
//     theme: "yellow"
//   },
//   {
//     number: "05",
//     icon: Megaphone,
//     title: "Announcements",
//     description:
//       "Create a central place for important school information. Notices can be organised by audience, helping the right members of the school community stay informed.",
//     points: [
//       "School-wide announcements",
//       "Role-specific notices",
//       "One place for important updates"
//     ],
//     image: "/feature-announcements.jfif",
//     alt: "Bright educational classroom environment",
//     theme: "blue"
//   },
//   {
//     number: "06",
//     icon: ClipboardList,
//     title: "Class Timetables",
//     description:
//       "Give students and teachers a clearer view of their schedules. Organise subjects, periods and class timetables in an easy-to-follow format.",
//     points: [
//       "Class-wise timetables",
//       "Subject and period information",
//       "Organised weekly schedules"
//     ],
//     image: "/feature-timetable.jfif",
//     alt: "Books and learning materials",
//     theme: "yellow"
//   }
// ];

// function FeaturePhoto({ src, alt, className = "" }) {
//   const [failed, setFailed] = useState(false);

//   return (
//     <div className={`features-photo ${className}`}>
//       {failed ? (
//         <div className="features-photo-fallback">
//           <GraduationCap size={42} />
//           <span>Learning, made simpler.</span>
//         </div>
//       ) : (
//         <img
//           src={src}
//           alt={alt}
//           loading="lazy"
//           onError={() => setFailed(true)}
//         />
//       )}
//     </div>
//   );
// }

// export default function Features() {
//   return (
//     <>
//       <Navbar />

//       <main className="features-page">

//         {/* HERO */}

//         <section className="features-hero">
//           <div className="features-container features-hero-grid">

//             <div className="features-hero-copy">
//               <span className="features-eyebrow">
//                 <Sparkles size={15} />
//                 DISCOVER EDUFLOW
//               </span>

//               <h1>
//                 The little things matter.
//                 <em> Let's make school life easier.</em>
//               </h1>

//               <p>
//                 Attendance, assignments, student information,
//                 examinations and everyday school updates shouldn't
//                 feel complicated. Discover how EduFlow brings them
//                 together in one connected experience.
//               </p>

//               <div className="features-hero-actions">
//                 <a
//                   href="#all-features"
//                   className="features-btn features-btn-primary"
//                 >
//                   Explore All Features
//                   <ArrowRight size={18} />
//                 </a>

//                 <Link
//                   to="/working"
//                   className="features-btn features-btn-outline"
//                 >
//                   How EduFlow Works
//                   <ArrowUpRight size={18} />
//                 </Link>
//               </div>

//               <div className="features-hero-bottom">
//                 <span className="features-hero-bottom-icon">
//                   <Check size={17} />
//                 </span>

//                 <span>
//                   Six essential modules. One organised school experience.
//                 </span>
//               </div>
//             </div>

//             <div className="features-hero-visual">
//               <div className="features-hero-shape" />

//               <FeaturePhoto
//                 src="/features-hero.jpeg"
//                 alt="Students learning together in a modern classroom"
//                 className="features-hero-image"
//               />

//               <div className="features-hero-note">
//                 <span>
//                   <GraduationCap size={25} />
//                 </span>

//                 <div>
//                   <strong>Made for better school days</strong>
//                   <small>Simple tools. Meaningful connections.</small>
//                 </div>
//               </div>

//               <span className="features-hero-spark" aria-hidden="true">
//                 ✳
//               </span>
//             </div>

//           </div>
//         </section>

//         {/* FEATURE NAVIGATION */}

//         <section className="features-intro" id="all-features">
//           <div className="features-container">

//             <div className="features-intro-heading">
//               <div>
//                 <span className="features-eyebrow">
//                   THE PLATFORM
//                 </span>

//                 <h2>
//                   Everything you need,
//                   <em> thoughtfully connected.</em>
//                 </h2>
//               </div>

//               <p>
//                 Explore six important parts of EduFlow. Select a
//                 feature to learn what it does and how it supports
//                 everyday school activities.
//               </p>
//             </div>

//             <div className="features-module-index">
//               {modules.map((module) => {
//                 const Icon = module.icon;

//                 return (
//                   <a
//                     href={`#module-${module.number}`}
//                     className="features-index-item"
//                     key={module.number}
//                   >
//                     <span className="features-index-icon">
//                       <Icon size={23} />
//                     </span>

//                     <span className="features-index-name">
//                       <small>MODULE {module.number}</small>
//                       <strong>{module.title}</strong>
//                     </span>

//                     <ArrowUpRight
//                       size={19}
//                       className="features-index-arrow"
//                     />
//                   </a>
//                 );
//               })}
//             </div>

//           </div>
//         </section>

//         {/* FEATURE DETAILS */}

//         <section className="features-modules">
//           {modules.map((module, index) => {
//             const Icon = module.icon;

//             return (
//               <article
//                 id={`module-${module.number}`}
//                 key={module.number}
//                 className={`features-detail ${
//                   index % 2 !== 0 ? "features-detail-alt" : ""
//                 }`}
//               >
//                 <div className="features-container features-detail-grid">

//                   <div className="features-detail-content">
//                     <span className="features-detail-label">
//                       FEATURE {module.number} / 06
//                     </span>

//                     <span
//                       className={`features-detail-icon features-${module.theme}`}
//                     >
//                       <Icon size={28} />
//                     </span>

//                     <h2>{module.title}</h2>
//                     <p>{module.description}</p>

//                     <ul className="features-detail-points">
//                       {module.points.map((point) => (
//                         <li key={point}>
//                           <span>
//                             <Check size={15} strokeWidth={3} />
//                           </span>
//                           {point}
//                         </li>
//                       ))}
//                     </ul>

//                     <a
//                       href="#all-features"
//                       className="features-detail-link"
//                     >
//                       View All Modules
//                       <ArrowUpRight size={17} />
//                     </a>
//                   </div>

//                   <div className="features-detail-visual">
//                     <div className="features-detail-backdrop" />

//                     <FeaturePhoto
//                       src={module.image}
//                       alt={module.alt}
//                       className="features-detail-photo"
//                     />

//                     <div className="features-image-label">
//                       <span>
//                         <Icon size={20} />
//                       </span>

//                       <div>
//                         <strong>{module.title}</strong>
//                         <small>Part of the EduFlow experience</small>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               </article>
//             );
//           })}
//         </section>

//         {/* HOW FEATURES CONNECT */}

//         <section className="features-connection">
//           <div className="features-container features-connection-grid">

//             <div className="features-connection-copy">
//               <span className="features-eyebrow">
//                 <Sparkles size={15} />
//                 MORE THAN SEPARATE FEATURES
//               </span>

//               <h2>
//                 A connected experience
//                 <em> from classroom to home.</em>
//               </h2>

//               <p>
//                 EduFlow is designed so important information doesn't
//                 stay isolated in separate pages. A teacher's update
//                 can become useful information for students and their
//                 linked parents.
//               </p>

//               <Link
//                 to="/working"
//                 className="features-btn features-btn-primary"
//               >
//                 Understand the Process
//                 <ArrowRight size={18} />
//               </Link>
//             </div>

//             <div className="features-connection-steps">

//               <div className="features-connection-step">
//                 <span className="features-step-number">01</span>

//                 <div>
//                   <strong>Teachers organise information</strong>
//                   <p>
//                     Create assignments, record attendance and
//                     update examination results.
//                   </p>
//                 </div>
//               </div>

//               <div className="features-connection-step">
//                 <span className="features-step-number">02</span>

//                 <div>
//                   <strong>Students follow their school day</strong>
//                   <p>
//                     View classwork, schedules, results and
//                     relevant school notices.
//                   </p>
//                 </div>
//               </div>

//               <div className="features-connection-step">
//                 <span className="features-step-number">03</span>

//                 <div>
//                   <strong>Parents stay informed</strong>
//                   <p>
//                     Review their linked child's academic
//                     information in one place.
//                   </p>
//                 </div>
//               </div>

//             </div>

//           </div>
//         </section>

//         {/* COMPACT CLOSING */}

//         <section className="features-closing">
//           <div className="features-container features-closing-inner">

//             <div>
//               <span>READY TO EXPLORE?</span>
//               <h2>Discover the EduFlow experience.</h2>
//               <p>
//                 Visit the demo or learn more about the platform.
//               </p>
//             </div>

//             <div className="features-closing-actions">
//               <Link to="/login" className="features-closing-primary">
//                 Try EduFlow
//                 <ArrowRight size={18} />
//               </Link>

//               <Link to="/solutions" className="features-closing-secondary">
//                 Explore Solutions
//                 <ArrowUpRight size={18} />
//               </Link>
//             </div>

//           </div>
//         </section>

//       </main>

//       <Footer />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  School,
  Send,
  UserCheck
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./Admissions.css";

/*
  Where the enquiry form is sent.
  Paste your form endpoint here (for example a Formspree URL or your own API).
  WHILE THIS IS EMPTY the form only shows the success message and sends nothing.
*/
const ENQUIRY_URL = "";

/*
  SAMPLE CONTENT: the process, documents and class list below are standard
  examples. Replace them with the school's approved admission details.
*/

const quickLinks = [
  { icon: ClipboardList, title: "Admission Process", text: "Steps to join VEDA", target: "#process" },
  { icon: UserCheck, title: "Eligibility", text: "Who can apply", target: "#eligibility" },
  { icon: FileText, title: "Required Documents", text: "What you need to bring", target: "#documents" },
  { icon: Send, title: "Admission Enquiry", text: "Send us your questions", target: "#enquiry" }
];

const steps = [
  {
    title: "Enquire",
    text: "Contact the school or send an enquiry using the form on this page."
  },
  {
    title: "Submit Application",
    text: "Fill in the admission form and submit it with the required documents."
  },
  {
    title: "Meet the School",
    text: "Visit the school and speak with the admission team about your child."
  },
  {
    title: "Confirm Admission",
    text: "Complete the formalities once the school confirms the admission."
  }
];

const documents = [
  "Birth certificate of the student",
  "Report card or transfer certificate from the previous school",
  "Recent passport-size photographs of the student",
  "Identity proof of parent or guardian",
  "Address proof"
];

const classOptions = [
  "Nursery", "LKG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6",
  "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
];

const emptyForm = {
  studentName: "",
  classApplying: "",
  parentName: "",
  phone: "",
  email: "",
  message: ""
};

/* Shows a branded placeholder if a photograph is missing. */

function LocalImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={`ad-image-holder ${className}`}>
      {!failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} {...props} />
      ) : (
        <div className="ad-image-placeholder" role="img" aria-label={alt}>
          <School size={28} strokeWidth={1.4} />
          <span>VEDA</span>
        </div>
      )}
    </div>
  );
}

function Admissions() {
  const { hash } = useLocation();

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  // Links like /admissions#enquiry scroll to that section.
  useEffect(() => {
    if (!hash) return;

    const section = document.getElementById(hash.slice(1));
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");

    try {
      if (ENQUIRY_URL) {
        const response = await fetch(ENQUIRY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form)
        });

        if (!response.ok) throw new Error("The enquiry could not be sent.");
      } else {
        console.warn("Enquiry form is not connected yet (ENQUIRY_URL is empty). Nothing was sent.");
      }

      setForm(emptyForm);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="veda-admissions">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Admissions" }]}
        />

        {/* 2. INTRODUCTION AND QUICK LINKS */}

        <section className="ad-intro">
          <div className="ad-container">

            <div className="ad-heading">
              <div className="ad-eyebrow">
                <span />
                JOIN VEDA
              </div>

              <h2>
                Everything You Need to <em>Apply.</em>
              </h2>

              <p className="ad-lead">
                Find out how to apply, who can apply and which documents
                are needed. If you have any questions, send us an enquiry.
              </p>
            </div>

            <div className="ad-quick-grid">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a className="ad-quick-tile" href={item.target} key={item.title}>
                    <span className="ad-icon-circle">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>

                    <span className="ad-quick-text">
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </span>

                    <ChevronRight size={18} className="ad-quick-arrow" />
                  </a>
                );
              })}
            </div>

          </div>
        </section>

        {/* 3. ADMISSION PROCESS */}

        <section className="ad-process" id="process">
          <div className="ad-container">

            <div className="ad-heading">
              <div className="ad-eyebrow">
                <span />
                HOW TO APPLY
              </div>

              <h2>
                Admission <em>Process.</em>
              </h2>
            </div>

            <ol className="ad-steps">
              {steps.map((step, index) => (
                <li className="ad-step" key={step.title}>
                  <span className="ad-step-number">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>

          </div>
        </section>

        {/* 4. ELIGIBILITY AND DOCUMENTS */}

        <section className="ad-details">
          <div className="ad-container ad-details-layout">

            <article className="ad-card" id="eligibility">
              <div className="ad-card-title">
                <span className="ad-icon-circle">
                  <UserCheck size={22} strokeWidth={1.7} />
                </span>
                <h3>Eligibility</h3>
              </div>

              <p>
                Eligibility is decided class by class, and the requirements
                can change with each academic session.
              </p>

              <p className="ad-note">
                For the exact age and class criteria, please contact the
                school office or send an enquiry.
              </p>

              <div className="ad-card-actions">
                <a href="#enquiry" className="ad-btn">
                  Send an Enquiry
                </a>

                <Link to="/contact" className="ad-text-link">
                  Contact Us
                </Link>
              </div>
            </article>

            <article className="ad-card" id="documents">
              <div className="ad-card-title">
                <span className="ad-icon-circle">
                  <FileText size={22} strokeWidth={1.7} />
                </span>
                <h3>Required Documents</h3>
              </div>

              <ul className="ad-checklist">
                {documents.map((item) => (
                  <li key={item}>
                    <span className="ad-check">
                      <Check size={14} strokeWidth={2.6} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="ad-note">
                Please confirm the final list with the school office.
              </p>
            </article>

          </div>
        </section>

        {/* 5. ENQUIRY FORM */}

        <section className="ad-enquiry" id="enquiry">
          <div className="ad-container ad-enquiry-layout">

            <aside className="ad-enquiry-info">
              <LocalImage
                src="/images/veda-classroom.jpg"
                alt="Teacher guiding students at VEDA"
                className="ad-enquiry-photo"
                loading="lazy"
              />

              <div className="ad-enquiry-info-body">
                <div className="ad-eyebrow light">
                  <span />
                  ADMISSION ENQUIRY
                </div>

                <h2>Have a question about admission?</h2>

                <p>
                  Fill in the form and tell us about your child. You can
                  also find our address and contact details on the contact page.
                </p>

                <Link to="/contact" className="ad-light-link">
                  Go to Contact Page <ChevronRight size={17} />
                </Link>
              </div>
            </aside>

            <div className="ad-form-card">
              {status === "success" ? (
                <div className="ad-success" role="status">
                  <CheckCircle2 size={44} strokeWidth={1.6} />
                  <h3>Thank you for your enquiry</h3>
                  <p>Your details have been submitted to the school.</p>

                  <button
                    type="button"
                    className="ad-btn"
                    onClick={() => setStatus("idle")}
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Enquiry Form</h3>
                  <p className="ad-form-intro">Fields marked * are required.</p>

                  <div className="ad-fields">

                    <div className="ad-field">
                      <label htmlFor="studentName">Student's Name *</label>
                      <input
                        id="studentName"
                        name="studentName"
                        type="text"
                        value={form.studentName}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                      />
                    </div>

                    <div className="ad-field">
                      <label htmlFor="classApplying">Class Applying For *</label>
                      <select
                        id="classApplying"
                        name="classApplying"
                        value={form.classApplying}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select class</option>
                        {classOptions.map((className) => (
                          <option key={className} value={className}>
                            {className}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="ad-field">
                      <label htmlFor="parentName">Parent / Guardian Name *</label>
                      <input
                        id="parentName"
                        name="parentName"
                        type="text"
                        value={form.parentName}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="ad-field">
                      <label htmlFor="phone">Mobile Number *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        pattern="[0-9]{10}"
                        title="Enter a 10-digit mobile number"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        required
                      />
                    </div>

                    <div className="ad-field ad-field-wide">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                    </div>

                    <div className="ad-field ad-field-wide">
                      <label htmlFor="message">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={form.message}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  {status === "error" && (
                    <p className="ad-error" role="alert">
                      Sorry, we could not send your enquiry. Please try again
                      or contact the school.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="ad-btn ad-submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending..." : "Submit Enquiry"}
                    <Send size={17} />
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Admissions;