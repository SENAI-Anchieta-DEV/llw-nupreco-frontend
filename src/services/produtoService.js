import api from './api';
import { unwrapApiData } from './apiResponse';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeTipoPrecificacao = (tipo) => {
  if (tipo === 'PERCENTUAL' || tipo === 'VALOR_FIXO') return tipo;
  return 'PERCENTUAL';
};

export const calcularPrecoVenda = (produto) => {
  const custoProduto = toNumber(produto?.custoProduto ?? produto?.precoCusto ?? produto?.preco ?? 0);
  const tipoPrecificacao = normalizeTipoPrecificacao(produto?.tipoPrecificacao);
  const margemLucro = toNumber(produto?.margemLucro);
  const lucroValor = toNumber(produto?.lucroValor);

  if (tipoPrecificacao === 'PERCENTUAL') {
    return custoProduto + (custoProduto * margemLucro) / 100;
  }

  return custoProduto + lucroValor;
};

export const calcularMargemPercentual = (produto) => {
  const custoProduto = toNumber(produto?.custoProduto ?? produto?.precoCusto ?? produto?.preco ?? 0);
  const lucroValor = toNumber(produto?.lucroValor);

  if (custoProduto <= 0) return 0;
  return (lucroValor / custoProduto) * 100;
};

export const normalizeProduto = (produto) => {
  if (!produto) return null;

  const custoProduto = toNumber(produto.custoProduto ?? produto.precoCusto ?? produto.preco ?? 0);
  const tipoPrecificacao = normalizeTipoPrecificacao(produto.tipoPrecificacao);
  const margemLucro = produto.margemLucro === null || produto.margemLucro === undefined ? null : toNumber(produto.margemLucro);
  const lucroValor = produto.lucroValor === null || produto.lucroValor === undefined ? null : toNumber(produto.lucroValor);
  const precoVenda = toNumber(produto.precoVenda ?? calcularPrecoVenda({ custoProduto, tipoPrecificacao, margemLucro, lucroValor }));
  const lucroUnitario = precoVenda - custoProduto;

  return {
    ...produto,
    id: produto.id,
    cod: produto.id,
    nome: produto.nome ?? produto.desc ?? '',
    desc: produto.nome ?? produto.desc ?? '',
    custoProduto,
    tipoPrecificacao,
    margemLucro,
    lucroValor,
    precoVenda,
    preco: precoVenda,
    lucroUnitario,
    categoria: produto.categoria ?? 'GERAL',
    qtd: toNumber(produto.qtd ?? produto.quantidade ?? 0),
  };
};

const normalizeProdutos = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeProduto).filter(Boolean);
};

const buildProdutoRequest = (produto) => {
  const tipoPrecificacao = normalizeTipoPrecificacao(produto.tipoPrecificacao);
  const custoProduto = toNumber(produto.custoProduto ?? produto.precoCusto ?? produto.preco ?? 0);
  const margemLucro = tipoPrecificacao === 'PERCENTUAL'
    ? toNumber(produto.margemLucro)
    : null;
  const lucroValor = tipoPrecificacao === 'VALOR_FIXO'
    ? toNumber(produto.lucroValor)
    : null;

  return {
    id: String(produto.id || produto.cod || '').trim(),
    nome: String(produto.nome || produto.desc || '').trim(),
    custoProduto,
    tipoPrecificacao,
    margemLucro,
    lucroValor,
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
