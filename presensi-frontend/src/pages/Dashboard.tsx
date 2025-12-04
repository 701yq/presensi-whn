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
  const [qrToken, setQrToken] = useState<string>("");

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Ambil data user & jadwal dari backend
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

  // Fungsi ambil data jadwal
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

  // Saat user klik “Simpan” di form
  const handleAddSubmit = (v: AddFormValue) => {
    const formData = {
      kode: v.kode,
      mataKuliah: v.mataKuliah,
      jumlah: v.jumlah,
      mulai: v.mulai,
      selesai: v.selesai,
      deskripsi: v.deskripsi,
      token_qr: v.token_qr,
    };

    setPendingPayload(JSON.stringify(formData));
    setOpenAdd(false);
    setOpenQR(true);
    setQrToken(v.token_qr);
  };

  // Saat user klik “Simpan” di modal QR
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

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // Fungsi konfirmasi hapus
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/jadwal/${deleteId}`);
      toast.success("Jadwal berhasil dihapus!");
      setShowConfirmDelete(false);
      setDeleteId(null);
      fetchJadwal();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus jadwal");
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  // Fungsi untuk menentukan status jadwal
  const getStatus = (jadwal: Jadwal): string => {
    const now = new Date();
    const mulai = new Date(jadwal.jam_mulai);
    const selesai = new Date(jadwal.jam_selesai);

    if (now < mulai) return "Belum Mulai";
    if (now >= mulai && now <= selesai) return "Berjalan";
    return "Selesai";
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
                  <th className="text-left py-3">STATUS</th>
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
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          getStatus(row) === "Berjalan"
                            ? "bg-green-100 text-green-700"
                            : getStatus(row) === "Belum Mulai"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {getStatus(row)}
                      </span>
                    </td>

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
                          onClick={() => handleEdit(row.id)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700"
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
                    <td colSpan={8} className="py-10 text-center text-gray-500">
                      Belum ada jadwal. Klik “Tambah Jadwal”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---------- Popup Konfirmasi Hapus ---------- */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Konfirmasi Hapus
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus jadwal ini?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Modals ---------- */}
      <AddScheduleModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddSubmit}
      />

      <QRModal
        open={openQR}
        onClose={() => setOpenQR(false)}
        payload={qrToken}
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
