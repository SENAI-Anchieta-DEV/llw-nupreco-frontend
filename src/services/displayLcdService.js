import api from './api';
import { unwrapApiData } from './apiResponse';
 
const normalizeDisplay = (display) => {
  if (!display) return null;
 
  return {
    id: display.id,
    codigoSerial: display.codigoSerial ?? '',
    ativo: Boolean(display.ativo),
    produtoId: display.produtoId ?? '',
  };
};
 
const normalizeDisplays = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeDisplay).filter(Boolean);
};
 
const buildDisplayRequest = (display) => ({
  codigoSerial: String(display.codigoSerial || '').trim(),
  chavePublica: String(display.chavePublica || display.codigoSerial || '').trim(),
  ativo: Boolean(display.ativo),
  produtoId: String(display.produtoId || '').trim(),
});
 
const displayLcdService = {
  async listar() {
    const response = await api.get('/displays');
    return normalizeDisplays(unwrapApiData(response));
  },
 
  async criar(display) {
    const response = await api.post('/displays', buildDisplayRequest(display));
    return normalizeDisplay(unwrapApiData(response));
  },
 
  async atualizar(id, display) {
    const response = await api.put(`/displays/${id}`, buildDisplayRequest(display));
    return normalizeDisplay(unwrapApiData(response));
  },
};
 
export default displayLcdService;
 
 