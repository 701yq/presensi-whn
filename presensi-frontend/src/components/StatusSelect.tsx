import type { Status } from "../store/scheduleStore";

const OPTIONS: Status[] = ["Hadir", "Izin", "Sakit", "Alpha"];

const color = (s: Status) => {
  switch (s) {
    case "Hadir":
      return "bg-green-100 text-green-700";
    case "Izin":
      return "bg-yellow-100 text-yellow-700";
    case "Sakit":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-red-100 text-red-700"; // Alpha
  }
};

export default function StatusSelect({
  value,
  onChange,
}: {
  value: Status;
  onChange: (s: Status) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Status)}
      className={`rounded-lg px-3 py-1 text-sm ${color(value)}`}
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
