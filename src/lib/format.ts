/* Fungsi pemformatan tunggal untuk nominal Rupiah dan angka berat desimal di seluruh aplikasi. */

/**
 * Memformat angka menjadi Rupiah tanpa spasi dan tanpa desimal (contoh: Rp50.000).
 */
export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  const formattedNumber = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return rounded < 0 ? `-Rp${formattedNumber}` : `Rp${formattedNumber}`;
}

/**
 * Memformat berat kilogram memakai koma tanpa nol di belakang (contoh: 4,5 atau 3).
 */
export function formatWeight(kg: number): string {
  const normalized = Number(kg.toFixed(2));
  return normalized.toString().replace('.', ',');
}
