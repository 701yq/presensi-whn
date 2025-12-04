// src/components/InfoModal.tsx
import Modal from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  waktuISO: string;
};

export default function InfoModal({
  open,
  onClose,
  lat,
  lng,
  waktuISO,
}: Props) {
  const waktu = new Date(waktuISO).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // OSM embed (no API key)
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.01
  }%2C${lat - 0.01}%2C${lng + 0.01}%2C${
    lat + 0.01
  }&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detail Informasi"
      widthClass="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="w-full aspect-video overflow-hidden rounded-lg border">
          <iframe title="map" className="w-full h-full" src={src} />
        </div>
        <div className="rounded-2xl border p-4">
          <p className="text-sm">
            Koordinat :{" "}
            <b>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </b>
          </p>
          <p className="text-sm mt-1">
            Waktu : <b>{waktu}</b>
          </p>
        </div>
      </div>
    </Modal>
  );
}
