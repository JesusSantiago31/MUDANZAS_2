import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Mail, Lock, Truck } from 'lucide-react';
import MapPicker from '../components/MapPicker';

export default function Registro({ setUser }) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      alert('Registro exitoso. Iniciando sesión...');
      const userPayload = { nombre: formData.nombre, correo: formData.correo };
      localStorage.setItem('user', JSON.stringify(userPayload));
      if (setUser) setUser(userPayload);
      navigate('/dashboard');
    } catch (err) {
      console.warn('Backend connection failed, using local simulation:', err.message);
      // Fallback for demo
      const userPayload = { nombre: formData.nombre || 'Carlos Mendoza', correo: formData.correo };
      localStorage.setItem('user', JSON.stringify(userPayload));
      if (setUser) setUser(userPayload);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="bg-white p-10 rounded shadow-xl w-full max-w-lg border border-slate-200">
        <div className="flex justify-center mb-6 text-green-700">
          <Truck size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-center text-slate-900 mb-2 uppercase tracking-tight">Crear Cuenta</h2>
        <p className="text-center text-xs text-slate-500 mb-8 uppercase tracking-widest">MUDANZAS MI HOGAR</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Nombre Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="pl-10 w-full px-4 py-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-green-600 bg-slate-50" placeholder="Ej. Juan Pérez" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Teléfono</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={16} />
                </div>
                <input required type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="pl-10 w-full px-4 py-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-green-600 bg-slate-50" placeholder="555-123-4567" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input required type="email" name="correo" value={formData.correo} onChange={handleChange} className="pl-10 w-full px-4 py-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-green-600 bg-slate-50" placeholder="correo@ejemplo.com" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Dirección Actual</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin size={16} />
              </div>
              <MapPicker onSelect={(address) => setFormData({ ...formData, direccion: address })} />
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="pl-10 w-full px-4 py-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-green-600 bg-slate-50" placeholder="Calle, Número, Colonia" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} className="pl-10 w-full px-4 py-2 text-sm border border-slate-300 rounded outline-none focus:ring-1 focus:ring-green-600 bg-slate-50" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-black text-xs uppercase py-3.5 rounded transition-all tracking-wider shadow-sm mt-2">
            Completar Registro
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 uppercase tracking-wider">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-green-700 font-extrabold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
