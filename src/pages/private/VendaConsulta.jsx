import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';


import vendaService from '../../services/vendaService';
import { getApiErrorMessage } from '../../services/apiResponse';


const motivosCancelamento = [
  'Cliente Desistiu Da Compra',
  'Produto Registrado Incorretamente',
  'Valor Recebido Incorreto',
  'Forma De Pagamento Informada Incorretamente',
  'Produto Sem Estoque Após Conferência',
  'Venda Registrada Em Duplicidade',
  'Erro Operacional No Atendimento',
];


const statusColors = {
  FINALIZADA: { bg: '#E8F5E9', color: '#2E7D32' },
  CANCELADA: { bg: '#FFEBEE', color: '#C62828' },
};


const getMotivoCancelamento = (venda) => {
  return venda?.motivoCancelamento || venda?.motivo || venda?.cancelamentoMotivo || '';
};


const LinhaVenda = ({ venda, onAbrirCancelamento }) => {
  const [aberta, setAberta] = useState(false);
  const statusColor = statusColors[venda.status] || statusColors.FINALIZADA;
  const motivoCancelamento = getMotivoCancelamento(venda);


  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setAberta((prev) => !prev)}>
            {aberta ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{venda.id}</TableCell>
        <TableCell>{venda.data}</TableCell>
        <TableCell>{venda.hora}</TableCell>
        <TableCell>R$ {Number(venda.total).toFixed(2)}</TableCell>
        <TableCell>R$ {Number(venda.valorRecebido).toFixed(2)}</TableCell>
        <TableCell>R$ {Number(venda.troco).toFixed(2)}</TableCell>
        <TableCell>
          <Chip label={venda.status} size="small" sx={{ bgcolor: statusColor.bg, color: statusColor.color, fontWeight: 700 }} />
        </TableCell>
        <TableCell align="right">
          {venda.status !== 'CANCELADA' ? (
            <Button
              size="small"
              color="error"
              startIcon={<CancelOutlinedIcon />}
              onClick={() => onAbrirCancelamento(venda)}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Cancelar
            </Button>
          ) : (
            <Typography variant="caption" sx={{ color: '#C62828', fontWeight: 700 }}>
              Cancelada
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} sx={{ py: 0 }}>
          <Collapse in={aberta} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: '#FAFAFA' }}>
              {venda.status === 'CANCELADA' && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: '12px',
                    border: '1px solid #FFCDD2',
                    bgcolor: '#FFF5F5',
                  }}
                >
                  <Typography sx={{ color: '#C62828', fontWeight: 800, mb: 0.5 }}>
                    Motivo Do Cancelamento
                  </Typography>
                  <Typography sx={{ color: '#555', fontWeight: 600 }}>
                    {motivoCancelamento || 'Motivo não informado.'}
                  </Typography>
                </Box>
              )}


              <Typography sx={{ color: '#128654', fontWeight: 800, mb: 1 }}>
                Itens Da Venda
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Produto</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Qtd.</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Preço Unitário</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venda.itens.map((item, index) => (
                    <TableRow key={`${venda.id}-${item.produtoId}-${index}`}>
                      <TableCell>{item.nomeProduto}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>R$ {Number(item.precoUnitario).toFixed(2)}</TableCell>
                      <TableCell>R$ {Number(item.subtotal).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};


const DialogCancelamentoVenda = ({ aberta, venda, motivoSelecionado, setMotivoSelecionado, onFechar, onConfirmar, cancelando }) => {
  useEffect(() => {
    if (!aberta) return undefined;


    const selecionarMotivoPeloTeclado = (event) => {
      const numeroDigitado = Number(event.key);


      if (numeroDigitado >= 1 && numeroDigitado <= motivosCancelamento.length) {
        setMotivoSelecionado(motivosCancelamento[numeroDigitado - 1]);
      }
    };


    window.addEventListener('keydown', selecionarMotivoPeloTeclado);


    return () => {
      window.removeEventListener('keydown', selecionarMotivoPeloTeclado);
    };
  }, [aberta, setMotivoSelecionado]);


  return (
    <Dialog open={aberta} onClose={cancelando ? undefined : onFechar} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: '#128654', fontWeight: 800 }}>
        Cancelar Venda
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Selecione o motivo do cancelamento da venda {venda?.id}. O usuário pode clicar na opção ou digitar o número correspondente.
        </Typography>


        <Stack spacing={1.2}>
          {motivosCancelamento.map((motivo, index) => {
            const selecionado = motivoSelecionado === motivo;


            return (
              <Button
                key={motivo}
                variant="outlined"
                onClick={() => setMotivoSelecionado(motivo)}
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderRadius: '12px',
                  borderColor: selecionado ? '#128654' : '#E0E0E0',
                  bgcolor: selecionado ? '#F0FFF7' : '#FFFFFF',
                  color: selecionado ? '#128654' : '#333333',
                  textTransform: 'none',
                  fontWeight: selecionado ? 800 : 600,
                  py: 1.2,
                  '&:hover': {
                    borderColor: '#128654',
                    bgcolor: '#F6FBF8',
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 28,
                    height: 28,
                    mr: 1.5,
                    borderRadius: '8px',
                    bgcolor: selecionado ? '#128654' : '#E8F5E9',
                    color: selecionado ? '#FFFFFF' : '#128654',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Box>
                {motivo}
              </Button>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onFechar} disabled={cancelando} sx={{ color: '#555', textTransform: 'none', fontWeight: 700 }}>
          Voltar
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<CancelOutlinedIcon />}
          onClick={onConfirmar}
          disabled={!motivoSelecionado || cancelando}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}
        >
          {cancelando ? 'Cancelando...' : 'Confirmar Cancelamento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const VendaConsulta = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [vendaParaCancelar, setVendaParaCancelar] = useState(null);
  const [motivoSelecionado, setMotivoSelecionado] = useState('');


  const carregarVendas = async () => {
    setCarregando(true);
    setErro('');


    try {
      const data = await vendaService.listar();
      setVendas(data);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar as vendas.'));
    } finally {
      setCarregando(false);
    }
  };


  useEffect(() => {
    carregarVendas();
  }, []);


  const abrirCancelamento = (venda) => {
    setErro('');
    setSucesso('');
    setVendaParaCancelar(venda);
    setMotivoSelecionado('');
  };


  const fecharCancelamento = () => {
    setVendaParaCancelar(null);
    setMotivoSelecionado('');
  };


  const confirmarCancelamento = async () => {
    setErro('');
    setSucesso('');


    if (!vendaParaCancelar || !motivoSelecionado) {
      setErro('Selecione um motivo para cancelar a venda.');
      return;
    }


    setCancelando(true);


    try {
      await vendaService.cancelar(vendaParaCancelar.id, motivoSelecionado);
      setSucesso(`Venda cancelada com sucesso. Motivo registrado: ${motivoSelecionado}.`);
      fecharCancelamento();
      await carregarVendas();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível cancelar a venda.'));
    } finally {
      setCancelando(false);
    }
  };


  return (
    <Box sx={{ bgcolor: '#F9F9F9', minHeight: '100%', p: { xs: 3, lg: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            VENDAS / CONSULTA
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
            Vendas
          </Typography>
        </Box>


        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarVendas}
          sx={{ borderColor: '#128654', color: '#128654', textTransform: 'none', fontWeight: 700 }}
        >
          Atualizar
        </Button>
      </Stack>


      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}


      <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
        {carregando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#128654' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '15px', border: '1px solid #EEE' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F6FBF8' }}>
                  <TableCell />
                  <TableCell sx={{ fontWeight: 800 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Hora</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Recebido</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Troco</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">Nenhuma venda encontrada.</TableCell>
                  </TableRow>
                ) : (
                  vendas.map((venda) => (
                    <LinhaVenda key={venda.id} venda={venda} onAbrirCancelamento={abrirCancelamento} />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>


      <DialogCancelamentoVenda
        aberta={Boolean(vendaParaCancelar)}
        venda={vendaParaCancelar}
        motivoSelecionado={motivoSelecionado}
        setMotivoSelecionado={setMotivoSelecionado}
        onFechar={fecharCancelamento}
        onConfirmar={confirmarCancelamento}
        cancelando={cancelando}
      />
    </Box>
  );
};


export default VendaConsulta;
