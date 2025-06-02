import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  // ajoute d'autres champs selon ton modèle
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setLoading(false);
      return;
    }

    axios
      .get<User>("/auth/users/me/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Token invalide ou expiré
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        setLoading(false);
      });
  }, []);

  return { user, loading };
};
