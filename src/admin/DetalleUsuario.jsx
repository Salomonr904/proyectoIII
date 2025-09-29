import React, { useEffect, useState } from 'react';

function DetalleUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datosSimulados = {
      '12345678': {
        nombre: 'Miguel Alejandro Guerra López',
        tipo: 'Estudiante',
        cedula: '12345678',
        telefono: '0412-0000000',
        correo: 'miguel@gmail.com',
        direccion: 'San Antonio',
        sexo: 'Masculino',
        estado: 'Activo',
        fechaNacimiento: '2010-05-12',
        nivel: 'Básico',
        profesor: 'Williams De Freitas',
        sede: 'Los Teques',
        representante: {
          nombre: 'Valentina Guerra',
          telefono: '0412-0000000',
          emergencia: '0412-0000000',
          correo: 'vale@gmail.com',
          direccion: 'San Francisco',
        },
      },
      '87654321': {
        nombre: 'Valentina Valido',
        tipo: 'Profesor',
        cedula: '87654321',
        telefono: '0412-0000000',
        correo: 'valentina@gmail.com',
        direccion: 'Caracas',
        sexo: 'Femenino',
        estado: 'Inactivo',
        fechaNacimiento: '1985-08-20',
        nivel: '—',
        profesor: '—',
        sede: '—',
      },
      '11223344': {
        nombre: 'Oscar Ampudia',
        tipo: 'Empleado',
        cedula: '11223344',
        telefono: '0412-0000000',
        correo: 'oscar@gmail.com',
        direccion: 'Los Teques',
        sexo: 'Masculino',
        estado: 'Activo',
        fechaNacimiento: '1990-03-15',
        nivel: '—',
        profesor: '—',
        sede: '—',
      },
    };

    setUsuario(datosSimulados[cedula]);
  }, [cedula]);

  if (!usuario) return <p>No se encontró el usuario.</p>;

  const calcularEdad = (fecha) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const edad = usuario.fechaNacimiento ? calcularEdad(usuario.fechaNacimiento) : null;

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
        <p><strong>Edad:</strong> {edad} años</p>
        <p><strong>Estado:</strong> {usuario.estado}</p>
      </section>

      {/* 🎓 Datos académicos */}
      {usuario.tipo === 'Estudiante' && (
        <section style={{ marginBottom: '2rem' }}>
          <h3>Nivel de Formación</h3>
          <p><strong>Nivel:</strong> {usuario.nivel}</p>
          <p><strong>Profesor:</strong> {usuario.profesor}</p>
          <p><strong>Sede:</strong> {usuario.sede}</p>
        </section>
      )}

      {/* 👨‍👩‍👧 Datos del representante */}
      {usuario.tipo === 'Estudiante' && edad < 18 ? (
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
          <p style={{ fontStyle: 'italic' }}>Este estudiante menor de edad no tiene representante registrado.</p>
        )
      ) : null}
    </div>
  );
}

export default DetalleUsuario;