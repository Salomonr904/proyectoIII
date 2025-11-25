import React, { useEffect, useState } from 'react';

function EditarUsuario({ cedula }) {
  const [profesores, setProfesores] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [estudiantes, setEstudiantes] = useState({});
  const [messageTeacherError, setMessageTeacherError] = useState('');
  const [messageBranchesError, setMessageBranchesError] = useState('');
  const [messageLevelsError, setMessageLevelsError] = useState('');
  const [messageStudentError, setMessageStudentError] = useState('');


  const [id_student, setId_student] = useState('');
  const [student_cedula, setStudent_cedula] = useState('');
  const [student_first_name, setStudent_first_name] = useState('');
  const [student_second_name, setStudent_second_name] = useState('');
  const [student_first_lastname, setStudent_first_lastname] = useState('');
  const [student_second_lastname, setStudent_second_lastname] = useState('');
  const [student_email, setStudent_email] = useState('');
  const [student_telephone, setStudent_telephone] = useState('');
  const [student_emergency_telephone, setStudent_emergency_telephone] = useState('');
  const [student_sex, setStudent_sex] = useState('');
  const [student_birthdate, setStudent_birthdate] = useState('');
  const [student_home_address, setStudent_home_address] = useState('');
  const [student_cedula_guardians_id, setStudent_cedula_guardians_id] = useState('');
  const [student_level_id, setStudent_level_id] = useState('');
  const [student_branch_id, setStudent_branch_id] = useState('');
  const [student_cedula_teacher_id, setStudent_cedula_teacher_id] = useState('');


  const [messageSuccesUpdate, setMessageSuccesUpdate] = useState('');
  const [messageErroUpdate, setMessageErroUpdate] = useState('');


  // Obtener lista de profesores
  const obtenerProfesores = async () => {
    try {

      const res = await fetch("http://localhost:6500/api/teachers", {
        method: "GET",
        credentials: 'include',
      })

      const response = await res.json();

      if (!response.success) {
        setMessageTeacherError(response.message);
        return;
      }

      setProfesores(response.data);
    } catch (err) {
      console.error('Error al cargar profesores:', err);
    }
  };

  // Obtener lista de sucursales
  const obtenerSucursales = async () => {
    try {
      const response = await fetch('http://localhost:6500/api/branches', {
        method: "GET",
        credentials: 'include',
      });

      const resultado = await response.json();

      if (!resultado.success) {
        setMessageBranchesError(resultado.message);
        return;
      }

      setSucursales(resultado.data);
    } catch (err) {
      console.error('Error al cargar sucursales:', err);
    }
  };

  // Obtener lista de niveles desde la API
  const obtenerNiveles = async () => {
    try {
      const response = await fetch('http://localhost:6500/api/level', {
        method: "GET",
        credentials: 'include',
      });
      const resultado = await response.json();

      if (!resultado.success) {
        setMessageLevelsError(resultado.message);
        return;
      }

      setNiveles(resultado.data);
    } catch (err) {
      console.error('Error al cargar niveles:', err);
    }
  };

  const obtenerEstudiantes = async (esudiante) => {
    try {
      const response = await fetch('http://localhost:6500/api/student', {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"studentCedula": esudiante}),
      });

      const res = await response.json();

      if (!res.success) {
        setMessageStudentError(res.message);
        return ;
      }

      setEstudiantes(res.data[0])
    } catch (error) {
      return console.log('Ha ocurrido un error inesperado', error);
    }
  }

  useEffect(() => {
    obtenerEstudiantes(cedula);
    obtenerProfesores();
    obtenerSucursales();
    obtenerNiveles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {

    if (estudiantes.id_student) {
      setId_student(estudiantes.id_student)
    }

    if (estudiantes.student_cedula) {
      setStudent_cedula(estudiantes.student_cedula);
    }

    if (estudiantes.student_first_name) {
      setStudent_first_name(estudiantes.student_first_name);
    }

    if (estudiantes.student_second_name) {
      setStudent_second_name(estudiantes.student_second_name);
    }

    if (estudiantes.student_first_lastname) {
      setStudent_first_lastname(estudiantes.student_first_lastname);
    }

    if (estudiantes.student_second_lastname) {
      setStudent_second_lastname(estudiantes.student_second_lastname);
    }

    if (estudiantes.student_email) {
      setStudent_email(estudiantes.student_email);
    }

    if (estudiantes.student_telephone) {
      setStudent_telephone(estudiantes.student_telephone);
    }

    if (estudiantes.student_emergency_telephone) {
      setStudent_emergency_telephone(estudiantes.student_emergency_telephone);
    }

    if (estudiantes.student_sex) {
      setStudent_sex(estudiantes.student_sex);
    }

    if (estudiantes.student_birthdate) {
      setStudent_birthdate(estudiantes.student_birthdate);
    }

    if (estudiantes.student_home_address) {
      setStudent_home_address(estudiantes.student_home_address);
    }

    if (estudiantes.student_cedula_guardians_id) {
      setStudent_cedula_guardians_id(estudiantes.student_cedula_guardians_id);
    }

    if (estudiantes.student_level_id) {
      setStudent_level_id(estudiantes.student_level_id);
    }

    if (estudiantes.student_branch_id) {
      setStudent_branch_id(estudiantes.student_branch_id);
    }

    if (estudiantes.student_cedula_teacher_id) {
      setStudent_cedula_teacher_id(estudiantes.student_cedula_teacher_id);
    }

  }, [estudiantes])



  async function sentInformation (e) {
    e.preventDefault();
    setMessageErroUpdate('');
    setMessageSuccesUpdate('');

    let data = {}

    data.id_student = Number(id_student);
    data.student_cedula = Number(student_cedula);
    data.student_first_name = student_first_name;
    data.student_second_name = student_second_name;
    data.student_first_lastname = student_first_lastname;
    data.student_second_lastname = student_second_lastname;
    data.student_email = student_email;
    data.student_telephone = student_telephone;
    data.student_emergency_telephone = student_emergency_telephone;
    data.student_sex = student_sex;
    data.student_birthdate = student_birthdate?.split("T")[0];
    data.student_home_address = student_home_address;
    data.student_cedula_guardians_id = student_cedula_guardians_id ? Number(student_cedula_guardians_id): null;
    data.student_level_id = Number(student_level_id);
    data.student_branch_id = Number(student_branch_id);
    data.student_cedula_teacher_id = Number(student_cedula_teacher_id);

    const response = await fetch(`http://localhost:6500/api/students/${data.id_student}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (!res.success) {
      setMessageErroUpdate(res.message);
      return;
    }

    setMessageSuccesUpdate(res.message);
  }

  return (
    <div className="p-6 bg-white min-h-screen">

      <h1 className="text-2xl font-bold text-indigo-950 mb-2">Editar Usuario</h1>

      {/* 🖼️ Foto del usuario con botón de editar */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-indigo-950 font-medium mb-4">Editar Foto</div>
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-500 text-sm text-center">Foto</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
          Editar Foto
        </button>
      </div>

      <form onSubmit={sentInformation}>
        {/* 📋 Datos del Estudiante */}
        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Datos del Estudiante</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">

          {/* Fila 1: Nombres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primer Nombre</label>
                <input
                  required
                  onChange={(e) => setStudent_first_name(e.target.value)}
                  defaultValue={estudiantes.student_first_name}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Segundo Nombre</label>
                <input
                  required
                  onChange={(e) => setStudent_second_name(e.target.value)}
                  defaultValue={estudiantes.student_second_name}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primer Apellido</label>
                <input
                  required
                  onChange={(e) => setStudent_first_lastname(e.target.value)}
                  defaultValue={estudiantes.student_first_lastname}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Segundo Apellido</label>
                <input
                  required
                  onChange={(e) => setStudent_second_lastname(e.target.value)}
                  defaultValue={estudiantes.student_second_lastname}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          {/* Fila 2: Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cédula de Identidad</label>
                <input
                  required
                  onChange={(e) => setStudent_cedula(e.target.value)}
                  defaultValue={estudiantes.student_cedula}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  required
                  onChange={(e) => setStudent_birthdate(e.target.value)}
                  defaultValue={estudiantes.student_birthdate?.split("T")[0]}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Edad</label>
                <input
                  defaultValue={estudiantes.student_second_name}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sexo</label>
              <select
                required
                onChange={(e) => setStudent_sex(e.target.value)}
                defaultValue={`${estudiantes.student_sex === "M" ? "F" : "M"}`}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Seleccionar</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>

          {/* Fila 3: Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  required
                  onChange={(e) => setStudent_email(e.target.value)}
                  defaultValue={estudiantes.student_email}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono Celular</label>
                <input
                  required
                  onChange={(e) => setStudent_telephone(e.target.value)}
                  defaultValue={estudiantes.student_telephone}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de Emergencia</label>
                <input
                  required
                  onChange={(e) => setStudent_emergency_telephone(e.target.value)}
                  defaultValue={estudiantes.student_emergency_telephone}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cédula del Representante</label>
                <input
                  onChange={(e) => setStudent_cedula_guardians_id(e.target.value)}
                  defaultValue={estudiantes.guardian_cedula}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>

          {/* Fila 4: Dirección */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                <input
                  required
                  onChange={(e) => setStudent_home_address(e.target.value)}
                  defaultValue={estudiantes.student_home_address}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>


        {/* 🎓 Nivel de Formación - CON NIVELES DESDE LA API */}
        <div className="bg-indigo-950 px-5 py-2 rounded-t-lg flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Datos de Formación</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nivel a cursar</label>
              <select
                required
                onChange={(e) => setStudent_level_id(e.target.value)}
                defaultValue={estudiantes.level_name}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar nivel</option>
                {niveles.map((nivel) => (
                  <option value={nivel.id_level} key={nivel.id_level}>
                    {nivel.level_name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Asignación de Profesor</label>
              <select
                required
                onChange={(e) => setStudent_cedula_teacher_id(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option>Seleccione</option>
                {profesores.map((profesor) => (
                  <option value={profesor.teacher_cedula} key={profesor.id_teacher}>
                    {profesor.teacher_first_name} - {profesor.teacher_cedula}
                  </option>
                ))
                }
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sucursal</label>
              <select
                required
                onChange={(e) => setStudent_branch_id(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar</option>
                {sucursales.map((sucursal) => (
                  <option value={sucursal.id_branch} key={sucursal.id_branch}>{sucursal.branch}</option>
                ))}

              </select>
            </div>
            {
              messageErroUpdate ? <span className="w-full grid md:col-span-3 justify-center text-sm font-medium text-red-600">{messageErroUpdate}</span> : <span className="w-full grid md:col-span-3 justify-center text-sm font-medium text-green-600">{messageSuccesUpdate}</span>
            }
          </div>
        </div>

        {/* 📤 Botones de acción - Centrados */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;