import React, { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-200  z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo y Navegación juntos */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="header__logo flex-shrink-0">
              <img 
                src="/img/institutolearning.png" 
                alt="Logo Weglish" 
                className="h-10 md:h-12 object-contain"
              />
            </div>

            {/* Navegación desktop - Al lado del logo */}
            <nav className="header__nav hidden md:block">
              <ul className="nav__list flex space-x-6">
                <li>
                  <a href="#" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors text-sm">
                    MISIÓN
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors text-sm">
                    VISIÓN
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors text-sm">
                    OBJETIVO
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Botón CTA */}
          <div className="header__cta">
            <a href="#">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 md:px-6 rounded-full transition-colors text-sm md:text-base">
                CONTACTÁNOS
              </button>
            </a>
          </div>

          {/* Menú móvil (hamburguesa) */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a href="#" className="block py-2 text-gray-800 font-semibold">MISIÓN</a>
              <a href="#" className="block py-2 text-gray-800 font-semibold">VISIÓN</a>
              <a href="#" className="block py-2 text-gray-800 font-semibold">OBJETIVO</a>
              <a href="#" className="block py-3">
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}