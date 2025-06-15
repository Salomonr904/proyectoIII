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

        <div><img src="/img/inicio-minifoto.png" alt="perfilesde estudiantes" /></div>

        <a href="#"><button> ¡Comienza Ahora! </button></a>

        <div className='imagenPrincipal'><img src="/img/paginaPrincipal.png" alt="" /></div>

       </div>
      </div>

      <div className='seccionDos'>
        <h2>BENEFICIOS DE APRENDER CON NOSOTROS </h2>
      
        <p>Nos especializamos en la enseñanza del inglés para niños, jóvenes y adultos.
         Con un enfoque práctico, moderno y personalizado, te guiamos con confianza en cada etapa,
         asegurando un aprendizaje efectivo. ¡Descubre todo lo que incluye tu experiencia!
        </p>

        <div className='BeneficiosInf'> 
         <Beneficios
         imgBeneficio = "1"
         tituloBeneficio = "Metodología Moderna"
         descripcionBeneficio = "Aprende con técnicas como Flipped Learning y el método Audiolingual, para dominar el idioma de forma natural."
         />

         <Beneficios
         imgBeneficio = "2"
         tituloBeneficio = "Aprendizaje Adaptado"
         descripcionBeneficio = "Contenidos y metodología enfocados en tus metas y necesidades, para un progreso eficaz."
         />

         <Beneficios
         imgBeneficio = "3"
         tituloBeneficio = "Desarrollo Integral"
         descripcionBeneficio = "Fortalecemos tu Speaking, Listening, Writing y Reading desde el primer día."
         />

         <Beneficios
         imgBeneficio = "4"
         tituloBeneficio = "Recursos Interactivos"
         descripcionBeneficio = "Herramientas digitales que impulsan el aprendizaje práctico y activo."
         />

         <Beneficios
         imgBeneficio = "5"
         tituloBeneficio = "Ambiente Dinámico"
         descripcionBeneficio = "Participación constante y clases diseñadas para mantenerte motivado."
         />

         <Beneficios
         imgBeneficio = "6"
         tituloBeneficio = "Certificación de Nivel"
         descripcionBeneficio = "Valida tu dominio del inglés y mejora tu perfil académico y profesional."
         />


       </div>
      </div>
      
      <div className="contenedorCursosInf">
        <h2>Explora nuestros niveles y encuentra tu curso ideal</h2>
        
        <p>Explora los niveles del idioma según el Marco Común Europeo de Referencia (MCER)
           y encuentra el punto ideal para empezar a avanzar con confianza y claridad.</p>
        <CursosInf 
        imgCurso = "Basico"
        nombreNivelCurso = "Nivel Básico (A1- A2)"
        descripcionNivelCurso = "Curso para desarrollar habilidades básicas de comunicación, que incluye presentarse, comprender expresiones simples y desenvolverse en situaciones cotidianas."
        />

        <CursosInf 
        imgCurso = "Medio"
        nombreNivelCurso = "Nivpersonalizadoel Intermedio (B1 – B2)"
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
