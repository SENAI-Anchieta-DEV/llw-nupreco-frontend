const parseDateOnly = (dateValue) => {
  if (!dateValue) return null;

  if (dateValue instanceof Date) {
    return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
  }

  const value = String(dateValue).slice(0, 10);
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const getTodayDateOnly = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const isContaPaga = (conta) => {
  return conta?.status === 'PAGA' || conta?.paga === true;
};

export const isContaVencida = (conta, referenceDate = getTodayDateOnly()) => {
  if (!conta || isContaPaga(conta)) return false;

  const vencimento = parseDateOnly(conta.dataVencimento);
  if (!vencimento) return false;

  // A conta só vence às 00:00 do dia seguinte ao vencimento.
  // Ex.: vencimento 05/05/2026 permanece válida até 23:59 de 05/05/2026.
  return vencimento.getTime() < referenceDate.getTime();
};

export const isContaVenceHoje = (conta, referenceDate = getTodayDateOnly()) => {
  if (!conta || isContaPaga(conta)) return false;

  const vencimento = parseDateOnly(conta.dataVencimento);
  if (!vencimento) return false;

  return vencimento.getTime() === referenceDate.getTime();
};

export const getStatusConta = (conta, referenceDate = getTodayDateOnly()) => {
  if (isContaPaga(conta)) return 'PAGA';
  if (isContaVencida(conta, referenceDate)) return 'VENCIDA';
  return conta?.status === 'VENCIDA' ? 'VENCIDA' : 'PENDENTE';
};

export const normalizeContaComStatus = (conta, referenceDate = getTodayDateOnly()) => {
  if (!conta) return null;

  const statusCalculado = getStatusConta(conta, referenceDate);

  return {
    ...conta,
    status: statusCalculado,
    paga: statusCalculado === 'PAGA',
    vencida: statusCalculado === 'VENCIDA',
    venceHoje: isContaVenceHoje(conta, referenceDate),
  };
};

export const getContasAPagar = (contas = []) => {
  return contas.filter((conta) => !isContaPaga(conta));
};

export const getTotalAPagar = (contas = []) => {
  return getContasAPagar(contas).reduce((total, conta) => {
    return total + Number(conta?.valor || 0);
  }, 0);
};

export const getNotificacoesContas = (contas = []) => {
  return contas.filter((conta) => !isContaPaga(conta) && (conta.venceHoje || conta.status === 'VENCIDA'));
};

export const formatarMoeda = (valor) => {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatarDataBr = (dateValue) => {
  if (!dateValue) return '-';

  const date = parseDateOnly(dateValue);
  if (!date) return String(dateValue);

  return date.toLocaleDateString('pt-BR');
};
