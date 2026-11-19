/* Komponen FT-04 dan FT-06 untuk ringkasan estimasi biaya langsung serta tombol kirim pesanan ke WhatsApp. */
import { ChevronDown, ChevronUp, ExternalLink, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { ADD_ONS, ESTIMATE_DISCLAIMER } from '../config.ts';
import type { EstimateResult } from '../lib/calculator.ts';
import { formatRupiah, formatWeight } from '../lib/format.ts';

interface SummaryProps {
  estimate: EstimateResult;
  includePickup: boolean;
  includeFragrance: boolean;
  lastWhatsAppUrl: string | null;
  onSubmitOrder: () => void;
}

interface MobileSummaryProps extends SummaryProps {
  isOpen: boolean;
  onToggleOpen: () => void;
}

/**
 * Menampilkan angka total estimasi dengan animasi transform dan opacity saat nilainya berubah.
 */
function AnimatedTotalValue({
  estimatedTotal,
  className,
}: {
  estimatedTotal: number | null;
  className: string;
}) {
  const formatted = estimatedTotal !== null ? formatRupiah(estimatedTotal) : '-';
  const [prevTotal, setPrevTotal] = useState<number | null>(estimatedTotal);
  const [changeCount, setChangeCount] = useState<number>(0);

  if (prevTotal !== estimatedTotal) {
    setPrevTotal(estimatedTotal);
    setChangeCount((count) => count + 1);
  }

  return (
    <span aria-live="polite" className={className}>
      <span
        key={changeCount}
        className={
          changeCount > 0 ? 'inline-block animate-total-change motion-reduce:animate-none' : 'inline-block'
        }
      >
        {formatted}
      </span>
    </span>
  );
}

function BreakdownList({
  estimate,
  includePickup,
  includeFragrance,
}: {
  estimate: EstimateResult;
  includePickup: boolean;
  includeFragrance: boolean;
}) {
  const hasValid = estimate.isValidWeight && estimate.billedWeight !== null;

  return (
    <dl className="space-y-3 text-sm">
      <div className="flex items-start justify-between gap-4">
        <dt className="text-neutral-600">
          <span className="block font-medium text-neutral-900">{estimate.service.name}</span>
          <span className="block text-sm text-neutral-600 tabular-nums">
            {hasValid
              ? `Berat ditagih ${formatWeight(estimate.billedWeight!)} kg x ${formatRupiah(estimate.service.pricePerKg)}`
              : 'Lengkapi estimasi berat cucian'}
          </span>
        </dt>
        <dd className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
          {estimate.mainServiceCost !== null ? formatRupiah(estimate.mainServiceCost) : '-'}
        </dd>
      </div>

      <div className="space-y-2 border-t border-neutral-200 pt-3">
        <div className="flex items-center justify-between gap-4">
          <dt className="font-medium text-neutral-900">Biaya Tambahan</dt>
          <dd className="font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
            {estimate.addOnsTotal !== null ? formatRupiah(estimate.addOnsTotal) : '-'}
          </dd>
        </div>

        {includePickup && (
          <div className="flex items-center justify-between gap-4 text-neutral-600">
            <dt>{ADD_ONS.pickup.name}</dt>
            <dd className="tabular-nums whitespace-nowrap">
              +{formatRupiah(estimate.pickupCost)}
            </dd>
          </div>
        )}

        {includeFragrance && (
          <div className="flex items-center justify-between gap-4 text-neutral-600">
            <dt>
              {ADD_ONS.fragrance.name}
              {hasValid ? ` (${formatWeight(estimate.billedWeight!)} kg)` : ''}
            </dt>
            <dd className="tabular-nums whitespace-nowrap">
              {estimate.fragranceCost !== null ? `+${formatRupiah(estimate.fragranceCost)}` : '-'}
            </dd>
          </div>
        )}

        {!includePickup && !includeFragrance && (
          <p className="text-sm text-neutral-600">Tidak ada layanan tambahan.</p>
        )}
      </div>
    </dl>
  );
}

/**
 * Panel ringkasan biaya sticky di kolom kanan untuk tampilan desktop (FT-04 & FT-06).
 */
export function DesktopPriceSummary({
  estimate,
  includePickup,
  includeFragrance,
  lastWhatsAppUrl,
  onSubmitOrder,
}: SummaryProps) {
  return (
    <aside
      aria-labelledby="desktop-summary-heading"
      className="hidden lg:block lg:col-span-5"
    >
      <div className="sticky top-6 rounded-2xl bg-white p-6 space-y-6">
        <h2 id="desktop-summary-heading" className="text-lg font-semibold text-neutral-900">
          Ringkasan Estimasi
        </h2>

        <BreakdownList
          estimate={estimate}
          includePickup={includePickup}
          includeFragrance={includeFragrance}
        />

        <div className="border-t border-neutral-200 pt-4 space-y-1">
          <p className="text-sm font-medium text-neutral-600">Total Estimasi Biaya</p>
          <p className="text-3xl font-semibold text-neutral-900 tabular-nums">
            <AnimatedTotalValue estimatedTotal={estimate.estimatedTotal} className="block" />
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onSubmitOrder}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 whitespace-nowrap"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Kirim ke WhatsApp</span>
          </button>

          {lastWhatsAppUrl && (
            <div
              role="status"
              className="flex items-center justify-between gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700"
            >
              <span>Tautan WhatsApp siap.</span>
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 rounded"
              >
                <span>Buka Ulang</span>
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        <p className="text-sm text-neutral-600">{ESTIMATE_DISCLAIMER}</p>
      </div>
    </aside>
  );
}

/**
 * Bilah ringkasan biaya menempel di bawah layar ponsel dengan rincian yang dapat dibuka (FT-04 & FT-06).
 */
export function MobilePriceSummaryBar({
  estimate,
  includePickup,
  includeFragrance,
  lastWhatsAppUrl,
  isOpen,
  onToggleOpen,
  onSubmitOrder,
}: MobileSummaryProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      {isOpen && (
        <div
          id="mobile-breakdown-panel"
          className="border-t border-neutral-200 bg-white px-4 py-4 space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <BreakdownList
            estimate={estimate}
            includePickup={includePickup}
            includeFragrance={includeFragrance}
          />
          {lastWhatsAppUrl && (
            <div className="flex items-center justify-between gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <span>Tautan WhatsApp siap.</span>
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold underline underline-offset-2"
              >
                <span>Buka Ulang</span>
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          )}
          <p className="border-t border-neutral-200 pt-3 text-sm text-neutral-600">
            {ESTIMATE_DISCLAIMER}
          </p>
        </div>
      )}

      <div className="border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={isOpen}
            aria-controls="mobile-breakdown-panel"
            className="flex min-h-[44px] min-w-0 flex-col justify-center rounded-xl px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-1 text-sm font-medium text-neutral-600 whitespace-nowrap">
              <span>Total Estimasi</span>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
            </span>
            <AnimatedTotalValue
              estimatedTotal={estimate.estimatedTotal}
              className="block text-2xl font-semibold leading-tight text-neutral-900 tabular-nums truncate"
            />
          </button>

          <button
            type="button"
            onClick={onSubmitOrder}
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 whitespace-nowrap"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Kirim ke WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
