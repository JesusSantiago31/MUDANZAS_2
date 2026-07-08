import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, Home, User, HelpCircle, Settings, LogOut,
  CheckCircle2, Box, Phone, X, ChevronRight, MapPin, Calendar, Clipboard
} from 'lucide-react';

/* ─── Helper: badge de estatus ─────────────────────────────── */
const EstatusBadge = ({ estatus }) => {
  const styles = {
    Aprobada:   'bg-blue-100 text-blue-700',
    Empacado:   'bg-indigo-100 text-indigo-700',
    'En Ruta':  'bg-purple-100 text-purple-700',
    Entrega:    'bg-cyan-100 text-cyan-700',
    Completada: 'bg-green-100 text-green-700',
    Rechazada:  'bg-red-100 text-red-700',
    Pendiente:  'bg-slate-200 text-slate-600',
  };
  return (
    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${styles[estatus] || 'bg-slate-200 text-slate-600'}`}>
      {estatus}
    </span>
  );
};

/* ─── Modal: Detalles de Vehículo + Conductor ───────────────── */
const VehicleDetailModal = ({ solicitudId, solicitudes, onClose }) => {
  const s = solicitudes.find(x => x.id_solicitud === solicitudId);
  if (!s) return null;
  const veh = s.Vehiculo;
  const cond = veh?.Conductor;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 text-white px-6 py-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Solicitud #{s.id_solicitud}</span>
            <h3 className="font-black uppercase text-lg">Detalles del Vehículo</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Vehículo */}
          {veh ? (
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              {veh.imagen_url ? (
                <img src={veh.imagen_url} alt="Vehículo" className="w-28 h-20 object-cover rounded-lg shadow" />
              ) : (
                <div className="w-28 h-20 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                  <Truck size={32} />
                </div>
              )}
              <div className="space-y-1 text-sm">
                <p className="font-black text-slate-900 text-base">{veh.tipo}</p>
                <p className="text-slate-500"><span className="font-bold text-slate-700">Placas:</span> {veh.placas}</p>
                {veh.capacidad && <p className="text-slate-500"><span className="font-bold text-slate-700">Capacidad:</span> {veh.capacidad}</p>}
                {veh.precio_base && <p className="text-slate-500"><span className="font-bold text-slate-700">Precio base:</span> ${parseFloat(veh.precio_base).toLocaleString()}</p>}
                <EstatusBadge estatus={veh.disponibilidad} />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-sm text-center">
              Vehículo aún no asignado
            </div>
          )}

          {/* Conductor */}
          {cond ? (
            <div className="border-t pt-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Conductor Asignado</h4>
              <div className="flex items-center gap-4">
                {cond.foto_url ? (
                  <img src={cond.foto_url} alt={cond.nombre} className="w-16 h-16 object-cover rounded-full shadow ring-2 ring-green-500" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center font-black text-green-700 text-xl ring-2 ring-green-500">
                    {cond.nombre?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="text-sm space-y-1">
                  <p className="font-black text-slate-900 text-base">{cond.nombre}</p>
                  {cond.telefono && (
                    <p className="flex items-center gap-1 text-slate-500">
                      <Phone size={12} className="text-green-600" /> {cond.telefono}
                    </p>
                  )}
                  <p className="text-slate-500"><span className="font-bold text-slate-700">Licencia:</span> {cond.licencia}</p>
                  <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${cond.disponibilidad ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cond.disponibilidad ? 'Activo' : 'No disponible'}
                  </span>
                </div>
              </div>
            </div>
          ) : veh ? (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 text-sm text-center">Sin conductor asignado</div>
          ) : null}

          {/* Datos de la solicitud */}
          <div className="border-t pt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Origen</span>
              <p className="font-bold text-slate-800 flex items-start gap-1"><MapPin size={12} className="mt-0.5 text-blue-500 shrink-0" />{s.origen}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Destino</span>
              <p className="font-bold text-slate-800 flex items-start gap-1"><MapPin size={12} className="mt-0.5 text-green-500 shrink-0" />{s.destino}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Fecha servicio</span>
              <p className="font-bold text-slate-800 flex items-center gap-1"><Calendar size={12} className="text-slate-400" />{new Date(s.fecha_servicio).toLocaleDateString()}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Estatus</span>
              <EstatusBadge estatus={s.estatus} />
            </div>
            {s.observaciones && (
              <div className="col-span-2 bg-slate-50 rounded-lg p-3">
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Observaciones</span>
                <p className="text-slate-700 text-xs leading-relaxed">{s.observaciones}</p>
              </div>
            )}
            {s.servicio_empaque && (
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase px-2 py-1 rounded tracking-wider">
                  <Box size={10} /> Incluye servicio de empaque
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t">
          <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase py-3 rounded-lg transition-colors tracking-wider">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Componente principal ──────────────────────────────────── */
export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const userName = user?.nombre || 'Cliente';

  const [solicitudes, setSolicitudes] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState(null);
  const [selectedCotizacionId, setSelectedCotizacionId] = useState(null);
  const [detailModalId, setDetailModalId] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  /* ── Polling cada 3 s ── */
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [resSol, resCot] = await Promise.all([
          fetch(`${apiUrl}/solicitudes/mis-solicitudes`, { headers }),
          fetch(`${apiUrl}/cotizaciones/mis-cotizaciones`, { headers }),
        ]);
        if (resSol.ok) setSolicitudes(await resSol.json());
        if (resCot.ok) setCotizaciones(await resCot.json());
      } catch (e) {
        console.error('Error fetching datos del cliente', e);
      }
    };

    fetchAll();
    const id = setInterval(fetchAll, 3000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    navigate('/');
  };

  const handleNewCotizacion = () => navigate('/cotizar');

  /* ── Sidebar helper ── */
  const NavBtn = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => setCurrentTab(tab)}
      className={`w-full text-left px-4 py-3 rounded text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${
        currentTab === tab ? 'bg-green-700 text-white' : 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  /* ── Barra de progreso del servicio activo ── */
  const getStep = (estatus) => {
    if (estatus === 'Empacado') return 1;
    if (estatus === 'En Ruta') return 2;
    if (estatus === 'Entrega') return 3;
    if (estatus === 'Completada') return 4;
    return 0;
  };

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-slate-100 border-r border-slate-200 flex flex-col justify-between p-6 shrink-0">
        <div>
          <div className="flex flex-col items-center mb-8 border-b border-slate-200 pb-6">
            <div className="w-16 h-16 bg-slate-900 rounded flex items-center justify-center text-white mb-2 shadow-sm">
              <Truck size={36} className="text-green-500" />
            </div>
            <span className="font-black text-slate-900 text-lg uppercase tracking-wider">MI HOGAR</span>
          </div>

          <button
            onClick={handleNewCotizacion}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold text-xs uppercase py-3.5 rounded-lg flex items-center justify-center gap-2 mb-8 transition-colors shadow-sm"
          >
            <span>+</span> Nueva Cotización
          </button>

          <nav className="space-y-1">
            <NavBtn tab="home"     icon={Home}        label="Inicio" />
            <NavBtn tab="mudanzas" icon={Truck}       label="Mis Mudanzas" />
            <NavBtn tab="perfil"   icon={User}        label="Perfil" />
            <NavBtn tab="soporte"  icon={HelpCircle}  label="Soporte" />
          </nav>
        </div>

        <div className="border-t border-slate-200 pt-6 space-y-1">
          <button className="w-full text-left px-4 py-3 rounded text-xs font-black uppercase tracking-wider flex items-center gap-3 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 transition-colors">
            <Settings size={16} /> Configuración
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded text-xs font-black uppercase tracking-wider flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">

        {/* ══ TAB: INICIO ══════════════════════════════════════ */}
        {currentTab === 'home' && (() => {
          // Si hay cotización seleccionada, mostramos su detalle en el panel central
          const cotSeleccionada = selectedCotizacionId
            ? cotizaciones.find(c => c.id_cotizacion === selectedCotizacionId)
            : null;

          // Solicitud activa (si no hay cotización seleccionada)
          let activa = null;
          if (!cotSeleccionada) {
            activa = selectedSolicitudId
              ? solicitudes.find(s => s.id_solicitud === selectedSolicitudId)
              : solicitudes.find(s => ['Aprobada', 'Empacado', 'En Ruta', 'Entrega'].includes(s.estatus));
          }

          const step = activa ? getStep(activa.estatus) : 0;

          return (
            <>
              {/* Header */}
              <header className="flex justify-between items-center mb-10 border-b border-green-700/30 pb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Panel de Cliente</span>
                  <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">Hola, {userName}</h1>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded border border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-300">
                    {userName.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </header>

              {/* Stats */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-6 rounded border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Total Solicitudes</span>
                    <span className="text-4xl font-black text-slate-900 mt-1 block">{solicitudes.length}</span>
                  </div>
                  <div className="text-blue-600 bg-blue-50 w-10 h-10 rounded flex items-center justify-center font-bold text-lg">📄</div>
                </div>
                <div className="bg-white p-6 rounded border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Completadas</span>
                    <span className="text-4xl font-black text-slate-900 mt-1 block">{solicitudes.filter(s => s.estatus === 'Completada').length}</span>
                  </div>
                  <div className="text-green-600 bg-green-50 w-10 h-10 rounded flex items-center justify-center"><CheckCircle2 size={24} /></div>
                </div>
              </section>

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Panel central: Cotización seleccionada ó Servicio en Curso */}
                <div className="lg:col-span-2">
                  {cotSeleccionada ? (
                    /* ── Vista detalle de Cotización ── */
                    (() => {
                      const solicitudAsociada = solicitudes.find(s => s.id_cotizacion === cotSeleccionada.id_cotizacion);
                      const realEstatus = solicitudAsociada ? solicitudAsociada.estatus : 'Pendiente';

                      return (
                        <div className="bg-white p-6 md:p-10 border border-[#2c5282] shadow-sm h-full flex flex-col">
                          <div className="flex justify-between items-center mb-12">
                            <h2 className="text-[22px] font-light uppercase text-[#2c5282] tracking-[0.1em]">Detalle de Cotización</h2>
                            <div className={`text-[9px] font-bold px-3 py-1 uppercase tracking-widest ${
                              realEstatus === 'Aprobada' || realEstatus === 'Aceptada'
                                ? 'bg-[#0a7a33] text-white'
                                : realEstatus === 'Rechazada'
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {realEstatus}
                            </div>
                          </div>

                      <div className="flex bg-[#fdfdfd] border-t border-b border-slate-200 mb-8 divide-x divide-slate-200">
                        <div className="flex-1 py-6 px-4">
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Origen</span>
                          <span className="font-bold text-slate-800 text-xs block min-h-[40px] leading-relaxed pr-4">{cotSeleccionada.origen || '—'}</span>
                        </div>
                        <div className="flex-1 py-6 px-4">
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Destino</span>
                          <span className="font-bold text-slate-800 text-xs block min-h-[40px] leading-relaxed pr-4">{cotSeleccionada.destino || '—'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#fdfdfd] border border-slate-200 p-6 mb-8 text-xs">
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Costo Estimado</span>
                          <span className="font-extrabold text-[#0a7a33] text-lg">
                            ${cotSeleccionada.costo_estimado ? parseFloat(cotSeleccionada.costo_estimado).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unidad</span>
                          <span className="font-extrabold text-slate-800">{cotSeleccionada.tipo_unidad || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Distancia</span>
                          <span className="font-extrabold text-slate-800">{cotSeleccionada.kilometros || '0'} km</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Fecha</span>
                          <span className="font-extrabold text-slate-800">{new Date(cotSeleccionada.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {cotSeleccionada.pisos && (
                          <div className="col-span-2">
                            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pisos</span>
                            <span className="font-extrabold text-slate-800">{cotSeleccionada.pisos}</span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Empaque</span>
                          <span className={`font-extrabold ${cotSeleccionada.servicio_empaque ? 'text-[#0a7a33]' : 'text-slate-500'}`}>
                            {cotSeleccionada.servicio_empaque ? '✓ Incluido' : 'No incluido'}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="relative flex justify-between items-center mb-10 px-4 mt-2">
                        <div className="absolute left-6 right-6 h-1 bg-slate-200 top-5 z-0 rounded-full"></div>
                        <div className={`absolute left-6 h-1 bg-[#0a7a33] top-5 z-0 rounded-full transition-all duration-1000 ${getStep(realEstatus) >= 3 ? 'right-6' : getStep(realEstatus) === 2 ? 'w-1/2' : getStep(realEstatus) === 1 ? 'w-1/4' : 'w-0'}`}></div>

                        {[
                          { icon: Box,  label: 'Empacado', s: 1 },
                          { icon: Truck, label: 'En Ruta',  s: 2 },
                          { icon: Home,  label: 'Entrega',  s: 3 },
                        ].map(({ icon: Icon, label, s: sv }) => (
                          <div key={label} className={`relative z-10 flex flex-col items-center gap-2 ${getStep(realEstatus) >= sv ? '' : 'opacity-50'}`}>
                            <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center shadow-md transition-colors ${getStep(realEstatus) >= sv ? 'bg-[#0a7a33] text-white' : 'bg-slate-200 text-slate-500'}`}>
                              <Icon size={20} strokeWidth={2.5} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-wider ${getStep(realEstatus) >= sv ? 'text-[#0a7a33]' : 'text-slate-400'}`}>{label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Estado de la cotización */}
                      <div className="bg-[#fdfdfd] border border-slate-200 p-6 mb-8 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded flex items-center justify-center ${
                          realEstatus === 'Aprobada' || realEstatus === 'Aceptada'
                            ? 'bg-[#0a7a33]/10 text-[#0a7a33]' 
                            : realEstatus === 'Rechazada' 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {(realEstatus === 'Aprobada' || realEstatus === 'Aceptada') ? <CheckCircle2 size={24} /> : 
                           realEstatus === 'Rechazada' ? <X size={24} /> : 
                           <HelpCircle size={24} />}
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Estado actual de la cotización</span>
                          <span className={`text-lg font-black uppercase tracking-wider ${
                            realEstatus === 'Aprobada' || realEstatus === 'Aceptada' || getStep(realEstatus) > 0 ? 'text-[#0a7a33]' : 
                            realEstatus === 'Rechazada' ? 'text-red-600' : 'text-slate-700'
                          }`}>
                            {realEstatus}
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-4 mt-auto">
                        <button
                          onClick={() => { setSelectedCotizacionId(null); setSelectedSolicitudId(null); }}
                          className="flex-1 border border-[#2c5282] bg-white text-[#2c5282] font-bold text-[10px] uppercase py-3.5 transition-colors hover:bg-slate-50 tracking-wider"
                        >
                          ← Volver
                        </button>
                        <button
                          onClick={handleNewCotizacion}
                          className="flex-1 bg-[#0a7a33] text-white font-bold text-[10px] uppercase py-3.5 transition-colors hover:bg-green-800 tracking-wider shadow-sm"
                        >
                          Nueva Solicitud con esta Cotización
                        </button>
                      </div>
                    </div>
                      );
                    })()
                  ) : !activa ? (
                    <div className="bg-white p-12 rounded border border-slate-200 text-center text-slate-500 shadow-sm">
                      <Truck size={48} className="mx-auto text-slate-300 mb-4" />
                      <h3 className="text-lg font-black uppercase tracking-wider text-slate-800">No hay mudanzas en curso</h3>
                      <p className="text-sm mt-2">Crea una nueva cotización o selecciona una de la lista.</p>
                      <button onClick={handleNewCotizacion} className="mt-6 bg-green-700 hover:bg-green-800 text-white font-black text-xs uppercase px-6 py-3 rounded-lg transition-colors">
                        + Nueva Cotización
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded border border-blue-600 ring-1 ring-blue-600 shadow-lg">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-black uppercase tracking-wider text-blue-700">Servicio en Curso: #{activa.id_solicitud}</h3>
                        <EstatusBadge estatus={activa.estatus} />
                      </div>

                      {/* Progress bar */}
                      <div className="relative flex justify-between items-center mb-8 px-4">
                        <div className="absolute left-6 right-6 h-0.5 bg-slate-200 top-5 z-0"></div>
                        <div className={`absolute left-6 h-0.5 bg-green-600 top-5 z-0 transition-all duration-1000 ${step >= 3 ? 'right-6' : step === 2 ? 'w-1/2' : step === 1 ? 'w-1/4' : 'w-0'}`}></div>

                        {[
                          { icon: Box,  label: 'Empacado', s: 1 },
                          { icon: Truck, label: 'En Ruta',  s: 2 },
                          { icon: Home,  label: 'Entrega',  s: 3 },
                        ].map(({ icon: Icon, label, s: sv }) => (
                          <div key={label} className={`relative z-10 flex flex-col items-center gap-1.5 ${step >= sv ? '' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${step >= sv ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              <Icon size={18} />
                            </div>
                            <span className={`text-[10px] font-black uppercase ${step >= sv ? 'text-slate-800' : 'text-slate-400'}`}>{label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Addresses */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-lg mb-6 text-xs">
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Origen</span>
                          <span className="font-extrabold text-slate-800">{activa.origen}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Destino</span>
                          <span className="font-extrabold text-slate-800">{activa.destino}</span>
                        </div>
                      </div>

                      {/* Conductor mini-card */}
                      {activa.Vehiculo?.Conductor && (
                        <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg p-3 mb-6">
                          {activa.Vehiculo.Conductor.foto_url ? (
                            <img src={activa.Vehiculo.Conductor.foto_url} alt="Conductor" className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-black text-green-700">
                              {activa.Vehiculo.Conductor.nombre?.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="text-xs">
                            <p className="font-black text-slate-800">{activa.Vehiculo.Conductor.nombre}</p>
                            <p className="text-slate-500">{activa.Vehiculo.Conductor.telefono || 'Tel. no disponible'}</p>
                          </div>
                          <div className="ml-auto text-[9px] font-black uppercase bg-green-600 text-white px-2 py-0.5 rounded">Conductor</div>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-4">
                        <button className="flex-1 border border-blue-600 hover:bg-blue-50 text-blue-700 font-black text-xs uppercase py-3.5 rounded-lg transition-all tracking-wider">
                          Contactar Operador
                        </button>
                        <button
                          onClick={() => setDetailModalId(activa.id_solicitud)}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase py-3.5 rounded-lg transition-all tracking-wider shadow-sm"
                        >
                          Ver Detalles del Vehículo
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Mis Cotizaciones */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Mis Cotizaciones</h3>
                      <button onClick={handleNewCotizacion} className="text-[10px] font-black uppercase text-green-700 hover:underline">+ Nueva</button>
                    </div>

                    <div className="space-y-3 text-xs max-h-[420px] overflow-y-auto pr-1">
                      {cotizaciones.length === 0 && (
                        <div className="text-center p-4 text-slate-500 italic border border-slate-100 bg-slate-50 rounded">
                          No tienes cotizaciones aún.
                        </div>
                      )}
                      {cotizaciones.map(c => {
                        const isSelected = selectedCotizacionId === c.id_cotizacion;
                        const solicitudAsociada = solicitudes.find(s => s.id_cotizacion === c.id_cotizacion);
                        const realEstatus = solicitudAsociada ? solicitudAsociada.estatus : 'Pendiente';
                        
                        return (
                          <div
                            key={c.id_cotizacion}
                            onClick={() => {
                              setSelectedCotizacionId(c.id_cotizacion);
                              setSelectedSolicitudId(null);
                            }}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                                : 'border-slate-100 bg-slate-50 hover:border-green-300'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-slate-400 block">#COT-{c.id_cotizacion}</span>
                                <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 mt-0.5 rounded uppercase tracking-wider ${
                                  realEstatus === 'Aprobada' || realEstatus === 'Aceptada' ? 'bg-[#0a7a33] text-white' : 
                                  realEstatus === 'Rechazada' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>{realEstatus}</span>
                              </div>
                              {c.costo_estimado && (
                                <span className="font-black text-green-700 text-sm">
                                  ${parseFloat(c.costo_estimado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1">
                              {c.origen && (
                                <div>
                                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Origen</span>
                                  <span className="font-bold text-slate-700 truncate block">{c.origen}</span>
                                </div>
                              )}
                              {c.destino && (
                                <div>
                                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Destino</span>
                                  <span className="font-bold text-slate-700 truncate block">{c.destino}</span>
                                </div>
                              )}
                              {c.tipo_unidad && (
                                <div>
                                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Unidad</span>
                                  <span className="font-bold text-slate-700">{c.tipo_unidad}</span>
                                </div>
                              )}
                              {c.kilometros && (
                                <div>
                                  <span className="text-[9px] uppercase text-slate-400 font-bold block">Distancia</span>
                                  <span className="font-bold text-slate-700">{c.kilometros} km</span>
                                </div>
                              )}
                            </div>
                            {c.servicio_empaque && (
                              <span className="inline-block mt-2 text-[9px] font-black uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded tracking-wider">Empaque incluido</span>
                            )}
                            <div className="mt-1.5 text-[9px] text-slate-400">
                              {new Date(c.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Promo */}
                  <div className="bg-blue-600 text-white p-6 rounded border border-blue-700 shadow-md flex flex-col justify-between min-h-[180px]">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight mb-2">¿Necesitas un vehículo más grande?</h3>
                      <p className="text-xs text-blue-100 leading-relaxed mb-4">Consulta nuestra flota y elige el equipo que mejor se adapte.</p>
                    </div>
                    <button onClick={handleNewCotizacion} className="bg-green-700 hover:bg-green-800 text-white font-extrabold text-xs uppercase py-3 rounded-lg transition-colors">
                      Explorar Flota
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* ══ TAB: MIS MUDANZAS ════════════════════════════════ */}
        {currentTab === 'mudanzas' && (
          <>
            <header className="mb-8 border-b border-slate-200 pb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Historial completo</span>
              <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">Mis Mudanzas</h1>
            </header>

            {solicitudes.length === 0 ? (
              <div className="text-center p-12 text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Truck size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="font-black uppercase">No tienes mudanzas registradas.</p>
                <button onClick={handleNewCotizacion} className="mt-4 bg-green-700 hover:bg-green-800 text-white font-black text-xs uppercase px-6 py-3 rounded-lg transition-colors">
                  + Nueva Cotización
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {solicitudes.map(s => {
                  const veh = s.Vehiculo;
                  const cond = veh?.Conductor;
                  return (
                    <div key={s.id_solicitud} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4">
                      {/* Vehículo imagen */}
                      <div className="shrink-0">
                        {veh?.imagen_url ? (
                          <img src={veh.imagen_url} alt="Vehículo" className="w-20 h-14 object-cover rounded-lg" />
                        ) : (
                          <div className="w-20 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                            <Truck size={24} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400">#REQ-{s.id_solicitud}</span>
                          <EstatusBadge estatus={s.estatus} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
                          <div>
                            <span className="block text-[9px] font-black uppercase text-slate-400">Fecha</span>
                            <span className="font-bold text-slate-700">{new Date(s.fecha_servicio).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-black uppercase text-slate-400">Origen</span>
                            <span className="font-bold text-slate-700 truncate block max-w-[120px]">{s.origen}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-black uppercase text-slate-400">Destino</span>
                            <span className="font-bold text-slate-700 truncate block max-w-[120px]">{s.destino}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-black uppercase text-slate-400">Vehículo</span>
                            <span className="font-bold text-slate-700">{veh?.tipo || 'Sin asignar'}</span>
                          </div>
                        </div>
                        {/* Conductor */}
                        {cond && (
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                            {cond.foto_url
                              ? <img src={cond.foto_url} alt={cond.nombre} className="w-5 h-5 rounded-full object-cover ring-1 ring-green-500" />
                              : <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-[7px] font-black text-green-700">{cond.nombre?.substring(0,2).toUpperCase()}</div>
                            }
                            <span className="font-bold text-slate-600">{cond.nombre}</span>
                            {cond.telefono && <span>· {cond.telefono}</span>}
                          </div>
                        )}
                        {s.observaciones && (
                          <p className="mt-2 text-[10px] text-slate-500 flex items-start gap-1">
                            <Clipboard size={10} className="mt-0.5 shrink-0" />{s.observaciones}
                          </p>
                        )}
                      </div>

                      {/* Button */}
                      <div className="shrink-0">
                        <button
                          onClick={() => setDetailModalId(s.id_solicitud)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase px-4 py-2 rounded-lg transition-colors tracking-wider"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══ TAB: PERFIL ══════════════════════════════════════ */}
        {currentTab === 'perfil' && (
          <>
            <header className="mb-8 border-b border-slate-200 pb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cuenta</span>
              <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">Mi Perfil</h1>
            </header>

            <div className="max-w-2xl">
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center font-black text-white text-2xl shadow-md">
                  {profileData.nombre?.substring(0,2).toUpperCase() || 'CL'}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xl">{profileData.nombre}</p>
                  <p className="text-sm text-slate-500">{profileData.correo}</p>
                  <span className="inline-block mt-1 text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded tracking-wider">Cliente</span>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updated = { ...user, ...profileData };
                  localStorage.setItem('user', JSON.stringify(updated));
                  if (setUser) setUser(updated);
                  setProfileSaved(true);
                  setTimeout(() => setProfileSaved(false), 3000);
                }}
                className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5"
              >
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Información Personal</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wider">Nombre Completo</label>
                    <input
                      type="text"
                      value={profileData.nombre}
                      onChange={e => setProfileData({ ...profileData, nombre: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
                    <input
                      type="email"
                      value={profileData.correo}
                      onChange={e => setProfileData({ ...profileData, correo: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wider">Teléfono</label>
                    <input
                      type="tel"
                      value={profileData.telefono}
                      onChange={e => setProfileData({ ...profileData, telefono: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="555-000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-1.5 uppercase tracking-wider">Dirección</label>
                    <input
                      type="text"
                      value={profileData.direccion}
                      onChange={e => setProfileData({ ...profileData, direccion: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Calle, número, colonia"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white font-black text-xs uppercase px-6 py-3 rounded-lg transition-colors tracking-wider shadow-sm"
                  >
                    Guardar Cambios
                  </button>
                  {profileSaved && (
                    <span className="flex items-center gap-1.5 text-green-700 text-xs font-black animate-pulse">
                      <CheckCircle2 size={14} /> ¡Guardado correctamente!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* ══ TAB: SOPORTE ═════════════════════════════════════ */}
        {currentTab === 'soporte' && (
          <div className="text-center p-12 text-slate-500">
            <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-lg font-black uppercase text-slate-800">Soporte</h2>
            <p className="mt-2 text-sm">Contáctanos al <span className="font-bold text-green-700">800-MIHOGAR</span> o por correo a <span className="font-bold text-green-700">soporte@mihogar.com</span></p>
          </div>
        )}

      </main>

      {/* ══ MODAL: Detalles del Vehículo ════════════════════════ */}
      {detailModalId && (
        <VehicleDetailModal
          solicitudId={detailModalId}
          solicitudes={solicitudes}
          onClose={() => setDetailModalId(null)}
        />
      )}

    </div>
  );
}
