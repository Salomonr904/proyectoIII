import React, { useState, useEffect } from 'react';

function GestionUsuarios({ onVerRestablecer }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/usuarios')
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error('Error al cargar usuarios:', err));
    */

    const simulados = [
      { nombre: 'Miguel Guerra', cedula: '00000000', estado: 'Activo' },
      { nombre: 'Valentina Villalba', cedula: '00000001', estado: 'Deshabilitado' },
      { nombre: 'Moises Gil', cedula: '00000002', estado: 'Activo' },
      { nombre: 'Maria Da Silva', cedula: '00000003', estado: 'Activo' },
      { nombre: 'Jose Montesino', cedula: '00000004', estado: 'Deshabilitado' },
      { nombre: 'Oscar Ampudia', cedula: '00000005', estado: 'Activo' },
      { nombre: 'Fabiola Rodriguez', cedula: '00000006', estado: 'Activo' },
    ];
    setUsuarios(simulados);
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.cedula.includes(busqueda.trim())
  );

  const cambiarEstado = async () => {
    if (!usuarioSeleccionado) return;
    const nuevoEstado = usuarioSeleccionado.estado === 'Activo' ? 'Deshabilitado' : 'Activo';

    // 🔄 Enviar cambio de estado al backend (PUT)
    /*
    fetch(`https://tu-backend.com/api/usuarios/${usuarioSeleccionado.cedula}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then(() => {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.cedula === usuarioSeleccionado.cedula
              ? { ...u, estado: nuevoEstado }
              : u
          )
        );
        setUsuarioSeleccionado(null);
      })
      .catch((err) => {
        console.error('Error al cambiar estado:', err);
        alert('No se pudo actualizar el estado del usuario.');
      });
    */

    // 🧪 Simulación temporal
    setUsuarios((prev) =>
      prev.map((u) =>
        u.cedula === usuarioSeleccionado.cedula
          ? { ...u, estado: nuevoEstado }
          : u
      )
    );
    setUsuarioSeleccionado(null);
  };

  return (
    <div>
      <h2>Gestionar Usuarios</h2>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por cédula"
      />

      {usuariosFiltrados.length === 0 ? (
        <p>No hay usuarios que coincidan con la búsqueda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre y Apellido</th>
              <th>Cédula de Identidad</th>
              <th>Estado</th>
              <th>Restablecer</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.nombre}</td>
                <td>{usuario.cedula}</td>
                <td>{usuario.estado}</td>
                <td>
                  <button onClick={() => onVerRestablecer(usuario.cedula)}>🔁</button>
                </td>
                <td>
                  <button onClick={() => setUsuarioSeleccionado(usuario)}>
                    {usuario.estado === 'Activo' ? 'Inactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {usuarioSeleccionado && (
        <div>
          <div>
            <p>
              ¿Seguro que deseas{' '}
              {usuarioSeleccionado.estado === 'Activo' ? 'inactivar' : 'activar'} al siguiente usuario?
            </p>
            <p>{usuarioSeleccionado.nombre}</p>
            <p>C.I: {usuarioSeleccionado.cedula}</p>
            <button onClick={() => setUsuarioSeleccionado(null)}>Cancelar</button>
            <button onClick={cambiarEstado}>
              {usuarioSeleccionado.estado === 'Activo' ? 'Inactivar' : 'Activar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionUsuarios;