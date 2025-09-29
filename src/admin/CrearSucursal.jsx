import React, { useState, useEffect } from 'react';

function CrearSucursal() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [sucursalAEliminar, setSucursalAEliminar] = useState(null);

  // 🔄 Cargar sucursales desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/sucursales')
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch((err) => console.error('Error al cargar sucursales:', err));
    */

    // 🧪 Simulación temporal
    const simuladas = [
      { nombre: 'Sucursal Norte', telefono: '0212-1234567', direccion: 'Av. Norte #123' },
      { nombre: 'Sucursal Sur', telefono: '0212-7654321', direccion: 'Av. Sur #456' },
      { nombre: 'Sucursal Este', telefono: '0212-1112233', direccion: 'Av. Este #789' },
    ];
    setSucursales(simuladas);
  }, []);

  const agregarSucursal = () => {
    if (!nombre.trim() || !telefono.trim() || !direccion.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const nueva = { nombre, telefono, direccion };

    // 🔼 Enviar nueva sucursal al backend (POST)
    /*
    fetch('https://tu-backend.com/api/sucursales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva),
    })
      .then((res) => res.json())
      .then((data) => {
        setSucursales((prev) => [...prev, data]);
        setNombre('');
        setTelefono('');
        setDireccion('');
      })
      .catch((err) => {
        console.error('Error al crear sucursal:', err);
        alert('No se pudo crear la sucursal.');
      });
    */

    // 🧪 Simulación temporal
    setSucursales((prev) => [...prev, nueva]);
    setNombre('');
    setTelefono('');
    setDireccion('');
  };

  const confirmarEliminacion = () => {
    if (!sucursalAEliminar) return;

    // 🔽 Eliminar sucursal del backend (DELETE)
    /*
    fetch(`https://tu-backend.com/api/sucursales/${sucursalAEliminar.nombre}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSucursales((prev) =>
          prev.filter((s) => s.nombre !== sucursalAEliminar.nombre)
        );
        setSucursalAEliminar(null);
      })
      .catch((err) => {
        console.error('Error al eliminar sucursal:', err);
        alert('No se pudo eliminar la sucursal.');
      });
    */

    // 🧪 Simulación temporal
    setSucursales((prev) =>
      prev.filter((s) => s.nombre !== sucursalAEliminar.nombre)
    );
    setSucursalAEliminar(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Nueva Sucursal</h2>

      {/* 📝 Formulario */}
      <div style={{ marginBottom: '2rem' }}>
        <label>Nombre de la sucursal:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Sucursal Norte"
        />

        <label>Teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej. 0212-1234567"
        />

        <label>Dirección:</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ej. Av. Norte #123"
        />

        <button onClick={agregarSucursal} style={{ marginTop: '1rem' }}>
          Agregar
        </button>
      </div>

      {/* 📋 Tabla de sucursales */}
      <h3>Lista de Sucursales</h3>
      {sucursales.length === 0 ? (
        <p>No hay sucursales registradas.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.map((sucursal, index) => (
              <tr key={index}>
                <td>{sucursal.nombre}</td>
                <td>{sucursal.telefono}</td>
                <td>{sucursal.direccion}</td>
                <td>✏️</td>
                <td>
                  <button onClick={() => setSucursalAEliminar(sucursal)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧨 Modal de confirmación */}
      {sucursalAEliminar && (
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
            <p>¿Estás seguro de eliminar esta sucursal?</p>
            <p><strong>{sucursalAEliminar.nombre}</strong></p>
            <p>Teléfono: {sucursalAEliminar.telefono}</p>
            <p>Dirección: {sucursalAEliminar.direccion}</p>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setSucursalAEliminar(null)}>Cancelar</button>
              <button onClick={confirmarEliminacion}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearSucursal;