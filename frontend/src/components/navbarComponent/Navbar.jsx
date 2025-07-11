// src/components/navbarComponent/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarStyle.css';


const Navbar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Delay para animação
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);


   const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };


  return (
    <header className={`navbar ${show ? 'show' : ''}`}>
      <div className="navbar-title">
        <img src="/img/coracao_desbrava.png" alt="Logo" />
      </div>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#services">Perfil</a></li>
        <li><a href="#about">Sobre</a></li>
        <li><a href="#contact">Suporte</a></li>
        <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
      </ul>
    </header>
  );
};

export default Navbar;
