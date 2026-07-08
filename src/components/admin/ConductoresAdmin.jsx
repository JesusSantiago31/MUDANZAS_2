import { useState, useEffect } from 'react';

export default function ConductoresAdmin() {
  const [conductores, setConductores] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', licencia: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/conductores`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setConductores(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    await fetch(`${apiUrl}/conductores`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(formData)
    });
    setFormData({ nombre: '', telefono: '', licencia: '' });
    fetchData();
  };

  const updateDisponibilidad = async (id, disponibilidad) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    await fetch(`${apiUrl}/conductores/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ disponibilidad: disponibilidad === 'true' })
    });
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h3 className="text-lg font-black uppercase tracking-tight mb-4">Registrar Conductor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 text-sm rounded" placeholder="Nombre Completo" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
          <input className="w-full border p-2 text-sm rounded" placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
          <input className="w-full border p-2 text-sm rounded" placeholder="No. Licencia" value={formData.licencia} onChange={e => setFormData({...formData, licencia: e.target.value})} required />
          <button className="w-full bg-slate-900 text-white font-bold py-2 rounded uppercase text-xs tracking-wider hover:bg-slate-800">Registrar</button>
        </form>
      </div>
      <div className="md:col-span-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <th className="p-3">Nombre</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Licencia</th>
              <th className="p-3">Disponibilidad</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {conductores.map(c => (
              <tr key={c.id_conductor} className="border-b hover:bg-slate-50">
                <td className="p-3 font-bold">{c.nombre}</td>
                <td className="p-3">{c.telefono}</td>
                <td className="p-3 font-mono text-xs">{c.licencia}</td>
                <td className="p-3">
                  <select 
                    className="border p-1 rounded text-xs" 
                    value={c.disponibilidad ? 'true' : 'false'}
                    onChange={(e) => updateDisponibilidad(c.id_conductor, e.target.value)}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
