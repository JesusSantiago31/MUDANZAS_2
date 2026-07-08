import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLogin({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');

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

      if (data.cliente?.rol !== 'admin') {
        throw new Error('Acceso denegado. No tienes permisos de administrador.');
      }
      
      localStorage.setItem('token', data.token);
      const userPayload = { 
        id: data.cliente?.id,
        nombre: data.cliente?.nombre, 
        correo: formData.correo,
        rol: 'admin'
      };
      localStorage.setItem('user', JSON.stringify(userPayload));
      if (setUser) setUser(userPayload);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-center">
          <ShieldAlert className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Portal Administrativo</h2>
          <p className="text-slate-400 text-sm mt-1">Solo personal autorizado</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">CORREO ELECTRÓNICO</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="admin@mudanzas.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">CONTRASEÑA</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded shadow-sm text-sm font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 uppercase transition-all"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
