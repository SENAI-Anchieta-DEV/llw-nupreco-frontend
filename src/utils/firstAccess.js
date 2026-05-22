import api from '../services/api';


const GESTOR_CADASTRADO_KEY = 'nupreco_gestor_cadastrado';


const normalizarRole = (role) => String(role || '').trim().toUpperCase();


const extrairDados = (resposta) => {
  if (!resposta) return null;
  return resposta?.data?.data ?? resposta?.data ?? resposta;
};


const possuiGestorNaResposta = (dados) => {
  if (!dados) return false;


  if (Array.isArray(dados)) {
    return dados.some((usuario) => normalizarRole(usuario?.role || usuario?.perfil) === 'GESTOR');
  }


  if (Array.isArray(dados?.content)) {
    return dados.content.some((usuario) => normalizarRole(usuario?.role || usuario?.perfil) === 'GESTOR');
  }


  if (Array.isArray(dados?.usuarios)) {
    return dados.usuarios.some((usuario) => normalizarRole(usuario?.role || usuario?.perfil) === 'GESTOR');
  }


  return normalizarRole(dados?.role || dados?.perfil) === 'GESTOR';
};


export const marcarGestorCadastrado = () => {
  localStorage.setItem(GESTOR_CADASTRADO_KEY, 'true');
};


export const existeGestorCadastradoLocalmente = () => {
  return localStorage.getItem(GESTOR_CADASTRADO_KEY) === 'true';
};


export const verificarGestorCadastrado = async () => {
  if (existeGestorCadastradoLocalmente()) {
    return true;
  }


  try {
    const response = await api.get('/usuarios/role/GESTOR');
    const dados = extrairDados(response);
    const existeGestor = possuiGestorNaResposta(dados);


    if (existeGestor) {
      marcarGestorCadastrado();
    }


    return existeGestor;
  } catch (error) {
    const status = error?.response?.status;


    if (status === 401 || status === 403) {
      return existeGestorCadastradoLocalmente();
    }


    return false;
  }
};



