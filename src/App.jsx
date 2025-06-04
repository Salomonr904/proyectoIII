import { useState } from 'react'
import CursosInf from './components/CursosInf'
import Beneficios from './components/BeneficiosInf'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='seccionUno'>
       <div className='icono'>
         <img src="/img/institutolearning.png" alt="icono Learnign" />
       </div>

        <nav>
          <ul className='navBarra'>
            <li><a href="#">MISIÓN</a></li>
            <li><a href="#"></a>VISIÓN</li>
            <li><a href="#"></a>OBJETIVO</li>
          </ul>
        </nav>
       <a href="#" className='contacto'><button>CONTACTÁNOS</button></a>
       <div>

        <h1>¡La comunicación es presición!</h1>
        <p>Domina el inglés y abre puertas al mundo profesional, académico y personal.</p>
        <p>Si formas parte de nuestro curso, aquí podrás aplicar lo aprendido y desarrollar
           tus habilidades de comprensión auditiva, expresión oral, lectura y escritura, con
            el apoyo de técnicas modernas y un enfoque adaptado a tu ritmo.
        </p>
        <p> ¡Haz de cada práctica un paso hacia tu fluidez! </p>

        <div><img src="" alt="érfilesde estudiantes" /></div>

        <a href="#"><button> ¡Comienza Ahora! </button></a>

        <div className='imagenPrincipal'><img src="/img/paginaPrincipal.png" alt="" /></div>

       </div>
      </div>

      <div className='seccionDos'>
        <h2>BENEFICIOS DE APRENDER CON NOSOTROS </h2>
        <hr />
        <p>En nuestra institución, nos especializamos en la 
          enseñanza del inglés para niños, jóvenes y adultos, 
          con un enfoque completamente personalizado. Gracias 
          a metodologías dinámicas y recursos adaptados, nuestros 
          estudiantes desarrollan con confianza las habilidades 
          que necesitan para comunicarse en inglés con fluidez y seguridad.
        </p>
        <div className='imgSeccionDos'> <img src="/img/seccionDos.png" alt="" /></div>
        <Beneficios
        
        tituloBeneficio = "Metodología moderna"
        descripcionBeneficio = "PPP, Flipped Learning y método Audiolingual para aprender de forma natural y efectiva."
        />

        <Beneficios
        
        tituloBeneficio = "Enfoque personalizado"
        descripcionBeneficio = "Clases adaptadas a tu ritmo, necesidades y estilo de aprendizaje."
        />

      </div>
      
      <div className="contenedorCursosInf">
        <h2>cursos</h2>
        <hr />
        <p>Explora los niveles del idioma según el Marco Común Europeo de Referencia (MCER)
           y encuentra el punto ideal para empezar a avanzar con confianza y claridad.</p>
        <CursosInf 
        imgCurso = "Basico"
        nombreNivelCurso = "Nivel Básico (A1- A2)"
        descripcionNivelCurso = "Curso para desarrollar habilidades básicas de comunicación, que incluye presentarse, comprender expresiones simples y desenvolverse en situaciones cotidianas."
        />

        <CursosInf 
        imgCurso = "Medio"
        nombreNivelCurso = "Nivel Intermedio (B1 – B2)"
        descripcionNivelCurso = "Curso para fortalecer habilidades comunicativas en inglés. Participa en conversaciones, expresa ideas y comprende textos generales. Ideal para entornos personales, académicos y laborales."
        />

        <CursosInf 
        imgCurso = "Avanzado"
        nombreNivelCurso = "Nivel Avanzado (C1 – C2)"
        descripcionNivelCurso = "Curso para perfeccionar el inglés, alcanzando fluidez y precisión. Facilita la comprensión de textos complejos, la comunicación natural y el uso efectivo del idioma en ámbitos profesionales, académicos y sociales."
        /> 
      </div>
      
    </>
  )
}

export default App
