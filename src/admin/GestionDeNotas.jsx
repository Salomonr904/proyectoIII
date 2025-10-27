import React, { useState, useEffect } from 'react';
import DetalleNotas from './DetalleNotas';

function GestionNotas() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nivel, setNivel] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState('lista');
  const [estudianteActual, setEstudianteActual] = useState(null);

  useEffect(() => {
    setLoading(true);

    const simulados = [
      {
        cedula: '00000000',
        nombre: 'Miguel Guerra',
        nivel: 'Básico',
        curso: 'José Alfredo Freita',
        evaluaciones: [
          { ponderacion: 15, nota: 12 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 10, nota: 7 },
          { ponderacion: 20, nota: 16 },
          { ponderacion: 15, nota: 12 },
          { ponderacion: 20, nota: 16 },
          { ponderacion: 5, nota: 4 },
        ],
      },
      {
        cedula: '00000001',
        nombre: 'Valentina Villalba',
        nivel: 'Básico',
        curso: 'José Alfredo Freita',
        evaluaciones: [
          { ponderacion: 15, nota: 15 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 10, nota: 10 },
          { ponderacion: 20, nota: 20 },
          { ponderacion: 15, nota: 15 },
          { ponderacion: 20, nota: 20 },
          { ponderacion: 5, nota: 5 },
        ],
      },
      {
        cedula: '00000002',
        nombre: 'Moises Gil',
        nivel: 'Básico',
        curso: 'José Alfredo Freita',
        evaluaciones: [
          { ponderacion: 15, nota: 10 },
          { ponderacion: 15, nota: 10 },
          { ponderacion: 10, nota: 6 },
          { ponderacion: 20, nota: 14 },
          { ponderacion: 15, nota: 10 },
          { ponderacion: 20, nota: 14 },
          { ponderacion: 5, nota: 3 },
        ],
      },
    ];

    const filtrados = nivel === 'todos'
      ? simulados
      : simulados.filter((est) => est.nivel === nivel);

    setTimeout(() => {
      setEstudiantes(filtrados);
      setLoading(false);
    }, 400);
  }, [nivel]);

  const calcularPromedio = (evaluaciones) => {
    const totalPonderacion = evaluaciones.reduce((acc, e) => acc + e.ponderacion, 0);
    const totalAportado = evaluaciones.reduce((acc, e) => acc + ((e.nota * e.ponderacion) / 20), 0);
    return totalPonderacion > 0 ? Math.round((totalAportado / totalPonderacion) * 100) : 0;
  };

  const verDetalles = (estudiante) => {
    setEstudianteActual(estudiante);
    setVista('detalle');
  };

  const exportarPDF = () => {
    alert('Función de exportar PDF aún no conectada.');
  };

  const volverALista = () => {
    setVista('lista');
    setEstudianteActual(null);
  };

  // ✅ Nueva función para sincronizar cambios desde DetalleNotas
  const actualizarEstudianteActual = (evaluacionesActualizadas) => {
    const actualizado = { ...estudianteActual, evaluaciones: evaluacionesActualizadas };
    setEstudianteActual(actualizado);

    setEstudiantes((prev) =>
      prev.map((est) =>
        est.cedula === actualizado.cedula ? actualizado : est
      )
    );
  };

  return (
    <div>
      {vista === 'lista' ? (
        <>
          <h2>Gestión de Notas</h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option value="todos">Todos los niveles</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>

            <button onClick={exportarPDF}>Exportar PDF</button>
          </div>

          {loading ? (
            <p>Cargando estudiantes...</p>
          ) : estudiantes.length === 0 ? (
            <p>No hay datos</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Nombre y Apellido</th>
                  <th>Cédula de Identidad</th>
                  <th>Nivel</th>
                  <th>Promedio</th>
                  <th>Ver</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est) => (
                  <tr key={est.cedula}>
                    <td>{est.nombre}</td>
                    <td>{est.cedula}</td>
                    <td>{est.nivel}</td>
                    <td>{calcularPromedio(est.evaluaciones)}%</td>
                    <td>
                      <button onClick={() => verDetalles(est)}>👁️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <DetalleNotas
          estudiante={estudianteActual}
          onVolver={volverALista}
          onActualizarEvaluaciones={actualizarEstudianteActual}
        />
      )}
    </div>
  );
}

export default GestionNotas;