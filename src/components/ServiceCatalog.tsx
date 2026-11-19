/* Komponen FT-01 untuk menampilkan katalog paket layanan utama beserta tarif, durasi, dan penanda hemat. */
import { Tag } from 'lucide-react';
import { MAIN_SERVICES, SERVICE_BADGE_LABELS, type ServiceCode } from '../config.ts';
import { getCheapestServiceCode } from '../lib/calculator.ts';
import { formatRupiah } from '../lib/format.ts';

interface ServiceCatalogProps {
  selectedCode: ServiceCode;
  onSelect: (code: ServiceCode) => void;
}

export function ServiceCatalog({ selectedCode, onSelect }: ServiceCatalogProps) {
  const cheapestServiceCode = getCheapestServiceCode();

  return (
    <section aria-labelledby="service-catalog-heading" className="space-y-3">
      <div className="space-y-1">
        <h2 id="service-catalog-heading" className="text-lg font-semibold text-neutral-900">
          Pilih Layanan
        </h2>
        <p className="text-sm text-neutral-600">
          Tarif berlaku per kilogram dengan ketentuan minimum 3 kg.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">Daftar paket layanan laundry utama</legend>
        {MAIN_SERVICES.map((service) => {
          const isSelected = service.code === selectedCode;
          const isCheapest = service.code === cheapestServiceCode;

          return (
            <label
              key={service.code}
              className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors duration-150 ease-out motion-reduce:transition-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-700 has-[:focus-visible]:ring-offset-2 ${
                isSelected
                  ? 'border-blue-700 bg-blue-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <input
                type="radio"
                name="mainService"
                value={service.code}
                checked={isSelected}
                onChange={() => onSelect(service.code)}
                className="sr-only"
              />

              <span
                aria-hidden="true"
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 ease-out motion-reduce:transition-none ${
                  isSelected ? 'border-blue-700 bg-blue-700' : 'border-neutral-400 bg-white'
                }`}
              >
                {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>

              <span className="flex-1 min-w-0 space-y-1">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-neutral-900">{service.name}</span>
                    {isCheapest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-medium text-emerald-800 whitespace-nowrap">
                        <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{SERVICE_BADGE_LABELS.cheapest}</span>
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-base font-semibold tabular-nums whitespace-nowrap ${
                      isSelected ? 'text-blue-700' : 'text-neutral-900'
                    }`}
                  >
                    {formatRupiah(service.pricePerKg)}/kg
                  </span>
                </span>

                <span className="block text-sm font-medium text-neutral-600">
                  Estimasi selesai {service.durationDays} hari
                </span>

                <span className="block text-sm text-neutral-600">{service.description}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
    </section>
  );
}
