import React from 'react';

const PracticasEstudiante = ({ onEntrar }) => {
  return (
    <div className="rounded-xl p-8 max-w-3xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">Listening</h2>
      <div className="flex justify-center mb-6">
        <img
          src="/img/listening-ilustracion.png"
          alt="Ilustración de Listening"
          className="h-48 w-auto object-contain"
        />
      </div>
      <button
        onClick={() => onEntrar('listening-niveles')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-3 rounded-full transition-colors"
      >
        Entrar
      </button>
    </div>
  );
};

export default PracticasEstudiante;

