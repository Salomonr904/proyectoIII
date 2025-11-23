import CursosInf from './CursosInf';

export default function CoursesSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Explora nuestros niveles y encuentra tu curso ideal
          </h2>
          
          <p className="text-lg text-gray-600 max-w-5xl mx-auto mb-8 text-justify leading-relaxed">
            Nuestros cursos se alinean con el Marco Común Europeo de Referencia (MCER), 
            abarcando desde niveles iniciales hasta avanzados. Te permitimos comenzar en 
            tu nivel actual y avanzar a tu propio ritmo.
          </p>
        </div>

        <div className="text-justify grid grid-cols-1 md:grid-cols-3 gap-8">
          <CursosInf 
            imgCurso="Basico"
            nombreNivelCurso="Nivel Básico (A1 - A2)"
            descripcionNivelCurso="Curso para desarrollar habilidades básicas de comunicación, que incluye presentarse, comprender expresiones simples y desenvolverse en situaciones cotidianas."
            LinkCurso="#basico"
          />

          <CursosInf
            imgCurso="Medio"
            nombreNivelCurso="Nivel Intermedio (B1 – B2)"
            descripcionNivelCurso="Curso para fortalecer habilidades comunicativas en inglés. Participa en conversaciones, expresa ideas y comprende textos generales. Ideal para entornos personales, académicos y laborales."
            LinkCurso="#intermedio"
          />

          <CursosInf
            imgCurso="Avanzado"
            nombreNivelCurso="Nivel Avanzado (C1 – C2)"
            descripcionNivelCurso="Curso para perfeccionar el inglés, alcanzando fluidez y precisión. Facilita la comprensión de textos complejos, la comunicación natural y el uso efectivo del idioma en ámbitos profesionales, académicos y sociales."
            LinkCurso="#avanzado"
          />
        </div>
      </div>
    </section>
  );
}