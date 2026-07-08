import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Truck } from 'lucide-react';

export default function Login({ setUser }) {
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }
      
      localStorage.setItem('token', data.token);
      const userPayload = { 
        id: data.cliente?.id,
        nombre: data.cliente?.nombre,
        correo: formData.correo,
        direccion: data.cliente?.direccion || ''
      };
      localStorage.setItem('user', JSON.stringify(userPayload));
      if (setUser) setUser(userPayload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.message);
      setError(err.message || 'Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="bg-white p-10 rounded shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex justify-center mb-6 text-green-700">
          <Truck size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-center text-slate-900 mb-2 uppercase tracking-tight">Iniciar Sesión</h2>
        <p className="text-center text-xs text-slate-500 mb-8 uppercase tracking-widest">MUDANZAS MI HOGAR</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input 
                required 
                type="email" 
                name="correo" 
                value={formData.correo} 
                onChange={handleChange} 
                className="pl-10 w-full px-4 py-3 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-green-600 bg-slate-50 text-sm" 
                placeholder="tucorreo@ejemplo.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input 
                required 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="pl-10 w-full px-4 py-3 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-green-600 bg-slate-50 text-sm" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-black text-xs uppercase py-3.5 rounded transition-all tracking-wider shadow-sm">
            Ingresar
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-8 uppercase tracking-wider">
          ¿No tienes una cuenta? <Link to="/registro" className="text-green-700 font-extrabold hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
