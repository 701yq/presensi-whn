// src/pages/RekapDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { QrCode, Pencil, Check, Info as InfoIcon } from "lucide-react";
import QRModal from "../components/QRModal";
import StatusSelect from "../components/StatusSelect";
import InfoModal from "../components/InfoModal";
import Modal from "../components/Modal";

import {
  getScheduleById,
  updateScheduleFields,
  updateStudentStatus,
  type Schedule,
  type Status,
} from "../store/scheduleStore";

type InfoPayload = { lat: number; lng: number; waktu: string };

export default function RekapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sched, setSched] = useState<Schedule | null>(null);

  // modal states
  const [openQR, setOpenQR] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [infoFor, setInfoFor] = useState<InfoPayload | null>(null);

  // form edit state lokal
  const [fKode, setFKode] = useState("");
  const [fMK, setFMK] = useState("");
  const [fKelas, setFKelas] = useState("");
  const [fJumlah, setFJumlah] = useState<number | "">("");
  const [fHari, setFHari] = useState("");
  const [fMulai, setFMulai] = useState("");
  const [fSelesai, setFSelesai] = useState("");

  // load data
  useEffect(() => {
    if (!id) return;
    const s = getScheduleById(id) ?? null;
    setSched(s);
  }, [id]);

  // ketika buka modal edit, prefill field dari sched
  useEffect(() => {
    if (openEdit && sched) {
      setFKode(sched.kode);
      setFMK(sched.mataKuliah);
      setFKelas(sched.kelas);
      setFJumlah(sched.jumlah ?? "");
      setFHari(sched.hari);
      setFMulai(sched.mulai);
      setFSelesai(sched.selesai);
    }
  }, [openEdit, sched]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    []
  );

  const students = sched?.students ?? [];

  const handleChangeStatus = (studentId: string, s: Status) => {
    if (!sched) return;
    updateStudentStatus(sched.id, studentId, s);
    setSched(getScheduleById(sched.id) ?? null);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sched) return;

    updateScheduleFields(sched.id, {
      kode: fKode.trim(),
      mataKuliah: fMK.trim(),
      kelas: fKelas.trim(),
      jumlah: fJumlah === "" ? 0 : Number(fJumlah),
      hari: fHari,
      mulai: fMulai,
      selesai: fSelesai,
    });

    const updated = getScheduleById(sched.id) ?? null;
    setSched(updated);
    setOpenEdit(false);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-gray-500">{today}</p>

        <div className="mt-2 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-xl font-semibold">Rekap Presensi</h1>
            {sched ? (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">{sched.kode}</span> —{" "}
                {sched.mataKuliah} • Kelas {sched.kelas} • {sched.hari} (
                {sched.mulai}–{sched.selesai})
              </p>
            ) : (
              <p className="text-sm text-gray-400 mt-1">Memuat data…</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              title="Tampilkan QR"
              onClick={() => setOpenQR(true)}
              disabled={!sched}
            >
              <QrCode size={16} />
              QR
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              title="Edit jadwal"
              onClick={() => setOpenEdit(true)}
              disabled={!sched}
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              title="Selesai (kembali ke Dashboard)"
              onClick={() => navigate("/dashboard", { replace: true })}
            >
              <Check size={16} />
              Selesai
            </button>
          </div>
        </div>

        {/* Tabel mahasiswa */}
        <div className="mt-6 bg-white rounded-2xl shadow-md">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold">Daftar Mahasiswa</h2>
          </div>

          <div className="px-6 pb-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left py-3">No</th>
                  <th className="text-left py-3">NIM</th>
                  <th className="text-left py-3">Nama</th>
                  <th className="text-left py-3">Waktu</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Info</th>
                </tr>
              </thead>
              <tbody>
                {students.length ? (
                  students.map((mhs, idx) => (
                    <tr key={mhs.id} className="border-b last:border-0">
                      <td className="py-3">{idx + 1}</td>
                      <td className="py-3">{mhs.nim}</td>
                      <td className="py-3">{mhs.nama}</td>
                      <td className="py-3">
                        {mhs.waktu
                          ? new Date(mhs.waktu).toLocaleString("id-ID", {
                              timeStyle: "short",
                              dateStyle: "short",
                            })
                          : "-"}
                      </td>
                      <td className="py-3">
                        <StatusSelect
                          value={mhs.status}
                          onChange={(s) => handleChangeStatus(mhs.id, s)}
                        />
                      </td>
                      <td className="py-3">
                        <button
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full border text-gray-700 hover:bg-gray-50"
                          title="Detail lokasi & waktu"
                          onClick={() =>
                            setInfoFor({
                              lat: Number(mhs.lat ?? 0),
                              lng: Number(mhs.lng ?? 0),
                              waktu: mhs.waktu ?? new Date().toISOString(),
                            })
                          }
                        >
                          <InfoIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      Belum ada data presensi mahasiswa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---------- Modals ---------- */}

      {/* Modal QR */}
      <QRModal
        open={openQR}
        onClose={() => setOpenQR(false)}
        payload={sched?.qrPayload ?? ""}
        onSave={() => setOpenQR(false)}
      />

      {/* Modal Edit (form internal) */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Ubah Jadwal"
        widthClass="max-w-lg"
      >
        <form onSubmit={submitEdit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Kode</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={fKode}
                onChange={(e) => setFKode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Kelas</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={fKelas}
                onChange={(e) => setFKelas(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Mata Kuliah</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={fMK}
              onChange={(e) => setFMK(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600">Jumlah Mahasiswa</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={fJumlah}
                onChange={(e) =>
                  setFJumlah(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                min={0}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Hari</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={fHari}
                onChange={(e) => setFHari(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Mulai</label>
                <input
                  type="time"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={fMulai}
                  onChange={(e) => setFMulai(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Selesai</label>
                <input
                  type="time"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  value={fSelesai}
                  onChange={(e) => setFSelesai(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenEdit(false)}
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

      {/* Modal Info (peta & waktu) */}
      {infoFor && (
        <InfoModal
          open={true}
          onClose={() => setInfoFor(null)}
          lat={infoFor.lat}
          lng={infoFor.lng}
          waktuISO={infoFor.waktu}
        />
      )}
    </Layout>
  );
}
