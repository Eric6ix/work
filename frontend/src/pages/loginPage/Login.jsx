import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/navbarComponent';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // para redirecionar após login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;

      // ETAPA 2
      localStorage.setItem('token', token); // armazena o token

      // ETAPA 3
      navigate('/dashboard'); // redireciona após login

    } catch (error) {
      console.error('Erro no login:', error);
      alert('Login inválido. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div className="container">
      <Navbar />

      <main className="main-content">
        <motion.article
          className="image-side"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img src="/img/f-150.png" alt="F-150" className="image-hover-animate" />
        </motion.article>

        <motion.aside
          className="form-side"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img src="/img/coracao_desbrava.png" alt="Logo" className="logo-heart" />
          <h2>Bem-vindo!</h2>
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
            <button type="submit" className="botao-main">Entrar</button>
          </form>
        </motion.aside>
      </main>
    </div>
  );
}
