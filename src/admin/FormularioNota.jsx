import React from 'react';

function FormularioNota() {
  return (
    <div className="formulario-nota">
      <h3>Subir Nota</h3>
      <input type="text" placeholder="Evaluación" />
      <input type="text" placeholder="Tipo de Evaluación" />
      <input type="date" placeholder="Fecha" />
      <input type="text" placeholder="Valor Máximo" />
      <input type="text" placeholder="Nota Obtenida" />
      <textarea placeholder="Observación"></textarea>
      <button>Registrar Nota</button>
    </div>
  );
}

export default FormularioNota;
