/* Konfigurasi terpusat data bisnis dari PRD LaundryCalc dan pilihan desain aplikasi. */

export type ServiceCode = 'L01' | 'L02' | 'L03';

export interface MainService {
  code: ServiceCode;
  name: string;
  pricePerKg: number;
  durationDays: number;
  description: string;
}

export interface AddOnOption {
  code: 'T01' | 'T02';
  name: string;
  displayName: string;
  price: number;
  calculationType: 'flat' | 'per_billed_kg';
  notes: string;
}

export const STORE_INFO = {
  appName: 'LaundryCalc',
  storeName: 'Laundry UMKM',
  whatsappNumber: '6281234567890',
  pickupRadiusMaxKm: 5,
  minimumChargeKg: 3,
} as const;

export const MAIN_SERVICES: readonly MainService[] = [
  {
    code: 'L01',
    name: 'Cuci Lipat',
    pricePerKg: 6000,
    durationDays: 3,
    description: 'Dicuci, dikeringkan, dilipat tanpa setrika (Min. charge 3 kg)',
  },
  {
    code: 'L02',
    name: 'Cuci Setrika',
    pricePerKg: 8000,
    durationDays: 3,
    description: 'Dicuci, disetrika, dilipat rapi (Min. charge 3 kg)',
  },
  {
    code: 'L03',
    name: 'Cuci Setrika Ekspres',
    pricePerKg: 15000,
    durationDays: 1,
    description: 'Sama dengan Cuci Setrika, selesai besok (Min. charge 3 kg)',
  },
] as const;

export const DEFAULT_SERVICE_CODE: ServiceCode = 'L01';

export const ADD_ONS: {
  readonly pickup: AddOnOption;
  readonly fragrance: AddOnOption;
} = {
  pickup: {
    code: 'T01',
    name: 'Antar-Jemput',
    displayName: 'Antar-Jemput',
    price: 10000,
    calculationType: 'flat',
    notes: 'Area penjemputan radius maks 5 km',
  },
  fragrance: {
    code: 'T02',
    name: 'Pewangi Premium',
    displayName: 'Pewangi Premium Downy',
    price: 2000,
    calculationType: 'per_billed_kg',
    notes: 'Aroma mewah pilihan tahan lama (Downy Passion / Mystique)',
  },
} as const;

export const WEIGHT_LIMITS = {
  minKg: 0.1,
  maxKg: 100,
  stepKg: 0.1,
  buttonStepKg: 0.5,
  defaultKg: 3,
} as const;

export const SERVICE_BADGE_LABELS = {
  cheapest: 'Paling Hemat',
} as const;

export const ESTIMATE_DISCLAIMER =
  'Total di atas adalah estimasi awal. Berat pasti akan ditimbang kembali saat pakaian diterima oleh kasir/kurir laundry.';

export const DESIGN_PREFERENCES = {
  fontFamily: 'Plus Jakarta Sans',
  accentColor: 'blue',
  salutation: 'Anda',
  rupiahWithSpace: false,
} as const;
