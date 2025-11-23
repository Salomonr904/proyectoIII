import React, { useState } from 'react';
import CargaMaterial from './CargaMaterial';
import VerMaterial from './VerMaterial';

function VistaMaterial() {
  const [modo, setModo] = useState('cargar'); // 'cargar' o 'ver'

  return (
    <div className="vista-material">
      <h2>Material de Estudio</h2>

      {/* Botones para alternar vistas */}
      <div className="botones-material">
        <button onClick={() => setModo('cargar')}>Cargar</button>
        <button onClick={() => setModo('ver')}>Ver</button>
      </div>

      {/* Vista dinámica */}
      {modo === 'cargar' && <CargaMaterial />}
      {modo === 'ver' && <VerMaterial />}
    </div>
  );
}

export default VistaMaterial;