import api from './api';
import { unwrapApiData } from './apiResponse';
import { normalizeContaComStatus } from '../utils/contasStatus';

const normalizeConta = (conta) => {
  if (!conta) return null;

  const contaNormalizada = {
    ...conta,
    id: conta.id,
    fornecedor: conta.nome ?? conta.fornecedor ?? '',
    nome: conta.nome ?? conta.fornecedor ?? '',
    descricao: conta.descricao ?? conta.nome ?? conta.fornecedor ?? '',
    valor: Number(conta.valor ?? 0),
    dataVencimento: conta.dataVencimento ?? '',
    status: conta.status ?? (conta.paga ? 'PAGA' : 'PENDENTE'),
    paga: conta.status === 'PAGA' || conta.paga === true,
  };

  return normalizeContaComStatus(contaNormalizada);
};

const normalizeContas = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeConta).filter(Boolean);
};

const buildContaRequest = (conta) => ({
  nome: String(conta.nome || conta.fornecedor || '').trim(),
  descricao: String(conta.descricao || conta.nome || conta.fornecedor || '').trim(),
  valor: Number(conta.valor),
  dataVencimento: conta.dataVencimento,
});

const contaService = {
  async listar() {
    const response = await api.get('/contas');
    return normalizeContas(unwrapApiData(response));
  },

  async buscarPorId(id) {
    const response = await api.get(`/contas/${id}`);
    return normalizeConta(unwrapApiData(response));
  },

  async buscarPorStatus(status) {
    const response = await api.get(`/contas/status/${status}`);
    return normalizeContas(unwrapApiData(response));
  },

  async criar(conta) {
    const response = await api.post('/contas', buildContaRequest(conta));
    return normalizeConta(unwrapApiData(response));
  },

  async atualizar(id, conta) {
    const response = await api.put(`/contas/${id}`, buildContaRequest(conta));
    return normalizeConta(unwrapApiData(response));
  },

  async salvar(conta) {
    if (conta.id) {
      return this.atualizar(conta.id, conta);
    }

    return this.criar(conta);
  },

  async atualizarStatus(id, status) {
    const response = await api.patch(`/contas/${id}/status`, null, {
      params: { novoStatus: status },
    });
    return normalizeConta(unwrapApiData(response));
  },

  async marcarComoPaga(id) {
    return this.atualizarStatus(id, 'PAGA');
  },

  async reabrirConta(id) {
    return this.atualizarStatus(id, 'PENDENTE');
  },

  async excluir(id) {
    await api.delete(`/contas/${id}`);
  },
};

export default contaService;
