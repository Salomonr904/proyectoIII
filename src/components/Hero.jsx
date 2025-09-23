import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const navigate = useNavigate();

  const irALogin = (ruta) => {
    navigate(ruta);
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-zinc-200 relative"> {/* Añadido 'relative' aquí */}
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="hero__content lg:w-1/2">
            <h1 className="text-xl md:text-5xl font-bold text-blue-950 mb-6 leading-tight">
              ¡La comunicación es <span className="text-sky-500">precisión!</span>
            </h1>

            <p className="text-xl text-gray-700 mb-6 font-medium">
              Domina el inglés y abre puertas al mundo profesional, académico y personal.
            </p>

            <p className="text-justify text-gray-600 mb-6 leading-relaxed">
              Si formas parte de nuestro curso, aquí podrás aplicar lo aprendido y desarrollar tus habilidades de comprensión auditiva, expresión oral, lectura y escritura, con el apoyo de técnicas modernas y un enfoque adaptado a tu ritmo.
            </p>

            <p className="text-blue-600 text-lg font-semibold mb-8 italic">
              ¡Haz de cada práctica un paso hacia tu fluidez!
            </p>

            {/* Student Profiles */}
            <div className="hero__student mb-8">
              <img
                src="/img/inicio-minifoto.png"
                alt="Perfiles de estudiantes"
                className="w-48 object-contain"
              />
            </div>

            {/* CTA Button */}
            <div className="hero__cta relative">
              <button
                onClick={() => setMostrarOpciones(!mostrarOpciones)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full text-lg transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                ¡Comienza Ahora!
              </button>

              {mostrarOpciones && (
                <div className="absolute top-full left-0 mt-4 w-80 bg-white rounded-lg shadow-xl p-6 z-10 border border-gray-200">
                  <p className="text-gray-700 mb-4 font-medium text-center">
                    Selecciona el sistema al que deseas ingresar:
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => irALogin("/loading-practicas")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      Sistema de Prácticas
                    </button>
                    <button
                      onClick={() => irALogin("/loading-calificaciones")}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      Sistema de Calificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="hero__image lg:w-1/2">
            <img
              src="/img/paginaPrincipal.png"
              alt="Imagen principal decorativa"
              className="w-full max-w-md mx-auto lg:max-w-lg"
            />
          </div>
        </div>

        {/* Aquí se añade el código del ícono de flecha */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}