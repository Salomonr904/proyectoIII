import React, { useState } from 'react';

function CargarEvaluacion({ estudiante, onVolver, onEvaluacionCargada }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    ponderacion: '',
    nota: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaEvaluacion = {
      ...form,
      ponderacion: parseInt(form.ponderacion),
      nota: parseInt(form.nota),
      estado: '✔',
    };

    // ✅ Enviamos solo la nueva evaluación
    onEvaluacionCargada(nuevaEvaluacion);
    onVolver();
  };

  return (
    <div>
      <h2>Cargar Evaluación</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '400px',
        }}
      >
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <input
          name="ponderacion"
          type="number"
          placeholder="Ponderación (%)"
          value={form.ponderacion}
          onChange={handleChange}
          required
        />
        <input
          name="nota"
          type="number"
          placeholder="Nota (1–20)"
          value={form.nota}
          onChange={handleChange}
          required
        />
        <button type="submit">Cargar</button>
        <button type="button" onClick={onVolver}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

export default CargarEvaluacion;