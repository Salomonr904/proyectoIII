import React, { useEffect, useState } from 'react';

function EditarUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`https://tu-backend.com/api/usuarios/${cedula}`);
        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [cedula]);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const edad = usuario?.fechaNacimiento ? calcularEdad(usuario.fechaNacimiento) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleRepChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      representante: { ...prev.representante, [name]: value },
    }));
  };

  if (loading) return <p>Cargando datos para editar...</p>;
  if (!usuario) return <p>No se encontró el usuario.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={() => onNavigate('detalle-usuario')}>← Atrás</button>
      <h2>Editar Usuario</h2>

      {/* 🧑 Datos del Estudiante */}
      <section>
        <h3>Datos del Estudiante</h3>
        <label>Primer Nombre:</label>
        <input name="primerNombre" value={usuario.primerNombre || ''} onChange={handleChange} />
        <label>Segundo Nombre:</label>
        <input name="segundoNombre" value={usuario.segundoNombre || ''} onChange={handleChange} />
        <label>Apellido:</label>
        <input name="apellido" value={usuario.apellido || ''} onChange={handleChange} />
        <label>Segundo Apellido:</label>
        <input name="segundoApellido" value={usuario.segundoApellido || ''} onChange={handleChange} />
        <label>Cédula de Identidad:</label>
        <input name="cedula" value={usuario.cedula || ''} onChange={handleChange} />
        <label>Fecha de Nacimiento:</label>
        <input name="fechaNacimiento" value={usuario.fechaNacimiento || ''} onChange={handleChange} />
        <label>Edad:</label>
        <input value={edad || ''} disabled />
        <label>Correo Electrónico:</label>
        <input name="correo" value={usuario.correo || ''} onChange={handleChange} />
        <label>Teléfono Celular:</label>
        <input name="telefono" value={usuario.telefono || ''} onChange={handleChange} />
        <label>Teléfono de Emergencia:</label>
        <input name="emergencia" value={usuario.emergencia || ''} onChange={handleChange} />
        <label>Dirección de Habitación:</label>
        <input name="direccion" value={usuario.direccion || ''} onChange={handleChange} />
        <label>Cédula del Representante:</label>
        <input name="cedula" value={usuario.representante?.cedula || ''} onChange={handleRepChange} />
        <label>Nombre del Representante:</label>
        <input name="nombre" value={usuario.representante?.nombre || ''} onChange={handleRepChange} />
      </section>

      {/* 👨‍👩‍👧 Datos del Representante */}
      {usuario.tipo === 'estudiante' && edad < 18 && (
        <section>
          <h3>Datos del Representante</h3>
          <label>Primer Nombre:</label>
          <input name="primerNombre" value={usuario.representante?.primerNombre || ''} onChange={handleRepChange} />
          <label>Apellido:</label>
          <input name="apellido" value={usuario.representante?.apellido || ''} onChange={handleRepChange} />
          <label>Cédula de Identidad:</label>
          <input name="cedula" value={usuario.representante?.cedula || ''} onChange={handleRepChange} />
          <label>Teléfono Celular:</label>
          <input name="telefono" value={usuario.representante?.telefono || ''} onChange={handleRepChange} />
          <label>Teléfono de Trabajo:</label>
          <input name="trabajo" value={usuario.representante?.trabajo || ''} onChange={handleRepChange} />
          <label>Dirección de Habitación:</label>
          <input name="direccionTrabajo" value={usuario.representante?.direccionTrabajo || ''} onChange={handleRepChange} />
          <label>Correo Electrónico:</label>
          <input name="correo" value={usuario.representante?.correo || ''} onChange={handleRepChange} />
        </section>
      )}

      {/* 🎓 Nivel de Formación */}
      {usuario.tipo === 'estudiante' && (
        <section>
          <h3>Nivel de Formación</h3>
          <label>Nivel a cursar:</label>
          <input name="nivel" value={usuario.nivel || ''} onChange={handleChange} />
          <label>Asignación de Profesor:</label>
          <input name="profesor" value={usuario.profesor || ''} onChange={handleChange} />
          <label>Sucursal:</label>
          <input name="sede" value={usuario.sede || ''} onChange={handleChange} />
        </section>
      )}

      {/* 📤 Botón para guardar (a implementar) */}
      <button>Guardar Cambios</button>
    </div>
  );
}

export default EditarUsuario;