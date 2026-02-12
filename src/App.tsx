import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import type { User } from "./types/user.types";
import UsersPage from "./pages/UsersPage";
import { SociosPage } from "./pages/SociosPage";
import SharesPage from "./pages/SharesPage";
import { PaymentsPage } from "./pages/PaymentPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setLoggedUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {!loggedUser ? (
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        ) : (
         <>
            <Route path="/" element={<DashboardPage user={loggedUser} onLogout={handleLogout} />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/socios" element={<SociosPage />} />
            <Route path="/shares" element={<SharesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}