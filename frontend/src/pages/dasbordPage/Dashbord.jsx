import { useState, useEffect } from 'react';
import Navbar from "../../components/navbarComponent";
import "./dashbordStyle.css";
import "../../globals.css";
import { MessagesModal, SendMessageModal } from '../../components/modal';
import { Link } from 'react-router-dom';


const userPosition = "admin0"
const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1])); // cuidado com segurança
      setUserRole(decoded.role);
      }
    }
  )


  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        {/* Título da dashboard */}

        {/* Cards de Resumo */}

        {userPosition === 'admin' && (     
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
            </section>
          )
        }

        {userPosition === 'admin0' && (  
          <img id="slide-aside" src="img/ford-GT.png" alt="" />
         )}
          {/* Placeholder para gráficos ou tabelas */}
              
                <section className="dashboard-visuals">
                  <button className="buttonDH" onClick={() => setShowMessageModal(true)}> 📥 Mensagens recebidas </button>
                  <button className="buttonDH" onClick={() => setShowSendModal(true)}> 📤 Enviar mensagem </button>
                  <div className="placeholder">Em breve...</div>
                </section>     
      </main>
    </>
  );
};

export default Dashboard;
