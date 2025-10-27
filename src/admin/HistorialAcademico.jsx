import React, { useState, useMemo } from 'react';

function HistorialAcademico({ estudiante = {}, onVolver }) {
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');

  // 🧪 Evaluaciones simuladas por nivel
  const evaluacionesPorNivel = {
    Básico: [
      {
        nombre: 'Prueba final',
        descripcion: 'Evaluación escrita final del trimestre anterior',
        ponderacion: 20,
        nota: 18,
      },
      {
        nombre: 'Proyecto',
        descripcion: 'Presentación grupal sobre tema libre',
        ponderacion: 15,
        nota: 14,
      },
      {
        nombre: 'Prueba de comprensión auditiva',
        descripcion: 'Evaluación de comprensión auditiva',
        ponderacion: 10,
        nota: 16,
      },
    ],
    Intermedio: [
      {
        nombre: 'Ensayo',
        descripcion: 'Redacción argumentativa sobre tema cultural',
        ponderacion: 25,
        nota: 15,
      },
      {
        nombre: 'Debate',
        descripcion: 'Participación en debate grupal',
        ponderacion: 20,
        nota: 17,
      },
    ],
    Avanzado: [
      {
        nombre: 'Examen oral',
        descripcion: 'Presentación individual en inglés',
        ponderacion: 30,
        nota: 19,
      },
      {
        nombre: 'Proyecto final',
        descripcion: 'Desarrollo de propuesta bilingüe',
        ponderacion: 25,
        nota: 18,
      },
    ],
  };

  const evaluaciones = nivelSeleccionado ? evaluacionesPorNivel[nivelSeleccionado] || [] : [];

  const porcentaje = useMemo(() => {
    const totalPonderacion = evaluaciones.reduce((acc, ev) => acc + ev.ponderacion, 0);
    const totalAportado = evaluaciones.reduce((acc, ev) => acc + ((ev.nota * ev.ponderacion) / 20), 0);
    return totalPonderacion > 0 ? Math.round((totalAportado / totalPonderacion) * 100) : 0;
  }, [evaluaciones]);

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={onVolver}>← Volver</button>
        <button onClick={() => alert('Exportar PDF aún no implementado')}>Exportar PDF</button>
      </div>

      <h2>Historial Académico</h2>

      <div>
        <p><strong>Nombre:</strong> {estudiante.nombre || 'Miguel Guerra'}</p>
        <p><strong>Cédula:</strong> {estudiante.cedula || '00.000.000'}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label><strong>Seleccione Nivel:</strong></label>
        <select
          value={nivelSeleccionado}
          onChange={(e) => setNivelSeleccionado(e.target.value)}
        >
          <option value="">-- Seleccione --</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p><strong>Nivel:</strong> {nivelSeleccionado || '—'}</p>
        <p><strong>Profesor:</strong> —</p>
        <p><strong>Calificación:</strong> —</p>
        <p><strong>Porcentaje:</strong> {porcentaje}%</p>
      </div>

      {evaluaciones.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Materia</th>
              <th>Descripción</th>
              <th>Ponderación</th>
              <th>Nota Obtenida</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((ev, index) => (
              <tr key={index}>
                <td>{ev.nombre}</td>
                <td>{ev.descripcion}</td>
                <td>{ev.ponderacion}</td>
                <td>{ev.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: '1rem' }}>No hay datos</p>
      )}
    </div>
  );
}

export default HistorialAcademico;