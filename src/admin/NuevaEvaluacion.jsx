import React, { useState, useEffect } from 'react';

function NuevaEvaluacion() {
  const [nombreEvaluacion, setNombreEvaluacion] = useState('');
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evaluacionAEliminar, setEvaluacionAEliminar] = useState(null);

  // 🔄 Cargar evaluaciones desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/evaluaciones')
      .then((res) => res.json())
      .then((data) => setEvaluaciones(data))
      .catch((err) => console.error('Error al cargar evaluaciones:', err));
    */

    // 🧪 Simulación temporal
    const simuladas = [
      { nombre: 'Prueba de comprensión lectora individual' },
      { nombre: 'Prueba de comprensión lectora grupal' },
      { nombre: 'Evaluación oral semestral' },
    ];
    setEvaluaciones(simuladas);
  }, []);

  const agregarEvaluacion = () => {
    if (!nombreEvaluacion.trim()) {
      alert('Por favor ingresa el nombre de la evaluación.');
      return;
    }

    const nueva = { nombre: nombreEvaluacion };

    // 🔼 Enviar nueva evaluación al backend (POST)
    /*
    fetch('https://tu-backend.com/api/evaluaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvaluaciones((prev) => [...prev, data]);
        setNombreEvaluacion('');
      })
      .catch((err) => {
        console.error('Error al crear evaluación:', err);
        alert('No se pudo crear la evaluación.');
      });
    */

    // 🧪 Simulación temporal
    setEvaluaciones((prev) => [...prev, nueva]);
    setNombreEvaluacion('');
  };

  const confirmarEliminacion = () => {
    if (!evaluacionAEliminar) return;

    // 🔽 Eliminar evaluación del backend (DELETE)
    /*
    fetch(`https://tu-backend.com/api/evaluaciones/${evaluacionAEliminar.nombre}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEvaluaciones((prev) =>
          prev.filter((e) => e.nombre !== evaluacionAEliminar.nombre)
        );
        setEvaluacionAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar evaluación:', err);
        alert('No se pudo eliminar la evaluación.');
      });
    */

    // 🧪 Simulación temporal
    setEvaluaciones((prev) =>
      prev.filter((e) => e.nombre !== evaluacionAEliminar.nombre)
    );
    setEvaluacionAEliminar(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Nueva Evaluación</h2>

      {/* 📝 Formulario */}
      <div style={{ marginBottom: '2rem' }}>
        <label>Nombre de la Evaluación:</label>
        <input
          type="text"
          value={nombreEvaluacion}
          onChange={(e) => setNombreEvaluacion(e.target.value)}
          placeholder="Ej. Prueba de comprensión lectora"
        />
        <button onClick={agregarEvaluacion} style={{ marginTop: '1rem' }}>
          Agregar
        </button>
      </div>

      {/* 📋 Tabla de evaluaciones */}
      <h3>Tipos de Evaluaciones</h3>
      {evaluaciones.length === 0 ? (
        <p>No hay evaluaciones registradas.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((evaluacion, index) => (
              <tr key={index}>
                <td>{evaluacion.nombre}</td>
                <td>✏️</td>
                <td>
                  <button onClick={() => setEvaluacionAEliminar(evaluacion)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧨 Modal de confirmación */}
      {evaluacionAEliminar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px' }}>
            <p>¿Estás seguro de eliminar esta evaluación?</p>
            <p><strong>{evaluacionAEliminar.nombre}</strong></p>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setEvaluacionAEliminar(null)}>Cancelar</button>
              <button onClick={confirmarEliminacion}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NuevaEvaluacion;