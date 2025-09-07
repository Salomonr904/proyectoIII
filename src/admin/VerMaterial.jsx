import React from 'react';

function VerMaterial() {
  return (
    <div className="ver-material">
      <h2>Material de Estudio</h2>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Listening</th>
            <th>Audio</th>
            <th>Video</th>
            <th>PDF</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {/* Ejemplo de fila, más adelante puedes hacer .map() con los datos */}
          <tr>
            <td>Nombre Ejemplo</td>
            <td>Listening 1</td>
            <td>Cargado</td>
            <td>Cargar</td>
            <td>Cargado</td>
            <td><button>Editar</button></td>
            <td><button>Eliminar</button></td>
          </tr>
        </tbody>
      </table>

      <button style={{ marginTop: '1rem' }}>Subir</button>
    </div>
  );
}

export default VerMaterial;