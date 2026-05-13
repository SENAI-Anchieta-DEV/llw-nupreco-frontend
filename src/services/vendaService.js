import api from './api';
import { unwrapApiData } from './apiResponse';


const MOTIVOS_CANCELAMENTO_STORAGE_KEY = 'nupreco_motivos_cancelamento_vendas';


const getMotivosCancelamentoRegistrados = () => {
  try {
    const motivosSalvos = localStorage.getItem(MOTIVOS_CANCELAMENTO_STORAGE_KEY);
    return motivosSalvos ? JSON.parse(motivosSalvos) : {};
  } catch (error) {
    return {};
  }
};


const registrarMotivoCancelamentoLocalmente = (id, motivoCancelamento) => {
  if (!id || !motivoCancelamento) return;


  try {
    const motivosRegistrados = getMotivosCancelamentoRegistrados();
    localStorage.setItem(
      MOTIVOS_CANCELAMENTO_STORAGE_KEY,
      JSON.stringify({
        ...motivosRegistrados,
        [id]: motivoCancelamento,
      })
    );
  } catch (error) {
    // Mantém o fluxo de cancelamento funcionando mesmo se o navegador bloquear o armazenamento local.
  }
};


const normalizeVenda = (venda) => {
  if (!venda) return null;


  const motivosRegistrados = getMotivosCancelamentoRegistrados();


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
    motivoCancelamento: venda.motivoCancelamento || venda.motivo || venda.cancelamentoMotivo || motivosRegistrados[venda.id] || '',
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
        produtoId: String(item.produtoId || item.id || item.cod || '').trim(),
        quantidade: Number(item.quantidade || item.qtd),
      })),
      valorRecebido: Number(venda.valorRecebido),
    });


    return normalizeVenda(unwrapApiData(response));
  },


  async cancelar(id, motivoCancelamento) {
    const payload = motivoCancelamento ? { motivoCancelamento } : undefined;
    const response = await api.patch(`/vendas/${id}/cancelar`, payload);
    registrarMotivoCancelamentoLocalmente(id, motivoCancelamento);
    return normalizeVenda(unwrapApiData(response));
  },
};


export default vendaService;


