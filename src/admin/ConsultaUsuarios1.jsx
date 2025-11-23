import React, { useState, useEffect } from 'react';

function ConsultaUsuarios({ onVerUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [tipo, setTipo] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [fecha, setFecha] = useState('todos');
  const [nivel, setNivel] = useState('todos');
  const [busquedaCedula, setBusquedaCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://tu-backend.com/api/usuarios?tipo=${tipo}&estado=${estado}&fecha=${fecha}&nivel=${nivel}`
      );
      const data = await response.json();

      const filtrados = data.filter((usuario) =>
        usuario.cedula.includes(busquedaCedula.trim())
      );

      setUsuarios(filtrados);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError('No se pudo cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [tipo, estado, fecha, nivel, busquedaCedula]);

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
      setUsuarioAEliminar(null);
    } catch (err) {
      console.error('Error al desactivar usuario:', err);
      alert('No se pudo cambiar el estado del usuario.');
    }
  };

  return (
    <div className="consulta-usuarios">
      <h2>Consultar Usuarios</h2>

      <div className="filtros">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="todos">Tipo</option>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="empleado">Empleado</option>
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="todos">Estado</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <select value={fecha} onChange={(e) => setFecha(e.target.value)}>
          <option value="todos">Fecha</option>
          <option value="2025-10-01">01/10/2025</option>
          <option value="2025-10-10">10/10/2025</option>
          <option value="2025-09-15">15/09/2025</option>
        </select>

        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="todos">Nivel</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>

        <input
          type="text"
          value={busquedaCedula}
          onChange={(e) => setBusquedaCedula(e.target.value)}
          placeholder="Buscar por cédula"
        />
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : usuarios.length === 0 ? (
        <p>No hay datos</p>
      ) : (
        <table>
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
                <td>{usuario.estado}</td>
                <td>
                  {usuario.estado === 'Activo' ? (
                    <button onClick={() => setUsuarioAEliminar(usuario)}>🗑️</button>
                  ) : (
                    <span>—</span>
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

      {usuarioAEliminar && (
        <div>
          <div>
            <p>¿Seguro que desea eliminar al siguiente usuario?</p>
            <p><strong>{usuarioAEliminar.tipo}</strong></p>
            <p>{usuarioAEliminar.nombre}</p>
            <p>C.I: {usuarioAEliminar.cedula}</p>
            <button onClick={() => setUsuarioAEliminar(null)}>Cancelar</button>
            <button onClick={() => desactivarUsuario(usuarioAEliminar.cedula)}>Eliminar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaUsuarios;