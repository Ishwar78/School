export const DEMO_ACCOUNTS_STORAGE_KEY = "eduflow_demo_accounts";

export function readAdditionalAccounts() {
  const saved = localStorage.getItem(DEMO_ACCOUNTS_STORAGE_KEY);

  if (saved === null) {
    return [];
  }

  const accounts = JSON.parse(saved);

  if (!Array.isArray(accounts)) {
    throw new TypeError("Saved demo accounts must be an array.");
  }

  const validAccounts = accounts.every(
    (account) =>
      account &&
      account.id != null &&
      account.recordId != null &&
      typeof account.name === "string" &&
      typeof account.email === "string" &&
      typeof account.password === "string" &&
      ["student", "teacher", "parent"].includes(account.role),
  );

  if (!validAccounts) {
    throw new TypeError("Saved demo accounts contain invalid account data.");
  }

  return accounts;
}

export function saveAdditionalAccounts(accounts) {
  localStorage.setItem(
    DEMO_ACCOUNTS_STORAGE_KEY,
    JSON.stringify(accounts),
  );
}
