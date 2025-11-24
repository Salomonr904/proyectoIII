import React from 'react';

const niveles = [
  { id: 1, color: 'bg-pink-200', titulo: 'Listening 1' },
  { id: 2, color: 'bg-orange-200', titulo: 'Listening 2' },
  { id: 3, color: 'bg-green-200', titulo: 'Listening 3' },
  { id: 4, color: 'bg-teal-200', titulo: 'Listening 4' },
  { id: 5, color: 'bg-blue-200', titulo: 'Listening 5' },
];

const ListeningNiveles = ({ onAbrirRecurso }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-ful mx-auto">
      {niveles.map((nivel) => (
        <div key={nivel.id} className={`p-6 rounded-xl shadow-md ${nivel.color}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">{nivel.titulo}</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onAbrirRecurso('video', nivel.id)}
              className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100"
            >
              Ver video
            </button>
            <button
              onClick={() => onAbrirRecurso('audio', nivel.id)}
              className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100"
            >
              Escuchar Audio
            </button>
            <button
              onClick={() => onAbrirRecurso('pdf', nivel.id)}
              className="bg-white text-gray-700 font-semibold py-2 px-4 rounded-md shadow hover:bg-gray-100"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListeningNiveles;