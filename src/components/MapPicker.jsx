import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

// Default center: Mexico City (you can change this to match your target area)
const defaultCenter = {
  lat: 19.4326,
  lng: -99.1332
};

const libraries = ['places'];

export default function MapPicker({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [markerPos, setMarkerPos] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState('');

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const onMapClick = useCallback((e) => {
    setMarkerPos({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
    setError('');
  }, []);

  const handleConfirm = async () => {
    if (!markerPos) {
      setError('Por favor haz clic en el mapa para seleccionar una ubicación');
      return;
    }
    
    setLoadingAddress(true);
    setError('');
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: markerPos });
      
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        onSelect(address);
        setOpen(false);
      } else {
        setError('No se pudo encontrar una dirección para esta ubicación');
      }
    } catch (e) {
      console.error('Geocoding error:', e);
      setError('Error al obtener la dirección');
    } finally {
      setLoadingAddress(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-2 text-sm text-green-600 hover:underline"
      >
        Señalar ubicación desde mapa
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Selecciona tu ubicación</h3>
              <button 
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 relative">
              {loadError ? (
                <div className="p-4 text-red-600 bg-red-50 rounded">
                  Error al cargar Google Maps. Verifica tu API Key.
                </div>
              ) : !isLoaded ? (
                <div className="p-12 text-center text-slate-500">
                  Cargando mapa...
                </div>
              ) : (
                <div className="rounded overflow-hidden border border-slate-300">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={defaultCenter}
                    zoom={12}
                    onClick={onMapClick}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false
                    }}
                  >
                    {markerPos && <Marker position={markerPos} />}
                  </GoogleMap>
                </div>
              )}
              
              {error && (
                <div className="mt-3 text-red-600 text-sm font-medium">{error}</div>
              )}
              
              <div className="mt-4 text-sm text-slate-500">
                Haz clic en cualquier parte del mapa para colocar el marcador en tu dirección exacta.
              </div>
            </div>
            
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!markerPos || loadingAddress || !isLoaded}
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingAddress ? 'Obteniendo...' : 'Confirmar Ubicación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
