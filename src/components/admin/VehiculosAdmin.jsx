import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function VehiculosAdmin() {
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [formData, setFormData] = useState({ tipo: '', placas: '', capacidad: '', precio_base: '', imagen_url: '', disponibilidad: 'Disponible', id_conductor: '' });
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [estatusFilter, setEstatusFilter] = useState('Todos');

  const VEHICLE_TYPES = [
    { tipo: "CAMIONETA 1.2T", capacidad: "Caja cerrada 2.00m", precio_base: "1200.00", imagen_url: "/src/assets/flota_camioneta.png" },
    { tipo: "FURGÓN 3.5T", capacidad: "Caja cerrada 3.50m", precio_base: "2200.00", imagen_url: "/src/assets/flota_furgon.png" },
    { tipo: "CAMIÓN 8T", capacidad: "Largo 6.00m", precio_base: "3800.00", imagen_url: "/src/assets/flota_camion.png" },
    { tipo: "CAMIÓN 14T", capacidad: "Largo 7.00m", precio_base: "5500.00", imagen_url: "/src/assets/camion_14t.png" },
    { tipo: "TRACTOCAMIÓN 25T", capacidad: "Largo 14.00m", precio_base: "8500.00", imagen_url: "/src/assets/flota_furgon.png" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const [resV, resC] = await Promise.all([
      fetch(`${apiUrl}/vehiculos`),
      fetch(`${apiUrl}/conductores`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
    ]);
    if (resV.ok) setVehiculos(await resV.json());
    if (resC.ok) setConductores(await resC.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const payload = { ...formData, id_conductor: formData.id_conductor || null };
    
    await fetch(`${apiUrl}/vehiculos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(payload)
    });
    setFormData({ tipo: '', placas: '', capacidad: '', precio_base: '', imagen_url: '', disponibilidad: 'Disponible', id_conductor: '' });
    fetchData();
  };

  const updateVehiculo = async (id, field, value) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    await fetch(`${apiUrl}/vehiculos/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ [field]: value || null })
    });
    fetchData();
  };

  const deleteVehiculo = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este vehículo? Esto podría afectar el historial de solicitudes.')) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    await fetch(`${apiUrl}/vehiculos/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchData();
  };

  const assignedConductorIds = vehiculos.map(v => v.id_conductor).filter(id => id !== null && id !== undefined);

  const filteredVehiculos = vehiculos.filter(v => {
    const matchTipo = tipoFilter === 'Todos' || v.tipo === tipoFilter;
    const matchEstatus = estatusFilter === 'Todos' || v.disponibilidad === estatusFilter;
    return matchTipo && matchEstatus;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h3 className="text-lg font-black uppercase tracking-tight mb-4">Agregar Vehículo</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select 
            className="w-full border p-2 text-sm rounded bg-white" 
            value={formData.tipo} 
            onChange={e => {
              const selected = VEHICLE_TYPES.find(v => v.tipo === e.target.value);
              if (selected) {
                setFormData({
                  ...formData,
                  tipo: selected.tipo,
                  capacidad: selected.capacidad,
                  precio_base: selected.precio_base,
                  imagen_url: selected.imagen_url
                });
              } else {
                setFormData({ ...formData, tipo: '', capacidad: '', precio_base: '', imagen_url: '' });
              }
            }}
            required
          >
            <option value="">-- Seleccionar Tipo de Vehículo --</option>
            {VEHICLE_TYPES.map(v => (
              <option key={v.tipo} value={v.tipo}>{v.tipo}</option>
            ))}
          </select>
          <input className="w-full border p-2 text-sm rounded" placeholder="Placas (Ej. XY-1234)" value={formData.placas} onChange={e => setFormData({...formData, placas: e.target.value})} required />
          <input className="w-full border p-2 text-sm rounded bg-slate-100 text-slate-500" placeholder="Capacidad" value={formData.capacidad} readOnly />
          <input type="number" className="w-full border p-2 text-sm rounded bg-slate-100 text-slate-500" placeholder="Precio Base" value={formData.precio_base} readOnly />
          <input className="w-full border p-2 text-sm rounded bg-slate-100 text-slate-500" placeholder="URL Imagen" value={formData.imagen_url} readOnly />
          
          <select className="w-full border p-2 text-sm rounded" value={formData.id_conductor} onChange={e => setFormData({...formData, id_conductor: e.target.value})}>
            <option value="">-- Sin conductor asignado --</option>
            {conductores.filter(c => c.disponibilidad === true && !assignedConductorIds.includes(c.id_conductor)).map(c => <option key={c.id_conductor} value={c.id_conductor}>{c.nombre}</option>)}
          </select>

          <button className="w-full bg-slate-900 text-white font-bold py-2 rounded uppercase text-xs tracking-wider hover:bg-slate-800">Registrar Vehículo</button>
        </form>
      </div>
      <div className="md:col-span-2">
        <div className="flex gap-4 mb-4">
          <select className="border p-2 text-sm rounded bg-white shadow-sm flex-1" value={tipoFilter} onChange={e => setTipoFilter(e.target.value)}>
            <option value="Todos">Todos los Tipos</option>
            {VEHICLE_TYPES.map(v => <option key={v.tipo} value={v.tipo}>{v.tipo}</option>)}
          </select>
          <select className="border p-2 text-sm rounded bg-white shadow-sm flex-1" value={estatusFilter} onChange={e => setEstatusFilter(e.target.value)}>
            <option value="Todos">Todos los Estatus</option>
            <option value="Disponible">Disponible</option>
            <option value="En Mantenimiento">Mantenimiento</option>
            <option value="Ocupado">Ocupado</option>
          </select>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <th className="p-3">Vehículo</th>
              <th className="p-3">Placas</th>
              <th className="p-3">Conductor Asignado</th>
              <th className="p-3">Estatus</th>
              <th className="p-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredVehiculos.map(v => (
              <tr key={v.id_vehiculo} className="border-b hover:bg-slate-50">
                <td className="p-3 font-bold">{v.tipo}</td>
                <td className="p-3">{v.placas}</td>
                <td className="p-3">
                  <select 
                    className="border p-1 rounded text-xs w-full" 
                    value={v.id_conductor || ''}
                    onChange={(e) => updateVehiculo(v.id_vehiculo, 'id_conductor', e.target.value)}
                  >
                    <option value="">Sin Asignar</option>
                    {conductores.filter(c => (c.disponibilidad === true && !assignedConductorIds.includes(c.id_conductor)) || c.id_conductor === v.id_conductor).map(c => <option key={c.id_conductor} value={c.id_conductor}>{c.nombre}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <select 
                    className="border p-1 rounded text-xs" 
                    value={v.disponibilidad}
                    onChange={(e) => updateVehiculo(v.id_vehiculo, 'disponibilidad', e.target.value)}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En Mantenimiento">Mantenimiento</option>
                    <option value="Ocupado">Ocupado</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => deleteVehiculo(v.id_vehiculo)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded" title="Eliminar Vehículo">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
