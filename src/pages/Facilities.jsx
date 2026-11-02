import React, { useEffect, useRef, useState } from "react";

import {
  ArrowDown,
  Bus,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  FlaskConical,
  HeartPulse,
  Library,
  Mic,
  Palette,
  Presentation,
  School,
  ShieldCheck,
  Sparkles,
  Trophy,
  UtensilsCrossed,
  Zap
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./Facilities.css";

/* =====================================================
   PART 1: ICONS
   Each facility has an icon NAME (a simple word) in the data below.
   This list connects the word to the real icon.
   To use a new icon: import it above, then add one line here.
   ===================================================== */

const ICONS = {
  library: Library,
  lab: FlaskConical,
  classroom: Presentation,
  sports: Trophy,
  transport: Bus,
  security: ShieldCheck,
  cafeteria: UtensilsCrossed,
  medical: HeartPulse,
  auditorium: Mic,
  art: Palette,
  water: Droplets,
  power: Zap,
  parking: Car,
  clean: Sparkles
};

/* =====================================================
   PART 2: THE DATA (edit the text and images here)

   All the text below is only an example. Replace it with the
   school's approved information before the website goes live.

   HIGHLIGHTS: the three points in the navy panel at the top.
     icon, title, text

   MAIN FACILITIES: shown as small cards. Clicking one opens its details.
     id        a word that is different for each facility
     name      short name shown on the small card
     icon      a word from the ICONS list above
     title     bigger heading shown in the details
     text      a short paragraph
     points    3 short bullet points
     images    3 photo paths, for example "/facilities/library-1.jpg"
               (put the files in public/facilities).
               Leave "" to show a placeholder.

   OTHER FACILITIES: shown in the row at the bottom.
     id, name, icon, text
     image     one photo path, for example "/facilities/cafeteria.jpg"
               Leave "" to show a placeholder.
               Best size: a landscape photo, about 800 x 500 pixels.

   LATER, WITH A BACKEND: replace these lists with data from your
   server. Use the same field names and the page needs no other change.
   ===================================================== */

const HIGHLIGHTS = [
  { icon: "security", title: "Safe and Secure", text: "A watched campus where only approved visitors come inside." },
  { icon: "classroom", title: "Modern Learning Spaces", text: "Bright classrooms, labs and a library for every class." },
  { icon: "sports", title: "Healthy and Active", text: "Sports, play and a clean, caring environment every day." }
];

const MAIN_FACILITIES = [
  {
    id: "library",
    name: "Library",
    icon: "library",
    title: "A Quiet Place to Read and Learn",
    text: "Our library gives students a calm space to read, research and discover new interests. Books for every class are kept in one place, with a reading area where students can sit and study.",
    points: [
      "Story books, reference books and magazines",
      "Reading periods for every class",
      "Quiet seating for study and homework"
    ],
    images: [
      "/facilities/library-1.jpg",
      "/facilities/library-2.jpg",
      "/facilities/library-3.jpg"
    ]
  },
  {
    id: "laboratories",
    name: "Laboratories",
    icon: "lab",
    title: "Learning by Doing",
    text: "Students learn science and computers by trying things for themselves. Our labs support the school curriculum with hands-on practice under a teacher's guidance.",
    points: [
      "Science labs for practical work",
      "Computer lab with internet access",
      "Practical sessions for every class"
    ],
    images: [
      "/facilities/laboratories-1.jpg",
      "/facilities/laboratories-2.jpg",
      "/facilities/laboratories-3.jpg"
    ]
  },
  {
    id: "classrooms",
    name: "Classrooms",
    icon: "classroom",
    title: "Bright Classrooms for Every Class",
    text: "Our classrooms are clean, airy and well lit, with comfortable seating so students can focus on learning and enjoy their day.",
    points: [
      "Well-lit and well-ventilated rooms",
      "Comfortable desks and benches",
      "Digital teaching aids"
    ],
    images: [
      "/facilities/classrooms-1.jpg",
      "/facilities/classrooms-2.jpg",
      "/facilities/classrooms-3.jpg"
    ]
  },
  {
    id: "sports",
    name: "Sports",
    icon: "sports",
    title: "Play, Move and Grow",
    text: "Sports build health, teamwork and confidence. Students take part in games and physical activities during the week and in school sports events through the year.",
    points: [
      "Open ground for games and activities",
      "Indoor and outdoor games",
      "Annual sports day and competitions"
    ],
    images: [
      "/facilities/sports-1.jpg",
      "/facilities/sports-2.jpg",
      "/facilities/sports-3.jpg"
    ]
  },
  {
    id: "transport",
    name: "Transport",
    icon: "transport",
    title: "Safe Travel to and from School",
    text: "School buses bring students from nearby villages and towns on fixed routes, with trained drivers and attendants looking after every child.",
    points: [
      "Fixed routes and pick-up times",
      "Trained drivers and attendants",
      "Vehicles checked regularly"
    ],
    images: [
      "/facilities/transport-1.jpg",
      "/facilities/transport-2.jpg",
      "/facilities/transport-3.jpg"
    ]
  },
  {
    id: "security",
    name: "Security",
    icon: "security",
    title: "A Safe Campus",
    text: "The safety of every child comes first. The campus is watched throughout the school day, and only approved visitors are allowed inside.",
    points: [
      "CCTV cameras across the campus",
      "Guards at the school gate",
      "Entry check for all visitors"
    ],
    images: [
      "/facilities/security-1.jpg",
      "/facilities/security-2.jpg",
      "/facilities/security-3.jpg"
    ]
  }
];

const OTHER_FACILITIES = [
  {
    id: "cafeteria",
    name: "Cafeteria",
    icon: "cafeteria",
    text: "A clean, bright place where students enjoy a healthy meal together.",
    image: "/facilities/cafeteria.jpg"
  },
  {
    id: "medical",
    name: "Medical Room",
    icon: "medical",
    text: "First aid and caring attention for any student who feels unwell.",
    image: "/facilities/medical-room.jpg"
  },
  {
    id: "auditorium",
    name: "Auditorium",
    icon: "auditorium",
    text: "A hall for assemblies, school events and student performances.",
    image: "/facilities/auditorium.jpg"
  }
];

/* =====================================================
   PART 3: SMALL SETTINGS
   ===================================================== */

// How long the row waits before moving to the next card (1000 = 1 second).
const AUTO_SCROLL_DELAY = 3000;

// Space between two cards in pixels. It must match "gap" in .fa-track in Facilities.css.
const CARD_GAP = 16;

/* =====================================================
   PART 4: SMALL HELPER PIECES
   ===================================================== */

/* The big hero photo. Shows a navy placeholder if the picture is missing. */

function LocalImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={`fa-image-holder ${className}`}>
      {!failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} {...props} />
      ) : (
        <div className="fa-image-placeholder" role="img" aria-label={alt}>
          <School size={28} strokeWidth={1.4} />
          <span>VEDA</span>
        </div>
      )}
    </div>
  );
}

/* One facility photo. Shows a placeholder until a real photo is added.
   It is used in the collage and on the "other facilities" cards. */

function FacilityPhoto({ src, name, icon, className }) {
  const [failed, setFailed] = useState(false);
  const Icon = ICONS[icon] || School;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={`fa-photo ${className}`}>
      {src && !failed ? (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="fa-photo-placeholder" role="img" aria-label={`${name} photo coming soon`}>
          <Icon size={34} strokeWidth={1.4} />
          <span>Photo coming soon</span>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   PART 5: THE ROW "OUR OTHER FACILITIES"
   Works like the Faculty page: it moves by itself, has two arrows,
   and stops once the visitor hovers, touches it or uses an arrow.

   The arrows sit next to the heading (never on top of the photos)
   and only appear when the cards do not all fit on the screen.
   ===================================================== */

function OtherFacilities({ items }) {

  // true = the row moves by itself, false = it has stopped
  const [autoScroll, setAutoScroll] = useState(true);

  // true = there are more cards than fit on screen, so scrolling makes sense
  const [canScroll, setCanScroll] = useState(false);

  // A handle to the scrolling row, so the code can move it
  const trackRef = useRef(null);

  // STEP 1: check if the row needs scrolling (now and when the window changes size)
  function checkIfScrollable() {
    const track = trackRef.current;
    if (!track) return;

    setCanScroll(track.scrollWidth > track.clientWidth + 5);
  }

  useEffect(
    function () {
      checkIfScrollable();
      window.addEventListener("resize", checkIfScrollable);

      return function () {
        window.removeEventListener("resize", checkIfScrollable);
      };
    },
    [items]
  );

  // STEP 2: scrolling helpers

  // How far one card moves the row: card width + the gap between cards
  function getStepSize() {
    const firstCard = trackRef.current.querySelector(".fa-other-card");
    return firstCard.offsetWidth + CARD_GAP;
  }

  // direction: 1 moves right, -1 moves left
  function scrollByOneCard(direction) {
    if (!trackRef.current) return;

    trackRef.current.scrollBy({
      left: direction * getStepSize(),
      behavior: "smooth"
    });
  }

  function stopAutoScroll() {
    setAutoScroll(false);
  }

  function handleArrowClick(direction) {
    stopAutoScroll();
    scrollByOneCard(direction);
  }

  // STEP 3: the automatic scrolling
  useEffect(
    function () {
      if (!autoScroll || !canScroll) return;

      // Visitors who asked their device for less motion get no auto scroll.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const timer = setInterval(function () {
        const track = trackRef.current;
        if (!track) return;

        const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

        if (reachedEnd) {
          track.scrollTo({ left: 0, behavior: "smooth" }); // go back to the start
        } else {
          scrollByOneCard(1);
        }
      }, AUTO_SCROLL_DELAY);

      // Clean up when the page closes or auto scroll is switched off
      return function () {
        clearInterval(timer);
      };
    },
    [autoScroll, canScroll]
  );

  // STEP 4: what appears on the screen
  return (
    <section className="fa-other">

      {/* The auto scroll stops when the mouse enters, a finger touches,
          or the keyboard focuses this area.
          To make it start again when the mouse leaves, add this line to the
          div below:  onMouseLeave={() => setAutoScroll(true)}  */}
      <div
        className="fa-container"
        onMouseEnter={stopAutoScroll}
        onTouchStart={stopAutoScroll}
        onFocus={stopAutoScroll}
      >

        <div className="fa-other-head">
          <div className="fa-heading">
            <div className="fa-eyebrow">
              <span />
              AND MORE
            </div>

            <h2>
              Our Other <em>Facilities</em>
            </h2>

            <p className="fa-lead">
              Small things that make every school day easier, safer and more comfortable.
            </p>
          </div>

          {canScroll && (
            <div className="fa-arrows">
              <button
                type="button"
                className="fa-arrow"
                onClick={() => handleArrowClick(-1)}
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                className="fa-arrow"
                onClick={() => handleArrowClick(1)}
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>

        <div className="fa-track" ref={trackRef} tabIndex={0}>
          {items.map((item) => {
            const Icon = ICONS[item.icon] || School;

            return (
              <article className="fa-other-card" key={item.id}>

                <div className="fa-other-media">
                  <FacilityPhoto
                    src={item.image}
                    name={item.name}
                    icon={item.icon}
                    className="fa-other-photo"
                  />

                  <span className="fa-other-icon">
                    <Icon size={26} strokeWidth={1.7} />
                  </span>
                </div>

                <div className="fa-other-body">
                  <h3 className="fa-other-name">{item.name}</h3>
                  <p className="fa-other-text">{item.text}</p>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* =====================================================
   PART 6: THE PAGE
   Order: banner, introduction, facility cards + details, other facilities.
   ===================================================== */

function Facilities() {

  // Which small card is selected. The first facility opens by default.
  const [selectedId, setSelectedId] = useState(MAIN_FACILITIES[0].id);

  const selected = MAIN_FACILITIES.find(function (facility) {
    return facility.id === selectedId;
  });

  const SelectedIcon = ICONS[selected.icon] || School;

  return (
    <>
      <Navbar />

      <main className="veda-facilities">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Facilities" }]}
        />

        {/* 2. INTRODUCTION: text on the left, three highlights on the right */}
        <section className="fa-intro">
          <div className="fa-container fa-intro-grid">

            <div>
              <div className="fa-eyebrow">
                <span />
                OUR FACILITIES
              </div>

              <h2>
                Everything Your Child to <em>Grow</em>
              </h2>

              <p className="fa-lead">
                From a quiet library to safe transport, VEDA gives students the
                space and support they need to learn, play and feel at home.
                Every facility is looked after daily by our staff.
              </p>

              <a href="#explore" className="fa-intro-link">
                Explore Facilities
                <ArrowDown size={18} />
              </a>
            </div>

            <div className="fa-highlights">
              {HIGHLIGHTS.map((item) => {
                const Icon = ICONS[item.icon] || School;

                return (
                  <div className="fa-highlight" key={item.title}>
                    <span className="fa-highlight-icon">
                      <Icon size={24} strokeWidth={1.8} />
                    </span>

                    <div>
                      <h3 className="fa-highlight-title">{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* 3. FACILITY CARDS AND DETAILS */}
        <section className="fa-main" id="explore">
          <div className="fa-container">

            <div className="fa-heading">
              <div className="fa-eyebrow">
                <span />
                CHOOSE A FACILITY
              </div>

              <h2>
                Explore Each <em>Facility</em>
              </h2>
            </div>

            {/* The row of small cards */}
            <div className="fa-chips" role="group" aria-label="Choose a facility">
              {MAIN_FACILITIES.map((facility) => {
                const Icon = ICONS[facility.icon] || School;
                const isSelected = facility.id === selectedId;

                return (
                  <button
                    key={facility.id}
                    type="button"
                    className={isSelected ? "fa-chip is-active" : "fa-chip"}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(facility.id)}
                  >
                    <span className="fa-chip-icon">
                      <Icon size={26} strokeWidth={1.7} />
                    </span>
                    {facility.name}
                  </button>
                );
              })}
            </div>

            {/* Details of the selected facility: information left, photos right.
                The key makes the box fade in again each time a new card is chosen. */}
            <div className="fa-detail" key={selected.id}>

              <div className="fa-detail-info">
                <span className="fa-detail-label">
                  <SelectedIcon size={18} strokeWidth={1.9} />
                  {selected.name.toUpperCase()}
                </span>

                <h3 className="fa-detail-title">{selected.title}</h3>
                <p className="fa-detail-text">{selected.text}</p>

                <ul className="fa-points">
                  {selected.points.map((point) => (
                    <li key={point}>
                      <CheckCircle2 size={20} strokeWidth={1.8} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fa-collage">
                {selected.images.map((src, index) => (
                  <FacilityPhoto
                    key={index}
                    src={src}
                    name={selected.name}
                    icon={selected.icon}
                    className={`fa-photo-${index + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>
        </section>

        {/* 4. OTHER FACILITIES */}
        <OtherFacilities items={OTHER_FACILITIES} />

      </main>

      <Footer />
    </>
  );
}

export default Facilities;