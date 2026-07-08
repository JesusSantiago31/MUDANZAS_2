import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Truck, Calendar, Settings, LogOut, FileText, Activity } from 'lucide-react';
import SolicitudesAdmin from '../components/admin/SolicitudesAdmin';
import VehiculosAdmin from '../components/admin/VehiculosAdmin';
import ConductoresAdmin from '../components/admin/ConductoresAdmin';
import ClientesAdmin from '../components/admin/ClientesAdmin';

export default function AdminDashboard({ setUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [stats, setStats] = useState({ total: 0, pendientes: 0, aprobadas: 0, completadas: 0, rechazadas: 0 });

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Error fetching stats', e);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/admin/login');
      return;
    }
    const userObj = JSON.parse(userStr);
    if (userObj.rol !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-200 flex flex-col shadow-inner">
        <div className="p-6">
          <h1 className="text-xl font-black uppercase text-slate-900 leading-tight">
            Mudanzas<br/>Mi Hogar
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Panel de Control</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem active={activeTab === 'clientes'} icon={<Users />} label="Clientes" onClick={() => setActiveTab('clientes')} />
          <SidebarItem active={activeTab === 'solicitudes'} icon={<FileText />} label="Solicitudes" onClick={() => setActiveTab('solicitudes')} />
          <SidebarItem active={activeTab === 'vehiculos'} icon={<Truck />} label="Vehículos" onClick={() => setActiveTab('vehiculos')} />
          <SidebarItem active={activeTab === 'conductores'} icon={<Activity />} label="Conductores" onClick={() => setActiveTab('conductores')} />
          
          <div className="pt-4">
            <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded transition-colors text-sm uppercase tracking-wide">
              Nueva Mudanza
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-300 space-y-2">
          <SidebarItem active={activeTab === 'configuracion'} icon={<Settings />} label="Configuración" onClick={() => setActiveTab('configuracion')} />
          <SidebarItem active={false} icon={<LogOut />} label="Cerrar Sesión" onClick={handleLogout} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-4xl font-black text-green-700 uppercase tracking-tight">Gestión Operativa</h2>
            <p className="text-slate-500 text-sm mt-1">Administración de flota y logística de traslados en tiempo real.</p>
          </div>
          <div className="bg-slate-200 border border-slate-300 rounded px-4 py-2 flex items-center gap-3">
            <div className="text-right">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin</span>
              <span className="block text-sm font-black text-slate-900">Gestión Logística</span>
            </div>
            <div className="bg-blue-600 p-2 rounded text-white">
              <Settings size={16} />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard title="Total" value={stats.total} highlight />
          <StatCard title="Pendientes" value={stats.pendientes} />
          <StatCard title="Aprobadas" value={stats.aprobadas} />
          <StatCard title="Completadas" value={stats.completadas} dark />
          <StatCard title="Rechazadas" value={stats.rechazadas} />
        </div>

        {/* Dynamic Content based on activeTab */}
        <div className="bg-white rounded border border-slate-300 min-h-[500px]">
          {activeTab === 'solicitudes' && <div className="p-8"><SolicitudesAdmin onUpdateStats={fetchStats} /></div>}
          {activeTab === 'clientes' && <div className="p-8"><ClientesAdmin /></div>}
          {activeTab === 'vehiculos' && <div className="p-8"><VehiculosAdmin /></div>}
          {activeTab === 'conductores' && <div className="p-8"><ConductoresAdmin /></div>}
          {activeTab === 'configuracion' && (
            <div className="p-8">
              <h3 className="text-xl font-black text-slate-900 mb-4">Configuración y Seguridad</h3>
              <div className="bg-slate-50 p-6 rounded border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Registrar Nuevo Administrador</h4>
                <p className="text-sm text-slate-500 mb-4">Crea una cuenta con privilegios administrativos totales. (Solo los administradores actuales pueden realizar esta acción).</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold uppercase tracking-wider">
                  Crear Administrador
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-colors ${
        active ? 'bg-green-700 text-white shadow' : 'text-slate-600 hover:bg-slate-300'
      }`}
    >
      {icon}
      <span className="uppercase tracking-wider">{label}</span>
    </button>
  );
}

function StatCard({ title, value, highlight, dark }) {
  return (
    <div className={`p-6 rounded border ${highlight ? 'border-green-600 shadow-[4px_4px_0_0_#16a34a] bg-white' : dark ? 'bg-green-800 text-white border-green-900 shadow-[4px_4px_0_0_#14532d]' : 'bg-white border-blue-600 shadow-[4px_4px_0_0_#2563eb]'}`}>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${dark ? 'text-green-300' : 'text-slate-500'}`}>{title}</h4>
      <p className={`text-4xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}
