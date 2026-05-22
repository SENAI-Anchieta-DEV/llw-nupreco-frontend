import api from './api';
import { unwrapApiData } from './apiResponse';

const normalizeUsuario = (usuario) => {
  if (!usuario) return null;

  return {
    ...usuario,
    id: usuario.id,
    nome: usuario.nome ?? '',
    email: usuario.email ?? '',
    role: usuario.role ?? usuario.perfil ?? 'FUNCIONARIO',
    ativo: usuario.ativo !== false,
  };
};

const normalizeUsuarios = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeUsuario).filter(Boolean);
};

const buildUsuarioRequest = (usuario) => ({
  nome: String(usuario.nome || '').trim(),
  email: String(usuario.email || '').trim(),
  senha: usuario.senha,
});

const usuarioService = {
  async listar() {
    const response = await api.get('/usuarios');
    return normalizeUsuarios(unwrapApiData(response));
  },

  async buscarPorId(id) {
    const response = await api.get(`/usuarios/${id}`);
    return normalizeUsuario(unwrapApiData(response));
  },

  async buscarPorRole(role) {
    const response = await api.get(`/usuarios/role/${role}`);
    return normalizeUsuarios(unwrapApiData(response));
  },

  async cadastrarFuncionario(usuario) {
    const response = await api.post('/usuarios/funcionario', buildUsuarioRequest(usuario));
    return normalizeUsuario(unwrapApiData(response));
  },

  async atualizar(id, usuario) {
    const response = await api.put(`/usuarios/${id}`, buildUsuarioRequest(usuario));
    return normalizeUsuario(unwrapApiData(response));
  },

  async excluir(id) {
    await api.delete(`/usuarios/${id}`);
  },
};

export default usuarioService;
