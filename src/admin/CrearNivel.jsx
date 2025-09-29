import React, { useState, useEffect } from 'react';

function CrearNivel() {
  const [nombreNivel, setNombreNivel] = useState('');
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [nivelAEliminar, setNivelAEliminar] = useState(null); // 🆕 Modal de eliminación

  // 🔄 Cargar niveles desde el backend (GET)
  useEffect(() => {
    // ⚠️ Cuando tengas el backend, reemplaza esta simulación por fetch real:
    /*
    fetch('https://tu-backend.com/api/niveles')
      .then((res) => res.json())
      .then((data) => setNiveles(data))
      .catch((err) => console.error('Error al cargar niveles:', err));
    */

    // 🧪 Simulación temporal
    const nivelesSimulados = [
      { nombre: 'Básico', dias: ['Lunes', 'Jueves'] },
      { nombre: 'Intermedio', dias: ['Martes', 'Viernes'] },
      { nombre: 'Avanzado', dias: ['Miércoles', 'Sábado'] },
    ];
    setNiveles(nivelesSimulados);
  }, []);

  const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const toggleDia = (dia) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const agregarNivel = () => {
    if (!nombreNivel || diasSeleccionados.length === 0) {
      alert('Por favor completa el nombre del nivel y selecciona al menos un día.');
      return;
    }

    const nuevoNivel = {
      nombre: nombreNivel,
      dias: diasSeleccionados,
    };

    // 🔼 Enviar nuevo nivel al backend (POST)
    // ⚠️ Cuando tengas el backend, reemplaza esta simulación por fetch real:
    /*
    fetch('https://tu-backend.com/api/niveles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoNivel),
    })
      .then((res) => res.json())
      .then((data) => {
        setNiveles((prev) => [...prev, data]);
        setNombreNivel('');
        setDiasSeleccionados([]);
      })
      .catch((err) => {
        console.error('Error al crear nivel:', err);
        alert('No se pudo crear el nivel.');
      });
    */

    // 🧪 Simulación temporal
    setNiveles((prev) => [...prev, nuevoNivel]);
    setNombreNivel('');
    setDiasSeleccionados([]);
  };

  const confirmarEliminacion = () => {
    if (!nivelAEliminar) return;

    // 🔽 Eliminar nivel del backend (DELETE)
    // ⚠️ Cuando tengas el backend, reemplaza esta simulación por fetch real:
    /*
    fetch(`https://tu-backend.com/api/niveles/${nivelAEliminar.nombre}`, {
      method: 'DELETE',
    })
      .then(() => {
        setNiveles((prev) => prev.filter((n) => n.nombre !== nivelAEliminar.nombre));
        setNivelAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar nivel:', err);
        alert('No se pudo eliminar el nivel.');
      });
    */

    // 🧪 Simulación temporal
    setNiveles((prev) => prev.filter((n) => n.nombre !== nivelAEliminar.nombre));
    setNivelAEliminar(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Nuevo Nivel</h2>

      {/* 📝 Formulario */}
      <div style={{ marginBottom: '2rem' }}>
        <label>Nombre del Nivel:</label>
        <input
          type="text"
          value={nombreNivel}
          onChange={(e) => setNombreNivel(e.target.value)}
          placeholder="Ej. Nivel Básico"
        />

        <div style={{ marginTop: '1rem' }}>
          <label>Días de clase:</label>
          <div>
            {diasDisponibles.map((dia) => (
              <label key={dia} style={{ marginRight: '1rem' }}>
                <input
                  type="checkbox"
                  checked={diasSeleccionados.includes(dia)}
                  onChange={() => toggleDia(dia)}
                />
                {dia}
              </label>
            ))}
          </div>
        </div>

        <button onClick={agregarNivel} style={{ marginTop: '1rem' }}>
          Agregar
        </button>
      </div>

      {/* 📋 Tabla de niveles */}
      <h3>Niveles de Formación</h3>
      {niveles.length === 0 ? (
        <p>No hay niveles registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Día de clases</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {niveles.map((nivel, index) => (
              <tr key={index}>
                <td>{nivel.nombre}</td>
                <td>{nivel.dias.join(' / ')}</td>
                <td>✏️</td>
                <td>
                  <button onClick={() => setNivelAEliminar(nivel)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧨 Modal de confirmación de eliminación */}
      {nivelAEliminar && (
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
            <p>¿Estás seguro de eliminar este nivel de formación?</p>
            <p><strong>{nivelAEliminar.nombre}</strong></p>
            <p>Días: {nivelAEliminar.dias.join(', ')}</p>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setNivelAEliminar(null)}>Cancelar</button>
              <button onClick={confirmarEliminacion}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearNivel;