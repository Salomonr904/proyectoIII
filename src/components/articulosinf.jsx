import React from "react";

function Articulosinf({ tituloArticulo, descripcionArticulo, imgArticulo }) {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="flex flex-col-reverse md:flex-row h-full">
        {/* Sección de texto */}
        <div className="p-6 md:p-8 flex flex-col justify-between w-full md:w-3/5 z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 leading-tight">
              {tituloArticulo}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {descripcionArticulo}
            </p>
          </div>
          <a
            href="#"
            className="text-gray-600 font-medium hover:text-blue-800 transtion-colors inline-flex items-center"
          >
            Ver mas &gt;
          </a>
        </div>

        {/* Sección de imagen con la forma curva */}
        <div className="relative w-full h-48 md:h-auto md:w-2/5 flex-shrink-0">
          {/* Este div crea el efecto de la curva */}
          <div
            className="absolute inset-0 bg-white"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%)" }} // Forma de curva
          ></div>
          <img
            src={`/img/art${imgArticulo}.jpg`} // Asegúrate de que las rutas de tus imágenes sean correctas
            alt={tituloArticulo}
            className="w-full h-full object-cover transform translate-x-0 transition-transform"
          />
          
        </div>
      </div>
    </div>
  );
}

export default Articulosinf;