
import React from 'react';

function RegistroUsuario({ cedula }) {
  return (
    <div className="formulario-usuario">
      <h2>Usuarios y Contraseña</h2>

      <section className="datos-usuario">
        <input
          name="cedula"
          placeholder="Cédula de Identidad"
          value={cedula || ''}
          readOnly
        />
        <input name="usuario" placeholder="Usuario" />
        <input name="contrasena" type="password" placeholder="Contraseña" />
        <select name="rol">
          <option value="">Rol</option>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
          <option value="admin">Administrador</option>
        </select>
        <textarea name="comentario" placeholder="Comentario" />
      </section>

      <section className="foto-usuario">
        <label>Agregar foto</label>
        <input type="file" accept="image/*" />
      </section>

      <div className="acciones-formulario">
        <button type="button">Cancelar</button>
        <button type="submit">Cargar</button>
      </div>
    </div>
  );
}

export default RegistroUsuario;

