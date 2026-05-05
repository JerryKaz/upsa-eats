import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bike, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in Leaflet with React
if (typeof L !== 'undefined' && L.Icon && L.Icon.Default) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Custom icons using Lucide
const createCustomIcon = (icon: React.ReactNode, color: string) => {
  const iconHtml = renderToStaticMarkup(
    <div style={{ 
      color: color, 
      backgroundColor: 'white', 
      padding: '8px', 
      borderRadius: '50%', 
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      border: `2px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Adjusted to center properly
  });
};

const courierIcon = createCustomIcon(<Bike size={20} />, '#f43f5e'); // primary-500
const destinationIcon = createCustomIcon(<MapPin size={20} />, '#0ea5e9'); // secondary-500

// Helper to update map state and bounds
function MapController({ courier, dest }: { courier: [number, number], dest: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    const bounds = L.latLngBounds([courier, dest]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }, [courier, dest, map]);

  return null;
}

interface LiveTrackingMapProps {
  status: string;
}

export default function LiveTrackingMap({ status }: LiveTrackingMapProps) {
  // Mock coordinates for UPSA Campus area
  const destCoords: [number, number] = [5.6506, -0.1738]; // UPSA Main Campus
  const startCoords: [number, number] = [5.6420, -0.1920]; // Initial courier position
  const [courierCoords, setCourierCoords] = useState<[number, number]>(startCoords);

  useEffect(() => {
    if (status === 'Delivered') {
      setCourierCoords(destCoords);
      return;
    }

    if (status !== 'Out for Delivery') return;

    // Reset to start if just went out for delivery
    if (courierCoords[0] === destCoords[0] && courierCoords[1] === destCoords[1]) {
       setCourierCoords(startCoords);
    }

    // Simulate smoother movement with small steps
    const interval = setInterval(() => {
      setCourierCoords(prev => {
        const step = 0.02; // Move 2% of distance
        const dLat = (destCoords[0] - prev[0]) * step;
        const dLng = (destCoords[1] - prev[1]) * step;
        
        // If very close, snap to destination
        if (Math.abs(dLat) < 0.00005 && Math.abs(dLng) < 0.00005) {
          clearInterval(interval);
          return destCoords;
        }
        
        // Add a tiny bit of random jitter for realism
        const jitter = () => (Math.random() - 0.5) * 0.0001;
        
        return [prev[0] + dLat + jitter(), prev[1] + dLng + jitter()];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Generate a mock route line
  const routePath = useMemo(() => {
    return [courierCoords, destCoords];
  }, [courierCoords, destCoords]);

  return (
    <div className="w-full h-full relative group">
      <MapContainer 
        center={courierCoords} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController courier={courierCoords} dest={destCoords} />
        
        <Polyline 
          positions={routePath} 
          pathOptions={{ 
            color: '#f43f5e', 
            weight: 4, 
            opacity: 0.6, 
            dashArray: '10, 10' 
          }} 
        />
        
        <Marker position={destCoords} icon={destinationIcon}>
          <Popup>
            <div className="text-xs font-bold">Your Delivery Destination</div>
          </Popup>
        </Marker>

        <Marker position={courierCoords} icon={courierIcon}>
          <Popup>
            <div className="text-xs font-bold">Courier is on the way!</div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map UI Overlay */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3">
          <div className="flex -space-x-1">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping absolute" />
          </div>
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Live Tracking</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-md px-3 py-3 rounded-2xl border border-slate-100 shadow-xl flex flex-col gap-2">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Courier</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Destination</span>
           </div>
        </div>
      </div>
    </div>
  );
}
