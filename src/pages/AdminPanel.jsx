import React, { useState } from 'react';
import PanelDeControl from '../admin/PanelDeControl';
import FormularioNuevoEstudiante from '../admin/FormularioNuevoEstudiante';
import FormularioNuevoProfesor from '../admin/FormularioNuevoProfesor';
import GestionDeNotas from '../admin/GestionDeNotas';
import HistorialAcademico from '../admin/HistorialAcademico';
import CargaMaterial from '../admin/CargaMaterial';
import RegistroUsuario from '../admin/RegistroUsuario';
import FormularioNuevoEmpleado from '../admin/FormularioNuevoEmpleado';
import ConsultaUsuarios from '../admin/ConsultaUsuarios';
import DetalleUsuario from '../admin/DetalleUsuario';
import EditarUsuario from '../admin/EditarUsuario';
import CrearNivel from '../admin/CrearNivel';
// import CrearCurso from '../admin/CrearCurso';
import CrearSucursal from '../admin/CrearSucursal';
import NuevaEvaluacion from '../admin/NuevaEvaluacion';
import CrearPago from '../admin/CrearPago';
import GestionUsuarios from '../admin/GestionUsuarios';
import GestionCuotas from '../admin/GestionCuotas';
import RestablecerContrasena from '../admin/RestablecerContrasena';
import RegistrarCuota from '../admin/RegistrarCuota';

const AdminPanel = () => {
  const [vista, setVista] = useState(null);
  const [cedulaActual, setCedulaActual] = useState('');
  const [usuarioActual, setUsuarioActual] = useState(null);

  const handleContinuar = (nuevaVista, cedula) => {
    setCedulaActual(cedula);
    setVista(nuevaVista);
  };

  const renderContenido = () => {
    switch (vista) {
      case 'estudiante':
        return <FormularioNuevoEstudiante onContinuar={handleContinuar} />;
      case 'profesor':
        return <FormularioNuevoProfesor onContinuar={handleContinuar} />;
      case 'registro-usuario':
        return <RegistroUsuario cedula={cedulaActual} />;
      case 'empleado':
        return <FormularioNuevoEmpleado onContinuar={handleContinuar} />;
      case 'cargar-nota':
        return <GestionDeNotas />;
      case 'historial-academico':
        return <HistorialAcademico onVolver={() => setVista('detalle-usuario')} />;
      case 'cargar-material':
        return <CargaMaterial />;
      case 'nuevo-nivel':
        return <CrearNivel />;
      case 'nuevo-curso':
        return <div>Formulario para crear un nuevo curso (pendiente)</div>;
      case 'nueva-sucursal':
        return <CrearSucursal />;
      case 'nueva-evaluacion':
        return <NuevaEvaluacion />;
      case 'nuevo-pago':
        return <CrearPago />;
      case 'gestionar-usuarios':
        return (
          <GestionUsuarios
            onVerRestablecer={(cedula) => {
              setCedulaActual(cedula);
              setVista('restablecer-usuario');
            }}
          />
        );
      case 'restablecer-usuario':
        return (
          <RestablecerContrasena
            cedula={cedulaActual}
            onVolver={() => setVista('gestionar-usuarios')}
          />
        );
      case 'gestionar-cuotas':
        return (
          <GestionCuotas
            onRegistrarCuota={() => setVista('registrar-cuota')}
         />
        );
      case 'registrar-cuota':
        return <RegistrarCuota onVolver={() => setVista('gestionar-cuotas')} />;

      case 'consultar':
        return (
          <ConsultaUsuarios
            onVerUsuario={(usuario) => {
              console.log('=== ADMIN PANEL: Usuario recibido ===');
              console.log('Cédula:', usuario.cedula);
              console.log('Tipo:', usuario.tipo);
              console.log('Nombre:', usuario.nombre);
              
              setCedulaActual(usuario.cedula);
              setUsuarioActual(usuario); // Guardar el usuario completo por si se necesita
              setVista('detalle-usuario');
              
              console.log('Redirigiendo a detalle-usuario...');
            }}
          />
        );
      case 'detalle-usuario':
        return <DetalleUsuario cedula={cedulaActual} onNavigate={setVista} />;
      case 'editar-usuario':
        return <EditarUsuario cedula={cedulaActual} usuario={usuarioActual} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Selecciona una opción del panel de control para comenzar
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Panel de Control */}
      <PanelDeControl onNavigate={setVista} />
      
      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto lg:ml-0 transition-all duration-300">
        <div className="p-4 lg:p-6 min-h-full">
          {renderContenido()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;