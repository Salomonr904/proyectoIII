import React, { useState, useEffect } from 'react';

function CrearPago() {
  const [nombreMetodo, setNombreMetodo] = useState('');
  const [metodos, setMetodos] = useState([]);
  const [metodoAEliminar, setMetodoAEliminar] = useState(null);

  // 🔄 Cargar métodos desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/metodos-pago')
      .then((res) => res.json())
      .then((data) => setMetodos(data))
      .catch((err) => console.error('Error al cargar métodos de pago:', err));
    */

    // 🧪 Simulación temporal
    const simulados = [
      { nombre: 'Transferencia Bancaria' },
      { nombre: 'Tarjeta de Crédito' },
      { nombre: 'Tarjeta de Débito' },
      { nombre: 'Efectivo' },
      { nombre: 'PayPal' },
      { nombre: 'Criptomonedas' },
    ];
    setMetodos(simulados);
  }, []);

  const agregarMetodo = () => {
    if (!nombreMetodo.trim()) {
      alert('Por favor ingresa el nombre del método de pago.');
      return;
    }

    const nuevo = { nombre: nombreMetodo };

    // 🔼 Enviar nuevo método al backend (POST)
    /*
    fetch('https://tu-backend.com/api/metodos-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    })
      .then((res) => res.json())
      .then((data) => {
        setMetodos((prev) => [...prev, data]);
        setNombreMetodo('');
      })
      .catch((err) => {
        console.error('Error al crear método de pago:', err);
        alert('No se pudo crear el método.');
      });
    */

    // 🧪 Simulación temporal
    setMetodos((prev) => [...prev, nuevo]);
    setNombreMetodo('');
  };

  const confirmarEliminacion = () => {
    if (!metodoAEliminar) return;

    // 🔽 Eliminar método del backend (DELETE)
    /*
    fetch(`https://tu-backend.com/api/metodos-pago/${metodoAEliminar.nombre}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMetodos((prev) =>
          prev.filter((m) => m.nombre !== metodoAEliminar.nombre)
        );
        setMetodoAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar método de pago:', err);
        alert('No se pudo eliminar el método.');
      });
    */

    // 🧪 Simulación temporal
    setMetodos((prev) =>
      prev.filter((m) => m.nombre !== metodoAEliminar.nombre)
    );
    setMetodoAEliminar(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Crear Método de Pago</h2>

      {/* 📝 Formulario */}
      <div style={{ marginBottom: '2rem' }}>
        <label>Método de Pago:</label>
        <input
          type="text"
          value={nombreMetodo}
          onChange={(e) => setNombreMetodo(e.target.value)}
          placeholder="Ej. Transferencia Bancaria"
        />
        <button onClick={agregarMetodo} style={{ marginTop: '1rem' }}>
          Agregar
        </button>
      </div>

      {/* 📋 Tabla de métodos */}
      <h3>Métodos de Pago</h3>
      {metodos.length === 0 ? (
        <p>No hay métodos registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Método de Pago</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {metodos.map((metodo, index) => (
              <tr key={index}>
                <td>{metodo.nombre}</td>
                <td>✏️</td>
                <td>
                  <button onClick={() => setMetodoAEliminar(metodo)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧨 Modal de confirmación */}
      {metodoAEliminar && (
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
            <p>¿Estás seguro de eliminar este método de pago?</p>
            <p><strong>{metodoAEliminar.nombre}</strong></p>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setMetodoAEliminar(null)}>Cancelar</button>
              <button onClick={confirmarEliminacion}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearPago;