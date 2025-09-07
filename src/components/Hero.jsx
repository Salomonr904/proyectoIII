import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const navigate = useNavigate();

  const irALogin = (ruta) => {
    navigate(ruta); // ← ahora apunta a la ruta de carga
  };

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">¡La comunicación es precisión!</h1>
        <p className="hero__subtitle">
          Domina el inglés y abre puertas al mundo profesional, académico y personal.
        </p>
        <p>
          Si formas parte de nuestro curso, aquí podrás aplicar lo aprendido y desarrollar tus habilidades de comprensión auditiva, expresión oral, lectura y escritura, con el apoyo de técnicas modernas y un enfoque adaptado a tu ritmo.
        </p>
        <p className="hero__highlight">¡Haz de cada práctica un paso hacia tu fluidez!</p>

        <div className="hero__student">
          <img src="/img/inicio-minifoto.png" alt="Perfiles de estudiantes" />
        </div>

        <div className="hero__cta">
          <button onClick={() => setMostrarOpciones(!mostrarOpciones)}>
            ¡Comienza Ahora!
          </button>

          {mostrarOpciones && (
            <div className="hero__opciones">
              <p>Selecciona el sistema al que deseas ingresar:</p>
              <button onClick={() => irALogin("/loading-practicas")}>
                Sistema de Prácticas
              </button>
              <button onClick={() => irALogin("/loading-calificaciones")}>
                Sistema de Calificaciones
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hero__image">
        <img src="/img/paginaPrincipal.png" alt="Imagen principal decorativa" />
      </div>
    </section>
  );
}
