import { useState, useEffect } from "react";
import Login from "./Login";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);  // This will trigger a re-render
  };

  return (
    <>
      {token ? (
        <h1>
          Todo App <a href="javascript:void(0);" onClick={handleLogout}>Logout</a>
        </h1>
      ) : (
        <Login onLogin={setToken} />
      )}
    </>
  );
}

export default App;
