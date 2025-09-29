import React, { useEffect, useState } from 'react';

function EditarUsuario({ cedula, onNavigate }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datosSimulados = {
      '12345678': {
        tipo: 'estudiante',
        primerNombre: 'Alejandro',
        segundoNombre: 'Alejandro',
        apellido: 'Guerra',
        segundoApellido: 'Guerra',
        cedula: '12345678',
        fechaNacimiento: '2000-12-12',
        correo: 'alejandro@gmail.com',
        telefono: '04141234567',
        emergencia: '04147654321',
        direccion: 'Calle 123, casa 45',
        representante: {
          cedula: '87654321',
          nombre: 'Guillermo Guerra',
          primerNombre: 'Guillermo',
          apellido: 'Guerra',
          telefono: '04149876543',
          trabajo: '04141239876',
          direccionTrabajo: 'Calle 123, casa 45',
          correo: 'vella@gmail.com',
        },
        nivel: 'Nivel Básico',
        profesor: 'Luis Torres',
        sede: 'Los Teques',
      },
    };

    setUsuario(datosSimulados[cedula]);
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

  if (!usuario) return <p>No se encontró el usuario.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={() => onNavigate('detalle-usuario')}>← Atrás</button>
      <h2>Editar Usuario</h2>

      {/* 🧑 Datos del Estudiante */}
      <section>
        <h3>Datos del Estudiante</h3>
        <label>Primer Nombre:</label>
        <input name="primerNombre" value={usuario.primerNombre} onChange={handleChange} />
        <label>Segundo Nombre:</label>
        <input name="segundoNombre" value={usuario.segundoNombre} onChange={handleChange} />
        <label>Apellido:</label>
        <input name="apellido" value={usuario.apellido} onChange={handleChange} />
        <label>Segundo Apellido:</label>
        <input name="segundoApellido" value={usuario.segundoApellido} onChange={handleChange} />
        <label>Cédula de Identidad:</label>
        <input name="cedula" value={usuario.cedula} onChange={handleChange} />
        <label>Fecha de Nacimiento:</label>
        <input name="fechaNacimiento" value={usuario.fechaNacimiento} onChange={handleChange} />
        <label>Edad:</label>
        <input value={edad} disabled />
        <label>Correo Electrónico:</label>
        <input name="correo" value={usuario.correo} onChange={handleChange} />
        <label>Teléfono Celular:</label>
        <input name="telefono" value={usuario.telefono} onChange={handleChange} />
        <label>Teléfono de Emergencia:</label>
        <input name="emergencia" value={usuario.emergencia} onChange={handleChange} />
        <label>Dirección de Habitación:</label>
        <input name="direccion" value={usuario.direccion} onChange={handleChange} />
        <label>Cédula del Representante:</label>
        <input name="cedula" value={usuario.representante.cedula} onChange={handleRepChange} />
        <label>Nombre del Representante:</label>
        <input name="nombre" value={usuario.representante.nombre} onChange={handleRepChange} />
      </section>

      {/* 👨‍👩‍👧 Datos del Representante */}
      <section>
        <h3>Datos del Representante</h3>
        <label>Primer Nombre:</label>
        <input name="primerNombre" value={usuario.representante.primerNombre} onChange={handleRepChange} />
        <label>Apellido:</label>
        <input name="apellido" value={usuario.representante.apellido} onChange={handleRepChange} />
        <label>Cédula de Identidad:</label>
        <input name="cedula" value={usuario.representante.cedula} onChange={handleRepChange} />
        <label>Teléfono Celular:</label>
        <input name="telefono" value={usuario.representante.telefono} onChange={handleRepChange} />
        <label>Teléfono de Trabajo:</label>
        <input name="trabajo" value={usuario.representante.trabajo} onChange={handleRepChange} />
        <label>Dirección de Habitación:</label>
        <input name="direccionTrabajo" value={usuario.representante.direccionTrabajo} onChange={handleRepChange} />
        <label>Correo Electrónico:</label>
        <input name="correo" value={usuario.representante.correo} onChange={handleRepChange} />
      </section>

      {/* 🎓 Nivel de Formación */}
      <section>
        <h3>Nivel de Formación</h3>
        <label>Nivel a cursar:</label>
        <input name="nivel" value={usuario.nivel} onChange={handleChange} />
        <label>Asignación de Profesor:</label>
        <input name="profesor" value={usuario.profesor} onChange={handleChange} />
        <label>Sucursal:</label>
        <input name="sede" value={usuario.sede} onChange={handleChange} />
      </section>

      {/* 📤 Botón para guardar (simulado) */}
      <button onClick={() => console.log('Datos actualizados:', usuario)}>Guardar Cambios</button>
    </div>
  );
}

export default EditarUsuario;