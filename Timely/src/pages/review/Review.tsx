import Sidebar from "../../components/Navbar/Sidebar";

const Review = () => {
  const email = localStorage.getItem("userEmail") ?? undefined;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar userEmail={email} />

      <main style={{ flex: 1, padding: "2rem" }}>
        <h1>Review</h1>
      </main>
    </div>
  );
};


export default Review;