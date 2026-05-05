import api from './api';
import { unwrapApiData } from './apiResponse';

const normalizeVenda = (venda) => {
  if (!venda) return null;

  return {
    ...venda,
    id: venda.id,
    dataVenda: venda.dataVenda,
    data: venda.dataVenda ? new Date(venda.dataVenda).toLocaleDateString('pt-BR') : '',
    hora: venda.dataVenda ? new Date(venda.dataVenda).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
    status: venda.status,
    itens: Array.isArray(venda.itens) ? venda.itens : [],
    total: Number(venda.total ?? 0),
    valorRecebido: Number(venda.valorRecebido ?? 0),
    troco: Number(venda.troco ?? 0),
  };
};

const normalizeVendas = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeVenda).filter(Boolean);
};

const vendaService = {
  async listar() {
    const response = await api.get('/vendas');
    return normalizeVendas(unwrapApiData(response));
  },

  async buscarPorId(id) {
    const response = await api.get(`/vendas/${id}`);
    return normalizeVenda(unwrapApiData(response));
  },

  async vender(venda) {
    const response = await api.post('/vendas', {
      itens: venda.itens.map((item) => ({
        produtoId: item.produtoId || item.id || item.cod,
        quantidade: Number(item.quantidade || item.qtd),
      })),
      valorRecebido: Number(venda.valorRecebido),
    });

    return normalizeVenda(unwrapApiData(response));
  },

  async cancelar(id) {
    const response = await api.patch(`/vendas/${id}/cancelar`);
    return normalizeVenda(unwrapApiData(response));
  },
};

export default vendaService;
