import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
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

const statusColors = {
  FINALIZADA: { bg: '#E8F5E9', color: '#2E7D32' },
  CANCELADA: { bg: '#FFEBEE', color: '#C62828' },
};

const LinhaVenda = ({ venda, onCancelar }) => {
  const [aberta, setAberta] = useState(false);
  const statusColor = statusColors[venda.status] || statusColors.FINALIZADA;

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
          {venda.status !== 'CANCELADA' && (
            <Button
              size="small"
              color="error"
              startIcon={<CancelOutlinedIcon />}
              onClick={() => onCancelar(venda)}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Cancelar
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} sx={{ py: 0 }}>
          <Collapse in={aberta} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: '#FAFAFA' }}>
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

const VendaConsulta = () => {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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

  const cancelarVenda = async (venda) => {
    setErro('');
    setSucesso('');

    try {
      await vendaService.cancelar(venda.id);
      setSucesso('Venda cancelada com sucesso.');
      await carregarVendas();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível cancelar a venda.'));
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
                    <LinhaVenda key={venda.id} venda={venda} onCancelar={cancelarVenda} />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default VendaConsulta;
