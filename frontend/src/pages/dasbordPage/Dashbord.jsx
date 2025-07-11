import Navbar from "../../components/navbarComponent";
import "./dashbordStyle.css";
import "../../globals.css";
import { MessagesModal, SendMessageModal } from '../../components/modal';
import { Link } from 'react-router-dom';


const userRole = 'admin0'
// const [showMessageModal, setShowMessageModal] = useState(false);
const Dashboard = () => {
  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        {/* Título da dashboard */}

        {/* Cards de Resumo */}

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
            </section>
          )
        }

        {userRole === 'admin0' && (  
          <img id="slide-aside" src="img/ford-GT.png" alt="" />
         )}
          {/* Placeholder para gráficos ou tabelas */}
              
                <section className="dashboard-visuals">
                  <div className="placeholder">Mensagens recebidas</div>
                  <div className="placeholder">Fazer envio de mensagen</div>
                  <div className="placeholder">Mensagens recebidas</div>
                  <div className="placeholder">Fazer envio de mensagen</div>
                </section>
              
              
        
      </main>
    </>
  );
};

export default Dashboard;
