import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import { SociosPage } from "./pages/SociosPage";
import SharesPage from "./pages/SharesPage";
import { PaymentsPage } from "./pages/PaymentPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/socios" element={<SociosPage />} />
        <Route path="/shares" element={<SharesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}