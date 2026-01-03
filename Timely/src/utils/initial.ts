export function getInitials(email: string): string {
  const namePart = email.split("@")[0]; // "john.doe"
  const parts = namePart.split(/[.\-_]/); // split by ., -, _ etc
  const initials = parts
    .filter(Boolean)
    .map((p) => p[0].toUpperCase())
    .slice(0, 2)
    .join(""); // max 2 letters
  return initials || "?";
}
