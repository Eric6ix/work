export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h2>Bem-vindo, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Departamento ID: {user.department_id}</p>
      <p>Cargo ID: {user.position_id}</p>
    </div>
  );
}
