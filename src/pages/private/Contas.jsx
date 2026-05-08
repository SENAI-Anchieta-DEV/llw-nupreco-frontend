import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';

import contaService from '../../services/contaService';
import { getApiErrorMessage } from '../../services/apiResponse';
import {
  formatarDataBr,
  formatarMoeda,
  getContasAPagar,
  getTotalAPagar,
  normalizeContaComStatus,
} from '../../utils/contasStatus';

const initialForm = {
  id: null,
  nome: '',
  descricao: '',
  valor: '',
  dataVencimento: '',
};

const statusColors = {
  PENDENTE: { bg: '#FFF8E1', color: '#F57F17', label: 'Pendente' },
  PAGA: { bg: '#E8F5E9', color: '#2E7D32', label: 'Paga' },
  VENCIDA: { bg: '#FFEBEE', color: '#C62828', label: 'Vencida' },
};

const Contas = () => {
  const [contas, setContas] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filtroStatus, setFiltroStatus] = useState('TODAS');
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const contasComStatus = useMemo(() => {
    return contas.map((conta) => normalizeContaComStatus(conta)).filter(Boolean);
  }, [contas]);

  const contasFiltradas = useMemo(() => {
    if (filtroStatus === 'TODAS') return contasComStatus;
    return contasComStatus.filter((conta) => conta.status === filtroStatus);
  }, [contasComStatus, filtroStatus]);

  const contasAPagar = useMemo(() => getContasAPagar(contasComStatus), [contasComStatus]);
  const totalAPagar = useMemo(() => getTotalAPagar(contasComStatus), [contasComStatus]);

  const carregarContas = async () => {
    setCarregando(true);
    setErro('');

    try {
      const data = await contaService.listar();
      setContas(data);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar as contas.'));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarContas();
  }, []);

  const alterarCampo = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limparCampos = () => {
    setForm(initialForm);
  };

  const editarConta = (conta) => {
    setForm({
      id: conta.id,
      nome: conta.nome,
      descricao: conta.descricao,
      valor: conta.valor,
      dataVencimento: conta.dataVencimento,
    });
  };

  const salvarConta = async () => {
    setErro('');
    setSucesso('');

    if (!form.nome || !form.descricao || !form.valor || !form.dataVencimento) {
      setErro('Preencha nome, descrição, valor e data de vencimento.');
      return;
    }

    if (Number(form.valor) <= 0) {
      setErro('O valor da conta deve ser maior que zero.');
      return;
    }

    setSalvando(true);

    try {
      await contaService.salvar(form);
      setSucesso(form.id ? 'Conta atualizada com sucesso.' : 'Conta cadastrada com sucesso.');
      limparCampos();
      await carregarContas();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível salvar a conta.'));
    } finally {
      setSalvando(false);
    }
  };

  const alterarStatus = async (conta, status) => {
    setErro('');
    setSucesso('');

    try {
      await contaService.atualizarStatus(conta.id, status);
      setSucesso(status === 'PAGA' ? 'Conta marcada como paga.' : 'Conta reaberta como pendente.');
      await carregarContas();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível alterar o status da conta.'));
    }
  };

  const alternarContaPaga = async (conta) => {
    await alterarStatus(conta, conta.status === 'PAGA' ? 'PENDENTE' : 'PAGA');
  };

  const excluirConta = async (conta) => {
    setErro('');
    setSucesso('');

    try {
      await contaService.excluir(conta.id);
      setSucesso('Conta excluída com sucesso.');
      await carregarContas();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível excluir a conta.'));
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9F9F9', minHeight: '100%', p: { xs: 3, lg: 4 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            FINANCEIRO / CONTAS
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
            Contas
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarContas}
          sx={{ borderColor: '#128654', color: '#128654', textTransform: 'none', fontWeight: 700 }}
        >
          Atualizar
        </Button>
      </Stack>

      <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0', mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
          <Box>
            <Typography sx={{ color: '#128654', fontWeight: 800 }}>
              Total A Pagar
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Soma das contas pendentes e vencidas. Contas marcadas como pagas são removidas deste total.
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
              {formatarMoeda(totalAPagar)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {contasAPagar.length} conta(s) em aberto
            </Typography>
          </Box>
        </Stack>
      </Card>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <AddCircleOutlineIcon sx={{ color: '#128654' }} />
              <Typography sx={{ color: '#128654', fontWeight: 800 }}>
                {form.id ? 'Editar Conta' : 'Nova Conta'}
              </Typography>
            </Stack>

            <Stack spacing={2}>
              <TextField label="Nome" name="nome" value={form.nome} onChange={alterarCampo} fullWidth />
              <TextField label="Descrição" name="descricao" value={form.descricao} onChange={alterarCampo} fullWidth />
              <TextField label="Valor" name="valor" type="number" value={form.valor} onChange={alterarCampo} fullWidth />
              <TextField
                label="Data De Vencimento"
                name="dataVencimento"
                type="date"
                value={form.dataVencimento}
                onChange={alterarCampo}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                A conta permanece válida durante todo o dia do vencimento e só passa a vencida às 00:00 do dia seguinte.
              </Typography>

              <Button
                variant="contained"
                disabled={salvando}
                startIcon={<SaveIcon />}
                onClick={salvarConta}
                sx={{ bgcolor: '#128654', py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
              >
                {salvando ? 'Salvando...' : 'Salvar Conta'}
              </Button>

              {form.id && (
                <Button onClick={limparCampos} sx={{ color: '#128654', textTransform: 'none', fontWeight: 700 }}>
                  Nova Conta
                </Button>
              )}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
              <Typography sx={{ color: '#128654', fontWeight: 800 }}>
                Contas Cadastradas
              </Typography>

              <TextField select size="small" label="Status" value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="TODAS">Todas</MenuItem>
                <MenuItem value="PENDENTE">Pendente</MenuItem>
                <MenuItem value="PAGA">Paga</MenuItem>
                <MenuItem value="VENCIDA">Vencida</MenuItem>
              </TextField>
            </Stack>

            {carregando ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#128654' }} />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '15px', border: '1px solid #EEE', overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F6FBF8' }}>
                      <TableCell sx={{ fontWeight: 800 }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Vencimento</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Valor</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Pagamento</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contasFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">Nenhuma conta encontrada.</TableCell>
                      </TableRow>
                    ) : (
                      contasFiltradas.map((conta) => {
                        const statusColor = statusColors[conta.status] || statusColors.PENDENTE;

                        return (
                          <TableRow key={conta.id} hover>
                            <TableCell>{conta.nome}</TableCell>
                            <TableCell>{formatarDataBr(conta.dataVencimento)}</TableCell>
                            <TableCell>{formatarMoeda(conta.valor)}</TableCell>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Chip label={statusColor.label} size="small" sx={{ bgcolor: statusColor.bg, color: statusColor.color, fontWeight: 700, width: 'fit-content' }} />
                                {conta.venceHoje && conta.status !== 'PAGA' && (
                                  <Typography variant="caption" sx={{ color: '#F57F17', fontWeight: 700 }}>
                                    Válida até hoje
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={conta.status === 'PAGA'}
                                    onChange={() => alternarContaPaga(conta)}
                                    sx={{ color: '#128654', '&.Mui-checked': { color: '#128654' } }}
                                  />
                                }
                                label="Paga"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Button size="small" startIcon={<EditIcon />} onClick={() => editarConta(conta)} sx={{ color: '#128654', textTransform: 'none', fontWeight: 700 }}>
                                Editar
                              </Button>
                              <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => excluirConta(conta)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                                Excluir
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contas;
