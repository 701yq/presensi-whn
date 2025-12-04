// src/utils/date.ts

// Convert MySQL datetime (UTC or local) -> datetime-local input format
export function toLocalInputFormat(dateStr: string) {
  if (!dateStr) return "";

  const d = new Date(dateStr);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Convert datetime-local input -> MySQL DATETIME (UTC-safe)
export function toMySQL(local: string) {
  if (!local) return null;
  const d = new Date(local);
  return d.toISOString().slice(0, 19).replace("T", " ");
}
