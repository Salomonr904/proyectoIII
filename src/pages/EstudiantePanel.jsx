import React, { useState } from 'react';
import NormativasGenerales from "../notasPracticas/NormativasGenerales";
import PanelDeControl from '../notasPracticas/PanelDeControl';
import PracticasEstudiante from "../notasPracticas/Practicas.jsx";
import ListeningNiveles from "../notasPracticas/ListeningNiveles";
import RecursoListening from "../notasPracticas/RecursoListening";

const EstudiantePanel = () => {
  const [vista, setVista] = useState('inicio');
  const [recurso, setRecurso] = useState({ tipo: null, nivel: null });

  const abrirRecurso = (tipo, nivel) => {
    setRecurso({ tipo, nivel });
    setVista('recurso-listening');
  };

  const renderVista = () => {
    switch (vista) {
      case 'inicio':
        return <NormativasGenerales />;
      case 'practicas':
        return <PracticasEstudiante onEntrar={setVista} />;
      case 'listening-niveles':
        return <ListeningNiveles onAbrirRecurso={abrirRecurso} />;
      case 'recurso-listening':
        return <RecursoListening tipo={recurso.tipo} nivel={recurso.nivel} />;
      case 'calificaciones':
        return <div className="text-gray-700 text-lg">Calificaciones (pendiente)</div>;
      default:
        return <NormativasGenerales />;
    }
  };

  const getTituloVista = () => {
    switch (vista) {
      case 'inicio':
        return 'Normativas Generales';
      case 'practicas':
        return 'Prácticas';
      case 'listening-niveles':
        return 'Niveles de Listening';
      case 'recurso-listening':
        return `Recurso: Nivel ${recurso.nivel}`;
      case 'calificaciones':
        return 'Calificaciones';
      default:
        return 'Normativas Generales';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <PanelDeControl onNavigate={setVista} />

        <main className="flex-1 p-8">
          {/* Encabezado dinámico */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide">{getTituloVista()}</h2>
            <div className="flex items-center gap-3">
              <img
                src="/img/foto-estudiante.jpg"
                alt="Foto del estudiante"
                className="h-12 w-12 rounded-full object-cover border border-gray-300"
              />
              <span className="text-gray-700 font-semibold">Miguel Guerra</span>
            </div>
          </div>

          {renderVista()}
        </main>
      </div>

      <footer className="text-center text-gray-500 text-sm py-4 border-t border-gray-300 bg-white">
        2025 Nnes Learning Center C.A RIF: J-40517294-0
      </footer>
    </div>
  );
};

export default EstudiantePanel;