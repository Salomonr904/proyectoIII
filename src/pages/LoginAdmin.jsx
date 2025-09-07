import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías validar usuario/contraseña si lo deseas
    navigate('/admin-panel');
  };

  return (
    <div className="login-container">
      <div className="logo-section">
        <img src="/img/institutolearning.png" alt="Logo Weglish" />
        <h2>Acceso exclusivo para administradores</h2>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>Admin</label>
        <input type="text" placeholder="Usuario" />
        <label>Contraseña</label>
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginAdmin;
