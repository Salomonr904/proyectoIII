import React, { useState } from 'react';

function RegistrarCuota({ onVolver }) {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [metodo, setMetodo] = useState('');
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [comentario, setComentario] = useState('');

  const cargarCuota = () => {
    if (!cedula || !nombre || !metodo || !fecha || !monto) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const nuevaCuota = {
      cedula,
      nombre,
      metodo,
      fecha,
      monto,
      comentario,
    };

    // ⚠️ Reemplaza esta simulación por fetch real:
    /*
    fetch('https://tu-backend.com/api/cuotas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCuota),
    })
      .then(() => {
        alert('Cuota registrada correctamente.');
        onVolver();
      })
      .catch((err) => {
        console.error('Error al registrar cuota:', err);
        alert('No se pudo registrar la cuota.');
      });
    */

    // 🧪 Simulación temporal
    alert(`Cuota registrada para ${nombre} (${cedula}) por ${monto} vía ${metodo}`);
    onVolver();
  };

  return (
    <div>
      <h2>Registrar Cuota</h2>

      <label>Cédula de Identidad:</label>
      <input
        type="text"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
      />

      <label>Nombre y Apellido:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <label>Método de Pago:</label>
      <input
        type="text"
        value={metodo}
        onChange={(e) => setMetodo(e.target.value)}
      />

      <label>Fecha de Pago:</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <label>Monto (Bs/S):</label>
      <input
        type="text"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />

      <label>Comentario:</label>
      <input
        type="text"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button onClick={onVolver}>Atrás</button>
      <button onClick={cargarCuota}>Cargar</button>
    </div>
  );
}

export default RegistrarCuota;