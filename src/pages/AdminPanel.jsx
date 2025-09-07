import React, { useState } from 'react';
import PanelDeControl from '../admin/PanelDeControl';
import FormularioNuevoEstudiante from '../admin/FormularioNuevoEstudiante';
import FormularioNuevoProfesor from '../admin/FormularioNuevoProfesor';
import GestionDeNotas from '../admin/GestionDeNotas';
import CargaMaterial from '../admin/CargaMaterial';

// import FormularioNuevoEmpleado from '../admin/FormularioNuevoEmpleado';
// import CrearNivel from '../admin/CrearNivel';
// import CrearCurso from '../admin/CrearCurso';
// import CrearSucursal from '../admin/CrearSucursal';
// import CrearEvaluacion from '../admin/CrearEvaluacion';
// import CrearPago from '../admin/CrearPago';
// import GestionUsuarios from '../admin/GestionUsuarios';
// import GestionCuotas from '../admin/GestionCuotas';

const AdminPanel = () => {
  const [vista, setVista] = useState(null);

  const renderContenido = () => {
    switch (vista) {
      case 'estudiante':
        return <FormularioNuevoEstudiante />;
      case 'profesor':
        return <FormularioNuevoProfesor />;
      case 'empleado':
        // return <FormularioNuevoEmpleado />;
        return <div>Formulario para Empleado (pendiente)</div>;

      case 'cargar-nota':
        return <GestionDeNotas />;
      case 'cargar-material':
        return <CargaMaterial />;

      case 'nuevo-nivel':
        // return <CrearNivel />;
        return <div>Formulario para crear un nuevo nivel (pendiente)</div>;
      case 'nuevo-curso':
        // return <CrearCurso />;
        return <div>Formulario para crear un nuevo curso (pendiente)</div>;
      case 'nueva-sucursal':
        // return <CrearSucursal />;
        return <div>Formulario para crear una nueva sucursal (pendiente)</div>;
      case 'nueva-evaluacion':
        // return <CrearEvaluacion />;
        return <div>Formulario para crear una nueva evaluación (pendiente)</div>;
      case 'nuevo-pago':
        // return <CrearPago />;
        return <div>Formulario para registrar un nuevo pago (pendiente)</div>;

      case 'gestionar-usuarios':
        // return <GestionUsuarios />;
        return <div>Gestión de Usuarios (pendiente)</div>;
      case 'gestionar-cuotas':
        // return <GestionCuotas />;
        return <div>Gestión de Cuotas (pendiente)</div>;

      case 'consultas':
        return <div>Consultas</div>;

      default:
        return <div>Selecciona una opción del panel</div>;
    }
  };

  return (
    <div className="app-layout">
      <PanelDeControl onNavigate={setVista} />
      <main className="contenido-principal">
        {renderContenido()}
      </main>
    </div>
  );
};

export default AdminPanel;




