/* Halaman utama LaundryCalc yang menyatukan katalog, kalkulator berat, add-on, formulir pemesan, dan tautan WhatsApp. */
import { useMemo, useRef, useState } from 'react';
import { AddOnOptions } from './components/AddOnOptions.tsx';
import { CustomerForm } from './components/CustomerForm.tsx';
import { DesktopPriceSummary, MobilePriceSummaryBar } from './components/PriceSummary.tsx';
import { ServiceCatalog } from './components/ServiceCatalog.tsx';
import { WeightInput } from './components/WeightInput.tsx';
import {
  DEFAULT_SERVICE_CODE,
  ESTIMATE_DISCLAIMER,
  STORE_INFO,
  WEIGHT_LIMITS,
  type ServiceCode,
} from './config.ts';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  calculateEstimate,
  validateOrderForm,
  type ValidationErrors,
} from './lib/calculator.ts';
import { formatWeight } from './lib/format.ts';

export default function App() {
  const [selectedServiceCode, setSelectedServiceCode] = useState<ServiceCode>(DEFAULT_SERVICE_CODE);
  const [weightInput, setWeightInput] = useState<string>(formatWeight(WEIGHT_LIMITS.defaultKg));
  const [includePickup, setIncludePickup] = useState<boolean>(false);
  const [includeFragrance, setIncludeFragrance] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isMobileBreakdownOpen, setIsMobileBreakdownOpen] = useState<boolean>(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string | null>(null);

  const weightInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLTextAreaElement>(null);

  const estimate = useMemo(
    () =>
      calculateEstimate({
        serviceCode: selectedServiceCode,
        weightInput,
        includePickup,
        includeFragrance,
      }),
    [selectedServiceCode, weightInput, includePickup, includeFragrance],
  );

  const handleWeightChange = (nextValue: string) => {
    setWeightInput(nextValue);
    setLastWhatsAppUrl(null);
    if (errors.weight) {
      setErrors((prev) => ({ ...prev, weight: undefined }));
    }
  };

  const handleTogglePickup = (checked: boolean) => {
    setIncludePickup(checked);
    setLastWhatsAppUrl(null);
    if (!checked && errors.pickupAddress) {
      setErrors((prev) => ({ ...prev, pickupAddress: undefined }));
    }
  };

  const handleNameChange = (value: string) => {
    setCustomerName(value);
    setLastWhatsAppUrl(null);
    if (errors.customerName) {
      setErrors((prev) => ({ ...prev, customerName: undefined }));
    }
  };

  const handleAddressChange = (value: string) => {
    setPickupAddress(value);
    setLastWhatsAppUrl(null);
    if (errors.pickupAddress) {
      setErrors((prev) => ({ ...prev, pickupAddress: undefined }));
    }
  };

  const focusFirstErrorField = (field: 'weight' | 'customerName' | 'pickupAddress') => {
    const targetRef =
      field === 'weight'
        ? weightInputRef
        : field === 'customerName'
          ? nameInputRef
          : addressInputRef;

    const element = targetRef.current;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const openExternalWhatsAppLink = (url: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleSubmitOrder = () => {
    const validation = validateOrderForm({
      weightInput,
      customerName,
      pickupAddress,
      includePickup,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsMobileBreakdownOpen(false);
      if (validation.firstErrorField) {
        focusFirstErrorField(validation.firstErrorField);
      }
      return;
    }

    if (
      !estimate.isValidWeight ||
      estimate.actualWeight === null ||
      estimate.billedWeight === null ||
      estimate.fragranceCost === null ||
      estimate.estimatedTotal === null
    ) {
      return;
    }

    setErrors({});
    const message = buildWhatsAppMessage({
      customerName,
      service: estimate.service,
      actualWeight: estimate.actualWeight,
      billedWeight: estimate.billedWeight,
      includePickup,
      pickupCost: estimate.pickupCost,
      includeFragrance,
      fragranceCost: estimate.fragranceCost,
      pickupAddress,
      notes,
      estimatedTotal: estimate.estimatedTotal,
    });

    const url = buildWhatsAppUrl(message);
    setLastWhatsAppUrl(url);
    openExternalWhatsAppLink(url);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-28 sm:px-6 lg:py-8">
        <header className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold text-neutral-900">{STORE_INFO.appName}</h1>
          <p className="text-sm text-neutral-600">
            Hitung estimasi biaya laundry {STORE_INFO.storeName} dan kirim pesanan ke WhatsApp.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitOrder();
            }}
            className="space-y-8 lg:col-span-7"
          >
            <ServiceCatalog
              selectedCode={selectedServiceCode}
              onSelect={(code) => {
                setSelectedServiceCode(code);
                setLastWhatsAppUrl(null);
              }}
            />

            <WeightInput
              value={weightInput}
              onChange={handleWeightChange}
              isMinChargeApplied={estimate.isMinChargeApplied}
              error={errors.weight}
              inputRef={weightInputRef}
            />

            <AddOnOptions
              includePickup={includePickup}
              includeFragrance={includeFragrance}
              billedWeight={estimate.billedWeight}
              previewFragranceCost={estimate.previewFragranceCost}
              onTogglePickup={handleTogglePickup}
              onToggleFragrance={(checked) => {
                setIncludeFragrance(checked);
                setLastWhatsAppUrl(null);
              }}
            />

            <CustomerForm
              customerName={customerName}
              pickupAddress={pickupAddress}
              notes={notes}
              includePickup={includePickup}
              nameError={errors.customerName}
              addressError={errors.pickupAddress}
              nameInputRef={nameInputRef}
              addressInputRef={addressInputRef}
              onNameChange={handleNameChange}
              onAddressChange={handleAddressChange}
              onNotesChange={(value) => {
                setNotes(value);
                setLastWhatsAppUrl(null);
              }}
            />

            <p className="text-sm text-neutral-600 lg:hidden">{ESTIMATE_DISCLAIMER}</p>
          </form>

          <DesktopPriceSummary
            estimate={estimate}
            includePickup={includePickup}
            includeFragrance={includeFragrance}
            lastWhatsAppUrl={lastWhatsAppUrl}
            onSubmitOrder={handleSubmitOrder}
          />
        </main>
      </div>

      <MobilePriceSummaryBar
        estimate={estimate}
        includePickup={includePickup}
        includeFragrance={includeFragrance}
        lastWhatsAppUrl={lastWhatsAppUrl}
        isOpen={isMobileBreakdownOpen}
        onToggleOpen={() => setIsMobileBreakdownOpen((prev) => !prev)}
        onSubmitOrder={handleSubmitOrder}
      />
    </div>
  );
}
