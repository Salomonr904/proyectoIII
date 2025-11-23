import React, { useEffect, useState } from 'react';

function DetalleUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        // ⚠️ Reemplaza esta URL por tu backend real
        const response = await fetch(`https://tu-backend.com/api/usuarios/${cedula}`);
        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        console.error('Error al cargar el detalle del usuario:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [cedula]);

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (!usuario) return <p>No se encontró el usuario.</p>;

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const edad = calcularEdad(usuario.fechaNacimiento);

  return (
    <div className="detalle-usuario" style={{ padding: '1rem' }}>
      {/* 🔙 Navegación */}
      <button onClick={() => onNavigate('consultar')}>← Atrás</button>

      {/* 🧑 Perfil */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>{usuario.nombre}</h2>
        <p><strong>Rol:</strong> {usuario.tipo}</p>
        <button
          onClick={() => onNavigate('editar-usuario')}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Editar
        </button>
      </section>

      {/* 📋 Datos personales */}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Datos del Usuario</h3>
        <p><strong>Cédula:</strong> {usuario.cedula}</p>
        <p><strong>Teléfono:</strong> {usuario.telefono}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
        <p><strong>Dirección:</strong> {usuario.direccion}</p>
        <p><strong>Sexo:</strong> {usuario.sexo}</p>
        <p><strong>Fecha de Nacimiento:</strong> {usuario.fechaNacimiento}</p>
        <p><strong>Estado:</strong> {usuario.estado}</p>
        {edad !== null && (
          <p>
            <strong>Edad:</strong>{' '}
            <span style={{ color: edad < 18 ? 'orange' : 'green' }}>{edad} años</span>
          </p>
        )}
      </section>

      {/* 🎓 Datos académicos */}
      {usuario.tipo === 'estudiante' && (
        <section style={{ marginBottom: '2rem' }}>
          <h3>Nivel de Formación</h3>
          <p><strong>Nivel:</strong> {usuario.nivel}</p>
          <p><strong>Profesor:</strong> {usuario.profesor}</p>
          <p><strong>Sede:</strong> {usuario.sede}</p>
        </section>
      )}

      {/* 👨‍👩‍👧 Representante */}
      {usuario.tipo === 'estudiante' && edad < 18 ? (
        usuario.representante ? (
          <section>
            <h3>Datos del Representante</h3>
            <p><strong>Nombre:</strong> {usuario.representante.nombre}</p>
            <p><strong>Teléfono:</strong> {usuario.representante.telefono}</p>
            <p><strong>Emergencia:</strong> {usuario.representante.emergencia}</p>
            <p><strong>Correo:</strong> {usuario.representante.correo}</p>
            <p><strong>Dirección:</strong> {usuario.representante.direccion}</p>
          </section>
        ) : (
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            ⚠️ Este estudiante menor de edad no tiene representante registrado.
          </p>
        )
      ) : null}
    </div>
  );
}

export default DetalleUsuario;