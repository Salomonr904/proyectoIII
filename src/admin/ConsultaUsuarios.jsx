import React, { useState, useEffect } from 'react';

function ConsultaUsuarios({ onVerUsuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [tipo, setTipo] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [fecha, setFecha] = useState('todos');
  const [nivel, setNivel] = useState('todos');
  const [busquedaCedula, setBusquedaCedula] = useState('');
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  useEffect(() => {
    const datosSimulados = [
      {
        cedula: '12345678',
        nombre: 'Miguel Alejandro Guerra López',
        telefono: '0412-0000000',
        estado: 'Activo',
        tipo: 'estudiante',
        fecha: '2025-10-01',
        nivel: 'Básico',
      },
      {
        cedula: '87654321',
        nombre: 'Valentina Valido',
        telefono: '0412-0000000',
        estado: 'Inactivo',
        tipo: 'profesor',
        fecha: '2025-09-15',
        nivel: 'Avanzado',
      },
      {
        cedula: '11223344',
        nombre: 'Oscar Ampudia',
        telefono: '0412-0000000',
        estado: 'Activo',
        tipo: 'empleado',
        fecha: '2025-10-10',
        nivel: 'Intermedio',
      },
    ];

    const filtrados = datosSimulados.filter((usuario) => {
      const coincideTipo = tipo === 'todos' || usuario.tipo === tipo;
      const coincideEstado = estado === 'todos' || usuario.estado.toLowerCase() === estado.toLowerCase();
      const coincideFecha = fecha === 'todos' || usuario.fecha === fecha;
      const coincideNivel = nivel === 'todos' || usuario.nivel === nivel;
      const coincideCedula = usuario.cedula.includes(busquedaCedula.trim());
      return coincideTipo && coincideEstado && coincideFecha && coincideNivel && coincideCedula;
    });

    setUsuarios(filtrados);
  }, [tipo, estado, fecha, nivel, busquedaCedula]);

  const desactivarUsuario = (cedula) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.cedula === cedula ? { ...u, estado: 'Inactivo' } : u))
    );
    setUsuarioAEliminar(null);
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
          <option value="2025-09-15">15/09/2025</option>
          <option value="2025-10-10">10/10/2025</option>
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

      {usuarios.length === 0 ? (
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