import Navbar from "../../components/navbarComponent";
import "../../globals.css"

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div>
        <h2>Bem-vindo, Eric!</h2>
        <p>Email: 1@1.com</p>
        <p>Departamento ID: 1</p>
        <p>Cargo ID: Dev</p>
      </div>
    </>
  );
}
