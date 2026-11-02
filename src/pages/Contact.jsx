import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Globe,
  MapPin,
  MessageCircle,
  Phone,
  Send
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./Contact.css";

/*
  SCHOOL DETAILS: fill these in with the school's real information.
  Anything left empty ("") falls back to the sample text shown below.
*/
const SCHOOL = {
  name: "VEDA International School",
  address: "Thurana (Hansi), Haryana", // add the full street address here
  phone: "",                           // for example "+91 98765 43210"
  email: "",                           // for example "info@school.com"
  hours: ""                            // for example "Mon to Sat, 8:00 AM to 2:00 PM"
};

/* Used when SCHOOL.phone is empty. */
const SAMPLE_PHONE = "+91 98765 43210";

/*
  MAP: replace this with the agreed Google Maps embed link
  (Google Maps > Share > Embed a map > copy the src="..." address).
  Until then the map searches for the school name and address.
*/
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${SCHOOL.name} ${SCHOOL.address}`
)}&output=embed`;

// Opens the school location in Google Maps (used by "Get Directions").
const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SCHOOL.name} ${SCHOOL.address}`
)}`;

/*
  Where the contact form is sent.
  Paste your form endpoint here (for example a Formspree URL or your own API).
  WHILE THIS IS EMPTY the form only shows the success message and sends nothing.
*/
const ENQUIRY_URL = "";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "WhatsApp", href: "https://wa.me/919876543210" }
];

const subjectOptions = [
  "Admission enquiry",
  "General enquiry",
  "Feedback",
  "Other"
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: ""
};

/* Small icons for the social buttons (drawn here so no extra package is needed). */

function SocialIcon({ name }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };

  if (name === "Instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" />
      </svg>
    );
  }

  if (name === "Facebook") {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }

  return <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />;
}

function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const phone = SCHOOL.phone || SAMPLE_PHONE;

  /*
    The four cards at the top. Every card has the same parts:
      label, value (main line), detail (supporting line), and a footer
      (a link, or social buttons). "featured" makes a card stand out.

    SAMPLE TEXT: the "detail" lines and the fallback opening hours are
    examples. Replace them with the school's approved wording.
  */
  const infoCards = [
    {
      icon: MapPin,
      label: "VISIT US",
      value: SCHOOL.address,
      detail: "Visit us on any working day. Our team will be happy to help you.",
      linkText: "Get Directions",
      href: DIRECTIONS_URL,
      external: true
    },
    {
      icon: Phone,
      label: "CALL US",
      value: phone,
      detail: SCHOOL.hours || "Monday to Saturday, 8:00 AM to 2:00 PM",
      linkText: "Call Now",
      href: `tel:${phone.replace(/[^\d+]/g, "")}`
    },
    {
      icon: Globe,
      label: "SOCIAL MEDIA",
      value: "Stay Connected",
      detail: "Follow VEDA for school notices and updates.",
      socialLinks: SOCIAL_LINKS
    },
    {
      icon: ClipboardList,
      label: "ADMISSIONS",
      value: "Looking to join VEDA?",
      detail: "Admissions are open for Class 1 to 12. Talk to our admission team.",
      linkText: "Admission Enquiry",
      to: "/admissions#enquiry",
      featured: true
    }
  ];

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

        if (!response.ok) throw new Error("The message could not be sent.");
      } else {
        console.warn("Contact form is not connected yet (ENQUIRY_URL is empty). Nothing was sent.");
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

      <main className="veda-contact">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School campus and students"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Contact Us" }]}
        />

        {/* 2. CONTACT DETAILS */}

        <section className="ct-info">
          <div className="ct-container">

            <div className="ct-heading">
              <div className="ct-eyebrow">
                <span />
                GET IN TOUCH
              </div>

              <h2>
                How Can We <em>Help You?</em>
              </h2>

              <p className="ct-lead">
                Visit the school, reach us by phone or email, or send a
                message using the form below.
              </p>
            </div>

            <div className="ct-info-grid">
              {infoCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    className={card.featured ? "ct-info-card featured" : "ct-info-card"}
                    key={card.label}
                  >
                    <span className="ct-icon-circle">
                      <Icon size={24} strokeWidth={1.7} />
                    </span>

                    <span className="ct-info-label">{card.label}</span>
                    <h3 className="ct-info-value">{card.value}</h3>
                    <p className="ct-info-detail">{card.detail}</p>

                    <div className="ct-info-footer">
                      {card.socialLinks &&
                        card.socialLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            className="ct-social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <SocialIcon name={link.label} />
                            {link.label}
                          </a>
                        ))}

                      {card.to && (
                        <Link to={card.to} className="ct-text-link">
                          {card.linkText} <ArrowUpRight size={16} />
                        </Link>
                      )}

                      {card.href && (
                        <a
                          href={card.href}
                          className="ct-text-link"
                          {...(card.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {card.linkText} <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

          </div>
        </section>

        {/* 3. FORM AND MAP */}

        <section className="ct-main">
          <div className="ct-container ct-main-layout">

            <div className="ct-form-card">
              {status === "success" ? (
                <div className="ct-success" role="status">
                  <CheckCircle2 size={44} strokeWidth={1.6} />
                  <h3>Thank you for your message</h3>
                  <p>Your message has been submitted to the school.</p>

                  <button
                    type="button"
                    className="ct-btn"
                    onClick={() => setStatus("idle")}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Send Us a Message</h3>
                  <p className="ct-form-intro">Fields marked * are required.</p>

                  <div className="ct-fields">

                    <div className="ct-field">
                      <label htmlFor="name">Your Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div className="ct-field">
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

                    <div className="ct-field">
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

                    <div className="ct-field">
                      <label htmlFor="subject">Subject *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select subject</option>
                        {subjectOptions.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="ct-field ct-field-wide">
                      <label htmlFor="message">Your Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                  </div>

                  {status === "error" && (
                    <p className="ct-error" role="alert">
                      Sorry, we could not send your message. Please try again
                      or contact the school directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="ct-btn ct-submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending..." : "Send Message"}
                    <Send size={17} />
                  </button>
                </form>
              )}
            </div>

            <div className="ct-map-card">
              <div className="ct-map-frame">
                <iframe
                  title={`Map showing the location of ${SCHOOL.name}`}
                  src={MAP_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <div className="ct-map-footer">
                <div>
                  <strong>{SCHOOL.name}</strong>
                  <span>{SCHOOL.address}</span>
                </div>

                <a
                  href={DIRECTIONS_URL}
                  className="ct-text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Contact;