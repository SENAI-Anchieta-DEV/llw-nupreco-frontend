import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/EditOutlined';
import ListAltIcon from '@mui/icons-material/ListAltOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Contas = ({
  aoSalvarConta,
  aoExcluirConta,
  contasCadastradas = [],
  aoNotificar
}) => {
  const theme = useTheme();

  const [modoLista, setModoLista] = useState(false);
  const [acaoLista, setAcaoLista] = useState('');

  const [idInterno, setIdInterno] = useState(null);
  const [fornecedor, setFornecedor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [valor, setValor] = useState('');

  const calcularStatus = (boleto) => {
    if (boleto.paga) return { label: 'PAGA', color: 'success' };

    const hoje = new Date().toISOString().split('T')[0];

    if (boleto.dataVencimento < hoje) {
      return { label: 'ATRASADA', color: 'error' };
    }

    return { label: 'PENDENTE', color: 'warning' };
  };

  const darBaixa = (boleto) => {
    const atualizado = { ...boleto, paga: !boleto.paga };
    aoSalvarConta?.(atualizado);
    aoNotificar?.(
      atualizado.paga ? 'Baixa efetuada com sucesso!' : 'Pagamento estornado.',
      'info'
    );
  };

  const prepararLista = (acao) => {
    setAcaoLista(acao);
    setModoLista(true);
  };

  const salvarOuRessalvar = () => {
    if (!fornecedor || !dataVencimento || !valor) {
      aoNotificar?.('Preencha fornecedor, vencimento e valor!', 'warning');
      return;
    }

    const payload = {
      id: idInterno || Date.now().toString(),
      fornecedor: fornecedor.toUpperCase(),
      dataVencimento,
      valor: parseFloat(valor).toFixed(2),
      paga: idInterno
        ? contasCadastradas.find((c) => c.id === idInterno)?.paga ?? false
        : false
    };

    aoSalvarConta?.(payload);
    limparCampos();
  };

  const limparCampos = () => {
    setIdInterno(null);
    setFornecedor('');
    setValor('');
    setDataVencimento('');
    setModoLista(false);
    setAcaoLista('');
  };

  const ActionCard = ({ label, icon }) => (
    <Card
      sx={{
        p: 2,
        borderRadius: '25px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0px 10px 20px rgba(0,0,0,0.35)'
              : '0px 10px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}
      >
        {label}
      </Typography>
      {icon}
    </Card>
  );

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', fontWeight: 'bold' }}
      >
        GESTÃO FINANCEIRA / CONTAS
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3} onClick={limparCampos}>
          <ActionCard
            label="NOVA CONTA"
            icon={<AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '3rem' }} />}
          />
        </Grid>

        <Grid item xs={12} md={3} onClick={() => prepararLista('EXCLUIR')}>
          <ActionCard
            label="EXCLUIR CONTA"
            icon={<HighlightOffIcon sx={{ color: '#C62828', fontSize: '3rem' }} />}
          />
        </Grid>

        <Grid item xs={12} md={3} onClick={() => prepararLista('EDITAR')}>
          <ActionCard
            label="ALTERAR DADOS"
            icon={<EditIcon sx={{ color: '#FBC02D', fontSize: '3rem' }} />}
          />
        </Grid>

        <Grid item xs={12} md={3} onClick={() => prepararLista('CONSULTAR')}>
          <ActionCard
            label="CONSULTAR / BAIXA"
            icon={<ListAltIcon sx={{ color: '#1976D2', fontSize: '3rem' }} />}
          />
        </Grid>
      </Grid>

      {modoLista ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '25px',
            maxHeight: '60vh',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'background.paper' }}>
                  <strong>Fornecedor</strong>
                </TableCell>
                <TableCell sx={{ bgcolor: 'background.paper' }}>
                  <strong>Vencimento</strong>
                </TableCell>
                <TableCell sx={{ bgcolor: 'background.paper' }}>
                  <strong>Valor</strong>
                </TableCell>
                <TableCell sx={{ bgcolor: 'background.paper' }}>
                  <strong>Status</strong>
                </TableCell>
                <TableCell sx={{ bgcolor: 'background.paper' }} align="center">
                  <strong>Ação</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {contasCadastradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhuma conta cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                contasCadastradas.map((b) => {
                  const status = calcularStatus(b);

                  return (
                    <TableRow key={b.id}>
                      <TableCell>{b.fornecedor}</TableCell>
                      <TableCell>{b.dataVencimento}</TableCell>
                      <TableCell>R$ {b.valor}</TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        {acaoLista === 'CONSULTAR' ? (
                          <Button
                            startIcon={<CheckCircleIcon />}
                            onClick={() => darBaixa(b)}
                            color={b.paga ? 'inherit' : 'success'}
                            sx={{ textTransform: 'none' }}
                          >
                            {b.paga ? 'Estornar' : 'Baixar'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              if (acaoLista === 'EXCLUIR') {
                                aoExcluirConta?.(b.id);
                              } else {
                                setIdInterno(b.id);
                                setFornecedor(b.fornecedor);
                                setValor(b.valor);
                                setDataVencimento(b.dataVencimento);
                                setModoLista(false);
                              }
                            }}
                            sx={{
                              color: acaoLista === 'EXCLUIR' ? '#D32F2F' : '#ED6C02',
                              fontWeight: 'bold'
                            }}
                          >
                            {acaoLista === 'EXCLUIR' ? 'REMOVER' : 'EDITAR'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: '25px',
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0px 4px 20px rgba(0,0,0,0.35)'
                : '0px 4px 20px rgba(0,0,0,0.05)',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, color: '#128654', fontWeight: 'bold' }}
          >
            {idInterno ? `Editando Conta: ${idInterno}` : 'Cadastrar Novo Boleto/Conta'}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="FORNECEDOR"
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value.toUpperCase())}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="VALOR (R$)"
                value={valor}
                type="number"
                onChange={(e) => setValor(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="VENCIMENTO"
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            {idInterno && (
              <Button onClick={limparCampos} sx={{ color: 'text.secondary' }}>
                Cancelar
              </Button>
            )}

            <Button
              variant="contained"
              onClick={salvarOuRessalvar}
              startIcon={<SaveIcon />}
              sx={{
                bgcolor: '#128654',
                borderRadius: '25px',
                px: 6,
                '&:hover': { bgcolor: '#0e6b43' }
              }}
            >
              {idInterno ? 'RESSALVAR ALTERAÇÕES' : 'SALVAR CONTA'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Contas;