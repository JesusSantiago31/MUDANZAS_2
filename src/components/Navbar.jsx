import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function Navbar({ user }) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 text-green-700 font-extrabold text-2xl tracking-wide uppercase">
            <Truck size={32} className="text-green-600" />
            <span>MUDANZAS MI HOGAR</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-slate-700 hover:text-green-700 font-semibold transition-colors">Inicio</Link>
            <Link to="/cotizar" className="text-slate-700 hover:text-green-700 font-semibold transition-colors">Cotización</Link>
          </div>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-xs font-black uppercase text-slate-500">Hola, {user.nombre}</span>
                <Link to="/dashboard" className="bg-green-800 hover:bg-green-950 text-white font-bold px-6 py-2.5 rounded text-xs transition-all shadow-sm uppercase tracking-wider">
                  Mi Panel
                </Link>
              </>
            ) : (
              <Link to="/login" className="bg-green-800 hover:bg-green-950 text-white font-bold px-6 py-2.5 rounded text-xs transition-all shadow-sm uppercase tracking-wider">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
