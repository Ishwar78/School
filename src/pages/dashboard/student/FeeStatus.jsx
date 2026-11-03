import React from "react";
import {
  Wallet,
  CheckCircle2,
  Clock,
  Download,
  Receipt,
  AlertCircle
} from "lucide-react";
import "./FeeStatus.css";

const FEE_INSTALLMENTS = [
  { term: "Quarter 1 (Apr - Jun 2026)", dueDate: "15 Apr 2026", amount: 15000, status: "Paid", receiptNo: "REC-2026-4421", datePaid: "10 Apr 2026" },
  { term: "Quarter 2 (Jul - Sep 2026)", dueDate: "15 Jul 2026", amount: 15000, status: "Paid", receiptNo: "REC-2026-8894", datePaid: "12 Jul 2026" },
  { term: "Quarter 3 (Oct - Dec 2026)", dueDate: "15 Oct 2026", amount: 15000, status: "Pending", receiptNo: "—", datePaid: "—" },
  { term: "Quarter 4 (Jan - Mar 2027)", dueDate: "15 Jan 2027", amount: 15000, status: "Upcoming", receiptNo: "—", datePaid: "—" },
];

export default function FeeStatus({ student = {} }) {
  const totalAnnual = 60000;
  const paid = 30000;
  const pending = 15000;
  const upcoming = 15000;

  const handleDownloadReceipt = (receipt) => {
    alert(`Receipt ${receipt} generated. Downloading PDF...`);
  };

  return (
    <div className="student-fees-page">
      {/* HEADER */}
      <div className="fees-header">
        <div className="fees-header-info">
          <span>FINANCIAL ACCOUNTING</span>
          <h2>Fee Status & Receipts</h2>
          <p>Quarterly installment breakdown, payment receipts and transaction records.</p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: "#64748b" }}>Academic Session: <strong>2026-2027</strong></span>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="fees-summary-grid">
        <div className="fee-stat-card">
          <span>Total Annual Fee</span>
          <h3>₹{totalAnnual.toLocaleString("en-IN")}</h3>
        </div>

        <div className="fee-stat-card">
          <span>Amount Paid</span>
          <h3 style={{ color: "#059669" }}>₹{paid.toLocaleString("en-IN")}</h3>
        </div>

        <div className="fee-stat-card">
          <span>Current Due / Pending</span>
          <h3 style={{ color: "#dc2626" }}>₹{pending.toLocaleString("en-IN")}</h3>
        </div>

        <div className="fee-stat-card">
          <span>Upcoming Installment</span>
          <h3 style={{ color: "#475569" }}>₹{upcoming.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      {/* INSTALLMENTS BREAKDOWN */}
      <div className="fees-breakdown-card">
        <h3 style={{ margin: "0 0 16px 0", color: "#082b55", fontSize: "18px" }}>Quarterly Fee Schedule & Receipts</h3>

        <div style={{ overflowX: "auto" }}>
          <table className="fees-table">
            <thead>
              <tr>
                <th>Fee Installment / Description</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt No.</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {FEE_INSTALLMENTS.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: "700", color: "#0f172a" }}>{item.term}</td>
                  <td>{item.dueDate}</td>
                  <td><strong>₹{item.amount.toLocaleString("en-IN")}</strong></td>
                  <td>
                    <span className={`fee-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ color: item.receiptNo !== "—" ? "#082b55" : "#94a3b8", fontWeight: "600" }}>
                    {item.receiptNo}
                  </td>
                  <td style={{ color: "#64748b" }}>{item.datePaid}</td>
                  <td>
                    {item.status === "Paid" ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(item.receiptNo)}
                        style={{
                          background: "#f1f5f9",
                          color: "#082b55",
                          border: "1px solid #cbd5e1",
                          borderRadius: "6px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Download size={13} /> Receipt
                      </button>
                    ) : item.status === "Pending" ? (
                      <span style={{ color: "#b91c1c", fontWeight: "700", fontSize: "12px" }}>
                        Pay at Accounts Office
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "12px" }}>Not Due Yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
