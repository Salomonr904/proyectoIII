import React, { useState, useEffect } from 'react';

function RegistrarCuota({ onVolver }) {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [metodo, setMetodo] = useState('');
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [comentario, setComentario] = useState('');
  const [metodosPago, setMetodosPago] = useState([]);
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
        console.log('Métodos de pago:', resultado);
        
        if (resultado.success && resultado.data) {
          setMetodosPago(resultado.data);
        } else {
          throw new Error(resultado.message || 'Error al cargar métodos de pago');
        }
      } catch (err) {
        console.error('Error al cargar métodos de pago:', err);
        
        // 🧪 Datos de simulación como fallback
        setMetodosPago([
          { id: 1, name: 'Efectivo' },
          { id: 2, name: 'Transferencia Bancaria' },
          { id: 3, name: 'Tarjeta de Débito' },
          { id: 4, name: 'Tarjeta de Crédito' },
          { id: 5, name: 'Pago Móvil' }
        ]);
      }
    };

    cargarMetodosPago();
  }, []);

  // 🔄 Registrar nueva cuota/pago - FORMATO CORREGIDO SEGÚN POSTMAN
  const cargarCuota = async () => {
    if (!cedula || !nombre || !metodo || !fecha || !monto) {
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
      // ✅ PREPARAR DATOS EN EL FORMATO EXACTO DEL POSTMAN
      const datosPago = {
        cedula_student_id: cedulaNumerica,  // ✅ Campo corregido
        amount: montoNumerico,              // ✅ Campo corregido
        payment_date: fecha,                // ✅ Campo corregido
        method_id: parseInt(metodo)         // ✅ Campo corregido (ID del método)
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
      alert(`✅ Pago registrado correctamente para ${nombre}`);
      
      // Limpiar formulario
      setCedula('');
      setNombre('');
      setMetodo('');
      setFecha('');
      setMonto('');
      setComentario('');
      
    } catch (err) {
      console.error('Error al registrar pago:', err);
      alert(`❌ Error al registrar pago: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  // Formatear fecha actual para el input date
  const obtenerFechaActual = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // 🔄 Datos quemados para pruebas rápidas
  const cargarDatosEjemplo = () => {
    setCedula('28148594');
    setNombre('María González');
    setMetodo('1'); // ID del método de pago (Efectivo)
    setFecha(obtenerFechaActual());
    setMonto('50');
    setComentario('Pago de matrícula semestral');
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="bg-white text-gray-500 py-4 px-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">Registrar Pago/Cuota</h2>
          <p className="text-sm text-gray-600 mt-1">
            Formato requerido: {'{cedula_student_id, amount, payment_date, method_id}'}
          </p>
        </div>

        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Información del Pago</h3>
          <button
            onClick={cargarDatosEjemplo}
            className="px-4 py-1 bg-amber-500 text-white text-sm rounded-full hover:bg-amber-600 transition-colors"
            type="button"
            disabled={cargando}
          >
            Cargar Datos Ejemplo
          </button>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-b-lg shadow-lg p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula Estudiante (cedula_student_id) *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  type="number"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ej: 28148594"
                  disabled={cargando}
                />
                <p className="text-xs text-gray-500 mt-1">Número de cédula del estudiante</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre y Apellido (Referencia)
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 bg-gray-50"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez (solo referencia)"
                  disabled={cargando}
                />
                <p className="text-xs text-gray-500 mt-1">Solo para referencia, no se envía al backend</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago (method_id) *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                  disabled={cargando}
                >
                  <option value="">Selecciona un método de pago</option>
                  {metodosPago.map((metodoItem) => (
                    <option key={metodoItem.id} value={metodoItem.id}>
                      {metodoItem.name} (ID: {metodoItem.id})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Se enviará el ID del método seleccionado</p>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Pago (payment_date) *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  disabled={cargando}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto (amount) *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  type="number"
                  step="0.01"
                  min="0"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ej: 50.00"
                  disabled={cargando}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentario (Opcional - No se envía)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-950 bg-gray-50"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Comentario interno (no se envía al backend)..."
                  rows="3"
                  disabled={cargando}
                />
                <p className="text-xs text-gray-500 mt-1">Este comentario es solo para referencia interna</p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Nota:</strong> Los campos marcados con * son obligatorios y se envían al backend. 
              El campo "Nombre" y "Comentario" son solo para referencia interna y NO se envían en la petición.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              📋 <strong>Formato enviado:</strong> {'{cedula_student_id, amount, payment_date, method_id}'}
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center space-x-4 pt-8 mt-6">
          <button 
            type="button" 
            onClick={onVolver}
            disabled={cargando}
            className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Atrás
          </button>
          <button 
            type="button" 
            onClick={cargarCuota}
            disabled={!cedula || !metodo || !fecha || !monto || cargando}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Registrando...' : 'Registrar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrarCuota;