import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Box, Building2, Truck, ClipboardList } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';
import especializadaImg from '../assets/especializada.png';
import camionetaImg from '../assets/flota_camioneta.png';
import camionImg from '../assets/flota_camion.png';
import furgonImg from '../assets/flota_furgon.png';

export default function Home() {
  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-slate-900 text-white min-h-[550px] flex items-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 relative z-10">
          <div className="max-w-2xl">
            <span className="bg-green-700 text-white font-extrabold text-xs uppercase px-3 py-1.5 rounded tracking-widest inline-block mb-4 shadow">
              SERVICIO CERTIFICADO
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6 uppercase text-slate-100">
              MUDANZAS SEGURAS Y CONFIABLES
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 font-light max-w-lg leading-relaxed">
              Garantizamos logística de alto rendimiento para el hogar y la empresa. Infraestructura pesada para proteger lo que más valoras.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/cotizar" 
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3.5 rounded font-extrabold text-sm uppercase flex items-center gap-2.5 transition-all shadow-md"
              >
                Cotizar ahora <ArrowRight size={16} />
              </Link>
              <a 
                href="#servicios" 
                className="border-2 border-slate-300 text-slate-200 hover:bg-white hover:text-slate-900 px-8 py-3 rounded font-extrabold text-sm uppercase transition-all"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestras Operaciones */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 border-l-4 border-blue-600 pl-4">
            <div className="text-blue-600 font-extrabold text-xs uppercase tracking-wider mb-2">Nuestras Operaciones</div>
            <h2 className="text-3xl font-extrabold text-slate-900 uppercase">
              Desarrollamos protocolos de seguridad industrial para cada etapa del traslado.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Mudanza Residencial */}
            <div className="bg-slate-100 p-8 rounded border border-slate-200/60 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                    <ShieldCheck size={28} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ver Proceso</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Mudanza Residencial</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Traslado integral de mobiliario doméstico con sistemas de sujeción de grado industrial.
                </p>
              </div>
            </div>

            {/* Empaque Profesional */}
            <div className="bg-blue-600 p-8 rounded text-white flex flex-col justify-between min-h-[220px] shadow-sm">
              <div>
                <div className="w-12 h-12 bg-blue-500/50 rounded flex items-center justify-center text-white mb-6">
                  <Box size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Empaque Profesional</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Protección multicapa con materiales de alta resistencia.
                </p>
              </div>
            </div>

            {/* Comercial */}
            <div className="bg-slate-900 p-8 rounded text-white flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-green-500 mb-6">
                  <Building2 size={28} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Comercial</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Logística corporativa para oficinas y sectores industriales.
                </p>
              </div>
            </div>
          </div>

          {/* Logistica Especializada Full Width card */}
          <div className="bg-slate-50 rounded border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-8 lg:p-12">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Servicios</span>
              <h3 className="text-2xl font-black text-slate-950 uppercase mt-2 mb-4">Logística Especializada</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Carga frágil y maquinaria pesada con monitoreo satelital en tiempo real.
              </p>
              <a href="#" className="text-blue-600 font-extrabold text-xs uppercase tracking-wider hover:text-blue-800 flex items-center gap-1">
                Detalles Técnicos <ArrowRight size={14} />
              </a>
            </div>
            <div className="h-64 lg:h-full relative min-h-[240px]">
              <img 
                src={especializadaImg} 
                alt="Logistica Especializada" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Flota Operativa */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase">Flota Operativa</h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest mt-2">Especificaciones Técnicas de Transporte</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Camioneta de Reparto */}
            <div className="bg-white rounded overflow-hidden shadow-sm border border-slate-200">
              <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center text-xs font-black uppercase tracking-wider">
                <span>Unidad _01</span>
                <Truck size={14} />
              </div>
              <div className="h-48 overflow-hidden relative bg-slate-200">
                <img src={camionetaImg} alt="Camioneta de Reparto" className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-green-600 text-white font-extrabold text-[10px] px-2 py-1 rounded">
                  EN SERVICIO
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-extrabold text-slate-900 uppercase mb-4">Camioneta de Reparto</h4>
                <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                  <div className="flex justify-between"><span className="text-slate-400">Capacidad</span> <span className="font-bold text-slate-800">1.5 Toneladas</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Volumen</span> <span className="font-bold text-slate-800">12 m³</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Uso</span> <span className="font-bold text-slate-800">Urbano</span></div>
                </div>
              </div>
            </div>

            {/* Camión de Carga */}
            <div className="bg-white rounded overflow-hidden shadow-sm border border-slate-200">
              <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center text-xs font-black uppercase tracking-wider">
                <span>Unidad _02</span>
                <Truck size={14} />
              </div>
              <div className="h-48 overflow-hidden relative bg-slate-200">
                <img src={camionImg} alt="Camión de Carga" className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-green-600 text-white font-extrabold text-[10px] px-2 py-1 rounded">
                  EN SERVICIO
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-extrabold text-slate-900 uppercase mb-4">Camión de Carga</h4>
                <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                  <div className="flex justify-between"><span className="text-slate-400">Capacidad</span> <span className="font-bold text-slate-800">5 Toneladas</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Volumen</span> <span className="font-bold text-slate-800">32 m³</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Uso</span> <span className="font-bold text-slate-800">Intermunicipal</span></div>
                </div>
              </div>
            </div>

            {/* Furgón Pesado */}
            <div className="bg-white rounded overflow-hidden shadow-sm border border-slate-200">
              <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center text-xs font-black uppercase tracking-wider">
                <span>Unidad _03</span>
                <Truck size={14} />
              </div>
              <div className="h-48 overflow-hidden relative bg-slate-200">
                <img src={furgonImg} alt="Furgón Pesado" className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-green-600 text-white font-extrabold text-[10px] px-2 py-1 rounded">
                  EN SERVICIO
                </span>
              </div>
              <div className="p-6">
                <h4 className="font-extrabold text-slate-900 uppercase mb-4">Furgón Pesado</h4>
                <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                  <div className="flex justify-between"><span className="text-slate-400">Capacidad</span> <span className="font-bold text-slate-800">12 Toneladas</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Volumen</span> <span className="font-bold text-slate-800">65 m³</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Uso</span> <span className="font-bold text-slate-800">Nacional</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) */}
      <section className="bg-green-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
            ¿Listo para moverte con seguridad?
          </h2>
          <p className="text-green-100 text-sm sm:text-base mb-8 max-w-xl mx-auto font-light leading-relaxed">
            Obtén un presupuesto detallado ajustado a tus necesidades logísticas en menos de 5 minutos.
          </p>
          <Link 
            to="/cotizar" 
            className="inline-flex items-center gap-2 bg-white text-green-800 font-extrabold px-8 py-3.5 rounded hover:bg-slate-100 transition-colors uppercase text-sm shadow-md"
          >
            Iniciar Cotización <ClipboardList size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
