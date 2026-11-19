/* Komponen FT-03 untuk memilih layanan tambahan Antar-Jemput dan Pewangi Premium. */
import { Check } from 'lucide-react';
import { ADD_ONS } from '../config.ts';
import { formatRupiah, formatWeight } from '../lib/format.ts';

interface AddOnOptionsProps {
  includePickup: boolean;
  includeFragrance: boolean;
  billedWeight: number | null;
  previewFragranceCost: number | null;
  onTogglePickup: (checked: boolean) => void;
  onToggleFragrance: (checked: boolean) => void;
}

export function AddOnOptions({
  includePickup,
  includeFragrance,
  billedWeight,
  previewFragranceCost,
  onTogglePickup,
  onToggleFragrance,
}: AddOnOptionsProps) {
  return (
    <section aria-labelledby="addons-heading" className="space-y-3">
      <div className="space-y-1">
        <h2 id="addons-heading" className="text-lg font-semibold text-neutral-900">
          Layanan Tambahan
        </h2>
        <p className="text-sm text-neutral-600">Pilih tambahan jika Anda memerlukannya.</p>
      </div>

      <div className="space-y-3">
        <label
          className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors duration-150 ease-out motion-reduce:transition-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-700 has-[:focus-visible]:ring-offset-2 ${
            includePickup
              ? 'border-blue-700 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <input
            type="checkbox"
            name="includePickup"
            checked={includePickup}
            onChange={(event) => onTogglePickup(event.target.checked)}
            className="sr-only"
          />

          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150 ease-out motion-reduce:transition-none ${
              includePickup ? 'border-blue-700 bg-blue-700 text-white' : 'border-neutral-400 bg-white'
            }`}
          >
            {includePickup && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </span>

          <span className="flex-1 min-w-0 space-y-1">
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-base font-semibold text-neutral-900">
                {ADD_ONS.pickup.displayName}
              </span>
              <span
                className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                  includePickup ? 'text-blue-700' : 'text-neutral-900'
                }`}
              >
                +{formatRupiah(ADD_ONS.pickup.price)}
              </span>
            </span>
            <span className="block text-sm text-neutral-600">{ADD_ONS.pickup.notes}</span>
          </span>
        </label>

        <label
          className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors duration-150 ease-out motion-reduce:transition-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-700 has-[:focus-visible]:ring-offset-2 ${
            includeFragrance
              ? 'border-blue-700 bg-blue-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <input
            type="checkbox"
            name="includeFragrance"
            checked={includeFragrance}
            onChange={(event) => onToggleFragrance(event.target.checked)}
            className="sr-only"
          />

          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150 ease-out motion-reduce:transition-none ${
              includeFragrance
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-neutral-400 bg-white'
            }`}
          >
            {includeFragrance && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </span>

          <span className="flex-1 min-w-0 space-y-1">
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-base font-semibold text-neutral-900">
                {ADD_ONS.fragrance.displayName}
              </span>
              <span
                className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                  includeFragrance ? 'text-blue-700' : 'text-neutral-900'
                }`}
              >
                +{formatRupiah(ADD_ONS.fragrance.price)}/kg ditagih
              </span>
            </span>

            <span className="block text-sm text-neutral-600">{ADD_ONS.fragrance.notes}</span>

            {billedWeight !== null && previewFragranceCost !== null && (
              <span
                className={`block text-sm font-medium tabular-nums ${
                  includeFragrance ? 'text-blue-700' : 'text-neutral-600'
                }`}
              >
                Tambahan untuk {formatWeight(billedWeight)} kg: +{formatRupiah(previewFragranceCost)}
              </span>
            )}
          </span>
        </label>
      </div>
    </section>
  );
}
