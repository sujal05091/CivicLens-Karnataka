'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Navigation, Edit3, Loader2, CheckCircle2 } from 'lucide-react';
import { useReportStore } from '@/store/report-store';
import { DEMO_LOCATION } from '@/lib/demo-data';
import OpenStreetMap from '@/components/OpenStreetMap';

export default function LocationPage() {
  const router = useRouter();
  const { setLocation } = useReportStore();
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(DEMO_LOCATION);

  const handleCurrentLocation = () => {
    setLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Browser geolocation is unavailable. Using demo location.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
          ward: 'Demo Ward 42',
          district: 'Bengaluru Urban',
        };
        setSelectedLocation(loc);
        setLocating(false);
      },
      () => {
        setLocationError('Location permission denied. Please enter address or use demo location.');
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleDemoLocation = () => {
    setSelectedLocation(DEMO_LOCATION);
    confirmLocation(DEMO_LOCATION);
  };

  const handleManualSubmit = () => {
    if (!manualAddress.trim()) return;
    const loc = {
      ...DEMO_LOCATION,
      address: manualAddress,
    };
    setSelectedLocation(loc);
    confirmLocation(loc);
  };

  const confirmLocation = (loc = selectedLocation) => {
    setLocation(loc);
    router.push('/intelligence');
  };

  return (
    <div className="px-4 md:px-8 pt-6 space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)]"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)]">Location Selector</h1>
          <p className="text-xs text-[var(--color-text-tertiary)]">Step 3 of 5: Spatial Context</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Map Column */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm">
            <OpenStreetMap
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
              title={selectedLocation.address}
              address={`${selectedLocation.ward}, ${selectedLocation.district}`}
              height="360px"
            />
          </div>
        </div>

        {/* Location Controls Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)] p-6 space-y-4 shadow-sm">
            <h2 className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
              Selected Location Details
            </h2>

            <div className="bg-[var(--color-surface-container-low)] p-4 rounded-xl space-y-2 border border-[var(--color-outline-variant)]">
              <div>
                <p className="text-xs text-[var(--color-text-tertiary)]">Address</p>
                <p className="font-bold text-sm text-[var(--color-text-primary)]">{selectedLocation.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--color-outline-variant)]">
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Ward</p>
                  <p className="font-semibold text-xs">{selectedLocation.ward}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-tertiary)]">District</p>
                  <p className="font-semibold text-xs">{selectedLocation.district}</p>
                </div>
              </div>
            </div>

            {locationError && (
              <div className="p-3 bg-[var(--color-alert-amber-light)] rounded-xl text-xs font-semibold text-[var(--color-alert-amber-dark)]">
                {locationError}
              </div>
            )}

            {/* Manual input */}
            {manualMode && (
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Enter street, landmark or area name"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] text-sm focus:border-[var(--color-civic-blue)] focus:outline-none"
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualAddress.trim()}
                  className="w-full py-2.5 bg-[var(--color-civic-blue)] text-white rounded-xl font-bold text-xs disabled:opacity-50"
                >
                  Apply Manual Address
                </button>
              </div>
            )}
          </div>

          {/* Action triggers */}
          <div className="space-y-3">
            <button
              onClick={() => confirmLocation()}
              className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-[var(--color-civic-blue)] text-white rounded-2xl font-bold text-base shadow-md hover:bg-[var(--color-civic-blue-dark)] active:scale-95 transition-all min-h-[56px]"
            >
              <CheckCircle2 size={20} />
              Confirm Location
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCurrentLocation}
                disabled={locating}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-xl font-semibold text-xs border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] transition-all disabled:opacity-50"
              >
                {locating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                Current GPS
              </button>

              <button
                onClick={() => setManualMode(!manualMode)}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-white rounded-xl font-semibold text-xs border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] transition-all"
              >
                <Edit3 size={16} />
                Edit Manually
              </button>
            </div>

            <button
              onClick={handleDemoLocation}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[var(--color-ai-teal-surface)] text-[var(--color-ai-teal-dark)] rounded-xl font-bold text-xs border border-[var(--color-ai-teal)] hover:bg-teal-100 transition-all"
            >
              🎯 Use Demo Bengaluru Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
