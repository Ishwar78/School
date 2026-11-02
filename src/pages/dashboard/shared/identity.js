import { personFromUser } from "./school";

export function readAuthenticatedUser() {
  try {
    const user = JSON.parse(localStorage.getItem("eduflowUser") || "null");

    if (user === null || (typeof user === "object" && !Array.isArray(user))) {
      return user;
    }

    throw new TypeError("The saved dashboard user must be an object.");
  } catch (error) {
    console.error("Unable to read the saved dashboard user.", error);

    return null;
  }
}

export function resolveDashboardPerson(records, user, role) {
  const person = personFromUser(records, user, role);

  return { person: person || null };
}
