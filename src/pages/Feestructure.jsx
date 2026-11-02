import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  Percent,
  Receipt,
  Users,
  Wallet
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBanner from "../components/PageBanner";
import "./FeeStructure.css";

/* =====================================================
   EDIT HERE: all the text and amounts on this page live
   in this section. Nothing else needs to change.

   IMPORTANT: every amount and rule below is only an
   EXAMPLE. Replace it with the school's approved fee
   information before the website goes live. While
   SHOW_SAMPLE_NOTICE is true, visitors see a note that
   the figures are examples. Set it to false once the
   approved fees are in.
   ===================================================== */

const SHOW_SAMPLE_NOTICE = true;

/* Fees are the same for every class in a stage.
   admission = paid once, at admission
   annual    = paid once every year
   monthly   = tuition fee, paid every month */
const STAGE_FEES = {
  Primary: { admission: 5000, annual: 6000, monthly: 1800 },
  Middle: { admission: 5000, annual: 7000, monthly: 2200 },
  Secondary: { admission: 6000, annual: 8000, monthly: 2600 },
  "Senior Secondary": { admission: 6000, annual: 9000, monthly: 3000 }
};

const STAGES = ["All", "Primary", "Middle", "Secondary", "Senior Secondary"];

const CLASSES = [
  { name: "Class 1", stage: "Primary" },
  { name: "Class 2", stage: "Primary" },
  { name: "Class 3", stage: "Primary" },
  { name: "Class 4", stage: "Primary" },
  { name: "Class 5", stage: "Primary" },
  { name: "Class 6", stage: "Middle" },
  { name: "Class 7", stage: "Middle" },
  { name: "Class 8", stage: "Middle" },
  { name: "Class 9", stage: "Secondary" },
  { name: "Class 10", stage: "Secondary" },
  { name: "Class 11", stage: "Senior Secondary" },
  { name: "Class 12", stage: "Senior Secondary" }
];

/* Fee guidelines: shown as cards. icon must be a name from ICONS below. */
const GUIDELINES = [
  {
    icon: "calendar",
    title: "Payment schedule",
    text: "Monthly tuition fee is paid by the due date set by the school each month. The annual charges are paid once at the start of the session."
  },
  {
    icon: "card",
    title: "Mode of payment",
    text: "Fees can be paid at the school office. Ask the office which payment methods are currently accepted."
  },
  {
    icon: "clock",
    title: "Late payment",
    text: "A late fee may apply when a payment is made after the due date. Please pay on time to avoid extra charges."
  },
  {
    icon: "users",
    title: "Siblings",
    text: "A concession may be available when more than one child from a family studies at VEDA. Please ask the school office for details."
  },
  {
    icon: "percent",
    title: "Refunds",
    text: "Refund rules are decided by the school. Please read them at the time of admission, and ask the office if anything is unclear."
  },
  {
    icon: "receipt",
    title: "Fee receipts",
    text: "A receipt is given for every payment. Please keep your receipts safe until the end of the session."
  }
];

/* Things that are not part of the table above. */
const NOT_INCLUDED = [
  "School transport (depends on the route)",
  "Books, stationery and uniform",
  "Examination and board registration fees",
  "Trips, events and optional activities"
];

/* Connects the icon words used above to the real icons. */
const ICONS = {
  calendar: CalendarDays,
  card: CreditCard,
  clock: Clock,
  users: Users,
  percent: Percent,
  receipt: Receipt
};

const money = (amount) => `₹${new Intl.NumberFormat("en-IN").format(amount)}`;

function FeeStructure() {
  const [stage, setStage] = useState("All");

  const rows = (stage === "All" ? CLASSES : CLASSES.filter((item) => item.stage === stage))
    .map((item) => {
      const fees = STAGE_FEES[item.stage];

      return {
        ...item,
        ...fees,
        firstYear: fees.admission + fees.annual + fees.monthly * 12
      };
    });

  return (
    <>
      <Navbar />

      <main className="veda-fees">

        <PageBanner
          image="/images/hero.png"
          alt="VEDA International School admissions"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Fee Structure" }]}
        />

        {/* 2. CLASS-WISE FEES */}

        <section className="fs-fees">
          <div className="fs-container">

            <div className="fs-heading">
              <div className="fs-eyebrow">
                <span />
                CLASS-WISE FEE INFORMATION
              </div>

              <h2>
                Fee Structure <em>at VEDA</em>
              </h2>

              {/* <p className="fs-lead">
                Choose a stage to see the fees for each class. Clear, simple
                and the same for every family.
              </p> */}
            </div>

            {SHOW_SAMPLE_NOTICE && (
              <div className="fs-notice" role="note">
                <Info size={20} strokeWidth={1.8} aria-hidden="true" />
                <p>
                  <strong>Sample figures.</strong> The amounts on this page are
                  examples only. Please contact the school office for the
                  approved fees.
                </p>
              </div>
            )}

            <div className="fs-filters" role="group" aria-label="Filter by stage">
              {STAGES.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`fs-filter ${stage === name ? "is-active" : ""}`}
                  aria-pressed={stage === name}
                  onClick={() => setStage(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="fs-table-wrap">
              <table className="fs-table">
                <caption className="fs-sr-only">
                  Class-wise fees in rupees
                </caption>

                <thead>
                  <tr>
                    <th scope="col">Class</th>
                    <th scope="col">Admission fee<small>Paid once</small></th>
                    <th scope="col">Annual charges<small>Every year</small></th>
                    <th scope="col">Tuition fee<small>Every month</small></th>
                    <th scope="col">First-year total<small>New admission</small></th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.name}
                      className={index > 0 && rows[index - 1].stage !== row.stage ? "fs-stage-start" : undefined}
                    >
                      <th scope="row" className="fs-class">
                        <span className="fs-class-name">{row.name}</span>
                        <span className="fs-class-stage">{row.stage}</span>
                      </th>
                      <td data-label="Admission fee (paid once)">{money(row.admission)}</td>
                      <td data-label="Annual charges (every year)">{money(row.annual)}</td>
                      <td data-label="Tuition fee (every month)">{money(row.monthly)}</td>
                      <td data-label="First-year total" className="fs-total">
                        {money(row.firstYear)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="fs-formula">
              <Wallet size={18} strokeWidth={1.8} aria-hidden="true" />
              First-year total = admission fee + annual charges + 12 months of
              tuition fee. From the second year, the admission fee is not paid again.
            </p>

          </div>
        </section>

        {/* 3. FEE GUIDELINES */}

        <section className="fs-guidelines">
          <div className="fs-container">

            <div className="fs-heading">
              <div className="fs-eyebrow">
                <span />
                FEE GUIDELINES
              </div>

              <h2>
                Good to <em>Know</em>
              </h2>

              <p className="fs-lead">
                A few simple points about paying fees at VEDA.
              </p>
            </div>

            <div className="fs-grid">
              {GUIDELINES.map((item) => {
                const Icon = ICONS[item.icon] || Info;

                return (
                  <article className="fs-card" key={item.title}>
                    <span className="fs-card-icon">
                      <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>

            <div className="fs-extra">
              <h3>Not included in the fees above</h3>

              <ul>
                {NOT_INCLUDED.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={19} strokeWidth={1.8} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <p>
                Ask the school office about these charges.
              </p>
            </div>

          </div>
        </section>

        {/* 4. CALL TO ACTION */}

        <section className="fs-cta">
          <div className="fs-container fs-cta-inner">
            <div>
              <h2>
                Questions about <em>fees?</em>
              </h2>
              <p>
                Contact the school office, or send an admission enquiry and
                our team will get in touch.
              </p>
            </div>

            <div className="fs-cta-buttons">
              <Link to="/admissions#enquiry" className="fs-btn">
                Admission Enquiry <ArrowUpRight size={18} />
              </Link>

              <Link to="/contact" className="fs-btn fs-btn-outline">
                Contact the School <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default FeeStructure;