import React from "react";

function CursosInf(props) {
  return (
    <div className="contenedorCursosInf bg-white rounded-lg border border-gray-200 overflow-hidden text-left h-full flex flex-col transition-transfrom duration-300 hover:scale-105 hover:shadow-lg">
      
      {/* Imagen en la parte superior */}
      <img
        className="w-full h-48 object-cover"
        src={`/img/nivel${props.imgCurso}.png`}
        alt="imagen Cursos"
      />

      {/* Contenido debajo de la imagen */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          <img src="/img/iconoCheck.png" alt="" className="mr-2 w-6 h-6" />
          {props.nombreNivelCurso}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
          {props.descripcionNivelCurso}
        </p>
        <a href={`${props.LinkCurso}`} className="mt-auto">
          <button className="text-gray-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center">
            Ver más &gt;
          </button>
        </a>
      </div>
    </div>
  );
}

export default CursosInf;
