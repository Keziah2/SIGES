import axios from "@/lib/api/axios";

interface LoginResponse {
  access: string;
  refresh: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>("/auth/jwt/create/", {
    email,
    password,
  });

  // Retourne directement { access, refresh }
  return response.data;
};
