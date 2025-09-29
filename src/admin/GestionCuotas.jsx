import React, { useState, useEffect } from 'react';

function GestionCuotas({ onRegistrarCuota }) {
  const [cuotas, setCuotas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/cuotas')
      .then((res) => res.json())
      .then((data) => setCuotas(data))
      .catch((err) => console.error('Error al cargar cuotas:', err));
    */

    // 🧪 Simulación temporal
    const simuladas = [
      {
        cedula: '00000000',
        nombre: 'Gabriela Sanchez',
        fecha: '01/01/2024',
        metodo: 'Efectivo',
        monto: '30$',
      },
      {
        cedula: '00000001',
        nombre: 'Miguel Guerra',
        fecha: '02/01/2024',
        metodo: 'Tarjeta de D/C',
        monto: '30$',
      },
      {
        cedula: '00000002',
        nombre: 'Esteban Escalona',
        fecha: '03/01/2024',
        metodo: 'Transferencia',
        monto: '30$',
      },
    ];
    setCuotas(simuladas);
  }, []);

  const cuotasFiltradas = cuotas.filter((c) =>
    c.cedula.includes(busqueda.trim())
  );

  return (
    <div>
      <h2>Gestión de Cuotas</h2>

      <button onClick={onRegistrarCuota}>Registrar</button>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por cédula"
      />

      {cuotasFiltradas.length === 0 ? (
        <p>No hay cuotas que coincidan con la búsqueda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>C.I</th>
              <th>Nombre y Apellido</th>
              <th>Fecha</th>
              <th>Método</th>
              <th>Monto</th>
              <th>Editar</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {cuotasFiltradas.map((cuota, index) => (
              <tr key={index}>
                <td>{cuota.cedula}</td>
                <td>{cuota.nombre}</td>
                <td>{cuota.fecha}</td>
                <td>{cuota.metodo}</td>
                <td>{cuota.monto}</td>
                <td>✏️</td>
                <td>👁️</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GestionCuotas;