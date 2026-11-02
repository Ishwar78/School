import React from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Heart,
  TrendingUp,
  Star,
  Target,
  Compass,
  Users,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Lightbulb
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LocalImage from "../components/LocalImage";
import PageBanner from "../components/PageBanner";
import "./About.css";

const values = [
  {
    icon: BookOpen,
    title: "Knowledge",
    description: "Building strong foundations through curiosity and learning."
  },
  {
    icon: Heart,
    title: "Character",
    description: "Encouraging kindness, responsibility and respect."
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "Helping every learner discover and develop their potential."
  },
  {
    icon: Star,
    title: "Success",
    description: "Preparing students to approach the future with confidence."
  }
];

const approach = [
  {
    icon: Lightbulb,
    title: "Meaningful Learning",
    text: "We believe students learn best when they are encouraged to explore ideas, ask questions and understand the world around them."
  },
  {
    icon: Users,
    title: "Personal Development",
    text: "Learning experiences should nurture communication, confidence, teamwork and individual interests alongside academic progress."
  },
  {
    icon: ShieldCheck,
    title: "Values & Responsibility",
    text: "Respect, discipline and empathy help create a positive learning community where every student has an opportunity to grow."
  }
];

const featuredTeachers = [
  {
    name: "Mrs. Sunita Sharma",
    designation: "Primary Teacher",
    photo: "/veda-faculty-uniform/faculty-01.jpg",
    alt: "Mrs. Sunita Sharma, Primary Teacher"
  },
  {
    name: "Mr. Rajesh Kumar",
    designation: "Maths Teacher",
    photo: "/veda-faculty-uniform/faculty-02.jpg",
    alt: "Mr. Rajesh Kumar, Maths Teacher"
  },
  {
    name: "Mrs. Neha Verma",
    designation: "Science Teacher",
    photo: "/veda-faculty-uniform/faculty-03.jpg",
    alt: "Mrs. Neha Verma, Science Teacher"
  },
  {
    name: "Mr. Amit Singh",
    designation: "Social Science Teacher",
    photo: "/veda-faculty-uniform/faculty-04.jpg",
    alt: "Mr. Amit Singh, Social Science Teacher"
  },
  {
    name: "Dr. Sandeep Yadav",
    designation: "Physics Teacher",
    photo: "/veda-faculty-uniform/faculty-05.jpg",
    alt: "Dr. Sandeep Yadav, Physics Teacher"
  }
];

function About() {
  return (
    <>
      <Navbar />

      <main className="veda-about">
        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          // label="ABOUT US"
          // caption="Our Story. Our Purpose."
          breadcrumb={[
            { label: "Home", to: "/" },
            { label: "About Us" }
          ]}
        />

        <section className="about-intro" id="our-story">
          <div className="about-container about-intro-grid">
            <div className="about-intro-content">
              <div className="about-eyebrow">
                <span />
                WELCOME TO OUR SCHOOL
              </div>

              <h2>
                A Place for Learning.
              <br />  
                <em>A Future of Possibilities.</em>
              </h2>

              <p>
                Located in Thurana (Hansi), Haryana, VEDA International
                School aims to provide an educational environment
                where learning, character and creativity develop
                together.
              </p>

              <p>
                Our approach recognises that every child brings
                individual strengths, interests and aspirations.
                Through meaningful classroom experiences, guidance
                and opportunities beyond academics, we aim to help
                students become thoughtful and confident individuals.
              </p>

              <div className="about-intro-bottom">
                <div className="about-intro-points">
                  <div>
                    <GraduationCap size={20} aria-hidden="true" />
                    <span>Student-centred learning</span>
                  </div>

                  <div>
                    <Heart size={20} aria-hidden="true" />
                    <span>Strong values and character</span>
                  </div>

                  <div>
                    <Sparkles size={20} aria-hidden="true" />
                    <span>Creativity and personal growth</span>
                  </div>
                </div>

                <a href="#vision" className="about-button">
                  Discover Our Purpose
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="about-intro-visual">
              <div className="about-intro-main-image">
                <LocalImage
                  src="/images/veda-admissions.jpg"
                  alt="Students entering the school campus"
                  loading="lazy"
                />
              </div>

              <div className="about-intro-small-image">
                <LocalImage
                  src="/images/veda-classroom.jpg"
                  alt="Students learning in a classroom"
                  loading="lazy"
                />
              </div>

              <div className="about-intro-image-label">
                <span>DISCOVER</span>
                <strong>Life at VEDA</strong>
              </div>

              <div className="about-intro-outline" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="about-history" aria-labelledby="about-history-title">
          <div className="about-container about-history-panel">
            <div>
              <div className="about-eyebrow">
                <span />
                OUR HISTORY
              </div>
              <h2 id="about-history-title">Our School History.</h2>
            </div>
            <p>
              VEDA International School, Thurana, is built on a vision of creating a nurturing environment where education goes beyond textbooks and classrooms. With a commitment to academic excellence, strong values, and holistic development, the school strives to provide students with meaningful learning experiences that encourage curiosity, confidence, and character. As we continue our journey, our focus remains on inspiring young minds, supporting individual potential, and preparing students for a brighter tomorrow.
            </p>
          </div>
        </section>

        <section className="about-principal">
          <div className="about-container about-principal-grid">
            <div className="about-principal-content">
              <div className="about-eyebrow">
                <span />
                FROM THE PRINCIPAL'S DESK
              </div>

              <h2>
                Building Character.
              <br /> 
                <em> Inspiring Futures.</em>
              </h2>

              <div className="about-quote-mark" aria-hidden="true">“</div>

              <p>
                Education is not only about academic achievement.
                It is also about developing the confidence to ask
                questions, the courage to try something new and the
                values that guide us throughout life.
              </p>

              <p>
                At VEDA, our educational purpose is to encourage
                learners to discover their abilities, respect
                others and approach each new opportunity with
                curiosity and determination.
              </p>

              <div className="about-principal-signature">
                <span />
                <div>
                  <strong>Principal's Message</strong>
                  <small>VEDA International School</small>
                </div>
              </div>

              <p className="about-content-note">
                Sample message — replace with the principal's approved
                statement before publishing.
              </p>
            </div>

            <div className="about-principal-visual">
              <div className="about-principal-photo">
                <LocalImage
                  src="/images/veda-principal.jpg"
                  alt="Template portrait for the principal's message"
                  loading="lazy"
                />
              </div>

              <div className="about-principal-frame" aria-hidden="true" />

              <div className="about-principal-caption">
                <span>LEADERSHIP &amp; GUIDANCE</span>
                <strong>Inspiring Every Learner</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="about-purpose" id="vision">
          <div className="about-container">
            <div className="about-section-heading centered">
              <div className="about-eyebrow">
                <span />
                OUR DIRECTION
                <span />
              </div>

              <h2>
                Guided by Purpose, 
              
                <em> Driven by Possibility.</em>
              </h2>

              <p>
                Our vision and mission reflect the educational
                environment we aim to build for every learner.
              </p>
            </div>

            <div className="about-purpose-grid">
              <article className="about-purpose-item">
                <div className="about-purpose-icon">
                  <Compass size={28} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <span className="about-purpose-number">01 / OUR VISION</span>
                <h3>Our Vision</h3>
                <p>
                  To nurture a learning community where students
                  develop knowledge, confidence, creativity and
                  strong values, preparing them to embrace future
                  opportunities with purpose.
                </p>
              </article>

              <article className="about-purpose-item">
                <div className="about-purpose-icon">
                  <Target size={28} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <span className="about-purpose-number">02 / OUR MISSION</span>
                <h3>Our Mission</h3>
                <p>
                  To encourage meaningful education through engaging
                  learning experiences, supportive guidance,
                  opportunities for participation and an emphasis
                  on personal development.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="about-container about-values-layout">
            <div className="about-values-intro">
              <div className="about-eyebrow">
                <span />
                THE VEDA WAY
              </div>

              <h2>
                Values That Shape
                <br />
                <em>Our Journey.</em>
              </h2>

              <p>
                Our four guiding values represent the foundations
                of the learning experience we aspire to create.
              </p>
            </div>

            <div className="about-values-grid">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article className="about-value" key={value.title}>
                    <div className="about-value-icon">
                      <Icon size={26} strokeWidth={1.6} aria-hidden="true" />
                    </div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="about-learning">
          <div className="about-container">
            <div className="about-learning-grid">
              <div className="about-learning-visual">
                <LocalImage
                  src="/images/highlight-academics.jpg"
                  alt="Students taking part in classroom learning"
                  loading="lazy"
                />

                <div className="about-learning-visual-caption">
                  <BookOpen size={22} aria-hidden="true" />
                  <div>
                    <span>OUR APPROACH</span>
                    <strong>Learning Beyond Textbooks</strong>
                  </div>
                </div>
              </div>

              <div className="about-learning-content">
                <div className="about-eyebrow">
                  <span />
                  HOW WE APPROACH EDUCATION
                </div>

                <h2>
                  Every Child.
                
                  <em> Every Possibility.</em>
                </h2>

                <p className="about-learning-intro">
                  We believe that education should provide space
                  for intellectual, social and personal growth.
                </p>

                <div className="about-approach-list">
                  {approach.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div className="about-approach-item" key={item.title}>
                        <div className="about-approach-icon">
                          <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                        </div>

                        <div>
                          <span>0{index + 1}</span>
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="about-staff"
          id="about-staff"
          aria-labelledby="about-staff-title"
        >
          <div className="about-container">
            <div className="about-section-heading">
              <div>
                <div className="about-eyebrow">
                  <span />
                  OUR STAFF
                </div>

                <h2 id="about-staff-title">
                  Meet the Teachers Who Make
                  <em> Learning Matter.</em>
                </h2>
              </div>

              <Link to="/faculty" className="about-staff-link">
                Meet Our Faculty
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>

            <div className="about-staff-grid">
              {featuredTeachers.map((teacher) => (
                <article className="about-staff-card" key={teacher.photo}>
                  <div className="about-staff-photo">
                    <LocalImage
                      src={teacher.photo}
                      alt={teacher.alt}
                      loading="lazy"
                    />
                  </div>

                  <div className="about-staff-info">
                    <h3>{teacher.name}</h3>
                    <p>{teacher.designation}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-people">
          <div className="about-container">
            <div className="about-section-heading">
              <div>
                <div className="about-eyebrow">
                  <span />
                  OUR SCHOOL COMMUNITY
                </div>

                <h2>
                  The People Behind,
                
                  <em> Every Possibility.</em>
                </h2>
              </div>

              <p>
                A school is shaped by the commitment of its
                educators, leadership and the wider community
                working together for its students.
              </p>
            </div>

            <div className="about-people-grid">
              <article className="about-person-card">
                <div className="about-person-photo teachers-photo">
                  <LocalImage
                    src="/images/highlight-teachers.jpg"
                    alt="Teachers supporting student learning"
                    loading="lazy"
                  />
                </div>

                <div className="about-person-info">
                  <span>OUR EDUCATORS</span>
                  <h3>Teachers Who Inspire</h3>
                  <p>
                    Encouraging curiosity, guiding learning and
                    supporting the individual development of students.
                  </p>
                </div>
              </article>

              <article className="about-person-card">
                <div className="about-person-photo campus-photo">
                  <LocalImage
                    src="/images/veda-campus.jpg"
                    alt="School campus representing leadership and management"
                    loading="lazy"
                  />
                </div>

                <div className="about-person-info">
                  <span>OUR LEADERSHIP</span>
                  <h3>Guidance with Purpose</h3>
                  <p>
                    School leadership and management help establish
                    the direction, values and supportive environment
                    of the institution.
                  </p>
                </div>
              </article>
            </div>

            <p className="about-management-note">
              Official management and faculty names, designations
              and photographs will be added after school confirmation.
            </p>
          </div>
        </section>

        <section className="about-cta">
          <div className="about-container about-cta-layout">
            <div className="about-cta-content">
              <div className="about-eyebrow light">
                <span />
                BEGIN YOUR VEDA JOURNEY
              </div>

              <h2>
                A Community to Join.
                <br />
                <em>A Future to Explore.</em>
              </h2>

              <p>
                Discover more about our school, explore admission
                information or connect with us for an enquiry.
              </p>

              <div className="about-cta-buttons">
                <Link to="/admissions" className="about-button">
                  Explore Admissions
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>

                <Link to="/contact" className="about-cta-link">
                  Contact Us
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="about-cta-photo">
              <LocalImage
                src="/images/veda-activities.jpg"
                alt="Students participating in school activities"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
