import { useState } from "react";
import Modal from "./Modal";

export type AddFormValue = {
  kode: string;
  mataKuliah: string;
  kelas: string;
  jumlah: number | "";
  hari: string;
  mulai: string;
  selesai: string;
};


const MATA_KULIAH = [
  { kode: "TIK201", nama: "Pemrograman Web" },
  { kode: "TIK202", nama: "Basis Data" },
  { kode: "TIK301", nama: "Jaringan Komputer" },
  { kode: "TIK102", nama: "Sistem Operasi" },
  { kode: "TIK401", nama: "Kecerdasan Buatan" },
  { kode: "TIK101", nama: "Algoritma dan Struktur Data" },
];

const HARI = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddFormValue) => void; // kirim ke parent; parent akan buka QR modal
};

export default function AddScheduleModal({ open, onClose, onSubmit }: Props) {
  const [v, setV] = useState<AddFormValue>({
    kode: "",
    mataKuliah: "",
    kelas: "",
    jumlah: "",
    hari: "",
    mulai: "",
    selesai: "",
  });

  const setField = (k: keyof AddFormValue, val: any) =>
    setV((s) => ({ ...s, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.kode || !v.kelas || !v.hari || !v.mulai || !v.selesai) return;
    onSubmit(v);
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Jadwal Baru" widthClass="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Mata Kuliah</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={v.kode}
            onChange={(e) => {
              const mk = MATA_KULIAH.find(x => x.kode === e.target.value);
              setField("kode", e.target.value);
              setField("mataKuliah", mk?.nama || "");
            }}
          >
            <option value="">Pilih Mata Kuliah</option>
            {MATA_KULIAH.map((m) => (
              <option key={m.kode} value={m.kode}>
                {m.nama} ({m.kode})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Kelas</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="A / B / C..."
              value={v.kelas}
              onChange={(e) => setField("kelas", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Jumlah Mahasiswa</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="30"
              value={v.jumlah}
              onChange={(e) => setField("jumlah", Number(e.target.value) || "")}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Hari</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={v.hari}
            onChange={(e) => setField("hari", e.target.value)}
          >
            <option value="">Pilih Hari</option>
            {HARI.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Waktu Mulai</label>
            <input
              type="time"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={v.mulai}
              onChange={(e) => setField("mulai", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Waktu Selesai</label>
            <input
              type="time"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={v.selesai}
              onChange={(e) => setField("selesai", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-[#1E63B4] text-white">
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
}
