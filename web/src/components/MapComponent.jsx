import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const MapComponent = ({ 
  latitude, 
  longitude, 
  onLocationSelect, 
  isReadOnly = false, 
  height = '300px' 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Default coordinate: Jakarta, Indonesia
  const defaultLat = -6.2088;
  const defaultLng = 106.8456;

  useEffect(() => {
    // Check if Leaflet L global is loaded
    if (!window.L) {
      setErrorMsg('Gagal memuat pustaka peta. Periksa koneksi internet Anda.');
      return;
    }

    const L = window.L;

    // Fix default marker icon issues in Leaflet (webpack/vite path issues)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const initialLat = latitude || defaultLat;
    const initialLng = longitude || defaultLng;

    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current).setView([initialLat, initialLng], 14);
      mapInstanceRef.current = map;

      // Premium CartoDB Dark Matter Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Add marker if location exists
      if (latitude && longitude) {
        const marker = L.marker([latitude, longitude]).addTo(map);
        markerRef.current = marker;
      }

      // Add click handler in selection mode
      if (!isReadOnly && onLocationSelect) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            const marker = L.marker([lat, lng]).addTo(map);
            markerRef.current = marker;
          }
          
          onLocationSelect(lat, lng);
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isReadOnly]);

  // Handle prop coordinate updates (e.g. on search or GPS updates)
  useEffect(() => {
    if (mapInstanceRef.current && latitude && longitude) {
      const L = window.L;
      mapInstanceRef.current.setView([latitude, longitude], 14);
      
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      } else {
        const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
        markerRef.current = marker;
      }
    }
  }, [latitude, longitude]);

  // Request user GPS location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung layanan deteksi lokasi (Geolokasi).');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: gpsLat, longitude: gpsLng } = position.coords;
        setGpsLoading(false);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([gpsLat, gpsLng], 15);
          
          if (markerRef.current) {
            markerRef.current.setLatLng([gpsLat, gpsLng]);
          } else {
            const marker = window.L.marker([gpsLat, gpsLng]).addTo(mapInstanceRef.current);
            markerRef.current = marker;
          }
          
          if (onLocationSelect) {
            onLocationSelect(gpsLat, gpsLng);
          }
        }
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsLoading(false);
        alert('Gagal mendeteksi lokasi. Pastikan Anda mengizinkan akses lokasi pada browser Anda.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={{ marginBottom: '1.5rem', width: '100%' }}>
      {errorMsg ? (
        <div className="alert alert-danger" style={{ margin: '0 0 1rem 0' }}>
          {errorMsg}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} style={{ color: 'var(--primary)' }} />
              {isReadOnly ? 'Lokasi Kejadian di Peta' : 'Pilih Lokasi Kejadian (Klik pada peta untuk memberi pin)'}
            </span>
            
            {!isReadOnly && (
              <button 
                type="button" 
                onClick={handleDetectLocation} 
                className="btn btn-secondary" 
                style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                disabled={gpsLoading}
              >
                <Navigation size={12} className={gpsLoading ? 'loading-spinner' : ''} style={{ margin: 0, width: '12px', height: '12px', borderUrl: 'none' }} />
                {gpsLoading ? 'Mendeteksi...' : 'Gunakan GPS Saya'}
              </button>
            )}
          </div>

          <div 
            ref={mapRef} 
            style={{ 
              height, 
              width: '100%', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)', 
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
              zIndex: 10 // ensure dropdown menus in navbar stay on top
            }}
          />
          
          {latitude && longitude && !isReadOnly && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'right' }}>
              Koordinat Terpilih: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapComponent;
