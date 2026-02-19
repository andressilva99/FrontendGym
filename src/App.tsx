import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Container } from "@mui/material"; 
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
      {!loggedUser ? (
        <Routes>
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      ) : (
        /* Cambiamos a height: '100vh' y overflow: 'hidden' para controlar el scroll */
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          overflow: 'hidden',
          bgcolor: "#f5f7fb" 
        }}>
          
          {/* Contenedor de rutas con scroll independiente */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', // Solo esta parte scrolleará si el contenido es mucho
            width: '100%'
          }}>
            <Routes>
              <Route path="/" element={<DashboardPage user={loggedUser} onLogout={handleLogout} />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/socios" element={<SociosPage />} />
              <Route path="/shares" element={<SharesPage />} />
              <Route path="/payments" element={<PaymentsPage user={loggedUser}/>} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>

          {/* FOOTER - Siempre visible al final sin empujar el layout */}
          <Box 
            component="footer" 
            sx={{ 
              py: 1.5, // Reducimos un poco el padding para ganar espacio
              px: 2, 
              backgroundColor: 'white',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              textAlign: 'center',
              zIndex: 10 // Asegura que esté por encima si hay elementos flotantes
            }}
          >
            <Container maxWidth="lg">
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' } 
                }}
              >
                © {new Date().getFullYear()} <strong>AsDev</strong>. Todos los derechos reservados.
              </Typography>
            </Container>
          </Box>
        </Box>
      )}
    </BrowserRouter>
  );
}