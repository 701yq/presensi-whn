// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import AddScheduleModal, {
  type AddFormValue,
} from "../components/AddScheduleModal";
import EditScheduleModal from "../components/EditScheduleModal";
import QRModal from "../components/QRModal";
import toast from "react-hot-toast";

type User = { nidn: string; nama_dosen: string };

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

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<Jadwal[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingPayload, setPendingPayload] = useState<string>("");
  const [openQR, setOpenQR] = useState(false);

  // 🔹 Ambil data user & jadwal dari backend
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      toast.error("Sesi login berakhir, silakan login kembali.");
      navigate("/", { replace: true });
      return;
    }

    api
      .get("/verify-token")
      .then((resp) => {
        setUser(resp.data.payload);
        fetchJadwal();
      })
      .catch(() => {
        toast.error("Gagal memuat data pengguna");
        localStorage.removeItem("jwt_token");
        navigate("/", { replace: true });
      });
  }, [navigate]);

  // 🔹 Fungsi ambil data jadwal
  const fetchJadwal = async () => {
    try {
      const resp = await api.get("/jadwal");
      setData(resp.data);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data jadwal");
    }
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // 🔹 Saat user klik “Simpan” di form
  const handleAddSubmit = (v: AddFormValue) => {
    const payload = JSON.stringify({
      kode: v.kode,
      mataKuliah: v.mataKuliah,
      jumlah: v.jumlah,
      mulai: v.mulai,
      selesai: v.selesai,
      deskripsi: v.deskripsi,
      token_qr: v.token_qr,
    });

    setPendingPayload(payload);
    setOpenAdd(false);
    setOpenQR(true);
  };

  // 🔹 Saat user klik “Simpan QR” di modal QR
  const handleQrSave = async () => {
    try {
      const data = JSON.parse(pendingPayload);

      await api.post("/jadwal", {
        kode_mk: data.kode,
        nidn: user?.nidn,
        jam_mulai: data.mulai,
        jam_selesai: data.selesai,
        token_qr: data.token_qr,
        deskripsi: data.deskripsi,
        jumlah: data.jumlah ?? 0,
      });

      toast.success("Jadwal berhasil ditambahkan!");
      setOpenQR(false);
      fetchJadwal();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan jadwal");
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setOpenEdit(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus jadwal ini?")) return;
    try {
      await api.delete(`/jadwal/${id}`);
      toast.success("Jadwal berhasil dihapus!");
      fetchJadwal();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus jadwal");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-gray-500">{today}</p>
        <h1 className="mt-2 text-xl font-semibold">
          Selamat Datang, {user?.nama_dosen ?? "Dosen"}
        </h1>
        <p className="text-sm text-gray-500">
          Politeknik Kesehatan Wira Husada Nusantara
        </p>

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
                  <th className="text-left py-3">JUMLAH</th>
                  <th className="text-left py-3">DESKRIPSI</th>
                  <th className="text-left py-3">REKAP</th>
                  <th className="text-left py-3">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-4">{row.kode_mk}</td>
                    <td className="py-4">{row.nama_mk}</td>
                    <td className="py-4">{row.jumlah ?? 0}</td>
                    <td className="py-4">{row.deskripsi ?? "-"}</td>
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
                        <button
                          className="text-blue-600 hover:text-blue-700"
                          aria-label="Edit"
                          onClick={() => handleEdit(row.id)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
                          aria-label="Delete"
                          onClick={() => handleDelete(row.id)}
                        >
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

      {editingId && (
        <EditScheduleModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          scheduleId={String(editingId)}
          onSave={() => fetchJadwal()}
        />
      )}
    </Layout>
  );
}
