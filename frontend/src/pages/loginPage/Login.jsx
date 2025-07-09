// src/pages/loginPage/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginStyle.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/auth/', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      alert('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      alert('Credenciais inválidas');
    }
  };

  return (
   
      <main className="login-container">
        <aside id="slide-aside" className="login-aside">
          <div className="h2-box">
            <h2>Bem-vindo à</h2>
            <h2><span>Disbrava Ford!</span></h2>
          </div>
          <p>
            Bem-vindo ao portal da Disbrava! Faça login para acessar as funcionalidades exclusivas do sistema.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-send">Entrar</button>
          </form>
        </aside>

        <article id="slide-article" className="login-article">
          <img src="img/f-150.png" alt="F-150" />
        </article>
      </main>
  );
};

export default Login;
