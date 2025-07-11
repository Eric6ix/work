import Navbar from "../../components/navbarComponent";
import "./dashbordStyle.css";
import "../../globals.css";
import { Link } from 'react-router-dom';
const userRole = 'admin'
const Dashboard = () => {
  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        {/* Título da dashboard */}
      

        {/* Cards de Resumo */}
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


          {/* Placeholder para gráficos ou tabelas */}
              {userRole === 'admin' && (
                <section className="dashboard-visuals">
                  <div className="placeholder">Mensagens recebidas</div>
                  <div className="placeholder">Fazer envio de mensagen</div>
                </section>
              )}
              
        
      </main>
    </>
  );
};

export default Dashboard;
