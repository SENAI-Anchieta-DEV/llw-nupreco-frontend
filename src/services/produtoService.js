import api from './api';
import { unwrapApiData } from './apiResponse';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeProduto = (produto) => {
  if (!produto) return null;

  const precoVenda = produto.precoVenda ?? produto.preco ?? produto.valorVenda ?? produto.custoProduto ?? 0;

  return {
    ...produto,
    id: produto.id,
    cod: produto.id,
    desc: produto.nome ?? produto.desc ?? '',
    nome: produto.nome ?? produto.desc ?? '',
    categoria: produto.categoria ?? 'GERAL',
    custoProduto: toNumber(produto.custoProduto),
    precoVenda: toNumber(precoVenda),
    preco: toNumber(precoVenda),
    qtd: toNumber(produto.qtd ?? produto.quantidade ?? 0),
  };
};

const normalizeProdutos = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeProduto).filter(Boolean);
};

const buildProdutoRequest = (produto) => {
  const id = String(produto.cod || produto.id || '').trim();
  const nome = String(produto.desc || produto.nome || '').trim().toUpperCase();
  const preco = toNumber(produto.precoVenda ?? produto.preco ?? produto.custoProduto);

  return {
    id,
    nome,
    custoProduto: preco,
    tipoPrecificacao: produto.tipoPrecificacao || 'VALOR_FIXO',
    margemLucro: produto.tipoPrecificacao === 'PERCENTUAL' ? toNumber(produto.margemLucro) : null,
    lucroValor: produto.tipoPrecificacao === 'PERCENTUAL' ? null : toNumber(produto.lucroValor ?? 0),
  };
};

const produtoService = {
  async listar() {
    const response = await api.get('/produtos');
    return normalizeProdutos(unwrapApiData(response));
  },

  async buscarPorId(id) {
    const response = await api.get(`/produtos/${id}`);
    return normalizeProduto(unwrapApiData(response));
  },

  async buscarPorNome(nome) {
    const response = await api.get('/produtos/buscar', { params: { nome } });
    return normalizeProdutos(unwrapApiData(response));
  },

  async criar(produto) {
    const response = await api.post('/produtos', buildProdutoRequest(produto));
    return normalizeProduto(unwrapApiData(response));
  },

  async atualizar(id, produto) {
    const response = await api.put(`/produtos/${id}`, buildProdutoRequest({ ...produto, id }));
    return normalizeProduto(unwrapApiData(response));
  },

  async salvar(produto) {
    if (produto.idInterno || produto.id) {
      return this.atualizar(produto.idInterno || produto.id, produto);
    }

    return this.criar(produto);
  },

  async excluir(id) {
    await api.delete(`/produtos/${id}`);
  },
};

export default produtoService;
