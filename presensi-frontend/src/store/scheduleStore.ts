// src/store/scheduleStore.ts

export type Status = "Hadir" | "Izin" | "Sakit" | "Alpha";

export type Student = {
  id: string;
  nim: string;
  nama: string;
  status: Status;
  waktu?: string;  // ISO string
  lat?: number;
  lng?: number;
};

export type Schedule = {
  id: string;
  kode: string;
  mataKuliah: string;
  kelas: string;
  jumlah: number;
  hari: string;
  mulai: string;   // "HH:mm"
  selesai: string; // "HH:mm"
  qrPayload: string;
  createdAt: string;
  updatedAt?: string;
  students: Student[];
};

const KEY = "presensi.schedules";

function read(): Schedule[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Schedule[]) : [];
  } catch {
    return [];
  }
}

function write(data: Schedule[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/* ========== API yang sudah dipakai di tempat lain ========== */
export function getSchedules(): Schedule[] {
  return read();
}

export function saveSchedules(data: Schedule[]) {
  write(data);
}

export function addSchedule(s: Schedule) {
  const all = read();
  all.push(s);
  write(all);
}

/* ========== Helper untuk Rekap Detail ========== */
export function getScheduleById(id: string): Schedule | undefined {
  return read().find((x) => x.id === id);
}

export function updateScheduleFields(
  id: string,
  fields: Partial<
    Pick<
      Schedule,
      "kode" | "mataKuliah" | "kelas" | "jumlah" | "hari" | "mulai" | "selesai"
    >
  >
) {
  const all = read();
  const i = all.findIndex((x) => x.id === id);
  if (i === -1) return;
  all[i] = { ...all[i], ...fields, updatedAt: new Date().toISOString() };
  write(all);
}

export function updateStudentStatus(
  scheduleId: string,
  studentId: string,
  status: Status
) {
  const all = read();
  const si = all.findIndex((s) => s.id === scheduleId);
  if (si === -1) return;
  const sch = all[si];

  sch.students = (sch.students ?? []).map((st) =>
    st.id === studentId ? { ...st, status } : st
  );

  all[si] = sch;
  write(all);
}

export function removeSchedule(id: string) {
  const all = read();
  const next = all.filter((s) => s.id !== id);
  write(next);
}

export function upsertSchedule(s: Schedule) {
  const all = read();
  const i = all.findIndex((x) => x.id === s.id);
  if (i >= 0) all[i] = s;
  else all.push(s);
  write(all);
}

