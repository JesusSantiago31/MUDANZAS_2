import { useState, useEffect } from 'react';
import { FileText, MapPin, Phone, Mail } from 'lucide-react';

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/admin/clientes`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    if (res.ok) setClientes(await res.json());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 border-r border-slate-200 pr-4 h-[600px] overflow-y-auto">
        <h3 className="text-sm font-black uppercase tracking-tight mb-4 sticky top-0 bg-white py-2">Directorio de Clientes ({clientes.length})</h3>
        <div className="space-y-2">
          {clientes.map(c => (
            <div 
              key={c.id_cliente} 
              onClick={() => setSelectedCliente(c)}
              className={`p-3 rounded border cursor-pointer transition-all ${selectedCliente?.id_cliente === c.id_cliente ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
            >
              <div className="font-bold text-slate-900">{c.nombre}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Mail size={12}/> {c.correo}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2">
        {selectedCliente ? (
          <div>
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h2 className="text-2xl font-black text-slate-900">{selectedCliente.nombre}</h2>
              <div className="flex gap-4 mt-2 text-sm text-slate-600">
                <div className="flex items-center gap-1"><Phone size={14}/> {selectedCliente.telefono || 'N/A'}</div>
                <div className="flex items-center gap-1"><MapPin size={14}/> {selectedCliente.direccion || 'N/A'}</div>
              </div>
            </div>
            
            <h3 className="text-sm font-black uppercase tracking-tight mb-4">Historial de Solicitudes ({selectedCliente.Solicituds?.length || 0})</h3>
            
            {selectedCliente.Solicituds && selectedCliente.Solicituds.length > 0 ? (
              <div className="space-y-4">
                {selectedCliente.Solicituds.map(s => (
                  <div key={s.id_solicitud} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-blue-600 mb-1">#REQ-{s.id_solicitud} • {new Date(s.fecha_servicio).toLocaleDateString()}</div>
                      <div className="text-sm">
                        <span className="font-bold">{s.origen}</span> ➔ {s.destino}
                      </div>
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${s.estatus === 'Completada' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {s.estatus}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-slate-50 text-slate-500 rounded border border-dashed border-slate-300">
                Este cliente no tiene solicitudes registradas aún.
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Selecciona un cliente de la lista para ver sus detalles.
          </div>
        )}
      </div>
    </div>
  );
}
