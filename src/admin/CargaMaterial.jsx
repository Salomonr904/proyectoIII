import React, { useState, useEffect } from 'react';

function CargaMaterial() {
  const [materiales, setMateriales] = useState([]);
  const [nombre, setNombre] = useState('');
  const [listening, setListening] = useState('');
  const [tipoArchivo, setTipoArchivo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [tiposMaterial, setTiposMaterial] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const materialesPorPagina = 5;

  // CARGAR NIVELES DESDE EL BACKEND
  useEffect(() => {
    const cargarNiveles = async () => {
      try {
        console.log('🔄 Cargando niveles desde backend...');
        const response = await fetch('http://localhost:6500/api/level');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ RESPUESTA COMPLETA DE NIVELES:', result);
        
        if (result.success && result.data) {
          // DEBUG: Ver la estructura exacta de los niveles
          console.log('🔍 ESTRUCTURA DE NIVELES:', result.data);
          if (result.data.length > 0) {
            console.log('🔍 PRIMER NIVEL:', result.data[0]);
            console.log('🔍 PROPIEDADES DEL PRIMER NIVEL:', Object.keys(result.data[0]));
            console.log('🔍 VALORES DEL PRIMER NIVEL:', result.data[0]);
          }
          
          setNiveles(result.data);
        } else {
          setNiveles([]);
        }
        
      } catch (error) {
        console.error('❌ Error cargando niveles:', error);
        setNiveles([]);
      }
    };

    cargarNiveles();
  }, []);

  // CARGAR TIPOS DE MATERIAL DESDE EL BACKEND
  useEffect(() => {
    const cargarTiposMaterial = async () => {
      try {
        console.log('🔄 Cargando tipos de material desde backend...');
        const response = await fetch('http://localhost:6500/api/typesMaterials');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('✅ Tipos de material cargados:', result);
        
        if (result.success && result.data) {
          setTiposMaterial(result.data);
        }
        
      } catch (error) {
        console.error('❌ Error cargando tipos de material:', error);
        alert('Error cargando tipos de material: ' + error.message);
      }
    };

    cargarTiposMaterial();
  }, []);

  // CARGAR TODOS LOS MATERIALES DESDE EL BACKEND
  useEffect(() => {
    const cargarMateriales = async () => {
      try {
        console.log('🔄 Cargando TODOS los materiales desde backend...');
        
        if (niveles.length > 0) {
          const materialesCompletos = [];
          
          for (const nivel of niveles) {
            try {
              console.log(`🔄 Cargando materiales del nivel ${nivel.id_level}...`);
              const response = await fetch(`http://localhost:6500/api/materials/level/${nivel.id_level}`);
              
              if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.data) {
                  const materialesTransformados = result.data.map(material => ({
                    id: material.id_material,
                    nombre: material.name_material,
                    listening: `listening${material.level_id}`,
                    tipoArchivo: obtenerNombreTipo(material.type_material_id),
                    archivo: material.original_name || 'archivo',
                    url: material.material ? `http://localhost:6500${material.material}` : '#',
                    level_id: material.level_id
                  }));
                  
                  materialesCompletos.push(...materialesTransformados);
                }
              }
            } catch (error) {
              console.error(`❌ Error cargando materiales del nivel ${nivel.id_level}:`, error);
            }
          }
          
          console.log('✅ TOTAL de materiales cargados:', materialesCompletos);
          setMateriales(materialesCompletos);
        }
        
      } catch (error) {
        console.error('❌ Error cargando materiales:', error);
        setMateriales([]);
      }
    };

    if (niveles.length > 0) {
      cargarMateriales();
    }
  }, [niveles]);

  // FUNCIÓN PARA OBTENER EL type_material_id BASADO EN EL TIPO SELECCIONADO
  const obtenerTypeMaterialId = (tipoSeleccionado) => {
    const tipo = tiposMaterial.find(t => t.type_material === tipoSeleccionado);
    return tipo ? tipo.id_type_material.toString() : '1';
  };

  // FUNCIÓN PARA OBTENER EL NOMBRE DEL TIPO BASADO EN EL ID
  const obtenerNombreTipo = (typeMaterialId) => {
    const tipo = tiposMaterial.find(t => t.id_type_material === typeMaterialId);
    return tipo ? tipo.type_material : 'pdf';
  };

  // FUNCIÓN PARA OBTENER EL NOMBRE DEL NIVEL (FLEXIBLE)
  const obtenerNombreNivel = (nivel) => {
    // Intentar diferentes nombres de propiedades
    return nivel.name_level || nivel.name || nivel.nombre || nivel.level_name || `Listening ${nivel.id_level}`;
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    if (!nombre || !listening || !tipoArchivo || !archivo) {
      alert('Completa todos los campos antes de subir.');
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('level_id', listening.replace('listening', ''));
      formData.append('material', archivo);
      formData.append('name_material', nombre);
      formData.append('type_material_id', obtenerTypeMaterialId(tipoArchivo));

      const response = await fetch('http://localhost:6500/api/materials/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const nuevoMaterial = {
          id: result.data.id_material,
          nombre: result.data.name_material,
          listening: `listening${result.data.level_id}`,
          tipoArchivo: obtenerNombreTipo(result.data.type_material_id),
          archivo: result.data.original_name || archivo.name,
          url: result.data.material ? `http://localhost:6500${result.data.material}` : URL.createObjectURL(archivo),
          level_id: result.data.level_id
        };

        if (editandoIndex !== null) {
          const actualizados = [...materiales];
          actualizados[editandoIndex] = nuevoMaterial;
          setMateriales(actualizados);
          setEditandoIndex(null);
        } else {
          setMateriales([...materiales, nuevoMaterial]);
        }

        setNombre('');
        setListening('');
        setTipoArchivo('');
        setArchivo(null);
        
        alert('✅ Material guardado exitosamente en la base de datos');
        
      } else {
        throw new Error(result.message || 'Error en la respuesta del servidor');
      }

    } catch (error) {
      console.error('❌ Error al guardar material:', error);
      alert('❌ Error al guardar en la base de datos: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (index) => {
    const mat = materiales[index];
    setNombre(mat.nombre);
    setListening(mat.listening);
    setTipoArchivo(mat.tipoArchivo);
    setArchivo(null);
    setEditandoIndex(index);
  };

  const handleEliminar = async (index) => {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer.');
    if (!confirm) return;
    
    try {
      const material = materiales[index];
      
      const response = await fetch(`http://localhost:6500/api/materials/${material.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const nuevos = [...materiales];
        nuevos.splice(index, 1);
        setMateriales(nuevos);
        alert('✅ Material eliminado de la base de datos');
      } else {
        throw new Error(result.message || `Error ${response.status} al eliminar`);
      }
      
    } catch (error) {
      console.error('❌ Error eliminando:', error);
      alert('❌ Error al eliminar de la base de datos: ' + error.message);
    }
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
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listening</label>
              <select 
                value={listening} 
                onChange={(e) => setListening(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-950"
                required
              >
                <option value="">-- Seleccione --</option>
                {niveles.map((nivel) => {
                  const nombreNivel = obtenerNombreNivel(nivel);
                  console.log(`🎯 Renderizando nivel:`, nivel, 'Nombre:', nombreNivel);
                  return (
                    <option key={nivel.id_level} value={`listening${nivel.id_level}`}>
                      {nombreNivel}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Archivo</label>
              <select 
                value={tipoArchivo} 
                onChange={(e) => setTipoArchivo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-950"
                required
              >
                <option value="">-- Seleccione --</option>
                {tiposMaterial.map((tipo) => (
                  <option key={tipo.id_type_material} value={tipo.type_material}>
                    {tipo.type_material.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Archivo</label>
              <input 
                type="file" 
                onChange={(e) => setArchivo(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-950"
                required
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={cargando}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
            >
              {cargando ? '🔄 Guardando...' : (editandoIndex !== null ? '💾 Guardar Cambios' : '📤 Agregar Material')}
            </button>
          </div>
        </form>
      </div>

      {/* Sección de Consultar */}
      <div className="p-6 mb-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">
<<<<<<< HEAD
            Consultar {materiales.length > 0 && `(${materiales.length})`}
=======
            Materiales en Base de Datos {materiales.length > 0 && `(${materiales.length})`}
>>>>>>> 5e61dd5d79fbf336925c17e6f7b67ed558ce522e
          </h3>
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">Filtrar por Listening:</label>
            <select 
              value={filtro} 
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
              className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Ver todos --</option>
              {niveles.map((nivel) => (
                <option key={nivel.id_level} value={`listening${nivel.id_level}`}>
                  {obtenerNombreNivel(nivel)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resto del código igual... */}
      {/* TABLA */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead className="bg-indigo-950">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Archivo</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Listening</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materialesPaginados.length > 0 ? (
              materialesPaginados.map((mat, index) => {
                const nivelCorrespondiente = niveles.find(n => n.id_level === parseInt(mat.level_id));
                const nombreNivel = nivelCorrespondiente ? obtenerNombreNivel(nivelCorrespondiente) : `Listening ${mat.level_id}`;
                
                return (
                  <tr key={mat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mat.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mat.archivo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mat.tipoArchivo === 'pdf' ? 'bg-red-100 text-red-800' :
                        mat.tipoArchivo === 'audio' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {mat.tipoArchivo.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {nombreNivel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleEditar(inicio + index)}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleEliminar(inicio + index)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-600 rounded hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
                      <button 
                        onClick={() => mat.url && mat.url !== '#' ? window.open(mat.url, '_blank') : alert('No hay archivo para visualizar')}
                        className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-600 rounded hover:bg-green-50 transition-colors"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay materiales en la base de datos</h3>
                    <p className="mt-1 text-sm text-gray-500">Agrega el primer material.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-between flex-1 sm:hidden">
            <button 
              disabled={paginaActual === 1} 
              onClick={() => setPaginaActual(paginaActual - 1)}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button 
              disabled={paginaActual === totalPaginas} 
              onClick={() => setPaginaActual(paginaActual + 1)}
              className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando página <span className="font-medium">{paginaActual}</span> de{' '}
                <span className="font-medium">{totalPaginas}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                <button 
                  disabled={paginaActual === 1} 
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  ← Anterior
                </button>
                <button 
                  disabled={paginaActual === totalPaginas} 
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  className="relative inline-flex items-center px-3 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Siguiente</span>
                  Siguiente →
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