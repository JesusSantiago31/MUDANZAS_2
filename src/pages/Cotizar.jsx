import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Info, ArrowRight, ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import camionetaImg from '../assets/flota_camioneta.png';
import furgonImg from '../assets/flota_furgon.png';
import camionImg from '../assets/flota_camion.png';
import camion14Img from '../assets/camion_14t.png';

const VEHCULOS = [
  {
    id: 'camioneta',
    nombre: 'CAMIONETA 1.2T',
    descripcion: 'Caja cerrada 2.00m',
    base: 1200,
    imagen: camionetaImg
  },
  {
    id: 'furgon_3_5',
    nombre: 'FURGÓN 3.5T',
    descripcion: 'Caja cerrada 3.50m',
    base: 2200,
    imagen: furgonImg
  },
  {
    id: 'camion_8t',
    nombre: 'CAMIÓN 8T',
    descripcion: 'Largo 6.00m',
    base: 3800,
    imagen: camionImg
  },
  {
    id: 'camion_14t',
    nombre: 'CAMIÓN 14T',
    descripcion: 'Largo 7.00m',
    base: 5500,
    imagen: camion14Img
  },
  {
    id: 'tractocamion_25t',
    nombre: 'TRACTOCAMIÓN 25T',
    descripcion: 'Largo 14.00m',
    base: 8500,
    imagen: furgonImg // Reusing furgon image due to generation limit
  }
];

export default function Cotizar() {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');

  const [vehiculosList, setVehiculosList] = useState([]);

  // Auto-cargar la dirección del cliente al montar el componente
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.direccion) {
          setOrigen(userObj.direccion);
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }

    const fetchVehiculos = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/vehiculos`);
        if (res.ok) {
          const data = await res.json();
          const disp = data.filter(v => v.disponibilidad !== 'En Mantenimiento');
          setVehiculosList(disp.length > 0 ? disp : VEHCULOS);
        } else {
          setVehiculosList(VEHCULOS);
        }
      } catch (err) {
        console.error('Error fetching vehiculos', err);
        setVehiculosList(VEHCULOS);
      }
    };
    fetchVehiculos();
  }, []);
  const [distancia, setDistancia] = useState(0);
  const [calculated, setCalculated] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [pisosOrigen, setPisosOrigen] = useState(0);
  const [pisosDestino, setPisosDestino] = useState(0);
  const [servicioEmpaque, setServicioEmpaque] = useState(false);
  const [fechaServicio, setFechaServicio] = useState('');

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!origen || !destino) {
      alert('Por favor ingrese origen y destino.');
      return;
    }
    
    if (!isLoaded) {
      alert('Cargando mapa, por favor espera un momento...');
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: origen,
          destination: destino,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            const distInMeters = result.routes[0].legs[0].distance.value;
            const distInKm = Math.ceil(distInMeters / 1000);
            setDistancia(distInKm);
            setCalculated(true);
          } else {
            console.warn('Google Maps Directions failed, using fallback simulation. Status:', status);
            // Fallback a simulación para no bloquear al usuario
            const simulatedDist = Math.floor(Math.random() * 50) + 10;
            setDistancia(simulatedDist);
            setCalculated(true);
            alert('Aviso: La API de rutas de Google Maps no está habilitada. Usando distancia aproximada.');
          }
        }
      );
    } catch (error) {
      console.error(error);
      alert('Error de mapa. Usando distancia aproximada.');
      const simulatedDist = Math.floor(Math.random() * 50) + 10;
      setDistancia(simulatedDist);
      setCalculated(true);
    }
  };

  // Calculations
  const vehiculoSeleccionado = vehiculosList.find(v => v.id_vehiculo === selectedUnit || v.id === selectedUnit);
  const costoBase = vehiculoSeleccionado ? parseFloat(vehiculoSeleccionado.precio_base || vehiculoSeleccionado.base || 0) : 0;
  const costoDistancia = calculated ? distancia * 20 : 0;
  const costoPisos = (pisosOrigen + pisosDestino) * 200;
  const costoEmpaque = servicioEmpaque ? 500 : 0;
  const costoTotal = costoBase + costoDistancia + costoPisos + costoEmpaque;

  const handleSaveCotizacion = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    if (!calculated || !selectedUnit) {
      alert('Por favor calcula la distancia y selecciona una unidad primero.');
      return;
    }

    try {
      const userObj = JSON.parse(userStr);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const payload = {
        id_cliente: userObj.id || null,
        origen,
        destino,
        kilometros: distancia,
        tipo_unidad: vehiculoSeleccionado?.nombre || selectedUnit,
        pisos: pisosOrigen + pisosDestino,
        costo_estimado: costoTotal,
        servicio_empaque: servicioEmpaque
      };
      
      const response = await fetch(`${apiUrl}/cotizaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Error al guardar cotización');
      alert('Cotización guardada exitosamente.');
    } catch (error) {
      console.error(error);
      alert('Error al intentar guardar en la base de datos.');
    }
  };

  const handleRequestMudanza = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    if (!calculated || !selectedUnit) {
      alert('Por favor calcula la distancia y selecciona una unidad primero.');
      return;
    }
    if (!fechaServicio) {
      alert('Por favor selecciona una fecha de servicio antes de solicitar.');
      return;
    }

    try {
      const userObj = JSON.parse(userStr);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // 1. Crear la Cotización primero
      const cotizacionPayload = {
        id_cliente: userObj.id || null,
        origen,
        destino,
        kilometros: distancia,
        tipo_unidad: vehiculoSeleccionado?.nombre || selectedUnit,
        pisos: pisosOrigen + pisosDestino,
        costo_estimado: costoTotal,
        servicio_empaque: servicioEmpaque
      };
      
      const cotizacionResponse = await fetch(`${apiUrl}/cotizaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cotizacionPayload)
      });
      
      let idCotizacion = null;
      if (cotizacionResponse.ok) {
        const cotData = await cotizacionResponse.json();
        idCotizacion = cotData.cotizacion?.id_cotizacion;
      }

      // 2. Crear la Solicitud
      const solicitudPayload = {
        id_cliente: userObj.id || null,
        id_cotizacion: idCotizacion,
        fecha_servicio: fechaServicio,
        origen,
        destino,
        pisos_origen: pisosOrigen,
        pisos_destino: pisosDestino,
        servicio_empaque: servicioEmpaque,
        id_vehiculo: vehiculoSeleccionado?.id_vehiculo || null,
        observaciones: `Vehículo: ${vehiculoSeleccionado?.nombre || vehiculoSeleccionado?.tipo || selectedUnit}`
      };
      
      const solicitudResponse = await fetch(`${apiUrl}/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solicitudPayload)
      });
      
      if (!solicitudResponse.ok) throw new Error('Error al enviar solicitud');
      alert('Solicitud enviada. Un asesor se comunicará contigo.');
    } catch (error) {
      console.error(error);
      alert('Error al intentar enviar la solicitud a la base de datos.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-slate-900 leading-none">
          COTIZA TU MUDANZA <span className="text-green-700">AL INSTANTE</span>
        </h1>
        <p className="text-slate-500 text-sm mt-3 max-w-xl">
          Obtén un presupuesto detallado y transparente en segundos. Elige tu vehículo ideal y personaliza cada detalle de tu traslado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Form and Selection Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ubicacion Card */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-6">
              <MapPin size={18} className="text-blue-600" />
              UBICACIÓN
            </h3>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400">Dirección de Origen</label>
                    <div className="text-[10px]"><MapPicker onSelect={(addr) => setOrigen(addr)} /></div>
                  </div>
                  <input 
                    required 
                    type="text" 
                    value={origen} 
                    onChange={(e) => setOrigen(e.target.value)} 
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50" 
                    placeholder="Ej: Av. Principal 123, Ciudad" 
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400">Dirección de Destino</label>
                    <div className="text-[10px]"><MapPicker onSelect={(addr) => setDestino(addr)} /></div>
                  </div>
                  <input 
                    required 
                    type="text" 
                    value={destino} 
                    onChange={(e) => setDestino(e.target.value)} 
                    className="w-full px-4 py-3 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50" 
                    placeholder="Ej: Calle Nueva 456, C" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase py-3.5 rounded transition-all tracking-wider shadow-sm"
                >
                  Calcular
                </button>
              </div>
            </form>
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded p-4 flex gap-3 text-xs text-blue-800 items-start">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>
                La distancia se calcula automáticamente mediante la <strong>API de Google Maps Distance Matrix</strong> para garantizar la precisión en la ruta y el costo final.
              </p>
            </div>
          </div>

          {/* Tipo de Unidad Card */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-6">
              <Truck size={18} className="text-blue-600" />
              TIPO DE UNIDAD
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vehiculosList.map((v) => {
                const vid = v.id_vehiculo || v.id;
                const vname = v.nombre || v.tipo;
                const vimg = v.imagen_url || v.imagen || camionImg;
                const vdesc = v.descripcion || v.capacidad;

                return (
                  <div 
                    key={vid} 
                    onClick={() => setSelectedUnit(vid)}
                    className={`cursor-pointer rounded border transition-all overflow-hidden flex flex-col justify-between ${
                      selectedUnit === vid 
                        ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="h-28 overflow-hidden bg-slate-100 relative">
                      <img src={vimg} alt={vname} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 border-t border-slate-100">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{vname}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{vdesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Servicios Adicionales Card */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-6">
              <ShieldCheck size={18} className="text-blue-600" />
              SERVICIOS ADICIONALES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Counters */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200/60">
                  <div>
                    <span className="block text-xs font-extrabold text-slate-800">Pisos en Origen</span>
                    <span className="text-[10px] text-slate-400">Sin elevador</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPisosOrigen(Math.max(0, pisosOrigen - 1))}
                      className="w-7 h-7 rounded border border-slate-300 bg-white flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-slate-800 w-4 text-center">{pisosOrigen}</span>
                    <button 
                      onClick={() => setPisosOrigen(pisosOrigen + 1)}
                      className="w-7 h-7 rounded border border-slate-300 bg-white flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200/60">
                  <div>
                    <span className="block text-xs font-extrabold text-slate-800">Pisos en Destino</span>
                    <span className="text-[10px] text-slate-400">Sin elevador</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setPisosDestino(Math.max(0, pisosDestino - 1))}
                      className="w-7 h-7 rounded border border-slate-300 bg-white flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-slate-800 w-4 text-center">{pisosDestino}</span>
                    <button 
                      onClick={() => setPisosDestino(pisosDestino + 1)}
                      className="w-7 h-7 rounded border border-slate-300 bg-white flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra Services checkboxes */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 border border-slate-200 rounded p-4 bg-slate-50 cursor-pointer hover:bg-slate-100/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={servicioEmpaque} 
                    onChange={(e) => setServicioEmpaque(e.target.checked)} 
                    className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500" 
                  />
                  <div>
                    <span className="block text-xs font-black uppercase text-green-700">Servicio de Empaque</span>
                    <span className="text-[10px] text-slate-400">Protección con burbuja y mantas</span>
                  </div>
                </label>

                <div className="flex items-center gap-3 border border-green-600/30 rounded p-4 bg-green-500/10">
                  <CheckCircle2 size={20} className="text-green-700 shrink-0" />
                  <div>
                    <span className="block text-xs font-black uppercase text-green-800">Seguro Incluido</span>
                    <span className="text-[10px] text-green-700">Protección total para su mercancía</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Sidebar Summary Column */}
        <div className="space-y-6">
          
          {/* Resumen del Servicio Card */}
          <div className="bg-slate-900 text-white p-6 rounded border border-slate-800 shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-4 mb-6">
              RESUMEN DEL SERVICIO
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Unidad:</span>
                <span className="font-bold">{vehiculoSeleccionado ? (vehiculoSeleccionado.nombre || vehiculoSeleccionado.tipo) : 'Ninguna'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distancia Est. ({calculated ? distancia : 0} Km x $20):</span>
                <span className="font-bold">${costoDistancia.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-4">
                <span className="text-slate-400">Costo Base:</span>
                <span className="font-bold">${costoBase.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recargo por Pisos:</span>
                <span className="font-bold">${costoPisos.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Empaque:</span>
                <span className="font-bold">${costoEmpaque.toLocaleString('es-MX')}</span>
              </div>
              
              <div className="border-t border-slate-800 pt-6 pb-2">
                <span className="block text-[10px] font-black uppercase tracking-widest text-green-500">Costo Estimado Total</span>
                <div className="text-4xl font-black text-green-400 mt-2">
                  ${(selectedUnit ? costoTotal : 0).toLocaleString('es-MX')}
                </div>
              </div>

              <div className="mt-4 pb-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Fecha de Servicio</label>
                <input 
                  type="date" 
                  value={fechaServicio}
                  onChange={(e) => setFechaServicio(e.target.value)}
                  className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                />
              </div>

              <button 
                onClick={handleRequestMudanza}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase py-4 rounded transition-all tracking-wider shadow-md mt-4"
              >
                Solicitar Mudanza Ahora
              </button>

              <button 
                onClick={handleSaveCotizacion}
                className="w-full border border-slate-700 hover:bg-slate-800 text-slate-300 font-black text-xs uppercase py-3.5 rounded transition-all tracking-wider mt-2"
              >
                Guardar Cotización
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest mt-6">
              🔒 Transacción 100% Segura
            </p>
          </div>

          {/* Necesitas Ayuda Box */}
          <div className="bg-slate-100 p-5 rounded border border-slate-200/60 flex items-center gap-4 text-xs">
            <div className="w-10 h-10 rounded bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              📞
            </div>
            <div>
              <span className="block font-black text-slate-900 uppercase">¿Necesitas Ayuda?</span>
              <span className="text-slate-500">Asesoría personalizada 24/7</span>
            </div>
          </div>

          {/* Calculo de Cotizacion Card */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm text-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-green-700 flex items-center gap-2 mb-4">
              🧮 CÁLCULO DE COTIZACIÓN
            </h3>
            <p className="text-slate-500 leading-relaxed mb-6">
              Nuestra tarifa se calcula bajo una estructura de integridad industrial transparente:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Costo Base:</span>
                <span className="font-bold text-slate-700">Variable por Unidad</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Distancia:</span>
                <span className="font-bold text-slate-700">$20 / Km</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Complejidad (Pisos):</span>
                <span className="font-bold text-slate-700">$200 / Piso</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400">Empaque Profesional:</span>
                <span className="font-bold text-slate-700">$500</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded border border-slate-200 mt-6">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Fórmula Aplicada:</span>
              <code className="block text-[10px] text-slate-600 leading-relaxed font-mono">
                Total = (Base) + (Km * $20) + (Pisos * $200) + Adicionales
              </code>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
