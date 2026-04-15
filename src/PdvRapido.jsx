import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CssBaseline,
  Grid,
  TextField,
  Button,
  Modal,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  useTheme
} from '@mui/material';

import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ReportProblemIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/AllInbox';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';

import SidebarMenu from './components/SidebarMenu';

const PdvRapido = ({
  onBack,
  onLogout,
  onRegistrarVenda,
  nomeVendedor,
  estoque = [],
  carregando,
  aoNotificar,
  aoIrVendas,
  aoIrUsuarios,
  aoIrProdutos,
  aoIrEstoque,
  aoIrContas
}) => {
  const theme = useTheme();

  const modulos = [
    { text: 'Início', icon: <HomeIcon />, action: onBack },
    { text: 'Usuário', icon: <PersonIcon />, action: aoIrUsuarios },
    { text: 'Vendas', icon: <AssessmentIcon />, action: aoIrVendas },
    { text: 'Pdv Rápido', icon: <StorefrontIcon /> },
    { text: 'Contas', icon: <ReportProblemIcon />, action: aoIrContas },
    { text: 'Estoque', icon: <InventoryIcon />, action: aoIrEstoque },
    { text: 'Produtos', icon: <CategoryIcon />, action: aoIrProdutos },
    { text: 'Sair', icon: <LogoutIcon />, action: onLogout }
  ];

  const [vendaAtiva, setVendaAtiva] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]);
  const [valorPago, setValorPago] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO');

  const adicionarItem = useCallback(() => {
    const encontrado = estoque.find((p) => p.cod === codigo);

    if (!encontrado) {
      aoNotificar?.("Produto não encontrado no sistema!", "error");
      return;
    }

    const qtdSolicitada = parseInt(quantidade, 10);
    const itemNoCarrinho = carrinho.find((item) => item.cod === codigo);
    const qtdJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

    if (Number.isNaN(qtdSolicitada) || qtdSolicitada <= 0) {
      aoNotificar?.("A quantidade deve ser maior que zero!", "warning");
      return;
    }

    if (Number(encontrado.qtd) < qtdSolicitada + qtdJaNoCarrinho) {
      aoNotificar?.(
        `Estoque insuficiente! Você só possui ${encontrado.qtd} unidades de ${encontrado.desc}`,
        'warning'
      );
      return;
    }

    const novoItem = {
      id: Date.now(),
      cod: encontrado.cod,
      desc: encontrado.desc,
      precoUnitario: Number(encontrado.preco),
      qtd: qtdSolicitada,
      subtotal: Number(encontrado.preco) * qtdSolicitada
    };

    setCarrinho((prev) => [...prev, novoItem]);
    setCodigo('');
    setQuantidade(1);
    aoNotificar?.(`${encontrado.desc} adicionado!`, 'success');
  }, [codigo, quantidade, estoque, carrinho, aoNotificar]);

  const removerItem = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F3' && vendaAtiva) {
        e.preventDefault();
        setOpenModal(true);
      }

      if (e.key === 'Enter' && codigo && vendaAtiva) {
        adicionarItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vendaAtiva, codigo, adicionarItem]);

  const totalVenda = carrinho.reduce((acc, item) => acc + item.subtotal, 0);
  const valorPagoNumero = Number(valorPago) || 0;
  const troco = valorPagoNumero > totalVenda ? valorPagoNumero - totalVenda : 0;

  const limparVenda = () => {
    setVendaAtiva(false);
    setCarrinho([]);
    setCodigo('');
    setQuantidade(1);
    setValorPago('');
    setFormaPagamento('DINHEIRO');
  };

  const finalizarOperacao = (status) => {
    if (status === 'CANCELADA') {
      if (carrinho.length > 0) {
        limparVenda();
        aoNotificar?.('Venda cancelada com sucesso.', 'info');
      } else {
        setVendaAtiva(false);
      }
      return;
    }

    if (carrinho.length === 0) {
      aoNotificar?.('Adicione pelo menos um item para concluir a venda.', 'warning');
      return;
    }

    onRegistrarVenda?.({
      data: new Date().toLocaleDateString('pt-BR'),
      vendedor: nomeVendedor || 'SISTEMA',
      itens: carrinho,
      total: totalVenda,
      pagamento: formaPagamento,
      valorPago: valorPagoNumero,
      troco,
      status
    });

    limparVenda();
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      <SidebarMenu modulos={modulos} />

      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>
              PDV RÁPIDO
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              VENDEDOR: {nomeVendedor?.toUpperCase() || 'GESTOR'}
            </Typography>
          </Box>
          <ShoppingCartIcon sx={{ fontSize: '3rem', color: theme.palette.mode === 'dark' ? '#3A3A3A' : '#EEE' }} />
        </Stack>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Card
            onClick={() => {
              setVendaAtiva(true);
              setCarrinho([]);
              setValorPago('');
              setFormaPagamento('DINHEIRO');
            }}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              border: vendaAtiva ? '2px solid #128654' : `1px solid ${theme.palette.divider}`,
              transition: '0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>
              NOVA VENDA (F2)
            </Typography>
            <AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '2.5rem' }} />
          </Card>

          <Card
            onClick={() => finalizarOperacao('CANCELADA')}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#2A1F1F' : '#FFF5F5' }
            }}
          >
            <Typography sx={{ color: '#C62828', fontWeight: 'bold' }}>
              CANCELAR VENDA
            </Typography>
            <HighlightOffIcon sx={{ color: '#C62828', fontSize: '2.5rem' }} />
          </Card>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{
            opacity: vendaAtiva ? 1 : 0.4,
            pointerEvents: vendaAtiva ? 'auto' : 'none',
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: '25px',
            boxShadow: theme.palette.mode === 'dark'
              ? '0px 4px 20px rgba(0,0,0,0.35)'
              : '0px 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Grid item xs={12} md={2}>
            <TextField
              label="QTD"
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="CÓDIGO DE BARRAS / EAN"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              fullWidth
              placeholder="Bipe o produto..."
              autoFocus={vendaAtiva}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary' }}>
              DICA: Digite o código e aperte <strong>ENTER</strong>.
              <br />
              Use <strong>F3</strong> para buscar no estoque.
            </Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={adicionarItem}
              fullWidth
              sx={{
                borderRadius: '15px',
                height: '55px',
                bgcolor: '#128654',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#0e6b43' }
              }}
            >
              INCLUIR
            </Button>
          </Grid>
        </Grid>

        <TableContainer
          component={Paper}
          sx={{
            flexGrow: 1,
            borderRadius: '25px',
            boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`,
            overflowY: 'auto'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['#', 'DESCRIÇÃO', 'QTD', 'UNITÁRIO', 'SUBTOTAL', 'REMOVER'].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      bgcolor: 'background.paper',
                      color: head === 'SUBTOTAL' ? '#128654' : 'text.primary',
                      fontWeight: 'bold'
                    }}
                    align={
                      head === 'QTD' || head === 'REMOVER'
                        ? 'center'
                        : head === 'UNITÁRIO' || head === 'SUBTOTAL'
                        ? 'right'
                        : 'left'
                    }
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {carrinho.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{item.desc}</TableCell>
                  <TableCell align="center">{item.qtd}</TableCell>
                  <TableCell align="right">R$ {Number(item.precoUnitario).toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ color: '#128654', fontWeight: 'bold' }}>
                    R$ {Number(item.subtotal).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Button onClick={() => removerItem(item.id)} sx={{ minWidth: 'auto', color: '#C62828' }}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {carrinho.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary', fontStyle: 'italic' }}>
                    Nenhum produto no carrinho. Inicie uma venda!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: '30px',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark'
              ? '0px -5px 20px rgba(0,0,0,0.25)'
              : '0px -5px 20px rgba(0,0,0,0.02)'
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={3}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#128654', letterSpacing: 1 }}>
                TOTAL DA COMPRA
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#128654' }}>
                R$ {totalVenda.toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="VALOR RECEBIDO"
                type="number"
                value={valorPago}
                onChange={(e) => setValorPago(e.target.value)}
                fullWidth
                placeholder="R$ 0,00"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                select
                label="FORMA DE PAGAMENTO"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                fullWidth
              >
                <MenuItem value="DINHEIRO">DINHEIRO</MenuItem>
                <MenuItem value="CARTÃO">CARTÃO DE CRÉDITO/DÉBITO</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#C62828' }}>
                TROCO A DEVOLVER
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: troco > 0 ? '#C62828' : 'text.primary' }}>
                R$ {troco.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            disabled={!vendaAtiva || carrinho.length === 0 || carregando}
            onClick={() => finalizarOperacao('CONCLUIDA')}
            sx={{
              bgcolor: '#128654',
              borderRadius: '20px',
              mt: 3,
              py: 2,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0px 4px 15px rgba(18, 134, 84, 0.3)',
              '&:hover': { bgcolor: '#0e6b43' }
            }}
          >
            {carregando ? 'FINALIZANDO...' : `CONCLUIR VENDA - R$ ${totalVenda.toFixed(2)}`}
          </Button>
        </Box>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            maxWidth: '92vw',
            bgcolor: 'background.paper',
            borderRadius: '30px',
            p: 4,
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: 24,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" sx={{ color: '#128654', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
            PESQUISAR NO ESTOQUE
          </Typography>

          {estoque.length === 0 ? (
            <Typography align="center" sx={{ color: 'text.secondary' }}>
              Nenhum produto cadastrado.
            </Typography>
          ) : (
            estoque.map((p) => (
              <Box
                key={p.cod}
                onClick={() => {
                  setCodigo(p.cod);
                  setOpenModal(false);
                }}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: '15px',
                  border: `1px solid ${theme.palette.divider}`,
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? '#23352D' : '#F1F8F5',
                    borderColor: '#128654'
                  },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>{p.desc}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    CÓD: {p.cod} | ESTOQUE: {p.qtd}
                  </Typography>
                </Box>

                <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>
                  R$ {Number(p.preco).toFixed(2)}
                </Typography>
              </Box>
            ))
          )}

          <Button onClick={() => setOpenModal(false)} fullWidth sx={{ mt: 2, color: 'text.secondary' }}>
            Fechar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PdvRapido;