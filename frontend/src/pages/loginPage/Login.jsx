import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbarComponent';
import api from '../../services/api';
import '../../globals.css'; // seu estilo
import './loginStyle.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/', { email, password });
      console.log('Login bem-sucedido:', response.data);
      // salvar token no localStorage
      localStorage.setItem('token', response.data.token);

      // redirecionar para dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="login-container">
        <article className="login-image">
          <img src="/img/f-150.png" alt="F-150" />
        </article>

        <aside className="login-form">
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

            <button className="botaoMain" type="submit">Entrar</button>
          </form>
        </aside>
      </main>
    </>
  );
};

export default Login;
