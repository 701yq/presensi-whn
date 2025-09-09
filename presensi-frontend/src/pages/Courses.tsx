import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getSchedules, removeSchedule, type Schedule } from "../store/scheduleStore";
import QRModal from "../components/QRModal";

export default function Courses() {
  const [data, setData] = useState<Schedule[]>([]);
  const [openQR, setOpenQR] = useState(false);
  const [qrPayload, setQrPayload] = useState("");

  useEffect(() => setData(getSchedules()), []);

  const refresh = () => setData(getSchedules());

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Daftar Mata Kuliah</h1>

        <div className="bg-white rounded-2xl shadow-md">
          <div className="px-6 pb-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left py-3">KODE</th>
                  <th className="text-left py-3">NAMA MATA KULIAH</th>
                  <th className="text-left py-3">KELAS</th>
                  <th className="text-left py-3">HARI</th>
                  <th className="text-left py-3">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-4">{r.kode}</td>
                    <td className="py-4">{r.mataKuliah}</td>
                    <td className="py-4">{r.kelas}</td>
                    <td className="py-4">{r.hari}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => { setQrPayload(r.qrPayload); setOpenQR(true); }}
                        >
                          Lihat
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => { removeSchedule(r.id); refresh(); }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!data.length && (
                  <tr><td colSpan={5} className="py-10 text-center text-gray-500">
                    Belum ada data.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <QRModal open={openQR} onClose={() => setOpenQR(false)} payload={qrPayload} onSave={() => setOpenQR(false)} />
    </Layout>
  );
}
