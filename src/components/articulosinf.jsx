import React from "react";

function Articulosinf({ tituloArticulo, descripcionArticulo, imgArticulo }) {
  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.01]">
      <div className="flex flex-col md:flex-row h-full">
        {/* Texto */}
        <div className="p-6 md:p-8 flex flex-col justify-between w-full md:w-3/5">
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
            className="text-blue-700 font-medium hover:underline inline-flex items-center"
          >
            Ver &gt;
          </a>
        </div>

        {/* Imagen con curva en esquina inferior izquierda */}
        <div className="relative w-full h-48 md:h-auto md:w-2/5">
          <div className="w-full h-full overflow-hidden">
            <img
              src={`/img/art${imgArticulo}.jpg`}
              alt={tituloArticulo}
              className="w-full h-full object-cover rounded-bl-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Articulosinf;
