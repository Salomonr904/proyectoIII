import React, { useEffect, useState } from 'react';

function RestablecerContrasena({ cedula, onVolver }) {
  const [usuario, setUsuario] = useState(null);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real:
    /*
    fetch(`https://tu-backend.com/api/usuarios/${cedula}`)
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch((err) => console.error('Error al cargar usuario:', err));
    */

    // 🧪 Simulación temporal
    const simulado = {
      cedula: cedula,
      rol: 'Estudiante',
      nombre: 'Miguel Guerra',
    };
    setUsuario(simulado);
  }, [cedula]);

  const guardarCambios = () => {
    if (!nuevaContrasena.trim()) {
      alert('Por favor ingresa una nueva contraseña.');
      return;
    }

    // ⚠️ Reemplaza esta simulación por fetch real:
    /*
    fetch(`https://tu-backend.com/api/usuarios/${cedula}/contrasena`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contrasena: nuevaContrasena, comentario }),
    })
      .then(() => {
        alert('Contraseña actualizada correctamente.');
        onVolver();
      })
      .catch((err) => {
        console.error('Error al actualizar contraseña:', err);
        alert('No se pudo actualizar la contraseña.');
      });
    */

    // 🧪 Simulación temporal
    alert(`Contraseña de ${usuario.nombre} actualizada a "${nuevaContrasena}"`);
    onVolver();
  };

  if (!usuario) return <p>Cargando datos del usuario...</p>;

  return (
    <div>
      <h2>Restablecer Contraseña</h2>

      <p>Cédula de Identidad: {usuario.cedula}</p>
      <p>Rol: {usuario.rol}</p>
      <p>Usuario: {usuario.nombre}</p>

      <label>Comentario:</label>
      <input
        type="text"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <label>Nueva Contraseña:</label>
      <input
        type="text"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
      />

      <button onClick={onVolver}>Atrás</button>
      <button onClick={guardarCambios}>Cargar</button>
    </div>
  );
}

export default RestablecerContrasena;