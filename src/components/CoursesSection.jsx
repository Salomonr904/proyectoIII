import CursosInf from './CursosInf';

export default function CoursesSection() {
  return (
    <section>
      <h2>Explora nuestros niveles y encuentra tu curso ideal</h2>

      <p>
        Explora los niveles del idioma según el Marco Común Europeo de Referencia (MCER)
        y encuentra el punto ideal para empezar a avanzar con confianza y claridad.
      </p>

      <div className="contenedorCursosInf">
        <CursosInf
          imgCurso="Basico"
          nombreNivelCurso="Nivel Básico (A1- A2)"
          descripcionNivelCurso="Curso para desarrollar habilidades básicas de comunicación, que incluye presentarse, comprender expresiones simples y desenvolverse en situaciones cotidianas."
        />

        <CursosInf
          imgCurso="Medio"
          nombreNivelCurso="Nivel Intermedio (B1 – B2)"
          descripcionNivelCurso="Curso para fortalecer habilidades comunicativas en inglés. Participa en conversaciones, expresa ideas y comprende textos generales. Ideal para entornos personales, académicos y laborales."
        />

        <CursosInf
          imgCurso="Avanzado"
          nombreNivelCurso="Nivel Avanzado (C1 – C2)"
          descripcionNivelCurso="Curso para perfeccionar el inglés, alcanzando fluidez y precisión. Facilita la comprensión de textos complejos, la comunicación natural y el uso efectivo del idioma en ámbitos profesionales, académicos y sociales."
        />
      </div>
    </section>
  );
}