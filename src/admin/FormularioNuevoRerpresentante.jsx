import React, {useState} from 'react';



export function NuevoRepresentante () {
  const [guardian_cedula, setGuardian_cedula] = useState('');
  const [guardian_first_name, setGuardian_first_name] = useState('');
  const [guardian_second_name, setGuardian_second_name] = useState('');
  const [guardian_first_lastname, setGuardian_first_lastname] = useState('');
  const [guardian_second_lastname, setGuardian_second_lastname] = useState('');
  const [guardian_email, setGuardian_email] = useState('');
  const [guardian_telephone, setGuardian_telephone] = useState('');
  const [guardian_work_telephone, setGuardian_work_telephone] = useState('');
  const [guardian_work_address, setGuardianWorkAddress] = useState('');

  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');



  async function sendInformation (e) {
    e.preventDefault();

    let data = {}

    data.guardian_cedula = Number(guardian_cedula);
    data.guardian_first_name = guardian_first_name;
    data.guardian_second_name = guardian_second_name;
    data.guardian_first_lastname = guardian_first_lastname;
    data.guardian_second_lastname = guardian_second_lastname;
    data.guardian_email = guardian_email;
    data.guardian_telephone = guardian_telephone;
    data.guardian_work_telephone = guardian_work_telephone;
    data.guardian_work_address = guardian_work_address;


    const res = await fetch("http://localhost:6500/api/guardians", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const response = await res.json();

    if (!response.success) {
      setMessageError(response.message);
      return;
    }

    setMessageSuccess(response.message);
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <form className="w-full mx-auto" onSubmit={sendInformation}>
        {/* Contenedor para mensajes */}
        <div id="message" className="bg-red-100 border border-red-400 text-red-700 px-4 py-0 rounded-xl relative mb-4 transition-all duration-300" style={{ visibility: 'hidden', height: '0', padding: 0 }}></div>

        {/* Contenedor General de Secciones */}
        <div className="bg-white rounded-lg p-0">

          {/* Sección: Datos del Representante (solo si es menor de 9 años) */}
            <div className="mt-8 border border-gray-300 rounded-lg shadow-sm">
              <div className="bg-orange-600 px-5 py-2 rounded-t-lg flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Datos del Representante</h3>
                <span className="text-white text-sm bg-orange-700 px-2 py-1 rounded">Requerido</span>
              </div>

              <div className="justify-center p-5 grid grid-cols-1 md:grid-cols-2 md:justify-center lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula del Representante *
                  </label>
                  <input
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 `}
                    name="guardian_cedula"
                    placeholder="Cédula del Representante"
                    onChange={(e) => setGuardian_cedula(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primer Nombre *
                  </label>
                  <input
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 `}
                    name="guardian_first_name"
                    placeholder="Primer Nombre"
                    onChange={(e) => setGuardian_first_name(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segundo Nombre
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_second_name"
                    placeholder="Segundo Nombre (opcional)"
                    onChange={(e) => setGuardian_second_name(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primer Apellido *
                  </label>
                  <input
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 `}
                    name="guardian_first_lastname"
                    placeholder="Primer Apellido"
                    onChange={(e) => setGuardian_first_lastname(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Segundo Apellido
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_second_lastname"
                    placeholder="Segundo Apellido (opcional)"
                    onChange={(e) => setGuardian_second_lastname(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600`}
                    name="guardian_email"
                    placeholder="Correo Electrónico"
                    onChange={(e) => setGuardian_email(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600 `}
                    name="guardian_telephone"
                    placeholder="Teléfono"
                    onChange={(e) => setGuardian_telephone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Trabajo
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_work_telephone"
                    placeholder="Teléfono de Trabajo (opcional)"
                    onChange={(e) => setGuardian_work_telephone(e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de Trabajo
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    name="guardian_work_address"
                    placeholder="Dirección de Trabajo (opcional)"
                    onChange={(e) => setGuardianWorkAddress(e.target.value)}
                  />
                </div>
                {
                  messageError ? <span className="w-full grid md:col-span-3 justify-center text-sm font-medium text-red-600">{messageError}</span> : <span className="w-full grid md:col-span-3 justify-center text-sm font-medium text-green-600">{messageSuccess}</span>
                }
              </div>
            </div>

          {/* Botones de acción */}
          <div className="flex justify-center space-x-4 pt-4">
            <button
              type="submit"
              className=" capitalize px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              registrar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}