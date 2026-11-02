import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  UserRound
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./Faculty.css";

/* =====================================================
   PART 1: THE DATA (edit the people here)
   -----------------------------------------------------
   Every person has the same 5 fields:
     id          a number that is different for each person
     name        full name
     designation job title shown on the card
     group       must match one name in the group list of that section
     photo       "" shows a placeholder, or a path like
                 "/images/faculty/sunita-sharma.jpg"

   The names below are only examples. Replace them with real staff.

   LATER, WITH A BACKEND: delete the two lists below and load the data
   from your server instead. The page needs no other change as long as
   the server sends the same 5 fields. Example:

     const [teachers, setTeachers] = useState([]);
     useEffect(() => {
       fetch("/api/faculty/teaching")
         .then((response) => response.json())
         .then((data) => setTeachers(data));
     }, []);
   ===================================================== */

const TEACHING_GROUPS = ["All", "Primary", "Middle", "Secondary", "Senior Secondary"];

const TEACHING_STAFF = [
  { id: 1, name: "Mrs. Sunita Sharma", designation: "Primary Teacher", group: "Primary", photo: "/veda-faculty-uniform/faculty-01.jpg" },
  { id: 2, name: "Mr. Rajesh Kumar", designation: "Maths Teacher", group: "Middle", photo: "/veda-faculty-uniform/faculty-02.jpg" },
  { id: 3, name: "Mrs. Neha Verma", designation: "Science Teacher", group: "Middle", photo: "/veda-faculty-uniform/faculty-03.jpg" },
  { id: 4, name: "Mr. Amit Singh", designation: "Social Science Teacher", group: "Secondary", photo: "/veda-faculty-uniform/faculty-04.jpg" },
  { id: 5, name: "Dr. Sandeep Yadav", designation: "Physics Teacher", group: "Senior Secondary", photo: "/veda-faculty-uniform/faculty-05.jpg" }
];

const STAFF_GROUPS = ["All", "Administration", "Office", "Library and Lab", "Support"];

const NON_TEACHING_STAFF = [
  { id: 1, name: "Mr. Mahender Singh", designation: "School Manager", group: "Administration", photo: "/veda-faculty-uniform/faculty-06.jpg" },
  { id: 2, name: "Mrs. Rekha Devi", designation: "Office Superintendent", group: "Office", photo: "/veda-faculty-uniform/faculty-07.jpg" },
  { id: 3, name: "Mr. Ravi Chauhan", designation: "Librarian", group: "Library and Lab", photo: "/veda-faculty-uniform/faculty-08.jpg" },
  { id: 4, name: "Mr. Jagdish Lal", designation: "Transport In-charge", group: "Support", photo: "/veda-faculty-uniform/faculty-09.jpg" },
  { id: 5, name: "Mr. Harpal Singh", designation: "Head of Security", group: "Support", photo: "/veda-faculty-uniform/faculty-10.jpg" }
];

/* =====================================================
   PART 2: SMALL SETTINGS
   ===================================================== */

// Space between two cards in pixels. It must match "gap" in .fc-track in Faculty.css.
const CARD_GAP = 12;

/* =====================================================
   PART 3: SMALL HELPER PIECES
   ===================================================== */

/* Takes "Mrs. Sunita Sharma" and gives "SS" (used in the placeholder). */

function getInitials(name) {
  const withoutTitle = name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "");
  const words = withoutTitle.split(" ");
  return (words[0][0] + (words[1] ? words[1][0] : "")).toUpperCase();
}

/* The photo on a card. Shows a placeholder until a real photo is added. */

function PersonPhoto({ photo, name }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [photo]);

  if (photo && !failed) {
    return <img src={photo} alt={name} loading="lazy" onError={() => setFailed(true)} />;
  }

  return (
    <div className="fc-photo-placeholder" role="img" aria-label={`Photo of ${name} coming soon`}>
      <UserRound size={34} strokeWidth={1.3} />
      <span>{getInitials(name)}</span>
    </div>
  );
}

/* =====================================================
   PART 4: ONE STAFF SECTION
   It is used twice: once for teachers, once for non-teaching staff.
   ===================================================== */

function StaffSection({ id, eyebrow, title, highlight, lead, people, groups, tint }) {

  // STEP 1: things the visitor can change
  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // A handle to the scrolling row, so the code can move it
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollButtons() {
    const track = trackRef.current;
    if (!track) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(track.scrollLeft > 2);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 2);
  }

  // STEP 2: choose which people to show
  const text = searchText.trim().toLowerCase();

  let visiblePeople = people.filter(function (person) {
    const groupMatches = selectedGroup === "All" || person.group === selectedGroup;
    const textMatches =
      person.name.toLowerCase().includes(text) ||
      person.designation.toLowerCase().includes(text);

    return groupMatches && textMatches;
  });

  if (sortBy === "name") {
    visiblePeople = [...visiblePeople].sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  // STEP 3: scrolling helpers

  // How far one card moves the row: card width + the gap between cards
  function getStepSize() {
    const firstCard = trackRef.current?.querySelector(".fc-card");
    if (!firstCard) return 0;
    const secondCard = firstCard.nextElementSibling;
    return secondCard ? secondCard.offsetLeft - firstCard.offsetLeft : firstCard.offsetWidth + CARD_GAP;
  }

  // direction: 1 moves right, -1 moves left
  function scrollByOneCard(direction) {
    if (!trackRef.current) return;

    const stepSize = getStepSize();
    if (!stepSize) return;

    trackRef.current.scrollBy({
      left: direction * stepSize,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }

  function handleArrowClick(direction) {
    scrollByOneCard(direction);
  }

  // Go back to the first card whenever the search, filter or sort changes.
  useEffect(
    function () {
      if (trackRef.current) trackRef.current.scrollTo({ left: 0 });
      const frame = requestAnimationFrame(updateScrollButtons);
      return () => cancelAnimationFrame(frame);
    },
    [searchText, selectedGroup, sortBy]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateScrollButtons)
      : null;
    if (observer) observer.observe(track);
    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons();
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [visiblePeople.length]);

  // STEP 5: what appears on the screen
  return (
    <section className={tint ? "fc-section fc-section-tint" : "fc-section"} id={id}>
      <div className="fc-container">

        {/* Heading */}
        <div className="fc-heading">
          <div className="fc-eyebrow">
            <span />
            {eyebrow}
          </div>

          <h2>
            {title} <em>{highlight}</em>
          </h2>

          <p className="fc-lead">{lead}</p>
        </div>

        {/* Search box and sort menu */}
        <div className="fc-tools">
          <div className="fc-search">
            <Search size={19} />
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by name or designation"
              aria-label={`Search ${title} ${highlight}`}
            />
          </div>

          <select
            className="fc-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort order"
          >
            <option value="default">Default order</option>
            <option value="name">Name A to Z</option>
          </select>
        </div>

        {/* Filter buttons */}
        <div className="fc-filters" role="group" aria-label="Filter by group">
          {groups.map((groupName) => (
            <button
              key={groupName}
              type="button"
              className={selectedGroup === groupName ? "fc-filter is-active" : "fc-filter"}
              aria-pressed={selectedGroup === groupName}
              onClick={() => setSelectedGroup(groupName)}
            >
              {groupName}
            </button>
          ))}
        </div>

        <p className="fc-count" role="status">
          Showing {visiblePeople.length} of {people.length}
        </p>

        {visiblePeople.length > 0 ? (
          <div className="fc-slider">
            <button
              type="button"
              className="fc-arrow fc-arrow-left"
              onClick={() => handleArrowClick(-1)}
              aria-label={`Scroll ${title} ${highlight} left`}
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={20} />
            </button>
            <div
              className="fc-track"
              ref={trackRef}
              tabIndex={0}
              onScroll={updateScrollButtons}
              aria-label={`${title} ${highlight} cards`}
            >
              {visiblePeople.map((person) => (
                <article className="fc-card" key={person.id}>
                  <div className="fc-photo">
                    <PersonPhoto photo={person.photo} name={person.name} />
                  </div>
                  <div className="fc-info">
                    <h3 className="fc-name">{person.name}</h3>
                    <p className="fc-role">{person.designation}</p>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="fc-arrow fc-arrow-right"
              onClick={() => handleArrowClick(1)}
              aria-label={`Scroll ${title} ${highlight} right`}
              disabled={!canScrollRight}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <p className="fc-empty" role="status">
            No staff found. Try a different name or filter.
          </p>
        )}

      </div>
    </section>
  );
}

/* =====================================================
   PART 5: THE PAGE
   Order: banner, teachers, non-teaching staff, numbers.
   ===================================================== */

function Faculty() {
  return (
    <>
      <Navbar />

      <main className="veda-faculty">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          // label="FACULTY AND STAFF"
          // caption="The People Behind VEDA"
          
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Faculty" }]}
        />

        {/* 2. TEACHING STAFF */}
        <StaffSection
          id="teaching"
          eyebrow="OUR TEACHERS"
          title="Teaching"
          highlight="Staff"
          lead="Qualified and caring teachers who guide every child from Class 1 to Class 12."
          people={TEACHING_STAFF}
          groups={TEACHING_GROUPS}
        />

        {/* 3. NON-TEACHING STAFF */}
        <StaffSection
          id="non-teaching"
          eyebrow="OUR SUPPORT TEAM"
          title="Non-Teaching"
          highlight="Staff"
          lead="The team that keeps the school running smoothly, safely and on time."
          people={NON_TEACHING_STAFF}
          groups={STAFF_GROUPS}
          tint
        />

        {/* 4. NUMBERS (counted automatically from the two lists) */}
        <section className="fc-stats" aria-label="Staff numbers">
          <div className="fc-container fc-stats-grid">

            <div className="fc-stat">
              <strong>{TEACHING_STAFF.length}</strong>
              <span>Teaching staff</span>
            </div>

            <div className="fc-stat">
              <strong>{NON_TEACHING_STAFF.length}</strong>
              <span>Non-teaching staff</span>
            </div>

            <div className="fc-stat">
              <strong>{TEACHING_STAFF.length + NON_TEACHING_STAFF.length}</strong>
              <span>People caring for our students</span>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Faculty;