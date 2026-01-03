
import Sidebar from "../../components/Navbar/Sidebar";

const Dashboard = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar userEmail={email} />

      <main style={{ flex: 1, padding: "2rem" }}>
        {/* Dashboard content goes here */}
        <h1>Dashboard</h1>
      </main>
    </div>
  );
};
export default Dashboard;