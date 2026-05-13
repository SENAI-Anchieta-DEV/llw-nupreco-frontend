import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  CssBaseline,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Snackbar,
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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';


import useAuth from '../../hooks/useAuth';
import produtoService from '../../services/produtoService';
import estoqueService from '../../services/estoqueService';
import vendaService from '../../services/vendaService';
import { getApiErrorMessage } from '../../services/apiResponse';


const normalizarTexto = (valor) => String(valor ?? '').trim().toLowerCase();


const obterCodigoProduto = (produto) => String(produto?.cod ?? produto?.id ?? produto?.produtoId ?? '').trim();


const obterNomeProduto = (produto) => produto?.desc ?? produto?.nome ?? produto?.nomeProduto ?? 'Produto Sem Nome';


const obterPrecoProduto = (produto) => Number(produto?.preco ?? produto?.precoVenda ?? produto?.valorVenda ?? produto?.custoProduto ?? 0);


const campoPadrao = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '11px',
    height: 48,
    bgcolor: 'white',
    fontSize: '0.9rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#9FA6AD',
  },
};


const PdvRapido = () => {
  const { user } = useAuth();


  const [vendaAtiva, setVendaAtiva] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]);
  const [valorPago, setValorPago] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO');
  const [produtos, setProdutos] = useState([]);
  const [itensEstoque, setItensEstoque] = useState([]);
  const [buscaModal, setBuscaModal] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState({ aberta: false, texto: '', tipo: 'info' });


  const nomeVendedor = user?.nome ?? user?.name ?? user?.usuario ?? 'Vendedor';


  const abrirMensagem = (texto, tipo = 'info') => {
    setMensagem({ aberta: true, texto, tipo });
  };


  const fecharMensagem = () => {
    setMensagem((prev) => ({ ...prev, aberta: false }));
  };


  const estoque = useMemo(() => {
    return produtos.map((produto) => {
      const codigoProduto = obterCodigoProduto(produto);
      const itemEstoque = itensEstoque.find((item) => {
        const codigoEstoque = String(item?.produtoId ?? item?.cod ?? item?.id ?? '').trim();
        return codigoEstoque === codigoProduto;
      });


      return {
        ...produto,
        cod: codigoProduto,
        desc: obterNomeProduto(produto),
        preco: obterPrecoProduto(produto),
        qtd: Number(itemEstoque?.quantidade ?? itemEstoque?.qtd ?? produto?.qtd ?? produto?.quantidade ?? 0),
      };
    });
  }, [produtos, itensEstoque]);


  const produtosFiltradosModal = useMemo(() => {
    const termo = normalizarTexto(buscaModal);


    const produtosFiltrados = termo
      ? estoque.filter((produto) => {
          const codigoProduto = normalizarTexto(produto.cod);
          const nomeProduto = normalizarTexto(produto.desc);
          return codigoProduto.includes(termo) || nomeProduto.includes(termo);
        })
      : estoque;


    return [...produtosFiltrados].sort((produtoA, produtoB) =>
      String(produtoA.desc ?? '').localeCompare(String(produtoB.desc ?? ''), 'pt-BR', {
        sensitivity: 'base',
        numeric: true,
      })
    );
  }, [buscaModal, estoque]);


  const carregarDados = useCallback(async () => {
    setCarregando(true);


    try {
      const [produtosApi, estoqueApi] = await Promise.all([
        produtoService.listar(),
        estoqueService.listarItens(),
      ]);


      setProdutos(produtosApi);
      setItensEstoque(estoqueApi);
    } catch (error) {
      abrirMensagem(getApiErrorMessage(error, 'Não foi possível carregar os produtos para o PDV.'), 'error');
    } finally {
      setCarregando(false);
    }
  }, []);


  useEffect(() => {
    carregarDados();
  }, [carregarDados]);


  const iniciarNovaVenda = useCallback(() => {
    setVendaAtiva(true);
    setCarrinho([]);
    setCodigo('');
    setQuantidade(1);
    setValorPago('');
  }, []);


  const adicionarItem = useCallback(() => {
    const codigoDigitado = String(codigo || '').trim();


    if (!codigoDigitado) {
      abrirMensagem('Informe o código do produto.', 'warning');
      return;
    }


    const encontrado = estoque.find((p) => String(p.cod).trim() === codigoDigitado);


    if (!encontrado) {
      abrirMensagem('Produto não encontrado! A venda atual foi mantida.', 'error');
      return;
    }


    const qtdSolicitada = parseInt(quantidade, 10);


    if (!Number.isFinite(qtdSolicitada) || qtdSolicitada <= 0) {
      abrirMensagem('A quantidade deve ser maior que zero.', 'warning');
      return;
    }


    const qtdJaNoCarrinho = carrinho
      .filter((item) => item.cod === encontrado.cod)
      .reduce((soma, item) => soma + Number(item.qtd), 0);


    if (Number(encontrado.qtd) < qtdSolicitada + qtdJaNoCarrinho) {
      abrirMensagem(`Estoque insuficiente. Disponível: ${Number(encontrado.qtd)} unidade(s) de ${encontrado.desc}.`, 'warning');
      return;
    }


    const precoUnitario = Number(encontrado.preco || 0);
    const novoItem = {
      id: `${encontrado.cod}-${Date.now()}`,
      produtoId: encontrado.id ?? encontrado.cod,
      cod: encontrado.cod,
      desc: encontrado.desc,
      nomeProduto: encontrado.desc,
      precoUnitario,
      qtd: qtdSolicitada,
      quantidade: qtdSolicitada,
      subtotal: precoUnitario * qtdSolicitada,
    };


    setCarrinho((prev) => [...prev, novoItem]);
    setCodigo('');
    setQuantidade(1);
    abrirMensagem(`${encontrado.desc} adicionado à venda.`, 'success');
  }, [codigo, quantidade, estoque, carrinho]);


  const removerItem = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };


  const abrirModalBusca = useCallback(() => {
    if (!vendaAtiva) return;
    setBuscaModal('');
    setOpenModal(true);
  }, [vendaAtiva]);


  const selecionarProdutoModal = (produto) => {
    setCodigo(produto.cod);
    setOpenModal(false);
  };


  const buscarProdutoModalPorCodigo = () => {
    const codigoBusca = String(buscaModal || '').trim();


    if (!codigoBusca) {
      abrirMensagem('Digite o código do produto para pesquisar.', 'warning');
      return;
    }


    const encontrado = estoque.find((produto) => String(produto.cod).trim() === codigoBusca);


    if (!encontrado) {
      abrirMensagem('Produto não encontrado! A venda atual foi mantida.', 'error');
      return;
    }


    selecionarProdutoModal(encontrado);
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        iniciarNovaVenda();
      }


      if (e.key === 'F3' && vendaAtiva) {
        e.preventDefault();
        abrirModalBusca();
      }


      if (e.key === 'Enter' && codigo && vendaAtiva && !openModal) {
        e.preventDefault();
        adicionarItem();
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vendaAtiva, codigo, adicionarItem, abrirModalBusca, openModal, iniciarNovaVenda]);


  const totalVenda = carrinho.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const troco = Number(valorPago) > totalVenda ? Number(valorPago) - totalVenda : 0;


  const finalizarOperacao = async (status) => {
    if (status === 'CANCELADA') {
      setVendaAtiva(false);
      setCarrinho([]);
      setCodigo('');
      setQuantidade(1);
      setValorPago('');
      abrirMensagem('Venda cancelada com sucesso.', 'info');
      return;
    }


    if (carrinho.length === 0) {
      abrirMensagem('Adicione pelo menos um produto antes de finalizar a venda.', 'warning');
      return;
    }


    if (Number(valorPago || 0) < totalVenda) {
      abrirMensagem('O valor recebido não pode ser menor que o total da venda.', 'warning');
      return;
    }


    setProcessando(true);


    try {
      await vendaService.vender({
        itens: carrinho,
        valorRecebido: valorPago,
      });


      setVendaAtiva(false);
      setCarrinho([]);
      setCodigo('');
      setQuantidade(1);
      setValorPago('');
      abrirMensagem('Venda finalizada com sucesso.', 'success');
      await carregarDados();
    } catch (error) {
      abrirMensagem(getApiErrorMessage(error, 'Não foi possível finalizar a venda.'), 'error');
    } finally {
      setProcessando(false);
    }
  };


  return (
    <Box sx={{ bgcolor: '#F7F7F7', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <CssBaseline />


      <Box sx={{ height: '100%', px: { xs: 2.5, md: 3.5, lg: 4.5 }, py: { xs: 2.2, md: 2.8, lg: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" sx={{ color: '#168A58', fontWeight: 900, fontSize: { xs: '1.7rem', lg: '2.15rem' }, lineHeight: 1 }}>
              PDV RÁPIDO
            </Typography>
            <Typography variant="caption" sx={{ color: '#333', fontWeight: 900, fontSize: '0.65rem' }}>
              VENDEDOR: {String(nomeVendedor).toUpperCase()}
            </Typography>
          </Box>
          <ShoppingCartIcon sx={{ color: '#EFEFEF', fontSize: { xs: '2rem', lg: '2.45rem' }, mr: 1 }} />
        </Stack>


        <Box sx={{ display: 'flex', gap: 2 }}>
          <Card
            onClick={iniciarNovaVenda}
            sx={{
              flex: 1,
              py: 2,
              px: 3,
              minHeight: 78,
              borderRadius: '15px',
              textAlign: 'center',
              cursor: 'pointer',
              border: vendaAtiva ? '1.5px solid #168A58' : '1px solid #EFEFEF',
              boxShadow: '0px 3px 10px rgba(0,0,0,0.045)',
            }}
          >
            <Typography sx={{ color: '#168A58', fontWeight: 900, fontSize: '0.8rem' }}>NOVA VENDA (F2)</Typography>
            <AddCircleOutlineIcon sx={{ color: '#168A58', fontSize: '1.7rem', mt: 0.55 }} />
          </Card>


          <Card
            onClick={() => finalizarOperacao('CANCELADA')}
            sx={{
              flex: 1,
              py: 2,
              px: 3,
              minHeight: 78,
              borderRadius: '15px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid #EFEFEF',
              boxShadow: '0px 3px 10px rgba(0,0,0,0.045)',
            }}
          >
            <Typography sx={{ color: '#E53935', fontWeight: 900, fontSize: '0.8rem' }}>CANCELAR VENDA</Typography>
            <HighlightOffIcon sx={{ color: '#E53935', fontSize: '1.7rem', mt: 0.55 }} />
          </Card>
        </Box>


        <Grid
          container
          spacing={2}
          sx={{
            opacity: vendaAtiva ? 1 : 0.36,
            pointerEvents: vendaAtiva ? 'auto' : 'none',
            bgcolor: 'white',
            px: 2,
            py: 1.6,
            borderRadius: '18px',
            border: '1px solid #EFEFEF',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.025)',
          }}
          alignItems="center"
        >
          <Grid item xs={12} md={2} lg={1.4}>
            <TextField label="QTD" type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} fullWidth size="small" sx={campoPadrao} />
          </Grid>
          <Grid item xs={12} md={4} lg={3.2}>
            <TextField
              label="CÓDIGO DE BARRAS / EAN"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              fullWidth
              size="small"
              sx={campoPadrao}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3.2}>
            <Typography variant="body2" sx={{ color: '#777', fontSize: '0.8rem', lineHeight: 1.35, fontWeight: 700 }}>
              DICA: Digite o código e aperte <strong>ENTER</strong>.<br />Use <strong>F3</strong> para buscar no estoque.
            </Typography>
          </Grid>
          <Grid item xs={12} md={2} lg={1.6}>
            <Button
              variant="contained"
              onClick={adicionarItem}
              fullWidth
              disabled={carregando}
              sx={{
                borderRadius: '12px',
                height: 48,
                bgcolor: '#A8DCC9',
                color: 'white',
                fontWeight: 900,
                fontSize: '0.75rem',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#168A58' },
              }}
            >
              INCLUIR
            </Button>
          </Grid>
        </Grid>


        <TableContainer component={Paper} sx={{ flexGrow: 1, minHeight: 0, borderRadius: '18px', boxShadow: 'none', border: '1px solid #EAEAEA', overflowY: 'auto', bgcolor: 'white' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'white', color: '#1B2635', fontWeight: 900, fontSize: '0.74rem', py: 1.45, borderBottom: '1px solid #EAEAEA' }}>#</TableCell>
                <TableCell sx={{ bgcolor: 'white', color: '#1B2635', fontWeight: 900, fontSize: '0.74rem', py: 1.45, borderBottom: '1px solid #EAEAEA' }}>DESCRIÇÃO</TableCell>
                <TableCell sx={{ bgcolor: 'white', color: '#1B2635', fontWeight: 900, fontSize: '0.74rem', py: 1.45, borderBottom: '1px solid #EAEAEA' }} align="center">QTD</TableCell>
                <TableCell sx={{ bgcolor: 'white', color: '#1B2635', fontWeight: 900, fontSize: '0.74rem', py: 1.45, borderBottom: '1px solid #EAEAEA' }} align="right">UNITÁRIO</TableCell>
                <TableCell sx={{ bgcolor: 'white', color: '#168A58', fontWeight: 900, fontSize: '0.74rem', py: 1.45, borderBottom: '1px solid #EAEAEA' }} align="right">SUBTOTAL</TableCell>
                <TableCell sx={{ bgcolor: 'white', color: '#1B2635', fontWeight: 900, fontSize: '0.74rem', py: 1.45, borderBottom: '1px solid #EAEAEA' }} align="center">REMOVER</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carregando ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} sx={{ color: '#168A58' }} />
                  </TableCell>
                </TableRow>
              ) : carrinho.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#333', fontStyle: 'italic', fontSize: '0.78rem' }}>
                    Nenhum produto no carrinho. Inicie uma venda!
                  </TableCell>
                </TableRow>
              ) : (
                carrinho.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontSize: '0.86rem' }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontSize: '0.86rem', fontWeight: 700 }}>{item.desc}</TableCell>
                    <TableCell sx={{ fontSize: '0.86rem' }} align="center">{item.qtd}</TableCell>
                    <TableCell sx={{ fontSize: '0.86rem' }} align="right">R$ {Number(item.precoUnitario).toFixed(2)}</TableCell>
                    <TableCell sx={{ color: '#168A58', fontWeight: 900, fontSize: '0.86rem' }} align="right">R$ {Number(item.subtotal).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => removerItem(item.id)}>
                        <DeleteIcon sx={{ color: '#C62828', fontSize: '1.15rem' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>


        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: '18px', border: '1px solid #EAEAEA', boxShadow: '0px -3px 10px rgba(0,0,0,0.02)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2.2}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#168A58', fontSize: '0.72rem', display: 'block', lineHeight: 1 }}>TOTAL DA COMPRA</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#168A58', fontSize: { xs: '1.9rem', lg: '2.25rem' }, lineHeight: 1.08 }}>R$ {totalVenda.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={12} md={2.1}>
              <TextField label="VALOR RECEBIDO" type="number" value={valorPago} onChange={(e) => setValorPago(e.target.value)} fullWidth size="small" sx={campoPadrao} />
            </Grid>
            <Grid item xs={12} md={2.1}>
              <TextField select label="FORMA DE PAG." value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} fullWidth size="small" sx={campoPadrao}>
                <MenuItem value="DINHEIRO">DINHEIRO</MenuItem>
                <MenuItem value="CARTAO">CARTÃO</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.1}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#C62828', fontSize: '0.72rem', display: 'block', lineHeight: 1 }}>TROCO A DEVOLVER</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#1B2635', fontSize: { xs: '1.55rem', lg: '1.8rem' } }}>R$ {troco.toFixed(2)}</Typography>
            </Grid>
          </Grid>


          <Button
            variant="contained"
            fullWidth
            disabled={!vendaAtiva || carrinho.length === 0 || processando}
            onClick={() => finalizarOperacao('CONCLUIDA')}
            sx={{
              bgcolor: '#168A58',
              borderRadius: '14px',
              mt: 1.6,
              py: 1.3,
              fontWeight: 900,
              fontSize: '0.95rem',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0e6b43' },
              '&.Mui-disabled': { bgcolor: '#D9D9D9', color: '#B7B7B7' },
            }}
          >
            {processando ? 'PROCESSANDO...' : `CONCLUIR VENDA - R$ ${totalVenda.toFixed(2)}`}
          </Button>
        </Box>
      </Box>


      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '92vw', sm: 560 }, bgcolor: 'white', borderRadius: '18px', p: 3, maxHeight: '80vh', overflowY: 'auto', boxShadow: 24 }}>
          <Typography variant="h6" sx={{ color: '#168A58', mb: 2, fontWeight: 900, textAlign: 'center', fontSize: '1.1rem' }}>PESQUISAR PRODUTO PELO CÓDIGO</Typography>


          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <TextField
                label="CÓDIGO DO PRODUTO"
                value={buscaModal}
                onChange={(e) => setBuscaModal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    buscarProdutoModalPorCodigo();
                  }
                }}
                fullWidth
                size="small"
                autoFocus
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', height: 42 } }}
              />
            </Grid>
            <Grid item xs={4}>
              <Button onClick={buscarProdutoModalPorCodigo} variant="contained" fullWidth sx={{ height: 42, borderRadius: '10px', bgcolor: '#168A58', fontWeight: 900, boxShadow: 'none' }}>
                BUSCAR
              </Button>
            </Grid>
          </Grid>


          {produtosFiltradosModal.length === 0 ? (
            <Alert severity="error" sx={{ borderRadius: '10px' }}>Produto não encontrado. A venda atual foi mantida.</Alert>
          ) : (
            produtosFiltradosModal.map((p) => (
              <Box
                key={p.cod}
                onClick={() => selecionarProdutoModal(p)}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: '12px',
                  border: '1px solid #F0F0F0',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F1F8F5', borderColor: '#168A58' },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.9rem' }}>{p.desc}</Typography>
                  <Typography variant="caption" color="textSecondary">CÓD: {p.cod} | ESTOQUE: {p.qtd}</Typography>
                </Box>
                <Typography sx={{ color: '#168A58', fontWeight: 900 }}>R$ {Number(p.preco).toFixed(2)}</Typography>
              </Box>
            ))
          )}


          <Button onClick={() => setOpenModal(false)} fullWidth sx={{ mt: 1.5, color: '#777', fontWeight: 800 }}>FECHAR</Button>
        </Box>
      </Modal>


      <Snackbar open={mensagem.aberta} autoHideDuration={3500} onClose={fecharMensagem} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={fecharMensagem} severity={mensagem.tipo} variant="filled" sx={{ borderRadius: '10px', fontWeight: 700 }}>
          {mensagem.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
};


export default PdvRapido;




