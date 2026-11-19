/* Logika perhitungan tarif laundry, validasi formulir, dan pembangkitan tautan WhatsApp sesuai PRD. */
import {
  ADD_ONS,
  ESTIMATE_DISCLAIMER,
  MAIN_SERVICES,
  STORE_INFO,
  WEIGHT_LIMITS,
  type MainService,
  type ServiceCode,
} from '../config.ts';
import { formatRupiah, formatWeight } from './format.ts';

export interface WeightValidationResult {
  valid: boolean;
  value: number | null;
  error?: string;
}

export interface EstimateInput {
  serviceCode: ServiceCode;
  weightInput: string;
  includePickup: boolean;
  includeFragrance: boolean;
}

export interface EstimateResult {
  service: MainService;
  isValidWeight: boolean;
  actualWeight: number | null;
  billedWeight: number | null;
  isMinChargeApplied: boolean;
  mainServiceCost: number | null;
  pickupCost: number;
  fragranceCost: number | null;
  previewFragranceCost: number | null;
  addOnsTotal: number | null;
  estimatedTotal: number | null;
}

export interface OrderFormInput {
  weightInput: string;
  customerName: string;
  pickupAddress: string;
  includePickup: boolean;
}

export type ValidationField = 'weight' | 'customerName' | 'pickupAddress';

export interface ValidationErrors {
  weight?: string;
  customerName?: string;
  pickupAddress?: string;
}

export interface FormValidationOutcome {
  isValid: boolean;
  errors: ValidationErrors;
  firstErrorField: ValidationField | null;
}

export interface WhatsAppMessageInput {
  customerName: string;
  service: MainService;
  actualWeight: number;
  billedWeight: number;
  includePickup: boolean;
  pickupCost: number;
  includeFragrance: boolean;
  fragranceCost: number;
  pickupAddress: string;
  notes: string;
  estimatedTotal: number;
}

const NUMERIC_PATTERN = /^-?\d+(\.\d+)?$/;

/**
 * Mengurai string input berat yang memakai koma atau titik menjadi angka desimal.
 */
export function parseWeightInput(raw: string): number | null {
  const cleaned = raw.trim().replace(',', '.');
  if (!cleaned || !NUMERIC_PATTERN.test(cleaned)) {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Memvalidasi input berat cucian terhadap batas minimum 0,1 kg dan maksimum 100 kg (BL-01).
 */
export function validateWeight(raw: string): WeightValidationResult {
  const parsed = parseWeightInput(raw);
  if (parsed === null || parsed < WEIGHT_LIMITS.minKg) {
    return {
      valid: false,
      value: null,
      error: 'Masukkan berat cucian minimal 0,1 kg, contoh: 2,5.',
    };
  }
  if (parsed > WEIGHT_LIMITS.maxKg) {
    return {
      valid: false,
      value: null,
      error: `Masukkan berat maksimal ${WEIGHT_LIMITS.maxKg} kg, contoh: 12,5.`,
    };
  }
  return {
    valid: true,
    value: parsed,
  };
}

/**
 * Mengambil objek layanan utama berdasarkan kode layanan.
 */
export function getMainServiceByCode(code: ServiceCode): MainService {
  return MAIN_SERVICES.find((item) => item.code === code) ?? MAIN_SERVICES[0];
}

/**
 * Menghitung berat ditagih (BL-01) serta rincian estimasi biaya layanan dan add-on (BL-02).
 */
export function calculateEstimate(input: EstimateInput): EstimateResult {
  const service = getMainServiceByCode(input.serviceCode);
  const weightCheck = validateWeight(input.weightInput);
  const pickupCost = input.includePickup ? ADD_ONS.pickup.price : 0;

  if (!weightCheck.valid || weightCheck.value === null) {
    return {
      service,
      isValidWeight: false,
      actualWeight: null,
      billedWeight: null,
      isMinChargeApplied: false,
      mainServiceCost: null,
      pickupCost,
      fragranceCost: null,
      previewFragranceCost: null,
      addOnsTotal: null,
      estimatedTotal: null,
    };
  }

  const actualWeight = weightCheck.value;
  const billedWeight = Math.max(STORE_INFO.minimumChargeKg, actualWeight);
  const isMinChargeApplied = actualWeight < STORE_INFO.minimumChargeKg;

  const mainServiceCost = Math.round(billedWeight * service.pricePerKg);
  const previewFragranceCost = Math.round(billedWeight * ADD_ONS.fragrance.price);
  const fragranceCost = input.includeFragrance ? previewFragranceCost : 0;
  const addOnsTotal = pickupCost + fragranceCost;
  const estimatedTotal = mainServiceCost + addOnsTotal;

  return {
    service,
    isValidWeight: true,
    actualWeight,
    billedWeight,
    isMinChargeApplied,
    mainServiceCost,
    pickupCost,
    fragranceCost,
    previewFragranceCost,
    addOnsTotal,
    estimatedTotal,
  };
}

/**
 * Memvalidasi seluruh kolom wajib sebelum mengirim pesanan ke WhatsApp (BL-03).
 */
export function validateOrderForm(input: OrderFormInput): FormValidationOutcome {
  const errors: ValidationErrors = {};

  const weightCheck = validateWeight(input.weightInput);
  if (!weightCheck.valid && weightCheck.error) {
    errors.weight = weightCheck.error;
  }

  if (!input.customerName.trim()) {
    errors.customerName = 'Masukkan nama Anda, contoh: Budi Santoso.';
  }

  if (input.includePickup && !input.pickupAddress.trim()) {
    errors.pickupAddress = 'Masukkan alamat penjemputan lengkap, contoh: Jl. Melati No. 12, RT 02.';
  }

  const orderedFields: ValidationField[] = ['weight', 'customerName', 'pickupAddress'];
  const firstErrorField = orderedFields.find((field) => Boolean(errors[field])) ?? null;

  return {
    isValid: firstErrorField === null,
    errors,
    firstErrorField,
  };
}

/**
 * Menyusun pesan pesanan WhatsApp sesuai template baku PRD dengan nominal sama persis dengan layar.
 */
export function buildWhatsAppMessage(order: WhatsAppMessageInput): string {
  const trimmedName = order.customerName.trim();
  const trimmedAddress = order.pickupAddress.trim();
  const trimmedNotes = order.notes.trim();

  const pickupText = order.includePickup
    ? `Ya (+${formatRupiah(order.pickupCost)})`
    : 'Tidak';
  const fragranceText = order.includeFragrance
    ? `Ya (+${formatRupiah(order.fragranceCost)})`
    : 'Tidak';
  const addressText = order.includePickup ? trimmedAddress : 'Antar Sendiri ke Toko';
  const notesText = trimmedNotes || '-';

  return [
    'Halo Admin Laundry, saya ingin memesan layanan laundry dengan rincian berikut:',
    '',
    `*Nama:* ${trimmedName}`,
    `*Layanan Utama:* ${order.service.name}`,
    `*Estimasi Berat:* ${formatWeight(order.actualWeight)} kg (Berat Ditagih: ${formatWeight(order.billedWeight)} kg)`,
    '*Layanan Tambahan:*',
    `- Antar-Jemput: ${pickupText}`,
    `- Pewangi Premium: ${fragranceText}`,
    '',
    `*Alamat Penjemputan:* ${addressText}`,
    `*Catatan Khusus:* ${notesText}`,
    '',
    `*Estimasi Total Biaya:* *${formatRupiah(order.estimatedTotal)}*`,
    '',
    `_(Catatan: ${ESTIMATE_DISCLAIMER})_`,
    '',
    'Mohon konfirmasi pesanan dan ketersediaan jadwalnya. Terima kasih!',
  ].join('\n');
}

/**
 * Membangun tautan deep-link WhatsApp yang aman terhadap karakter khusus memakai encodeURIComponent.
 */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
