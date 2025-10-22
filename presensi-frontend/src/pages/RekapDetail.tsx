// src/pages/RekapDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { QrCode, Pencil, Check, Info as InfoIcon } from "lucide-react";
import QRModal from "../components/QRModal";
import EditScheduleModal from "../components/EditScheduleModal";
import InfoModal from "../components/InfoModal";
import { api } from "../lib/api";

// ----- Typing lokal -----
type Student = {
  id: string;
  nim: string;
  nama: string;
  waktu: string | null;
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
  mulai: string;
  selesai: string;
  qrPayload: string;
  createdAt: string;
  students: Student[];
};

type InfoPayload = { lat: number; lng: number; waktu: string };

export default function RekapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sched, setSched] = useState<Schedule | null>(null);
  const [openQR, setOpenQR] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [infoFor, setInfoFor] = useState<InfoPayload | null>(null);

  // ----- Ambil data presensi berdasarkan jadwal_id -----
  const loadData = async (jadwalId: string) => {
    try {
      const resJ = await api.get(`/jadwal/${jadwalId}`);
      const resP = await api.get(`/presensi/jadwal/${jadwalId}`);

      const jadwalApi = resJ.data;
      const presensiList = resP.data || [];

      const schedule: Schedule = {
        id: String(jadwalApi.id),
        kode: jadwalApi.kode_mk ?? "",
        mataKuliah: jadwalApi.nama_mk ?? "",
        kelas: "",
        jumlah: jadwalApi.jumlah ?? 0,
        hari: "",
        mulai: jadwalApi.jam_mulai ?? "",
        selesai: jadwalApi.jam_selesai ?? "",
        qrPayload: jadwalApi.token_qr ?? "",
        createdAt: new Date().toISOString(),
        students: presensiList.map((p: any) => ({
          id: String(p.presensi_id),
          nim: p.nim,
          nama: p.nama_mahasiswa ?? "",
          waktu: p.waktu ?? null,
          lat: p.lat ? Number(p.lat) : undefined,
          lng: p.lng ? Number(p.lng) : undefined,
        })),
      };

      setSched(schedule);
    } catch (err) {
      console.error("Gagal memuat rekap:", err);
      setSched(null);
    }
  };

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  // ----- Format tanggal hari ini -----
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

  // ----- Refresh data setelah edit -----
  const handleSaveEdit = async () => {
    if (!sched) return;
    await loadData(sched.id);
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
                {sched.mataKuliah}
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
              <QrCode size={16} /> QR
            </button>

            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              title="Edit jadwal"
              onClick={() => setOpenEdit(true)}
              disabled={!sched}
            >
              <Pencil size={16} /> Edit
            </button>

            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              title="Selesai (kembali ke Dashboard)"
              onClick={() => navigate("/dashboard", { replace: true })}
            >
              <Check size={16} /> Selesai
            </button>
          </div>
        </div>

        {/* ---------- Tabel Mahasiswa ---------- */}
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
                    <td colSpan={5} className="py-10 text-center text-gray-500">
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
      <QRModal
        open={openQR}
        onClose={() => setOpenQR(false)}
        payload={sched?.qrPayload ?? ""}
        onSave={() => setOpenQR(false)}
      />

      {sched && (
        <EditScheduleModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          scheduleId={sched.id}
          onSave={handleSaveEdit}
        />
      )}

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
