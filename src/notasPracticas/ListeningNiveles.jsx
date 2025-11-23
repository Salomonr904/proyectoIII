<<<<<<< HEAD
import React, { useState, useEffect } from 'react';

const ListeningNiveles = ({ onAbrirRecurso }) => {
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);

  // DATOS QUEMADOS PERO CON ESTRUCTURA REAL
  const nivelesData = [
    {
      id_level: 1,
      titulo: 'Listening 1',
      color: 'bg-pink-200',
      recursos: {
        video: null,
        audio: null, 
        pdf: null
      }
    },
    {
      id_level: 2,
      titulo: 'Listening 2',
      color: 'bg-orange-200',
      recursos: {
        video: null,
        audio: null,
        pdf: null
      }
    },
    {
      id_level: 3,
      titulo: 'Listening 3',
      color: 'bg-green-200',
      recursos: {
        video: null,
        audio: null,
        pdf: null
      }
    },
    {
      id_level: 4,
      titulo: 'Listening 4',
      color: 'bg-teal-200',
      recursos: {
        video: null,
        audio: null,
        pdf: null
      }
    },
    {
      id_level: 5,
      titulo: 'Listening 5',
      color: 'bg-blue-200',
      recursos: {
        video: null,
        audio: null,
        pdf: null
      }
    }
  ];

  // Simular carga de niveles
  useEffect(() => {
    setTimeout(() => {
      setNiveles(nivelesData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Cargando niveles...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold text-blue-800">🎧 Niveles de Listening</h3>
        <p className="text-sm text-blue-600">
          Los 5 niveles están listos. Para habilitar los materiales, configura la ruta del backend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {niveles.map((nivel) => (
          <div key={nivel.id_level} className={`p-6 rounded-xl shadow-md ${nivel.color}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{nivel.titulo}</h3>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => alert(`🎥 Video del ${nivel.titulo}\n\nPara conectar con materiales reales:\n1. Pregunta la ruta: /api/materials/level/:id_level\n2. Cambia la URL en el código`)}
                className="bg-white text-gray-700 font-semibold py-3 px-4 rounded-md shadow hover:bg-gray-100 transition duration-200 flex items-center justify-center gap-2 border border-blue-300"
              >
                <span>🎥</span>
                <span>Ver Video</span>
              </button>

              <button
                onClick={() => alert(`🔊 Audio del ${nivel.titulo}\n\nPara conectar con materiales reales:\n1. Pregunta la ruta: /api/materials/level/:id_level\n2. Cambia la URL en el código`)}
                className="bg-white text-gray-700 font-semibold py-3 px-4 rounded-md shadow hover:bg-gray-100 transition duration-200 flex items-center justify-center gap-2 border border-blue-300"
              >
                <span>🔊</span>
                <span>Escuchar Audio</span>
              </button>

              <button
                onClick={() => alert(`📄 PDF del ${nivel.titulo}\n\nPara conectar con materiales reales:\n1. Pregunta la ruta: /api/materials/level/:id_level\n2. Cambia la URL en el código`)}
                className="bg-white text-gray-700 font-semibold py-3 px-4 rounded-md shadow hover:bg-gray-100 transition duration-200 flex items-center justify-center gap-2 border border-blue-300"
              >
                <span>📄</span>
                <span>Descargar PDF</span>
              </button>
            </div>

            <div className="mt-4 text-center">
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                Nivel {nivel.id_level} - Esperando configuración
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* INSTRUCCIONES */}
      <div className="mt-8 p-6 bg-gray-100 rounded-lg max-w-4xl mx-auto">
        <h4 className="font-bold text-gray-800 mb-2">🚨 Para conectar con materiales reales:</h4>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>Pregunta a tu compañero: <strong>"¿Cuál es la ruta EXACTA para obtener materiales por nivel?"</strong></li>
          <li>Ejemplos: <code>/api/materials/level/1</code>, <code>/api/materials/1</code>, <code>/api/materials?level=1</code></li>
          <li>Una vez sepas la ruta, se cambia en una sola línea de código</li>
          <li>Los botones se habilitarán automáticamente con los materiales reales</li>
        </ol>
      </div>
=======
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
>>>>>>> 5e61dd5d79fbf336925c17e6f7b67ed558ce522e
    </div>
  );
};

export default ListeningNiveles;