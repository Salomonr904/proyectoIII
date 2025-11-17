import React, { useState } from 'react';

function CargaMaterial() {
  const [materiales, setMateriales] = useState([]);
  const [nombre, setNombre] = useState('');
  const [listening, setListening] = useState('');
  const [tipoArchivo, setTipoArchivo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const materialesPorPagina = 5;

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nombre || !listening || !tipoArchivo || !archivo) {
      alert('Completa todos los campos antes de subir.');
      return;
    }

    const nuevo = {
      nombre,
      listening,
      tipoArchivo,
      archivo: archivo.name,
      url: URL.createObjectURL(archivo),
    };

    if (editandoIndex !== null) {
      const actualizados = [...materiales];
      actualizados[editandoIndex] = nuevo;
      setMateriales(actualizados);
      setEditandoIndex(null);
    } else {
      setMateriales([...materiales, nuevo]);
    }

    setNombre('');
    setListening('');
    setTipoArchivo('');
    setArchivo(null);
  };

  const handleEditar = (index) => {
    const mat = materiales[index];
    setNombre(mat.nombre);
    setListening(mat.listening);
    setTipoArchivo(mat.tipoArchivo);
    setArchivo(null); // No se puede editar archivo directamente
    setEditandoIndex(index);
  };

  const handleEliminar = (index) => {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.');
    if (!confirm) return;
    const nuevos = [...materiales];
    nuevos.splice(index, 1);
    setMateriales(nuevos);
  };

  const materialesFiltrados = filtro
    ? materiales.filter((m) => m.listening === filtro)
    : materiales;

  const totalPaginas = Math.ceil(materialesFiltrados.length / materialesPorPagina);
  const inicio = (paginaActual - 1) * materialesPorPagina;
  const materialesPaginados = materialesFiltrados.slice(inicio, inicio + materialesPorPagina);

  return (
    <div className="carga-material">
      <h2>Cargar Material</h2>

      <form onSubmit={handleAgregar} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
        <label>
          Nombre del Material
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>

        <label>
          Seleccionar Listening
          <select value={listening} onChange={(e) => setListening(e.target.value)}>
            <option value="">-- Seleccione --</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={`listening${n}`}>Listening {n}</option>
            ))}
          </select>
        </label>

        <label>
          Tipo de Archivo
          <select value={tipoArchivo} onChange={(e) => setTipoArchivo(e.target.value)}>
            <option value="">-- Seleccione --</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
          </select>
        </label>

        <label>
          Archivo
          <input type="file" onChange={(e) => setArchivo(e.target.files[0])} />
        </label>

        <button type="submit">{editandoIndex !== null ? 'Guardar Cambios' : 'Agregar'}</button>
      </form>

      <hr />

      <h3>Consultar Materiales</h3>
      <label>Filtrar por Listening:</label>
      <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
        <option value="">-- Ver todos --</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={`listening${n}`}>Listening {n}</option>
        ))}
      </select>

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Archivo</th>
            <th>Tipo</th>
            <th>Listening</th>
            <th>Editar</th>
            <th>Eliminar</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {materialesPaginados.length > 0 ? (
            materialesPaginados.map((mat, index) => (
              <tr key={index}>
                <td>{mat.nombre}</td>
                <td>{mat.archivo}</td>
                <td>{mat.tipoArchivo}</td>
                <td>{mat.listening}</td>
                <td><button onClick={() => handleEditar(inicio + index)}>✏️</button></td>
                <td><button onClick={() => handleEliminar(inicio + index)}>🗑️</button></td>
                <td>
                  <button onClick={() => window.open(mat.url, '_blank')}>👁️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">No hay datos</td></tr>
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div style={{ marginTop: '1rem' }}>
          <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>←</button>
          <span style={{ margin: '0 1rem' }}>Página {paginaActual} de {totalPaginas}</span>
          <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>→</button>
        </div>
      )}
    </div>
  );
}

export default CargaMaterial;