// src/components/navbarComponent/Navbar.jsx
import React, { useEffect, useState } from 'react';
import './NavbarStyle.css';

const Navbar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay para animação
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className={`navbar ${show ? 'show' : ''}`}>
      <div className="navbar-title">
        <img src="/img/coracao_desbrava.png" alt="Logo" />
      </div>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#services">Serviços</a></li>
        <li><a href="#about">Sobre</a></li>
        <li><a href="#contact">Suporte</a></li>
        <li><a href="#contact">Cargo</a></li>
        <li><a href="#contact">Departamento</a></li>
        <li><a href="#Mensagem" className="btn-create">Mensagens</a></li>
      </ul>
    </header>
  );
};

export default Navbar;
