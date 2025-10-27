import React, { useState, useEffect } from 'react';

function GestionCuotas({ onRegistrarCuota }) {
  // Estados para el formulario de registro
  const [cedula, setCedula] = useState('');
  const [nombreApellido, setNombreApellido] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [monto, setMonto] = useState('');
  const [comentario, setComentario] = useState('');

  // Estados para la gestión de cuotas
  const [cuotas, setCuotas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('Todos');
  const [mostrarFiltroNivel, setMostrarFiltroNivel] = useState(false);

  // 🔄 Cargar cuotas desde el backend (GET)
  useEffect(() => {
    // ⚠️ Reemplaza esta simulación por fetch real cuando tengas el backend:
    /*
    fetch('https://tu-backend.com/api/cuotas')
      .then((res) => res.json())
      .then((data) => setCuotas(data))
      .catch((err) => console.error('Error al cargar cuotas:', err));
    */

    // 🧪 Simulación temporal con datos de la imagen
    const simuladas = [
      {
        id: 1,
        cedula: '00.000.000',
        nombre: 'Josep Parra',
        fecha: '00/08/2025',
        metodo: 'Efectivo',
        monto: '30$',
        nivel: 'Básico'
      },
      {
        id: 2,
        cedula: '00.000.000',
        nombre: 'Miguel Guerra',
        fecha: '00/08/2025',
        metodo: 'Tarjeta de D/C',
        monto: '30$',
        nivel: 'Intermedio'
      },
      {
        id: 3,
        cedula: '00.000.000',
        nombre: 'Esteban Escalona',
        fecha: '00/08/2025',
        metodo: 'Transferencia',
        monto: '30$',
        nivel: 'Avanzado'
      },
      {
        id: 4,
        cedula: '00.000.000',
        nombre: 'Valentina Villalba',
        fecha: '00/08/2025',
        metodo: 'Pago Móvil',
        monto: '30$',
        nivel: 'Básico'
      },
      {
        id: 5,
        cedula: '00.000.000',
        nombre: 'Oscar Amputia',
        fecha: '00/08/2025',
        metodo: 'Cheque',
        monto: '30$',
        nivel: 'Intermedio'
      },
    ];
    setCuotas(simuladas);
  }, []);

  // 🔄 Función para registrar nueva cuota
  const registrarCuota = () => {
    if (!cedula || !nombreApellido || !metodoPago || !fechaPago || !monto) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const nuevaCuota = {
      id: Date.now(),
      cedula,
      nombre: nombreApellido,
      fecha: fechaPago,
      metodo: metodoPago,
      monto,
      comentario,
    };

    // 🔼 Enviar nueva cuota al backend (POST)
    /*
    fetch('https://tu-backend.com/api/cuotas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCuota),
    })
      .then((res) => res.json())
      .then((data) => {
        setCuotas((prev) => [...prev, data]);
        limpiarFormulario();
      })
      .catch((err) => {
        console.error('Error al crear cuota:', err);
        alert('No se pudo registrar la cuota.');
      });
    */

    // 🧪 Simulación temporal
    setCuotas((prev) => [...prev, nuevaCuota]);
    limpiarFormulario();
  };

  // 🧹 Limpiar formulario después de registrar
  const limpiarFormulario = () => {
    setCedula('');
    setNombreApellido('');
    setMetodoPago('');
    setFechaPago('');
    setMonto('');
    setComentario('');
  };

  // 🔍 Filtrado combinado de cuotas
  const cuotasFiltradas = cuotas.filter(cuota => {
    const coincideBusqueda = cuota.cedula.includes(busqueda.trim()) || 
                            cuota.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFecha = !filtroFecha || cuota.fecha.includes(filtroFecha);
    const coincideNivel = filtroNivel === 'Todos' || cuota.nivel === filtroNivel;
    
    return coincideBusqueda && coincideFecha && coincideNivel;
  });

  // Cerrar menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setMostrarFiltroNivel(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          Registrar Cuota
        </h1>
      </div>

      {/* 📝 Formulario de Registro - Dos líneas con tres campos cada una */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8">
        {/* Primera línea: Cédula, Nombre, Método de Pago */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Campo Cédula de Identidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cédula de Identidad
            </label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Cédula de identidad"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Campo Nombre y Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre y Apellido
            </label>
            <input
              type="text"
              value={nombreApellido}
              onChange={(e) => setNombreApellido(e.target.value)}
              placeholder="Nombre y apellido"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Campo Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago
            </label>
            <input
              type="text"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              placeholder="Método de pago"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Segunda línea: Fecha, Monto, Comentario */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Campo Fecha de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Pago
            </label>
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700"
            />
          </div>

          {/* Campo Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto (Bs/$)
            </label>
            <input
              type="text"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Monto"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Campo Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario
            </label>
            <input
              type="text"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comentario"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Botón Cargar */}
        <div className="flex justify-start">
          <button
            onClick={registrarCuota}
            className="px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200"
          >
            Cargar
          </button>
        </div>
      </div>

      {/* 📊 Sección de Consulta de Cuotas */}
      <div className="bg-gray-50 rounded-ml shadow-sm overflow-hidden">
        {/* Header con título, filtros y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Consultar Cuotas
          </h3>
          
          {/* Contenedor de Filtros y Búsqueda */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* 🎛️ Botones de Filtro */}
            <div className="flex flex-wrap gap-2">
              {/* Filtro Fecha - Input directo como en la imagen */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Mes</label>
                  <input
                    type="month"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950"
                  />
                </div>
              </div>

              {/* Botón Filtro Nivel */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMostrarFiltroNivel(!mostrarFiltroNivel);
                  }}
                  className={`flex items-center px-7 py-2.5 border rounded-full text-sm font-medium transition-colors duration-200 ${
                    filtroNivel !== 'Todos' 
                      ? 'border-indigo-500 text-indigo-700 bg-indigo-50' 
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1"></span>
                  Nivel: {filtroNivel}
                </button>
                
                {mostrarFiltroNivel && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <button
                        onClick={() => setFiltroNivel('Todos')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                          filtroNivel === 'Todos' 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => setFiltroNivel('Básico')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                          filtroNivel === 'Básico' 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Básico
                      </button>
                      <button
                        onClick={() => setFiltroNivel('Intermedio')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md mb-1 ${
                          filtroNivel === 'Intermedio' 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Intermedio
                      </button>
                      <button
                        onClick={() => setFiltroNivel('Avanzado')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                          filtroNivel === 'Avanzado' 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Avanzado
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 🔍 Barra de búsqueda */}
            <div className="w-full md:w-64">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por cédula o nombre"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
        
        {/* 📋 Tabla de Cuotas */}
        {cuotasFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {busqueda || filtroFecha || filtroNivel !== 'Todos' 
                ? 'No hay cuotas que coincidan con la búsqueda.' 
                : 'No hay cuotas registradas.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* 💻 Versión desktop - Tabla */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-950">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      C.I.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Nombre y Apellido
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Método
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Monto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Editar
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Eliminar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cuotasFiltradas.map((cuota) => (
                    <tr key={cuota.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cuota.cedula}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cuota.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{cuota.fecha}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{cuota.metodo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cuota.monto}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors duration-200">
                          <span className="text-lg">✏️</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 transition-colors duration-200">
                          <span className="text-lg">🗑️</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 Versión móvil - Cards */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {cuotasFiltradas.map((cuota) => (
                  <div key={cuota.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-2">{cuota.nombre}</h3>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">C.I.:</span> {cuota.cedula}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">Fecha:</span> {cuota.fecha}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">Método:</span> {cuota.metodo}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          <span className="font-medium">Nivel:</span> {cuota.nivel}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">Monto:</span> {cuota.monto}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200">
                        <span className="text-lg mr-2">✏️</span>
                        Editar
                      </button>
                      
                      <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors duration-200">
                        <span className="text-lg mr-2">🗑️</span>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionCuotas;