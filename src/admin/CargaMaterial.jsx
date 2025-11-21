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
    setArchivo(null);
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
    <div className="min-h-screen p-6">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-500">Listening</h1>
      </div>

      {/* Sección de Nuevo Material */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-500 mb-4">+ Nuevo Material</h3>
        
        <form onSubmit={handleAgregar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Material</label>
              <input 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-950"
                placeholder="Nombre del Material"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listening</label>
              <select 
                value={listening} 
                onChange={(e) => setListening(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-950"
              >
                <option value="">-- Seleccione --</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={`listening${n}`}>Listening {n}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Archivo</label>
              <select 
                value={tipoArchivo} 
                onChange={(e) => setTipoArchivo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-950"
              >
                <option value="">-- Seleccione --</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
              <input 
                type="file" 
                onChange={(e) => setArchivo(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-950"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editandoIndex !== null ? 'Guardar Cambios' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>

      {/* Sección de Consultar - Ahora fuera de la tabla */}
      <div className="p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">Consultar</h3>
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">Filtrar por Listening:</label>
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Ver todos --</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={`listening${n}`}>Listening {n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de materiales - Sin bordes y ocupando todo el ancho */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-indigo-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Archivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Editar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Eliminar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ver</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {materialesPaginados.length > 0 ? (
              materialesPaginados.map((mat, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mat.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mat.archivo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => handleEditar(inicio + index)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => handleEliminar(inicio + index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      🗑️
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => window.open(mat.url, '_blank')}
                      className="text-green-600 hover:text-green-900"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              disabled={paginaActual === 1} 
              onClick={() => setPaginaActual(paginaActual - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button 
              disabled={paginaActual === totalPaginas} 
              onClick={() => setPaginaActual(paginaActual + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{paginaActual}</span> de{' '}
                <span className="font-medium">{totalPaginas}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  disabled={paginaActual === 1} 
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  ←
                </button>
                <button 
                  disabled={paginaActual === totalPaginas} 
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Siguiente</span>
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CargaMaterial;