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
  const [metodosPago, setMetodosPago] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('Todos');
  const [mostrarFiltroNivel, setMostrarFiltroNivel] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 🔄 Cargar métodos de pago desde el backend
  useEffect(() => {
    const cargarMetodosPago = async () => {
      try {
        const response = await fetch('http://localhost:6500/api/payments_methods');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const resultado = await response.json();
        console.log('Métodos de pago cargados:', resultado);
        
        if (resultado.success && resultado.data) {
          // ✅ Filtrar solo métodos activos (method_delete: false) y transformar datos
          const metodosActivos = resultado.data
            .filter(metodo => !metodo.method_delete)
            .map(metodo => ({
              id: metodo.id_payment_method,
              name: metodo.payment_method
            }));
          
          console.log('Métodos activos:', metodosActivos);
          setMetodosPago(metodosActivos);
        } else {
          throw new Error(resultado.message || 'Error al cargar métodos de pago');
        }
      } catch (err) {
        console.error('Error al cargar métodos de pago:', err);
        
        // 🧪 Datos de simulación como fallback
        setMetodosPago([
          { id: 1, name: 'Efectivo' },
          { id: 2, name: 'Transferencia' },
          { id: 3, name: 'Tarjeta' }
        ]);
      }
    };

    cargarMetodosPago();
  }, []);

  // 🔄 Cargar cuotas desde el backend (GET)
  useEffect(() => {
    const cargarCuotas = async () => {
      try {
        const response = await fetch('http://localhost:6500/api/payments');
        
        if (!response.ok) {
          console.warn('Endpoint de pagos no disponible, usando datos de simulación');
          throw new Error('Endpoint no disponible');
        }
        
        const resultado = await response.json();
        console.log('Cuotas cargadas del backend:', resultado);
        
        if (resultado.success && resultado.data) {
          // ✅ CORREGIDO: Transformar datos según la estructura real del backend
          const cuotasTransformadas = resultado.data.map(pago => ({
            id: pago.id_payment,
            cedula: pago.student_cedula?.toString() || 'N/A',
            nombre: `${pago.student_first_name || ''} ${pago.student_first_lastname || ''}`.trim() || 'Estudiante',
            fecha: pago.payment_date ? new Date(pago.payment_date).toLocaleDateString('es-ES') : 'N/A',
            metodo: pago.payment_method || 'N/A',
            monto: `$${pago.amount}`,
            nivel: 'Básico' // Placeholder
          }));
          
          console.log('Cuotas transformadas:', cuotasTransformadas);
          setCuotas(cuotasTransformadas);
        } else {
          throw new Error(resultado.message || 'Error al cargar pagos');
        }
      } catch (err) {
        console.error('Error al cargar cuotas:', err);
        
        // 🧪 Simulación temporal con datos REALES del backend como fallback
        const simuladas = [
          {
            id: 1,
            cedula: '30051443',
            nombre: 'Salomon Reyes',
            fecha: '07/11/2025',
            metodo: 'pago movil',
            monto: '$70.00',
            nivel: 'Básico'
          },
          {
            id: 2,
            cedula: '2554789',
            nombre: 'Salomon Reyes',
            fecha: '22/11/2025',
            metodo: 'fdsjjsdks',
            monto: '$50.00',
            nivel: 'Intermedio'
          }
        ];
        setCuotas(simuladas);
      }
    };

    cargarCuotas();
  }, []);

  // 🔄 Función para registrar nueva cuota - FORMATO CORREGIDO
  const registrarCuota = async () => {
    if (!cedula || !nombreApellido || !metodoPago || !fechaPago || !monto) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Validar que el monto sea un número válido
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      alert('Por favor ingresa un monto válido.');
      return;
    }

    // Validar que la cédula sea un número
    const cedulaNumerica = parseInt(cedula);
    if (isNaN(cedulaNumerica)) {
      alert('La cédula debe ser un número válido.');
      return;
    }

    setCargando(true);

    try {
      // ✅ PREPARAR DATOS EN EL FORMATO EXACTO DEL BACKEND
      const datosPago = {
        cedula_student_id: cedulaNumerica,
        amount: montoNumerico,
        payment_date: fechaPago,
        method_id: parseInt(metodoPago)
      };

      console.log('Datos enviados al backend:', datosPago);

      // Llamada real al backend
      const response = await fetch('http://localhost:6500/api/payments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosPago),
      });

      const resultado = await response.json();
      console.log('Respuesta del backend:', resultado);

      if (!response.ok) {
        throw new Error(resultado.message || 'Error en la respuesta del servidor');
      }

      if (!resultado.success) {
        throw new Error(resultado.message || 'No se pudo registrar el pago');
      }

      // Éxito
      alert(`✅ Pago registrado correctamente para ${nombreApellido}`);
      limpiarFormulario();
      
      // Recargar cuotas para mostrar el nuevo registro
      window.location.reload();
      
    } catch (err) {
      console.error('Error al registrar pago:', err);
      alert(`❌ Error al registrar pago: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  // 🗑️ Función para eliminar cuota
  const eliminarCuota = async (idCuota) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:6500/api/payments/${idCuota}`, {
        method: 'DELETE',
      });

      const resultado = await response.json();
      console.log('Respuesta eliminación:', resultado);

      if (!response.ok) {
        throw new Error(resultado.message || 'Error al eliminar pago');
      }

      if (!resultado.success) {
        throw new Error(resultado.message || 'No se pudo eliminar el pago');
      }

      // Eliminar localmente
      setCuotas(prev => prev.filter(cuota => cuota.id !== idCuota));
      alert('✅ Pago eliminado correctamente');
      
    } catch (err) {
      console.error('Error al eliminar cuota:', err);
      alert(`❌ Error al eliminar pago: ${err.message}`);
    }
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

  // 🔄 Cargar datos de ejemplo para pruebas
  const cargarDatosEjemplo = () => {
    setCedula('28148594');
    setNombreApellido('María González');
    const primerMetodo = metodosPago.length > 0 ? metodosPago[0].id : '';
    setMetodoPago(primerMetodo.toString());
    setFechaPago(new Date().toISOString().split('T')[0]);
    setMonto('50');
    setComentario('Pago de matrícula semestral');
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      {/* 🏷️ Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-500 mb-2">
          Registrar Cuota
        </h1>
        <p className="text-sm text-gray-600">
          Formato backend: {'{cedula_student_id, amount, payment_date, method_id}'}
        </p>
      </div>

      {/* 📝 Formulario de Registro */}
      <div className="bg-white rounded-lg p-6 mb-6 md:mb-8 border border-gray-200">
        {/* Botón para cargar datos de ejemplo */}
        <div className="flex justify-end mb-4">
          <button
            onClick={cargarDatosEjemplo}
            className="px-4 py-2 bg-amber-500 text-white text-sm rounded-full hover:bg-amber-600 transition-colors"
            type="button"
            disabled={cargando}
          >
            Cargar Datos Ejemplo
          </button>
        </div>

        {/* Primera línea: Cédula, Nombre, Método de Pago */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Campo Cédula de Identidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cédula Estudiante (cedula_student_id) *
            </label>
            <input
              type="number"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ej: 28148594"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
              disabled={cargando}
            />
          </div>

          {/* Campo Nombre y Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre y Apellido (Referencia)
            </label>
            <input
              type="text"
              value={nombreApellido}
              onChange={(e) => setNombreApellido(e.target.value)}
              placeholder="Nombre y apellido (solo referencia)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400 bg-gray-50"
              disabled={cargando}
            />
            <p className="text-xs text-gray-500 mt-1">No se envía al backend</p>
          </div>

          {/* Campo Método de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pago (method_id) *
            </label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700"
              disabled={cargando || metodosPago.length === 0}
            >
              <option value="">Selecciona un método</option>
              {metodosPago.map((metodo) => (
                <option key={metodo.id} value={metodo.id}>
                  {metodo.id} - {metodo.name}
                </option>
              ))}
            </select>
            {metodosPago.length === 0 && (
              <p className="text-xs text-red-500 mt-1">No hay métodos de pago disponibles</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Se enviará el ID: {metodoPago || 'Ninguno'}
            </p>
          </div>
        </div>

        {/* Segunda línea: Fecha, Monto, Comentario */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Campo Fecha de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Pago (payment_date) *
            </label>
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700"
              disabled={cargando}
            />
          </div>

          {/* Campo Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto (amount) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ej: 50.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400"
              disabled={cargando}
            />
          </div>

          {/* Campo Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario (No se envía)
            </label>
            <input
              type="text"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comentario interno"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-950 focus:border-indigo-950 transition-colors duration-200 text-gray-700 placeholder-gray-400 bg-gray-50"
              disabled={cargando}
            />
            <p className="text-xs text-gray-500 mt-1">Solo referencia interna</p>
          </div>
        </div>

        {/* Botón Cargar */}
        <div className="flex justify-start">
          <button
            onClick={registrarCuota}
            disabled={!cedula || !metodoPago || !fechaPago || !monto || cargando}
            className="px-6 py-2 bg-indigo-950 text-white text-sm font-medium rounded-full hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Registrando...' : 'Cargar'}
          </button>
        </div>
      </div>

      {/* 📊 Sección de Consulta de Cuotas */}
      <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
        {/* Header con título, filtros y búsqueda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 md:mb-0">
            Consultar Cuotas
          </h3>
          
          {/* Contenedor de Filtros y Búsqueda */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* 🎛️ Botones de Filtro */}
            <div className="flex flex-wrap gap-2">
              {/* Filtro Fecha */}
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
                        <button 
                          onClick={() => eliminarCuota(cuota.id)}
                          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        >
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
                      
                      <button 
                        onClick={() => eliminarCuota(cuota.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
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