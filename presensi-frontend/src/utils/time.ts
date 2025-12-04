// src/utils/time.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Aktifkan plugin
dayjs.extend(utc);
dayjs.extend(timezone);

// Fungsi umum: ambil waktu sekarang dalam WIB
export function getNowWIB() {
  return dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
}

// Ubah waktu UTC ke WIB
export function toWIB(datetime: string) {
  return dayjs(datetime).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
}

// Format tanggal WIB ke tampilan yang mudah dibaca
export function formatWIB(datetime: string) {
  return dayjs(datetime).tz("Asia/Jakarta").format("DD MMMM YYYY, HH:mm [WIB]");
}

export default dayjs;
