import React, { useState } from "react";

import { demoUsers } from "../../../data/demoUsers";
import {
  readAdditionalAccounts,
  saveAdditionalAccounts,
} from "../../../data/demoAccounts";
import useSchool from "../shared/useSchool";
import { Panel, Table } from "../shared/UI";

const recordsByRole = {
  student: "students",
  teacher: "teachers",
  parent: "parents",
};

export default function AdminAccounts() {
  const school = useSchool();
  const [accountState, setAccountState] = useState(() => {
    try {
      return { accounts: readAdditionalAccounts(), loadError: "" };
    } catch (error) {
      console.error("Unable to load saved demo accounts.", error);
      return {
        accounts: [],
        loadError:
          "Saved demo accounts could not be read. Fix the stored account data before adding accounts.",
      };
    }
  });
  const { accounts, loadError } = accountState;
  const [role, setRole] = useState("student");
  const [recordId, setRecordId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const records = school[recordsByRole[role]].items;
  const selectedRecord = records.find(
    (record) => String(record.id) === recordId,
  );

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

    if (loadError) {
      setError(loadError);
      return;
    }

    if (!selectedRecord) {
      setError("Select a school record before creating a login account.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailAlreadyUsed = [...demoUsers, ...accounts].some(
      (account) => account.email.toLowerCase() === normalizedEmail,
    );

    if (emailAlreadyUsed) {
      setError("An account with this email already exists.");
      return;
    }

    const nextAccounts = [
      ...accounts,
      {
        id: crypto.randomUUID(),
        recordId: selectedRecord.id,
        name: selectedRecord.name,
        email: normalizedEmail,
        password,
        role,
      },
    ];

    try {
      saveAdditionalAccounts(nextAccounts);
      setAccountState({ accounts: nextAccounts, loadError: "" });
      setPassword("");
      setMessage(`Login account created for ${selectedRecord.name}.`);
    } catch (saveError) {
      console.error("Unable to save the new demo account.", saveError);
      setError("The login account could not be saved in this browser.");
    }
  }

  return (
    <>
      <Panel
        title="Create a login account"
        subtitle="Link a separate demo login to an existing school record."
      >
        <form className="role-form" onSubmit={handleSubmit}>
          <label>
            Account role
            <select value={role} onChange={handleRoleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </label>
          <label>
            School record
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
            Login email
            <input
              required
              type="email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Demo password
            <input
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="role-primary" disabled={Boolean(loadError)}>
            Create login account
          </button>
        </form>
        <p className="role-muted">
          Demo passwords are stored separately from school records in this
          browser. This localStorage login is for development only, not for
          real student data.
        </p>
        {loadError && (
          <p className="storage-warning" role="alert">
            {loadError}
          </p>
        )}
        {error && (
          <p className="storage-warning" role="alert">
            {error}
          </p>
        )}
        {message && <p role="status">{message}</p>}
      </Panel>

      <Panel title="Additional login accounts">
        <Table
          headers={["Name", "Email", "Role", "Linked record"]}
          rows={accounts.map((account) => [
            account.name,
            account.email,
            account.role,
            account.recordId,
          ])}
        />
      </Panel>
    </>
  );
}
