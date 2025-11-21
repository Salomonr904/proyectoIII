import React, { useState } from 'react';

// Datos de ejemplo para los desplegables (select)
const tiposDeEvaluacion = [
  'Parcial',
  'Exposición',
  'Práctica',
  'Taller',
  'Proyecto Final',
];
const ponderaciones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function CargarEvaluacion({ estudiante, onVolver, onEvaluacionCargada }) {
  // Inicializamos los campos del formulario.
  const [form, setForm] = useState({
    tipo: '', // Cambiamos 'nombre' por 'tipo' para mayor claridad
    descripcion: '',
    ponderacion: '',
    nota: '',
  });

  const handleChange = (e) => {
    // Maneja los cambios para todos los campos: input y select.
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas antes de enviar
    if (!form.tipo || !form.ponderacion || !form.nota) {
        alert('Por favor, selecciona el Tipo de Evaluación, Ponderación y la Nota.');
        return;
    }

    const nuevaEvaluacion = {
      // Usamos 'tipo' en lugar de 'nombre'
      nombre: form.tipo, 
      descripcion: form.descripcion,
      // Convertimos a número entero (integer)
      ponderacion: parseInt(form.ponderacion, 10), 
      nota: parseInt(form.nota, 10),
      estado: '✔',
    };

    onEvaluacionCargada(nuevaEvaluacion);
    onVolver();
  };

  return (
    // Contenedor principal sin color de fondo para imitar la imagen
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* === Botón Atrás === */}
        <div className="mb-4">
          <button
            onClick={onVolver}
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Atrás
          </button>
        </div>
        
        {/* === Contenedor Principal del Formulario === */}
        <div className="shadow-xl rounded-lg overflow-hidden">
          
          {/* Encabezado Azul Fuerte */}
          <div className="bg-indigo-950 p-4">
            <h2 className="text-xl font-semibold text-white">
              Evaluación
            </h2>
          </div>
          
          {/* Formulario y Contenido */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Primera Fila: Tipo, Ponderación y Nota */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Tipo de Evaluación (Cambiado a SELECT) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Evaluación
                </label>
                <select
                  name="tipo" // Nombre del campo en el estado 'form'
                  value={form.tipo}
                  onChange={handleChange}
                  required
                  // Estilos para parecer un desplegable de la imagen
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-950 appearance-none"
                >
                  {/* Opción placeholder / vacío */}
                  <option value="" disabled>Tipo de Evaluación</option>
                  {/* Mapeamos los tipos de evaluación */}
                  {tiposDeEvaluacion.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Ponderación (Cambiado a SELECT) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ponderación
                </label>
                <select
                  name="ponderacion"
                  value={form.ponderacion}
                  onChange={handleChange}
                  required
                  // Estilos para parecer un desplegable de la imagen
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-950 appearance-none"
                >
                  {/* Opción placeholder / vacío */}
                  <option value="" disabled>Ponderación</option>
                  {/* Mapeamos las ponderaciones */}
                  {ponderaciones.map((p) => (
                    <option key={p} value={p}>
                      {p}%
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Nota (Input de Texto simple, como en la imagen) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota
                </label>
                <input
                  name="nota"
                  type="number" // Sigue siendo number para validación de datos
                  placeholder="Nota"
                  value={form.nota}
                  onChange={handleChange}
                  required
                  min="0" // Agregar límites si es necesario
                  max="20" // Agregar límites si es necesario
                  // Estilos para el input de texto
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-950"
                />
              </div>
              
            </div>

            {/* Segunda Fila: Descripción (Input de Texto Largo) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                // Hacemos el campo opcional (quitamos 'required') ya que no siempre es necesaria una descripción
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-950"
              />
            </div>

            {/* Botón de Cargar Centrado (dentro del formulario) */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 rounded-full text-base font-medium text-white bg-blue-400 hover:bg-blue-500 transition duration-150 ease-in-out shadow-lg"
              >
                Cargar
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default CargarEvaluacion;