import React, { useState } from 'react';
import PanelDeControl from '../admin/PanelDeControl';
import FormularioNuevoEstudiante from '../admin/FormularioNuevoEstudiante';
import FormularioNuevoProfesor from '../admin/FormularioNuevoProfesor';
import GestionDeNotas from '../admin/GestionDeNotas';
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
            onVerUsuario={(cedula) => {
              setCedulaActual(cedula);
              setVista('detalle-usuario');
            }}
          />
        );
      case 'detalle-usuario':
        return <DetalleUsuario cedula={cedulaActual} onNavigate={setVista} />;
      case 'editar-usuario':
        return <EditarUsuario cedula={cedulaActual} />;
      default:
        return <div>Selecciona una opción del panel</div>;
    }
  };

  return (
    <div className="app-layout">
      <PanelDeControl onNavigate={setVista} />
      <main className="contenido-principal">{renderContenido()}</main>
    </div>
  );
};

export default AdminPanel;





