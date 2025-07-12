import { useState, useEffect } from 'react';
import Navbar from "../../components/navbarComponent";
import "./dashbordStyle.css";
import "../../globals.css";
import { MessagesModal, SendMessageModal } from '../../components/base';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userRole , setUserRole] = useState('admin0'); // valor padrão
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   try {
    //     const decoded = JSON.parse(atob(token.split('.')[1]));
    //     setUserRole(decoded.role);
    //   } catch (err) {
    //     console.error('Erro ao decodificar o token:', err);
    //   }
    // }
  }, []); // importante: dependência vazia para rodar apenas uma vez

  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        {/* Cards ADMIN */}
        {userRole === 'admin' && (
          <section className="dashboard-cards">
            <Link to="/users" className="card shadow card-button link-sem-decoracao">
              <h2>🧑‍💼 Cargos</h2>
              <p>3 tipos</p>
            </Link>
            <Link to="/department" className="card shadow card-button link-sem-decoracao">
              <h2>🏢 Departamentos</h2>
              <p>3 setores</p>
            </Link>
            <Link to="/position" className="card shadow card-button link-sem-decoracao">
              <h2>👥 Usuários</h2>
              <p>15 cadastrados</p>
            </Link>
            <button className="buttonDH" onClick={() => setShowSendModal(true)}>
            📤 Enviar mensagem
          </button>
          </section>
        )}

        {/* Imagem para outro tipo de usuário */}
        {userRole === 'admin0' && (
          <img id="slide-aside" src="img/ford-GT.png" alt="Imagem para colaborador" />
        )}

        {/* Ações com modais */}
        <section className="dashboard-visuals">
          <button className="buttonDH" onClick={() => setShowMessageModal(true)}>
            📥 Mensagens recebidas
          </button>
          
          <div className="placeholder">
            <h1>Breve...</h1>
            <p>Em desenvolvimento</p>
          </div>
        </section>

        {/* Modais */}
        {showSendModal && (
          <SendMessageModal onClose={() => setShowSendModal(false)} />
        )}
        {showMessageModal && (
          <MessagesModal onClose={() => setShowMessageModal(false)} />
        )}
      </main>
    </>
  );
};

export default Dashboard;
