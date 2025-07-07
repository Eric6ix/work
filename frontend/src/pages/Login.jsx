// src/pages/Login.jsx
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import '../styles/Login.css'; // Importando o CSS do Login
import './Login.css';

export default function Login() {
  return (
    <div className="container">
      <Navbar />

      <main className="main-content">
        {/* Article com imagem da F-150 */}
        <motion.article
          className="image-side"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src="/f-150.png"
            alt="Ford F-150"
            className="car-image"
          />
        </motion.article>

        {/* Aside com formulário */}
        <motion.aside
          className="form-side"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src="/coracao_desbrava.png"
            alt="Logo"
            className="logo-heart"
          />
          <h2>Bem-vindo!</h2>
          <form>
            <input type="email" placeholder="E-mail" required />
            <input type="password" placeholder="Senha" required />
            <button type="submit" className="botao-main">Entrar</button>
          </form>
        </motion.aside>
      </main>
    </div>
  );
}
