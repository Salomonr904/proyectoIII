import React, { useState, useEffect } from 'react';

function ConsultaUsuarios({ onVerUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [tipo, setTipo] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null); // 🆕

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://tu-backend.com/api/usuarios?tipo=${tipo}&estado=${estado}`);
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('No se pudo cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [tipo, estado]);

  const desactivarUsuario = async (cedula) => {
    try {
      await fetch(`https://tu-backend.com/api/usuarios/${cedula}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Inactivo' }),
      });

      setUsuarios((prev) =>
        prev.map((u) => (u.cedula === cedula ? { ...u, estado: 'Inactivo' } : u))
      );
      setUsuarioAEliminar(null); // cerrar modal
    } catch (err) {
      console.error('Error al desactivar usuario:', err);
      alert('No se pudo cambiar el estado del usuario.');
    }
  };

  return (
    <div className="consulta-usuarios" style={{ padding: '1rem' }}>
      <h2>Consultar Usuarios</h2>

      <div className="filtros" style={{ marginBottom: '1rem' }}>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ marginRight: '1rem' }}>
          <option value="todos">Todos los tipos</option>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="empleado">Empleado</option>
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : usuarios.length === 0 ? (
        <p>No hay usuarios que coincidan con los filtros.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>C.I</th>
              <th>Nombre y Apellido</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Eliminar</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.cedula}>
                <td>{usuario.cedula}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.telefono}</td>
                <td>
                  <span style={{ color: usuario.estado === 'Activo' ? 'green' : 'gray' }}>
                    {usuario.estado}
                  </span>
                </td>
                <td>
                  {usuario.estado === 'Activo' ? (
                    <button onClick={() => setUsuarioAEliminar(usuario)}>🗑️</button>
                  ) : (
                    <span style={{ opacity: 0.5 }}>—</span>
                  )}
                </td>
                <td>
                  <button onClick={() => onVerUsuario(usuario.cedula)}>👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🧨 Modal de confirmación */}
      {usuarioAEliminar && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px' }}>
            <p>¿Seguro que desea eliminar al siguiente usuario?</p>
            <p><strong>{usuarioAEliminar.tipo}</strong></p>
            <p>{usuarioAEliminar.nombre}</p>
            <p>C.I: {usuarioAEliminar.cedula}</p>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setUsuarioAEliminar(null)}>Cancelar</button>
              <button onClick={() => desactivarUsuario(usuarioAEliminar.cedula)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaUsuarios;