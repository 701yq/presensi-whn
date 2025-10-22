// src/components/AddScheduleModal.tsx
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { api } from "../lib/api";

export type AddFormValue = {
  kode: string;
  mataKuliah: string;
  jumlah: number | "";
  mulai: string;
  selesai: string;
  deskripsi: string;
  token_qr: string;
};

type MataKuliah = {
  kode_mk: string;
  nama_mk: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddFormValue) => void;
};

export default function AddScheduleModal({ open, onClose, onSubmit }: Props) {
  const initialState: AddFormValue = {
    kode: "",
    mataKuliah: "",
    jumlah: "",
    mulai: "",
    selesai: "",
    deskripsi: "",
    token_qr: "",
  };

  const [v, setV] = useState<AddFormValue>(initialState);
  const [listMK, setListMK] = useState<MataKuliah[]>([]);
  const [customMK, setCustomMK] = useState(false);

  // 🔹 Ambil data mata kuliah saat modal dibuka
  useEffect(() => {
    async function fetchMK() {
      try {
        const res = await api.get("/mata-kuliah");
        setListMK(res.data);
      } catch (err) {
        console.error("Gagal mengambil data mata kuliah:", err);
      }
    }

    if (open) {
      fetchMK();
      // Reset form & buat token baru setiap kali modal dibuka
      setV({
        ...initialState,
        token_qr: `QR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      });
      setCustomMK(false);
    }
  }, [open]);

  const setField = (k: keyof AddFormValue, val: any) =>
    setV((s) => ({ ...s, [k]: val }));

  // 🔹 Simpan data jadwal (jika manual, buat MK dulu)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.kode || !v.mulai || !v.selesai) {
      alert("Mohon lengkapi semua kolom wajib.");
      return;
    }

    try {
      // Jika user menambah MK manual, tambahkan ke database terlebih dahulu
      if (customMK) {
        await api.post("/mata-kuliah", {
          kode_mk: v.kode,
          nama_mk: v.mataKuliah,
        });
      }

      // Lanjutkan kirim ke parent untuk buat jadwal
      onSubmit(v);
    } catch (err) {
      console.error("Gagal menambah mata kuliah:", err);
      alert("Gagal menambah mata kuliah. Pastikan kode MK belum terpakai.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah Jadwal Baru"
      widthClass="max-w-lg"
    >
      <form onSubmit={submit} className="space-y-4">
        {/* Mata Kuliah */}
        <div>
          <label className="text-sm text-gray-600">Mata Kuliah</label>

          {!customMK ? (
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={v.kode}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "__custom__") {
                  setCustomMK(true);
                  setField("kode", "");
                  setField("mataKuliah", "");
                  return;
                }
                const mk = listMK.find((x) => x.kode_mk === value);
                setField("kode", value);
                setField("mataKuliah", mk?.nama_mk || "");
              }}
            >
              <option value="">Pilih Mata Kuliah</option>
              {listMK.map((m) => (
                <option key={m.kode_mk} value={m.kode_mk}>
                  {m.nama_mk} ({m.kode_mk})
                </option>
              ))}
              <option value="__custom__">+ Tambah manual</option>
            </select>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Kode MK (contoh: MK001)"
                value={v.kode}
                onChange={(e) => setField("kode", e.target.value)}
              />
              <input
                type="text"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Nama Mata Kuliah"
                value={v.mataKuliah}
                onChange={(e) => setField("mataKuliah", e.target.value)}
              />
            </div>
          )}

          {/* Tombol kembali hanya muncul jika mode manual aktif */}
          {customMK && (
            <button
              type="button"
              onClick={() => setCustomMK(false)}
              className="text-xs text-gray-500 mt-1"
            >
              ← Kembali ke daftar
            </button>
          )}
        </div>

        {/* Jumlah Peserta */}
        <div>
          <label className="text-sm text-gray-600">Jumlah Peserta</label>
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="30"
            value={v.jumlah}
            onChange={(e) => setField("jumlah", Number(e.target.value) || "")}
          />
        </div>

        {/* Deskripsi Jadwal */}
        <div>
          <label className="text-sm text-gray-600">Deskripsi</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Masukkan deskripsi jadwal (opsional)"
            rows={3}
            value={v.deskripsi}
            onChange={(e) => setField("deskripsi", e.target.value)}
          />
        </div>

        {/* Token QR Jadwal */}
        <div>
          <label className="text-sm text-gray-600">Token QR</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-50"
            value={v.token_qr}
            onChange={(e) => setField("token_qr", e.target.value)}
            placeholder="Token unik QR Code"
          />
        </div>

        {/* Waktu Mulai dan Selesai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Waktu Mulai</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={v.mulai}
              onChange={(e) => setField("mulai", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Waktu Selesai</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={v.selesai}
              onChange={(e) => setField("selesai", e.target.value)}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#1E63B4] text-white"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
}
