import Sidebar from "../../components/Navbar/Sidebar";

const Pomodoro = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar userEmail={email} />

      <main style={{ flex: 1, padding: "2rem" }}>
        {/* Dashboard content goes here */}
        <h1>Pomodoro Timer</h1>
      </main>
    </div>
  );
};


export default Pomodoro;