import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  School,
  X,
  ZoomIn
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./Gallery.css";

/*
  All images are LOCAL (public/images). No external image URLs.

  SAMPLE PHOTOS: these use the photographs already in the project.
  To add a real photo, copy it into public/images and add one more
  line to the list below. The filter buttons are created from the
  "category" names automatically, so a new category such as
  "Celebrations", "Events", "Functions" or "Achievements"
  will get its own button as soon as one photo uses it.
*/

const photos = [
  { src: "/images/veda-campus.jpg", title: "The VEDA campus", category: "Campus" },
  { src: "/images/highlight-facilities.jpg", title: "Library and reading space", category: "Campus" },
  { src: "/images/veda-admissions.jpg", title: "Welcome to VEDA", category: "Campus" },

  { src: "/images/veda-classroom.jpg", title: "Teacher guiding students", category: "Classrooms" },
  { src: "/images/highlight-academics.jpg", title: "Focused learning", category: "Classrooms" },
  { src: "/images/highlight-teachers.jpg", title: "Teachers working together", category: "Classrooms" },

  { src: "/images/veda-activities.jpg", title: "Students at activity time", category: "Activities" },
  { src: "/images/highlight-activities.jpg", title: "Art and creative expression", category: "Activities" },
  { src: "/images/veda-notices.jpg", title: "The school community", category: "Activities" }
];

// "All" plus every category used in the photo list above.
const categories = ["All", ...new Set(photos.map((photo) => photo.category))];

/* Shows a branded placeholder if a photograph is missing. */

function LocalImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={`gl-image-holder ${className}`}>
      {!failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} {...props} />
      ) : (
        <div className="gl-image-placeholder" role="img" aria-label={alt}>
          <School size={26} strokeWidth={1.4} />
          <span>VEDA</span>
        </div>
      )}
    </div>
  );
}

function Gallery() {
  const [filter, setFilter] = useState("All");

  // Position of the open photo inside the visible list. null = lightbox closed.
  const [openIndex, setOpenIndex] = useState(null);

  const lastFocused = useRef(null); // the tile to return focus to
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  const visiblePhotos =
    filter === "All"
      ? photos
      : photos.filter((photo) => photo.category === filter);

  const photoCount = visiblePhotos.length;
  const isOpen = openIndex !== null;
  const currentPhoto = isOpen ? visiblePhotos[openIndex] : null;

  const openLightbox = (index, event) => {
    lastFocused.current = event.currentTarget;
    setOpenIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setOpenIndex(null);
    if (lastFocused.current) lastFocused.current.focus();
  }, []);

  const showNext = useCallback(() => {
    setOpenIndex((index) => (index + 1) % photoCount);
  }, [photoCount]);

  const showPrevious = useCallback(() => {
    setOpenIndex((index) => (index - 1 + photoCount) % photoCount);
  }, [photoCount]);

  // While the lightbox is open: lock page scroll and listen to the keyboard.
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current.focus();

    const handleKey = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();

      // Keep Tab inside the lightbox
      if (event.key === "Tab" && dialogRef.current) {
        const buttons = dialogRef.current.querySelectorAll("button");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeLightbox, showNext, showPrevious]);

  return (
    <>
      <Navbar />

      <main className="veda-gallery">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
        />

        {/* 2. PHOTO GRID */}

        <section className="gl-gallery">
          <div className="gl-container">

            <div className="gl-heading">
              <div>
                <div className="gl-eyebrow">
                  <span />
                  SCHOOL LIFE
                </div>

                <h2>
                  Life at VEDA, <em>in Pictures.</em>
                </h2>

                <p className="gl-intro">
                  Photographs of our campus, classrooms and activities.
                </p>
              </div>

              <p className="gl-count" aria-live="polite">
                {photoCount} {photoCount === 1 ? "photograph" : "photographs"}
              </p>
            </div>

            <div className="gl-filters" role="group" aria-label="Filter photographs">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={filter === category ? "active" : ""}
                  onClick={() => setFilter(category)}
                  aria-pressed={filter === category}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="gl-grid">
              {visiblePhotos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  className="gl-tile"
                  onClick={(event) => openLightbox(index, event)}
                  aria-label={`View photograph: ${photo.title}`}
                >
                  <LocalImage
                    src={photo.src}
                    alt=""
                    className="gl-tile-photo"
                    loading="lazy"
                  />

                  <span className="gl-tile-zoom" aria-hidden="true">
                    <ZoomIn size={17} />
                  </span>

                  <span className="gl-tile-caption">
                    <small>{photo.category.toUpperCase()}</small>
                    <strong>{photo.title}</strong>
                  </span>
                </button>
              ))}
            </div>

            {/* Closing strip */}

            <div className="gl-cta">
              <div>
                <h3>Become a part of the VEDA family</h3>
                <p>Find admission information or get in touch with the school.</p>
              </div>

              <div className="gl-cta-actions">
                <Link to="/admissions" className="gl-btn">
                  Admissions <ArrowUpRight size={16} />
                </Link>

                <Link to="/contact" className="gl-cta-link">
                  Contact Us
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 3. LIGHTBOX */}

        {currentPhoto && (
          <div className="gl-lightbox" onClick={closeLightbox}>
            <div
              className="gl-lightbox-dialog"
              role="dialog"
              aria-modal="true"
              aria-label={currentPhoto.title}
              ref={dialogRef}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="gl-round-btn gl-lightbox-close"
                onClick={closeLightbox}
                aria-label="Close photograph"
                ref={closeButtonRef}
              >
                <X size={20} />
              </button>

              <button
                type="button"
                className="gl-round-btn gl-lightbox-prev"
                onClick={showPrevious}
                aria-label="Previous photograph"
              >
                <ChevronLeft size={22} />
              </button>

              <figure className="gl-lightbox-figure">
                <LocalImage
                  src={currentPhoto.src}
                  alt={currentPhoto.title}
                  className="gl-lightbox-photo"
                />

                <figcaption>
                  <strong>{currentPhoto.title}</strong>
                  <span>
                    {currentPhoto.category} · {openIndex + 1} / {photoCount}
                  </span>
                </figcaption>
              </figure>

              <button
                type="button"
                className="gl-round-btn gl-lightbox-next"
                onClick={showNext}
                aria-label="Next photograph"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}

export default Gallery;