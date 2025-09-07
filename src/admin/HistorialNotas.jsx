import React from 'react';

function HistorialNotas() {
  return (
    <div className="historial-notas">
      <h3>Evaluaciones y Calificaciones</h3>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Evaluación</th>
            <th>Tipo de Eval.</th>
            <th>Observ.</th>
            <th>Nota</th>
            <th>Valor</th>
            <th>Edit.</th>
            <th>Elim.</th>
          </tr>
        </thead>
        <tbody>
          {/* Puedes mapear aquí un array de notas más adelante */}
          <tr>
            <td>--/--/----</td>
            <td>Ejemplo</td>
            <td>Parcial</td>
            <td>Observación breve</td>
            <td>15</td>
            <td>20</td>
            <td><button>🖉</button></td>
            <td><button>🗑️</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default HistorialNotas;

