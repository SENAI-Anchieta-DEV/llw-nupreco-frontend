import api from './api';
<<<<<<< HEAD
import { marcarGestorCadastrado } from '../utils/firstAccess';
=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
import {
  setToken,
  setStoredUser,
  clearSession,
  getStoredUser,
  getToken,
} from '../utils/token';

<<<<<<< HEAD

const normalizeUser = (data) => {
  if (!data) return null;


=======
const normalizeUser = (data) => {
  if (!data) return null;

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  if (data.user) {
    return {
      id: data.user.id,
      nome: data.user.nome,
      email: data.user.email,
      role: data.user.role,
    };
  }

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  return {
    id: data.id,
    nome: data.nome,
    email: data.email,
    role: data.role,
  };
};

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
const getTokenFromResponse = (data) => {
  return data?.token || data?.accessToken || null;
};

<<<<<<< HEAD

const authService = {
  async login(nome, senha) {


=======
const authService = {
  async login(nome, senha) {

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const response = await api.post('/auth/login', {
    nome,
    senha,

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  });
 
  const data = response.data?.data;
 
  const token = getTokenFromResponse(data);

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const user = normalizeUser(data);
 
  if (!token || !user) {

<<<<<<< HEAD

    throw new Error('Resposta de autenticação inválida.');


  }
  setToken(token);
  setStoredUser(user);


  if (String(user.role || '').toUpperCase() === 'GESTOR') {
    marcarGestorCadastrado();
  }
=======
    throw new Error('Resposta de autenticação inválida.');

  }
  setToken(token);
  setStoredUser(user);
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
 
  return user;
},
 

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  logout() {
    clearSession();
  },

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  getCurrentUser() {
    return getStoredUser();
  },

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  isAuthenticated() {
    return !!getToken();
  },
};

<<<<<<< HEAD

export default authService;

=======
export default authService;
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
