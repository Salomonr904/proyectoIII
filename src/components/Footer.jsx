import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importa el hook de navegación

function Footer() {
  const navigate = useNavigate(); // 👈 Inicializa el hook

  // 👇 Define la función que se ejecuta al hacer clic
  const handleAdminClick = (e) => {
    e.preventDefault(); // Evita que el enlace recargue la página
    navigate('/loading-admin'); // Redirige a la pantalla de carga
  };

  return (
    <footer>
      {/* Logo */}
      <div>
        <img src="/img/institutolearning.png" alt="Logo Wenglish" />
      </div>

      {/* Tu próximo paso es */}
      <div>
        <h4>Tu próximo paso es:</h4>
        <ul>
          <li><a href="#">Evalúa tu nivel</a></li>
          <li><a href="#">Reserva tu cupo</a></li>
          <li><a href="#">Solicitar información</a></li>
        </ul>
      </div>

      {/* Sobre nosotros */}
      <div>
        <h4>Sobre nosotros:</h4>
        <ul>
          <li><a href="#">Misión</a></li>
          <li><a href="#">Visión</a></li>
          <li><a href="#">Objetivo</a></li>
        </ul>
      </div>

      {/* Cursos */}
      <div>
        <h4>Cursos</h4>
        <ul>
          <li><a href="#">Nivel básico</a></li>
          <li><a href="#">Nivel intermedio</a></li>
          <li><a href="#">Nivel avanzado</a></li>
        </ul>
      </div>

      {/* Otros links */}
      <div>
        <h4>Otros links</h4>
        <ul>
          <li>
            <a href="/loading-admin" onClick={handleAdminClick}>
              Gestión interna
            </a>
          </li>
          <li><a href="#">Últimos artículos</a></li>
        </ul>
      </div>

      {/* Contacto */}
      <div>
        <p>Developer: dev.wenglish@gmail.com</p>
        <p>2025 Nnes Learning Center C.A RIF: J-40517294-0</p>
      </div>

      {/* Redes sociales */}
      <div>
        <h4>Síguenos</h4>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
      </div>
    </footer>
  );
}

export default Footer;
