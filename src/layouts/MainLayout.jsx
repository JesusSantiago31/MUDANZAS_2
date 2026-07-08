import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainLayout({ user, setUser }) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar user={user} setUser={setUser} />
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer from Mockup */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-green-500 font-extrabold text-lg tracking-wider mb-4 uppercase">
              <Truck size={24} />
              <span>Mudanzas Mi Hogar</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Especialistas en traslados residenciales y corporativos con los más altos estándares de protección.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-500 transition-colors">Inicio</Link></li>
              <li><Link to="/servicios" className="hover:text-green-500 transition-colors">Servicios</Link></li>
              <li><Link to="/cotizar" className="hover:text-green-500 transition-colors">Flota</Link></li>
              <li><Link to="/contacto" className="hover:text-green-500 transition-colors text-green-500">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Redes Sociales</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all text-slate-400">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all text-slate-400">
                <svg className="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all text-slate-400">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-slate-500">
              *Términos y condiciones
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-8 pt-6 flex justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Mudanzas Mi Hogar. Seguridad y Confianza.</p>
        </div>
      </footer>
    </div>
  );
}
