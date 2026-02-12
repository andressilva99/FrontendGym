import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { User } from "../types/user.types";

interface LoginPageProps {
  users: User[];
  onLogin: Dispatch<SetStateAction<User | null>>;
}

export default function LoginPage({ onLogin }: any) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dni: Number(dni),
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      onLogin(data);

    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div>
      <input
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}