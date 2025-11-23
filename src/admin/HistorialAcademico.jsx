import React, { useState, useMemo } from "react";

export default function HistorialAcademico({ estudiante = {}, onVolver }) {
  const [nivelSeleccionado, setNivelSeleccionado] = useState("");

  const evaluacionesPorNivel = {
    Básico: [
      {
        nombre: "Prueba final",
        descripcion: "Evaluación escrita final del trimestre anterior",
        ponderacion: 20,
        nota: 18,
      },
      {
        nombre: "Proyecto",
        descripcion: "Presentación grupal sobre tema libre",
        ponderacion: 15,
        nota: 14,
      },
      {
        nombre: "Prueba de comprensión auditiva",
        descripcion: "Evaluación de comprensión auditiva",
        ponderacion: 10,
        nota: 16,
      },
    ],
    Intermedio: [
      {
        nombre: "Ensayo",
        descripcion: "Redacción argumentativa sobre tema cultural",
        ponderacion: 25,
        nota: 15,
      },
      {
        nombre: "Debate",
        descripcion: "Participación en debate grupal",
        ponderacion: 20,
        nota: 17,
      },
    ],
    Avanzado: [
      {
        nombre: "Examen oral",
        descripcion: "Presentación individual en inglés",
        ponderacion: 30,
        nota: 19,
      },
      {
        nombre: "Proyecto final",
        descripcion: "Desarrollo de propuesta bilingüe",
        ponderacion: 25,
        nota: 18,
      },
    ],
  };

  const evaluaciones = nivelSeleccionado
    ? evaluacionesPorNivel[nivelSeleccionado] || []
    : [];

  const porcentaje = useMemo(() => {
    const totalPonderacion = evaluaciones.reduce(
      (acc, ev) => acc + ev.ponderacion,
      0
    );
    const totalAportado = evaluaciones.reduce(
      (acc, ev) => acc + (ev.nota * ev.ponderacion) / 20,
      0
    );
    return totalPonderacion > 0
      ? Math.round((totalAportado / totalPonderacion) * 100)
      : 0;
  }, [evaluaciones]);

  return (
    <div className="w-full p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onVolver}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Atrás
        </button>

        <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition">
          Exportar PDF
        </button>
      </div>

      {/* Título */}
      <h2 className="text-2xl font-semibold text-gray-500 mb-6">
        Historial Académico
      </h2>

      {/* Perfil + Nivel + Porcentaje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Perfil */}
        <div className="flex items-center gap-4">
          <img
            src="/img/student.png"
            className="w-20 h-20 rounded-full object-cover shadow"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {estudiante.nombre || "Miguel Guerra"}
            </p>
            <p className="text-gray-600">{estudiante.cedula || "00.000.000"}</p>
          </div>
        </div>

        {/* Nivel info */}
        <div>
          <p className="text-lg font-medium text-gray-700">
            Nivel: <span className="font-semibold">{nivelSeleccionado || "—"}</span>
          </p>
          <p className="text-gray-600">Profesor: —</p>
          <p className="text-gray-600">Calificación: —</p>
        </div>

        {/* Porcentaje circular */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="#2563eb"
                strokeWidth="10"
                strokeDasharray={314}
                strokeDashoffset={314 - (314 * porcentaje) / 100}
                fill="transparent"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-700">
              {porcentaje}%
            </span>
          </div>
        </div>
      </div>

      {/* Selector de nivel */}
      <div className="mt-6 w-64">
        <select
          className="w-full p-2 border rounded-lg shadow-sm bg-white"
          value={nivelSeleccionado}
          onChange={(e) => setNivelSeleccionado(e.target.value)}
        >
          <option value="">Seleccione Nivel</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-indigo-950 text-white">
            <tr>
              <th className="p-3 text-left">Evaluación</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Ponderación</th>
              <th className="p-3 text-left">Nota Obtenida</th>
            </tr>
          </thead>

          {evaluaciones.length > 0 ? (
            <tbody>
              {evaluaciones.map((ev, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{ev.nombre}</td>
                  <td className="p-3 text-gray-700">{ev.descripcion}</td>
                  <td className="p-3">{ev.ponderacion}%</td>
                  <td className="p-3 font-medium text-gray-800">{ev.nota}</td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No hay datos
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
