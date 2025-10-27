import React, { useEffect, useState, useMemo } from 'react';
import CargarEvaluacion from './CargarEvaluacion';
import HistorialAcademico from './HistorialAcademico';

function DetalleNotas({ estudiante, onVolver, onActualizarEvaluaciones }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [formTemp, setFormTemp] = useState({});
  const [vista, setVista] = useState('detalle');

  useEffect(() => {
    if (estudiante?.evaluaciones) {
      setEvaluaciones(estudiante.evaluaciones);
    }
  }, [estudiante]);

  const promedio = useMemo(() => {
    const totalPonderacion = evaluaciones.reduce((acc, item) => acc + item.ponderacion, 0);
    const totalAportado = evaluaciones.reduce((acc, item) => acc + ((item.nota * item.ponderacion) / 20), 0);
    return totalPonderacion > 0 ? Math.round((totalAportado / totalPonderacion) * 100) : 0;
  }, [evaluaciones]);

  const colorPromedio = useMemo(() => {
    if (promedio >= 90) return '#4caf50';
    if (promedio >= 80) return '#8bc34a';
    if (promedio >= 70) return '#ffeb3b';
    if (promedio >= 60) return '#ff9800';
    return '#f44336';
  }, [promedio]);

  const textoPromedio = useMemo(() => {
    if (promedio >= 90) return 'Excelente';
    if (promedio >= 80) return 'Muy bien';
    if (promedio >= 70) return 'Bien';
    if (promedio >= 60) return 'Regular';
    return 'Deficiente';
  }, [promedio]);

  const eliminarEvaluacion = (index) => {
    const confirmacion = window.confirm('¿Eliminar esta evaluación?');
    if (!confirmacion) return;
    const nuevas = [...evaluaciones];
    nuevas.splice(index, 1);
    setEvaluaciones(nuevas);
    onActualizarEvaluaciones(nuevas);
  };

  const iniciarEdicion = (index) => {
    setEditandoIndex(index);
    setFormTemp({ ...evaluaciones[index] });
  };

  const cancelarEdicion = () => {
    setEditandoIndex(null);
    setFormTemp({});
  };

  const guardarEdicion = (index) => {
    const actualizadas = [...evaluaciones];
    actualizadas[index] = {
      ...formTemp,
      ponderacion: parseInt(formTemp.ponderacion),
      nota: parseInt(formTemp.nota),
    };
    setEvaluaciones(actualizadas);
    onActualizarEvaluaciones(actualizadas);
    cancelarEdicion();
  };

  const handleChange = (e) => {
    setFormTemp({ ...formTemp, [e.target.name]: e.target.value });
  };

  const agregarEvaluacion = (nueva) => {
    const actualizadas = [...evaluaciones, nueva];
    setEvaluaciones(actualizadas);
    onActualizarEvaluaciones(actualizadas);
    setVista('detalle');
  };

  if (vista === 'evaluar') {
    return (
      <CargarEvaluacion
        estudiante={estudiante}
        onVolver={() => setVista('detalle')}
        onEvaluacionCargada={agregarEvaluacion}
      />
    );
  }

  if (vista === 'historial') {
    return (
      <HistorialAcademico
        estudiante={estudiante}
        onVolver={() => setVista('detalle')}
      />
    );
  }

  return (
    <div>
      <button onClick={onVolver}>Atrás</button>
      <h2>Detalle de Notas</h2>

      {estudiante && (
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Nombre:</strong> {estudiante.nombre}</p>
          <p><strong>Cédula:</strong> {estudiante.cedula}</p>
          <p><strong>Nivel:</strong> {estudiante.nivel}</p>
          <p><strong>Curso:</strong> {estudiante.curso}</p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setVista('historial')}>Histórico</button>
            <button onClick={() => setVista('evaluar')}>Evaluar</button>
          </div>
        </div>
      )}

      <h3>Evaluaciones Presentadas</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ponderación</th>
            <th>Nota</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {evaluaciones.map((evaluacion, index) => (
            <tr key={index}>
              {editandoIndex === index ? (
                <>
                  <td><input name="nombre" value={formTemp.nombre} onChange={handleChange} /></td>
                  <td><input name="descripcion" value={formTemp.descripcion} onChange={handleChange} /></td>
                  <td><input name="ponderacion" type="number" value={formTemp.ponderacion} onChange={handleChange} /></td>
                  <td><input name="nota" type="number" value={formTemp.nota} onChange={handleChange} /></td>
                  <td><input name="estado" value={formTemp.estado} onChange={handleChange} /></td>
                  <td>
                    <button onClick={() => guardarEdicion(index)}>💾</button>
                    <button onClick={cancelarEdicion}>❌</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{evaluacion.nombre}</td>
                  <td>{evaluacion.descripcion}</td>
                  <td>{evaluacion.ponderacion}</td>
                  <td>{evaluacion.nota}</td>
                  <td>{evaluacion.estado}</td>
                  <td>
                    <button onClick={() => iniciarEdicion(index)}>✏️</button>
                    <button onClick={() => eliminarEvaluacion(index)}>🗑️</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Conversión de Promedio</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>%</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>90–100%</td><td>Excelente</td></tr>
            <tr><td>80–89%</td><td>Muy bien</td></tr>
            <tr><td>70–79%</td><td>Bien</td></tr>
            <tr><td>60–69%</td><td>Regular</td></tr>
            <tr><td>0–59%</td><td>Deficiente</td></tr>
          </tbody>
        </table>

        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: colorPromedio,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}>
          {promedio}%
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Resultado actual: {textoPromedio} ({promedio}%)
      </div>
    </div>
  );
}

export default DetalleNotas;