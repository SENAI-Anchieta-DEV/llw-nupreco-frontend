import api from './api';
import {
  setToken,
  setStoredUser,
  clearSession,
  getStoredUser,
  getToken,
} from '../utils/token';

const normalizeUser = (data) => {
  if (!data) return null;

  // Caso a API devolva o user dentro de "user"
  if (data.user) {
    return {
      id: data.user.id,
      nome: data.user.nome,
      email: data.user.email,
      role: data.user.role,
    };
  }

  // Caso a API devolva os campos direto na raiz
  return {
    id: data.id,
    nome: data.nome,
    email: data.email,
    role: data.role,
  };
};

const getTokenFromResponse = (data) => {
  return data?.token || data?.accessToken || null;
};

const authService = {
  async login(email, senha) {
    const response = await api.post('/auth/login', {
      email,
      senha,
    });

    const data = response.data;
    const token = getTokenFromResponse(data);
    const user = normalizeUser(data);

    if (!token || !user) {
      throw new Error('Resposta de autenticação inválida.');
    }

    setToken(token);
    setStoredUser(user);

    return user;
  },

  logout() {
    clearSession();
  },

  getCurrentUser() {
    return getStoredUser();
  },

  isAuthenticated() {
    return !!getToken();
  },
};

export default authService;