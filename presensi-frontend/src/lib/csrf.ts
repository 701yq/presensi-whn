// baca cookie bernama XSRF-TOKEN (hasil dari /sanctum/csrf-cookie)
export function getXsrfToken(): string {
  const m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}
