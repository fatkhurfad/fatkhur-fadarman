/* Komponen FT-05 untuk mengisi data pemesan: nama wajib, alamat kondisional, dan catatan khusus. */
import { AlertCircle } from 'lucide-react';
import type { RefObject } from 'react';
import { STORE_INFO } from '../config.ts';

interface CustomerFormProps {
  customerName: string;
  pickupAddress: string;
  notes: string;
  includePickup: boolean;
  nameError?: string;
  addressError?: string;
  nameInputRef: RefObject<HTMLInputElement | null>;
  addressInputRef: RefObject<HTMLTextAreaElement | null>;
  onNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export function CustomerForm({
  customerName,
  pickupAddress,
  notes,
  includePickup,
  nameError,
  addressError,
  nameInputRef,
  addressInputRef,
  onNameChange,
  onAddressChange,
  onNotesChange,
}: CustomerFormProps) {
  return (
    <section
      aria-labelledby="customer-form-heading"
      className="rounded-2xl bg-white p-4 sm:p-6 space-y-4"
    >
      <div className="space-y-1">
        <h2 id="customer-form-heading" className="text-lg font-semibold text-neutral-900">
          Data Pemesan
        </h2>
        <p className="text-sm text-neutral-600">
          Lengkapi data berikut untuk format pesan WhatsApp.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="customer-name" className="block text-sm font-medium text-neutral-900">
            Nama Pemesan
          </label>
          <input
            ref={nameInputRef}
            id="customer-name"
            name="customerName"
            type="text"
            autoComplete="name"
            value={customerName}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Contoh: Budi Santoso"
            aria-required="true"
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? 'customer-name-error' : undefined}
            className={`h-12 w-full rounded-xl border bg-white px-4 text-base text-neutral-900 placeholder:text-neutral-500 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 ${
              nameError ? 'border-red-700' : 'border-neutral-200'
            }`}
          />
          {nameError && (
            <p
              id="customer-name-error"
              role="alert"
              className="flex items-start gap-2 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{nameError}</span>
            </p>
          )}
        </div>

        {includePickup ? (
          <div className="space-y-2">
            <label htmlFor="pickup-address" className="block text-sm font-medium text-neutral-900">
              Alamat Penjemputan
            </label>
            <textarea
              ref={addressInputRef}
              id="pickup-address"
              name="pickupAddress"
              autoComplete="street-address"
              rows={3}
              value={pickupAddress}
              onChange={(event) => onAddressChange(event.target.value)}
              placeholder="Contoh: Jl. Melati No. 12, RT 02"
              aria-required="true"
              aria-invalid={Boolean(addressError)}
              aria-describedby={addressError ? 'pickup-address-error pickup-address-help' : 'pickup-address-help'}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-500 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 ${
                addressError ? 'border-red-700' : 'border-neutral-200'
              }`}
            />
            <p id="pickup-address-help" className="text-sm text-neutral-600">
              Jangkauan jemput maksimal {STORE_INFO.pickupRadiusMaxKm} km dari toko.
            </p>
            {addressError && (
              <p
                id="pickup-address-error"
                role="alert"
                className="flex items-start gap-2 text-sm text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{addressError}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
            Cucian diantar sendiri ke toko. Centang Antar-Jemput di atas jika Anda ingin dijemput.
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor="order-notes" className="block text-sm font-medium text-neutral-900">
            Catatan Khusus (Opsional)
          </label>
          <textarea
            id="order-notes"
            name="notes"
            rows={2}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Contoh: Baju putih dan bahan sutra jangan dicampur"
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-500 transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </section>
  );
}
