import { useRef } from "react";
import Modal from "./Modal";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  open: boolean;
  onClose: () => void;
  payload: string; // value yang di-encode
  onSave: () => void; // simpan ke storage
};

export default function QRModal({ open, onClose, payload, onSave }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  const download = () => {
    const url = ref.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "QR-Presensi.png";
    a.click();
  };

  return (
    <Modal open={open} onClose={onClose} title="Scan QR" widthClass="max-w-sm">
      <div className="flex flex-col items-center gap-4">
        <QRCodeCanvas value={payload} size={220} includeMargin ref={ref} />
        <div className="w-full">
          <p className="text-sm text-gray-600">Kode Presensi</p>
          <input
            className="w-full border-b outline-none py-1"
            readOnly
            value={payload}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={download}
            className="px-4 py-2 rounded-full bg-green-500 text-white"
          >
            Download
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-full bg-[#1E63B4] text-white"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
}
