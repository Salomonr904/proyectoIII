import React from 'react';

function CargaMaterial() {
  return (
    <div className="carga-material">
      <h2>Cargar Material</h2>

      <form className="formulario-carga">
        {/* Nombre del material */}
        <div>
          <label>Nombre del Material</label>
          <input type="text" placeholder="Ej: Listening para nivel 2" />
        </div>

        {/* Listening (1 al 5) */}
        <div>
          <label>Seleccionar Listening</label>
          <select>
            <option value="">-- Seleccione --</option>
            <option value="listening1">Listening 1</option>
            <option value="listening2">Listening 2</option>
            <option value="listening3">Listening 3</option>
            <option value="listening4">Listening 4</option>
            <option value="listening5">Listening 5</option>
          </select>
        </div>

        {/* Tipo de archivo */}
        <div>
          <label>Tipo de Archivo</label>
          <select>
            <option value="">-- Seleccione --</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        {/* Subir archivo */}
        <div>
          <label>Archivo</label>
          <input type="file" />
        </div>

        {/* Botón para subir */}
        <button type="submit">Subir</button>
      </form>
    </div>
  );
}

export default CargaMaterial;