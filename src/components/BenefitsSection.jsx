import React from "react";
import Beneficios from './BeneficiosInf';

export default function BenefitsSection() {
  return (
    <section>
      <h2>BENEFICIOS DE APRENDER CON NOSOTROS</h2>

      <p>
        Nos especializamos en la enseñanza del inglés para niños, jóvenes y adultos.
        Con un enfoque práctico, moderno y personalizado, te guiamos con confianza en cada etapa,
        asegurando un aprendizaje efectivo. ¡Descubre todo lo que incluye tu experiencia!
      </p>

      <div className="BeneficiosInf">
        <Beneficios
          imgBeneficio="1"
          tituloBeneficio="Metodología Moderna"
          descripcionBeneficio="Aprende con técnicas como Flipped Learning y el método Audiolingual, para dominar el idioma de forma natural."
        />

        <Beneficios
          imgBeneficio="2"
          tituloBeneficio="Aprendizaje Adaptado"
          descripcionBeneficio="Contenidos y metodología enfocados en tus metas y necesidades, para un progreso eficaz."
        />

        <Beneficios
          imgBeneficio="3"
          tituloBeneficio="Desarrollo Integral"
          descripcionBeneficio="Fortalecemos tu Speaking, Listening, Writing y Reading desde el primer día."
        />

        <Beneficios
          imgBeneficio="4"
          tituloBeneficio="Recursos Interactivos"
          descripcionBeneficio="Herramientas digitales que impulsan el aprendizaje práctico y activo."
        />

        <Beneficios
          imgBeneficio="5"
          tituloBeneficio="Ambiente Dinámico"
          descripcionBeneficio="Participación constante y clases diseñadas para mantenerte motivado."
        />

        <Beneficios
          imgBeneficio="6"
          tituloBeneficio="Certificación de Nivel"
          descripcionBeneficio="Valida tu dominio del inglés y mejora tu perfil académico y profesional."
        />
      </div>
    </section>
  );
}