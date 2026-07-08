import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';

export default function SolicitudesAdmin({ onUpdateStats }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Todas');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const [resSol, resVeh] = await Promise.all([
      fetch(`${apiUrl}/solicitudes`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
      fetch(`${apiUrl}/vehiculos`)
    ]);
    
    if (resSol.ok) setSolicitudes(await resSol.json());
    if (resVeh.ok) setVehiculos(await resVeh.json());
  };

  const updateEstatus = async (id, estatus) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    await fetch(`${apiUrl}/solicitudes/${id}/estado`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ estatus })
    });
    fetchData();
    if (onUpdateStats) onUpdateStats();
  };

  const assignVehicle = async (idSolicitud, idVehiculo) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // Primero obtenemos la solicitud actual para actualizar también su id_vehiculo a través del mismo endpoint genérico si es posible, o usamos uno específico.
    // Como no hicimos un endpoint específico para asignar vehículo, pero tenemos uno en solicitudes que actualiza. Wait, actualizarEstadoSolicitud solo actualiza estatus.
    // Tendré que enviar otra petición, pero no tengo un controlador para actualizar id_vehiculo en solicitud.
    // Vamos a agregar esto al fetch body enviándolo al backend si modificamos el backend.
    
    // En este punto, le enviaré el id_vehiculo al endpoint de estado. Modificaré el backend para que lo reciba.
    await fetch(`${apiUrl}/solicitudes/${idSolicitud}/estado`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ id_vehiculo: idVehiculo || null })
    });
    
    fetchData();
    if (onUpdateStats) onUpdateStats();
    setIsModalOpen(false);
  };

  const openModal = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsModalOpen(true);
  };

  const filteredSolicitudes = solicitudes.filter(s => statusFilter === 'Todas' || s.estatus === statusFilter);

  // Helper to determine if a vehicle is already booked on a specific date
  const getAssignedVehiclesForDate = (dateString) => {
    return solicitudes
      .filter(s => s.id_vehiculo && new Date(s.fecha_servicio).toDateString() === new Date(dateString).toDateString())
      .map(s => s.id_vehiculo);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-black text-slate-800 uppercase tracking-tight">Gestión de Traslados</h3>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded px-4 py-2 text-sm font-bold text-slate-700 bg-white shadow-sm"
        >
          <option value="Todas">Todas las Solicitudes</option>
          <option value="Pendiente">Pendientes</option>
          <option value="Aprobada">Aprobadas</option>
          <option value="Empacado">Empacadas</option>
          <option value="En Ruta">En Ruta</option>
          <option value="Entrega">En Entrega</option>
          <option value="Completada">Completadas</option>
          <option value="Rechazada">Rechazadas</option>
        </select>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-widest font-bold">
            <th className="p-4">ID Manifiesto</th>
            <th className="p-4">Cliente</th>
            <th className="p-4">Fecha Traslado</th>
            <th className="p-4">Origen / Destino</th>
            <th className="p-4">Unidad Asignada</th>
            <th className="p-4">Estado</th>
            <th className="p-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {filteredSolicitudes.map(s => (
            <tr key={s.id_solicitud} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-black text-blue-600">#REQ-{s.id_solicitud}</td>
              <td className="p-4 font-bold">{s.Cliente?.nombre || 'N/A'}</td>
              <td className="p-4">{new Date(s.fecha_servicio).toLocaleDateString()}</td>
              <td className="p-4 text-xs">
                <div className="font-bold">{s.origen}</div>
                <div className="text-slate-400">➔ {s.destino}</div>
              </td>
              <td className="p-4 text-xs">
                {s.Vehiculo ? (
                  <div>
                    <span className="font-bold">{s.Vehiculo.tipo}</span><br/>
                    <span className="text-slate-500">Placas: {s.Vehiculo.placas}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No Asignada</span>
                )}
              </td>
              <td className="p-4">
                <select 
                  value={s.estatus} 
                  onChange={(e) => updateEstatus(s.id_solicitud, e.target.value)}
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${s.estatus === 'Completada' ? 'bg-green-600 text-white' : s.estatus === 'Aprobada' ? 'bg-blue-600 text-white' : s.estatus === 'Empacado' || s.estatus === 'En Ruta' || s.estatus === 'Entrega' ? 'bg-purple-600 text-white' : s.estatus === 'Rechazada' ? 'bg-red-600 text-white' : 'bg-slate-400 text-white'}`}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Empacado">Empacado</option>
                  <option value="En Ruta">En Ruta</option>
                  <option value="Entrega">Entrega</option>
                  <option value="Completada">Completada</option>
                  <option value="Rechazada">Rechazada</option>
                </select>
              </td>
              <td className="p-4 text-center">
                <button onClick={() => openModal(s)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Eye size={20}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedSolicitud && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-lg">Asignación de Unidad - #REQ-{selectedSolicitud.id_solicitud}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Cliente</p>
                  <p className="font-bold text-slate-900">{selectedSolicitud.Cliente?.nombre}</p>
                  <div className="text-xs text-slate-500 mt-1 flex flex-col gap-1">
                    <p>✉️ {selectedSolicitud.Cliente?.correo || 'Sin correo'}</p>
                    <p>📞 {selectedSolicitud.Cliente?.telefono || 'Sin teléfono'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Fecha Programada</p>
                  <p className="font-bold">{new Date(selectedSolicitud.fecha_servicio).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Ruta</p>
                  <p>{selectedSolicitud.origen} ➔ {selectedSolicitud.destino}</p>
                </div>
                <div className="col-span-2 bg-blue-50 p-3 rounded border border-blue-100">
                  <p className="text-blue-600 text-xs font-bold uppercase mb-1">Tipo de Vehículo Requerido (Según Cotización)</p>
                  <p className="font-black">{selectedSolicitud.Vehiculo?.tipo || "El cliente no seleccionó un vehículo específico (o se borró)"}</p>
                </div>
              </div>

              <h4 className="font-black text-slate-900 uppercase tracking-tight mb-3">Seleccionar Unidad Disponible</h4>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {vehiculos
                  .filter(v => v.disponibilidad === 'Disponible')
                  .filter(v => selectedSolicitud.Vehiculo?.tipo ? v.tipo === selectedSolicitud.Vehiculo.tipo : true)
                  .filter(v => !getAssignedVehiclesForDate(selectedSolicitud.fecha_servicio).includes(v.id_vehiculo) || selectedSolicitud.id_vehiculo === v.id_vehiculo)
                  .map(v => (
                  <div 
                    key={v.id_vehiculo}  
                    className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-colors ${
                      selectedSolicitud.id_vehiculo === v.id_vehiculo 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                    onClick={() => assignVehicle(selectedSolicitud.id_solicitud, v.id_vehiculo)}
                  >
                    <div>
                      <div className="font-bold text-slate-900">{v.tipo}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">Placas: {v.placas}</div>
                    </div>
                    <div className="text-right">
                      {v.id_conductor ? (
                        <div className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">Con Chofer Asignado</div>
                      ) : (
                        <div className="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded">Sin Chofer - ¡Atención!</div>
                      )}
                    </div>
                  </div>
                ))}

                {vehiculos
                  .filter(v => v.disponibilidad === 'Disponible')
                  .filter(v => selectedSolicitud.Vehiculo?.tipo ? v.tipo === selectedSolicitud.Vehiculo.tipo : true)
                  .filter(v => !getAssignedVehiclesForDate(selectedSolicitud.fecha_servicio).includes(v.id_vehiculo) || selectedSolicitud.id_vehiculo === v.id_vehiculo)
                  .length === 0 && (
                  <div className="text-center p-4 text-slate-500 italic">No hay vehículos de la categoría solicitada que estén disponibles o todos están ocupados para esta fecha.</div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
