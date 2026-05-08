import api from './api';
import { unwrapApiData } from './apiResponse';

const normalizeItemEstoque = (item) => ({
  ...item,
  id: item.produtoId,
  produtoId: item.produtoId,
  cod: item.produtoId,
  nomeProduto: item.nomeProduto,
  desc: item.nomeProduto,
  quantidade: Number(item.quantidade ?? 0),
  qtd: Number(item.quantidade ?? 0),
});

const normalizeEstoque = (data) => {
  const itens = Array.isArray(data?.itens) ? data.itens : Array.isArray(data) ? data : [];

  return {
    id: data?.id ?? null,
    itens: itens.map(normalizeItemEstoque),
  };
};

const buildEstoqueRequest = (produtoId, quantidade) => ({
  produtoId: String(produtoId || '').trim(),
  quantidade: Number(quantidade),
});

const estoqueService = {
  async listar() {
    const response = await api.get('/estoque');
    return normalizeEstoque(unwrapApiData(response));
  },

  async listarItens() {
    const estoque = await this.listar();
    return estoque.itens;
  },

  async adicionar(produtoId, quantidade) {
    const response = await api.patch('/estoque/adicionar', buildEstoqueRequest(produtoId, quantidade));
    return normalizeItemEstoque(unwrapApiData(response));
  },

  async remover(produtoId, quantidade) {
    const response = await api.patch('/estoque/remover', buildEstoqueRequest(produtoId, quantidade));
    return normalizeItemEstoque(unwrapApiData(response));
  },
};

export default estoqueService;
