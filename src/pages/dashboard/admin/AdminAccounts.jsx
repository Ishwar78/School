import React, { useState } from "react";
import { DEFAULT_ADMIN } from "../../../data/adminCredentials";

const sampleRecords = {
  student: [
    { id: "std-1", name: "Aarav Sharma" },
    { id: "std-2", name: "Diya Patel" },
    { id: "std-3", name: "Rohan Verma" },
  ],
  teacher: [
    { id: "tch-1", name: "Dr. Rajesh Kumar" },
    { id: "tch-2", name: "Ananya Gupta" },
    { id: "tch-3", name: "Sunita Mehra" },
  ],
  parent: [
    { id: "par-1", name: "Vikram Sharma" },
    { id: "par-2", name: "Sunita Patel" },
  ],
};

const defaultAccounts = [
  {
    id: "acc-1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@eduflow.com",
    role: "teacher",
    recordId: "tch-1",
  },
  {
    id: "acc-2",
    name: "Aarav Sharma",
    email: "aarav.sharma@eduflow.com",
    role: "student",
    recordId: "std-1",
  },
];

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem("veda_admin_accounts");
      return saved ? JSON.parse(saved) : defaultAccounts;
    } catch {
      return defaultAccounts;
    }
  });

  const [role, setRole] = useState("student");
  const [recordId, setRecordId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const records = sampleRecords[role] || [];
  const selectedRecord = records.find((record) => String(record.id) === recordId);

  function handleRoleChange(event) {
    setRole(event.target.value);
    setRecordId("");
    setEmail("");
    setMessage("");
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedRecord) {
      setError("Please select a school record first.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailAlreadyUsed = [DEFAULT_ADMIN, ...accounts].some(
      (account) => account.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyUsed) {
      setError("An account with this email address already exists.");
      return;
    }

    const nextAccounts = [
      ...accounts,
      {
        id: "acc-" + Date.now(),
        recordId: selectedRecord.id,
        name: selectedRecord.name,
        email: normalizedEmail,
        role,
      },
    ];

    try {
      localStorage.setItem("veda_admin_accounts", JSON.stringify(nextAccounts));
      setAccounts(nextAccounts);
      setPassword("");
      setEmail("");
      setRecordId("");
      setMessage(`Login account successfully created for ${selectedRecord.name}.`);
    } catch (saveError) {
      console.error(saveError);
      setError("Account could not be saved to browser storage.");
    }
  }

  return (
    <section className="module">
      <div className="module-head">
        <div>
          <span className="eyebrow">SECURITY &amp; ACCESS</span>
          <h1>Login Accounts Management</h1>
          <p>Create and review user access credentials for student, parent and teacher logins.</p>
        </div>
      </div>

      <div className="panel form-panel">
        <h2>Create a Login Account</h2>
        <form className="role-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Account Role
              <select value={role} onChange={handleRoleChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </label>
            <label>
              School Record
              <select
                required
                value={recordId}
                onChange={(event) => {
                  setRecordId(event.target.value);
                  setMessage("");
                  setError("");
                }}
              >
                <option value="">Select a {role} record</option>
                {records.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.name} ({record.id})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Login Email
              <input
                required
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              Temporary Password
              <input
                required
                type="password"
                placeholder="At least 6 characters"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button type="submit" className="primary-btn">
              Create User Account
            </button>
          </div>
        </form>

        {error && (
          <p className="storage-warning" role="alert" style={{ color: "#ef4444", marginTop: "10px" }}>
            {error}
          </p>
        )}
        {message && (
          <p role="status" style={{ color: "#10b981", marginTop: "10px", fontWeight: "600" }}>
            {message}
          </p>
        )}
      </div>

      <div className="panel table-wrap">
        <h2>Registered Accounts</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Login Email</th>
              <th>Role</th>
              <th>Linked School Record</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td><strong>{account.name}</strong></td>
                <td>{account.email}</td>
                <td>
                  <span className="status active" style={{ textTransform: "capitalize" }}>
                    {account.role}
                  </span>
                </td>
                <td>{account.recordId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
