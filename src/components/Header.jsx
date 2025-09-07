import React from "react";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <img src="/img/institutolearning.png" alt="Logo Weglish" />
      </div>

      <nav className="header__nav">
        <ul className="nav__list">
          <li><a href="#">MISIÓN</a></li>
          <li><a href="#">VISIÓN</a></li>
          <li><a href="#">OBJETIVO</a></li>
        </ul>
      </nav>

      <div className="header__cta">
        <a href="#"><button>CONTACTÁNOS</button></a>
      </div>
    </header>
  );
}
