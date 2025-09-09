// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import AddScheduleModal, { type AddFormValue } from "../components/AddScheduleModal";
import QRModal from "../components/QRModal";
import { addSchedule, getSchedules, type Schedule } from "../store/scheduleStore";

type User = { name: string };

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<Schedule[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  // untuk QR step
  const [pendingPayload, setPendingPayload] = useState<string>("");
  const [pendingSchedule, setPendingSchedule] = useState<Schedule | null>(null);
  const [openQR, setOpenQR] = useState(false);

  useEffect(() => {
    api.get("/api/user").then((r) => setUser(r.data)).catch(() => {});
    setData(getSchedules());
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleAddSubmit = (v: AddFormValue) => {
    const id = `JDW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // payload untuk QR
    const payload = JSON.stringify({
      id,
      kode: v.kode,
      kelas: v.kelas,
      hari: v.hari,
      mulai: v.mulai,
      selesai: v.selesai,
      issuedAt: new Date().toISOString(),
    });

    setPendingPayload(payload);

    // Schedule sementara untuk disimpan setelah QR disave
    setPendingSchedule({
      id,
      kode: v.kode,
      mataKuliah: v.mataKuliah,
      kelas: v.kelas,
      jumlah: Number(v.jumlah || 0),
      hari: v.hari,
      mulai: v.mulai,
      selesai: v.selesai,
      qrPayload: payload,
      createdAt: new Date().toISOString(),
      students: [], // wajib sesuai tipe Schedule
    });

    setOpenAdd(false);
    setOpenQR(true);
  };

  const handleQrSave = () => {
    if (!pendingSchedule) return;
    addSchedule(pendingSchedule);
    setData(getSchedules());
    setOpenQR(false);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-gray-500">{today}</p>
        <h1 className="mt-2 text-xl font-semibold">
          Selamat Datang, {user?.name ?? "Admin Test"}
        </h1>
        <p className="text-sm text-gray-500">Dosen, Wira Husada Nusantara</p>

        <div className="mt-8 bg-white rounded-2xl shadow-md">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-lg font-semibold">Aktivitas</h2>
            <button
              onClick={() => setOpenAdd(true)}
              className="inline-flex items-center gap-2 bg-[#1E63B4] text-white text-sm px-3 py-2 rounded-lg"
            >
              <Plus size={16} /> Tambah Jadwal
            </button>
          </div>

          <div className="px-6 pb-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left py-3">KODE</th>
                  <th className="text-left py-3">MATA KULIAH</th>
                  <th className="text-left py-3">KELAS</th>
                  <th className="text-left py-3">JUMLAH MAHASISWA</th>
                  <th className="text-left py-3">HARI</th>
                  <th className="text-left py-3">REKAP</th>
                  <th className="text-left py-3">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-4">{row.kode}</td>
                    <td className="py-4">{row.mataKuliah}</td>
                    <td className="py-4">{row.kelas}</td>
                    <td className="py-4">{row.jumlah}</td>
                    <td className="py-4">{row.hari}</td>
                    <td className="py-4">
                      <button
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full border text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate(`/rekap/${row.id}`)}
                        title="Lihat rekap"
                      >
                        <Plus size={16} />
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-700" aria-label="Edit">
                          <Pencil size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-700" aria-label="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!data.length && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500">
                      Belum ada jadwal. Klik “Tambah Jadwal”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddScheduleModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddSubmit}
      />
      <QRModal
        open={openQR}
        onClose={() => setOpenQR(false)}
        payload={pendingPayload}
        onSave={handleQrSave}
      />
    </Layout>
  );
}
