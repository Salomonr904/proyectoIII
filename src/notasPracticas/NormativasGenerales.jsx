import React from "react";

const NormativasGenerales = () => {
  const normas1 = [
    "Las clases se dictan en inglés, por lo tanto, se exige la participación en inglés.",
    "Las clases inician y terminan a la hora establecida. En caso de retraso, se permite ingresar solo dentro de los primeros 20 minutos, sin interrumpir.",
    "Clase perdida por inasistencia se recupera con clase particular de costo extra por hora.",
    "Evaluaciones orales y escritas deben presentarse en la fecha y horario establecidos.",
  ];

  const normas2 = [
    "Si no presenta la evaluación en la fecha asignada, deberá agendar una clase particular y notificar las evaluaciones a presentar.",
    "El arancel mensual debe ser cancelado en la fecha asignada.",
    "Si no puede ver su nota final o realizar prácticas, póngase al día cuanto antes. Si ha cancelado, contacte a su profesor para resolverlo.",
    "Ver cartelera para más información.",
  ];

  const CheckIcon = () => (
    <div className="w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center">
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="w-full px-4 md:px-16 py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-5">
          {normas1.map((texto, index) => (
            <div key={index} className="flex gap-3 items-start">
              <CheckIcon />
              <p className="text-gray-600 text-sm leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-5">
          {normas2.map((texto, index) => (
            <div key={index} className="flex gap-3 items-start">
              <CheckIcon />
              <p className="text-gray-600 text-sm leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NormativasGenerales;