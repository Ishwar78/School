import React from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./Legal.css";

const lastUpdated = "October 26, 2026";

const legalPages = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "This page explains what information this website handles and how it is used. The school should review and update this policy before connecting production accounts, analytics, or enquiry services.",
    sections: [
      {
        title: "Information you provide",
        paragraphs: [
          "The public Contact and Admissions pages include enquiry forms. In the current website build, those forms are not connected to a submission service. Submitting a form does not send its contents to the school.",
          "Please do not enter sensitive personal, health, financial, or student information into a form unless the school has confirmed an approved submission channel."
        ]
      },
      {
        title: "School portal and browser storage",
        paragraphs: [
          "The portal is a demonstration application. It stores demo account, school-record, and signed-in-user data in your browser's local storage on the device you use. This data is not sent to a school server by the current demo implementation.",
          "Other people using the same browser or device may be able to access locally stored demo data. Sign out on shared devices, and do not use real student records or real passwords in this demonstration portal. Clearing browser storage removes locally saved app data."
        ]
      },
      {
        title: "Cookies, analytics, and third parties",
        paragraphs: [
          "The current app code does not configure analytics or a cookie-based tracking service. The website loads some fonts from Google Fonts and may display an embedded map from Google Maps on the Contact page; those providers may receive technical request information when their resources load and handle it under their own policies."
        ]
      },
      {
        title: "Children's information",
        paragraphs: [
          "The public pages are intended to provide information about the school. Because this demo portal is not a production student-data system, children and families should not use it to submit real student records or confidential information."
        ]
      },
      {
        title: "Changes and questions",
        paragraphs: [
          "This notice may be updated as the website and its services change. For privacy questions, contact the school using the details on the Contact page. Add the school's verified contact details and approved data-handling practices before using this page as the school's formal privacy notice."
        ]
      }
    ]
  },
  terms: {
    title: "Terms & Conditions",
    intro:
      "These terms apply to use of the VEDA International School website and its demonstration school portal. Please read them before using the site.",
    sections: [
      {
        title: "Website information",
        paragraphs: [
          "The website provides general information about VEDA International School, its activities, and admissions. Content may be updated and is not a guarantee of admission, availability, fees, or any particular school service.",
          "For current admission criteria, documents, dates, fees, and other official decisions, please confirm directly with the school."
        ]
      },
      {
        title: "Demonstration portal",
        paragraphs: [
          "The school portal on this website is a demonstration, not a production service for official school records. Demo data is stored in the browser and may be reset, changed, or lost. Do not enter real passwords, confidential information, or real student, parent, or staff records."
        ]
      },
      {
        title: "Acceptable use",
        paragraphs: [
          "Use the website lawfully and respectfully. Do not attempt to disrupt the site, gain unauthorized access, interfere with another person's use, or upload harmful or misleading content."
        ]
      },
      {
        title: "Enquiries and external services",
        paragraphs: [
          "Contact and Admissions forms are not connected to a submission service in the current build, so sending a form does not deliver an enquiry to the school. Use verified school contact details for important or time-sensitive matters.",
          "Links and embedded content from third-party services are provided for convenience. Those services are governed by their own terms and privacy policies."
        ]
      },
      {
        title: "Updates and contact",
        paragraphs: [
          "These terms may change as the website develops. Continued use after an update means you are using the current version. Contact the school through its verified contact channels with questions about these terms."
        ]
      }
    ]
  }
};

function LegalPage({ page }) {
  const content = legalPages[page];

  return (
    <>
      <Navbar />
      <main className="legal-page">
        <article className="legal-content">
          <div className="legal-container">
            <header className="legal-heading">
              <span className="legal-eyebrow">SCHOOL INFORMATION</span>
              <h1>{content.title}</h1>
              <p className="legal-updated">Last updated: {lastUpdated}</p>
              <p className="legal-intro">{content.intro}</p>
            </header>

            <div className="legal-sections">
              {content.sections.map((section) => (
                <section className="legal-section" key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

export function PrivacyPolicy() {
  return <LegalPage page="privacy" />;
}

export function TermsConditions() {
  return <LegalPage page="terms" />;
}
