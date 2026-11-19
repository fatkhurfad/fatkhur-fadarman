/* Komponen FT-02 untuk input estimasi berat cucian (kg) dan notifikasi ketentuan minimum charge 3 kg. */
import { AlertCircle, Info, Minus, Plus } from 'lucide-react';
import type { RefObject } from 'react';
import { STORE_INFO, WEIGHT_LIMITS } from '../config.ts';
import { formatWeight } from '../lib/format.ts';
import { parseWeightInput } from '../lib/calculator.ts';

interface WeightInputProps {
  value: string;
  onChange: (nextValue: string) => void;
  isMinChargeApplied: boolean;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function WeightInput({
  value,
  onChange,
  isMinChargeApplied,
  error,
  inputRef,
}: WeightInputProps) {
  const parsed = parseWeightInput(value);
  const canDecrease = parsed === null || parsed > WEIGHT_LIMITS.buttonStepKg;
  const canIncrease = parsed === null || parsed < WEIGHT_LIMITS.maxKg;

  const handleAdjust = (delta: number) => {
    const current = parsed;
    if (current === null || current <= 0) {
      onChange(delta > 0 ? formatWeight(WEIGHT_LIMITS.defaultKg) : formatWeight(WEIGHT_LIMITS.buttonStepKg));
      return;
    }
    const next = Math.min(
      WEIGHT_LIMITS.maxKg,
      Math.max(WEIGHT_LIMITS.buttonStepKg, Number((current + delta).toFixed(1))),
    );
    onChange(formatWeight(next));
  };

  return (
    <section
      aria-labelledby="weight-input-heading"
      className="rounded-2xl bg-white p-4 sm:p-6 space-y-4"
    >
      <div className="space-y-1">
        <label
          id="weight-input-heading"
          htmlFor="weight-input"
          className="block text-lg font-semibold text-neutral-900"
        >
          Estimasi Berat Cucian
        </label>
        <p className="text-sm text-neutral-600">
          Masukkan perkiraan berat dalam kilogram (boleh desimal).
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleAdjust(-WEIGHT_LIMITS.buttonStepKg)}
          disabled={!canDecrease}
          aria-label="Kurangi berat 0,5 kg"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          <Minus className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative flex-1">
          <input
            ref={inputRef}
            id="weight-input"
            name="weight"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Contoh: 3,5"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'weight-error weight-helper' : 'weight-helper'}
            className={`h-12 w-full rounded-xl border bg-white pl-4 pr-12 text-base font-medium tabular-nums text-neutral-900 placeholder:text-neutral-500 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 ${
              error ? 'border-red-700' : 'border-neutral-200'
            }`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-neutral-600"
          >
            kg
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleAdjust(WEIGHT_LIMITS.buttonStepKg)}
          disabled={!canIncrease}
          aria-label="Tambah berat 0,5 kg"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <p id="weight-helper" className="text-sm text-neutral-600">
        Gunakan koma atau titik untuk desimal, misal 4,5.
      </p>

      {error && (
        <div
          id="weight-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {!error && isMinChargeApplied && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            Ketentuan minimum charge {formatWeight(STORE_INFO.minimumChargeKg)} kg berlaku. Berat
            ditagih dihitung {formatWeight(STORE_INFO.minimumChargeKg)} kg.
          </span>
        </div>
      )}
    </section>
  );
}
