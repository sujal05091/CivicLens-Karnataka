'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface OpenStreetMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  title?: string;
  address?: string;
  height?: string;
  className?: string;
}

export default function OpenStreetMap({
  latitude = 12.9716,
  longitude = 77.5946,
  zoom = 16,
  title = 'Shanthinagar Main Road Corridor',
  address = 'Ward 42, Bengaluru Urban, Karnataka',
  height = '340px',
  className = '',
}: OpenStreetMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const osmExternalUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;

  useEffect(() => {
    // Load Leaflet CSS if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    let isSubscribed = true;

    // Load Leaflet JS dynamically
    const initLeafletMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current || !isSubscribed) return;

      // Clean old instance if re-rendering
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create interactive Leaflet map attached to container
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: zoom,
        scrollWheelZoom: false, // Prevent page scrolling hijack
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create Custom RED PIN Div Icon anchored to ground coordinates
      const redPinIcon = L.divIcon({
        className: 'custom-red-pin-wrapper',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 40px; height: 50px;">
            <div style="position: absolute; top: 0; width: 36px; height: 36px; border-radius: 50%; background: rgba(239, 68, 68, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; z-index: 10; width: 36px; height: 36px; border-radius: 50%; background: #dc2626; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.35); border: 2.5px solid white;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style="width: 14px; height: 4px; background: rgba(0,0,0,0.4); border-radius: 50%; margin-top: 4px; filter: blur(1px);"></div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
      });

      // Add RED PIN Marker anchored at latitude, longitude
      L.marker([latitude, longitude], { icon: redPinIcon }).addTo(map);

      setMapLoaded(true);
    };

    if ((window as any).L) {
      initLeafletMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => initLeafletMap();
      document.head.appendChild(script);
    }

    return () => {
      isSubscribed = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 border-red-200 shadow-md bg-white ${className}`}>
      {/* Map Header Overlay Bar with RED Accent */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-red-100 z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            📍
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-[var(--color-text-primary)]">{title}</h4>
            <p className="text-[10px] text-[var(--color-text-tertiary)] font-medium">{address}</p>
          </div>
        </div>

        <a
          href={osmExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
        >
          <span>Open Full Map</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Map Frame Container (Interactive Leaflet Map where RED PIN is anchored to coordinates) */}
      <div className="relative w-full overflow-hidden" style={{ height }}>
        
        {/* Leaflet Interactive Map Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Coordinates Badge with RED Pin Indicator */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-black text-red-600 shadow-md border border-red-200 flex items-center gap-2 pointer-events-none">
          <Navigation size={14} className="text-red-600 fill-red-600" />
          <span>RED PIN ANCHORED: {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
        </div>

        {/* Loading Spinner Skeleton */}
        {!mapLoaded && (
          <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center text-red-600 space-y-2 z-10">
            <MapPin size={36} className="text-red-600 animate-bounce" />
            <span className="text-xs font-bold">Loading Interactive OpenStreetMap Red Marker...</span>
          </div>
        )}
      </div>

      {/* Footer OpenStreetMap Attribution */}
      <div className="px-3 py-1 bg-red-50/50 text-[10px] text-[var(--color-text-tertiary)] text-right border-t border-red-100">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-red-600">OpenStreetMap</a> contributors
      </div>
    </div>
  );
}
