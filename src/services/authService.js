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

  if (data.user) {
    return {
      id: data.user.id,
      nome: data.user.nome,
      email: data.user.email,
      role: data.user.role,
    };
  }

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
  async login(nome, senha) {

  const response = await api.post('/auth/login', {
    nome,
    senha,

  });
 
  const data = response.data?.data;
 
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