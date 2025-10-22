// src/components/EditScheduleModal.tsx
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { api } from "../lib/api";

type Jadwal = {
  id: number;
  kode_mk: string;
  nama_mk: string;
  nidn: string;
  nama_dosen: string;
  jam_mulai: string;
  jam_selesai: string;
  token_qr: string;
  deskripsi: string;
  jumlah: number;
};

type MataKuliah = {
  kode_mk: string;
  nama_mk: string;
  sks: number;
};

interface EditScheduleModalProps {
  open: boolean;
  onClose: () => void;
  scheduleId: string;
  onSave: () => void;
}

export default function EditScheduleModal({
  open,
  onClose,
  scheduleId,
  onSave,
}: EditScheduleModalProps) {
  const [data, setData] = useState<Jadwal | null>(null);
  const [listMK, setListMK] = useState<MataKuliah[]>([]);
  const [customMK, setCustomMK] = useState(false);

  // 🔹 Ambil daftar mata kuliah + data jadwal saat modal dibuka
  useEffect(() => {
    async function fetchData() {
      try {
        const [resJadwal, resMK] = await Promise.all([
          api.get(`/jadwal/${scheduleId}`),
          api.get("/mata-kuliah"),
        ]);
        setData(resJadwal.data);
        setListMK(resMK.data);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    }

    if (open && scheduleId) fetchData();
  }, [open, scheduleId]);

  const setField = (key: keyof Jadwal, value: any) => {
    if (!data) return;
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // 🔹 Simpan perubahan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      await api.put(`/jadwal/${data.id}`, {
        kode_mk: data.kode_mk,
        nidn: data.nidn,
        jam_mulai: data.jam_mulai,
        jam_selesai: data.jam_selesai,
        token_qr: data.token_qr,
        deskripsi: data.deskripsi,
        jumlah: data.jumlah,
      });
      onSave();
      onClose();
    } catch (err) {
      console.error("Gagal mengupdate jadwal:", err);
    }
  };

  if (!data) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Jadwal"
      widthClass="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mata Kuliah */}
        <div>
          <label className="text-sm text-gray-600">Mata Kuliah</label>
          {!customMK ? (
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.kode_mk}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "__custom__") {
                  setCustomMK(true);
                  setField("kode_mk", "");
                  setField("nama_mk", "");
                  return;
                }
                const mk = listMK.find((x) => x.kode_mk === value);
                setField("kode_mk", value);
                setField("nama_mk", mk?.nama_mk || "");
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
                value={data.kode_mk}
                onChange={(e) => setField("kode_mk", e.target.value)}
              />
              <input
                type="text"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Nama Mata Kuliah"
                value={data.nama_mk}
                onChange={(e) => setField("nama_mk", e.target.value)}
              />
            </div>
          )}

          {/* Tombol kembali hanya muncul jika mode custom aktif */}
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
            min={0}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={data.jumlah}
            onChange={(e) => setField("jumlah", Number(e.target.value) || 0)}
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="text-sm text-gray-600">Deskripsi</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2"
            rows={3}
            value={data.deskripsi}
            onChange={(e) => setField("deskripsi", e.target.value)}
          />
        </div>

        {/* Token QR */}
        <div>
          <label className="text-sm text-gray-600">Token QR</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-50"
            value={data.token_qr}
            onChange={(e) => setField("token_qr", e.target.value)}
          />
        </div>

        {/* Waktu Mulai & Selesai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Waktu Mulai</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.jam_mulai}
              onChange={(e) => setField("jam_mulai", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Waktu Selesai</label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={data.jam_selesai}
              onChange={(e) => setField("jam_selesai", e.target.value)}
            />
          </div>
        </div>

        {/* Tombol */}
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
            Simpan Perubahan
          </button>
        </div>
      </form>
    </Modal>
  );
}
