import React from "react";
import Beneficios from './BeneficiosInf';

export default function BenefitsSection() {
  const beneficiosData = [
    {
      imgBeneficio: "1",
      tituloBeneficio: "Metodología Moderna",
      descripcionBeneficio: "Aprende con técnicas como Flipped Learning y el método Audiolingual, para dominar el idioma de forma natural.",
      colorClass: "bg-blue-50 "
    },
    {
      imgBeneficio: "2",
      tituloBeneficio: "Recursos Interactivos",
      descripcionBeneficio: "Herramientas digitales que impulsan el aprendizaje práctico y activo",
      colorClass: "bg-gray-200 "
    },
    {
      imgBeneficio: "3",
      tituloBeneficio: "Aprendizaje Adaptado",
      descripcionBeneficio: "Contenidos y metodología enfocados en tus metas y necesidades, para un progreso eficaz.",
      colorClass: "bg-orange-100"
    },
    {
      imgBeneficio: "4",
      tituloBeneficio: "Ambiente Dinámico",
      descripcionBeneficio: "Participación constante y clases diseñadas para mantenerte motivado",
      colorClass: "bg-red-100"
    },
    {
      imgBeneficio: "5",
      tituloBeneficio: "Desarrollo Integral",
      descripcionBeneficio: "Fortalecemos tu Speaking, Listening, Writing y Reading desde el primer día.",
      colorClass: "bg-yellow-50"
    },
    {
      imgBeneficio: "6",
      tituloBeneficio: "Certificación de Nivel",
      descripcionBeneficio: "Valida tu dominio del inglés y mejora tu perfil académico y profesional.",
      colorClass: "bg-green-100"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Beneficios de aprender con nosotros
          </h2>
          
          <p className="text-justify text-lg text-gray-600 max-w-1xl mx-auto leading-relaxed">
            Nos especializamos en la enseñanza del inglés para niños, jóvenes y adultos. 
            Con un enfoque práctico, moderno y personalizado, te guiamos con confianza en cada etapa, 
            asegurando un aprendizaje efectivo. ¡Descubre todo lo que incluye tu experiencia!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiosData.map((beneficio, index) => (
            <div 
              key={index}
              className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${beneficio.colorClass}`}
            >
              <Beneficios
                imgBeneficio={beneficio.imgBeneficio}
                tituloBeneficio={beneficio.tituloBeneficio}
                descripcionBeneficio={beneficio.descripcionBeneficio}
                colorClass={beneficio.colorClass}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}