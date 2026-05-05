import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import RefreshIcon from '@mui/icons-material/Refresh';

import produtoService from '../../services/produtoService';
import estoqueService from '../../services/estoqueService';
import vendaService from '../../services/vendaService';
import { getApiErrorMessage } from '../../services/apiResponse';

const PdvRapido = () => {
  const [produtos, setProdutos] = useState([]);
  const [itensEstoque, setItensEstoque] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [form, setForm] = useState({ produtoId: '', quantidade: 1 });
  const [valorRecebido, setValorRecebido] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const produtosDisponiveis = useMemo(() => {
    return produtos.map((produto) => {
      const itemEstoque = itensEstoque.find((item) => item.produtoId === produto.id);
      return {
        ...produto,
        quantidadeEstoque: itemEstoque?.quantidade ?? 0,
      };
    });
  }, [produtos, itensEstoque]);

  const total = useMemo(() => {
    return carrinho.reduce((soma, item) => soma + Number(item.subtotal), 0);
  }, [carrinho]);

  const troco = useMemo(() => {
    return Number(valorRecebido || 0) - total;
  }, [valorRecebido, total]);

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');

    try {
      const [produtosApi, estoqueApi] = await Promise.all([
        produtoService.listar(),
        estoqueService.listarItens(),
      ]);

      setProdutos(produtosApi);
      setItensEstoque(estoqueApi);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar os produtos para venda.'));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const alterarCampo = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarAoCarrinho = () => {
    setErro('');
    setSucesso('');

    const produto = produtosDisponiveis.find((item) => item.id === form.produtoId);
    const quantidade = Number(form.quantidade);

    if (!produto || quantidade <= 0) {
      setErro('Selecione um produto e informe uma quantidade válida.');
      return;
    }

    const quantidadeJaNoCarrinho = carrinho
      .filter((item) => item.produtoId === produto.id)
      .reduce((soma, item) => soma + Number(item.quantidade), 0);

    if (quantidadeJaNoCarrinho + quantidade > Number(produto.quantidadeEstoque)) {
      setErro('Quantidade solicitada maior do que o estoque disponível.');
      return;
    }

    const precoUnitario = Number(produto.precoVenda ?? produto.preco ?? produto.custoProduto ?? 0);

    setCarrinho((prev) => [
      ...prev,
      {
        produtoId: produto.id,
        nomeProduto: produto.nome,
        quantidade,
        precoUnitario,
        subtotal: precoUnitario * quantidade,
      },
    ]);

    setForm({ produtoId: '', quantidade: 1 });
  };

  const removerItem = (index) => {
    setCarrinho((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const finalizarVenda = async () => {
    setErro('');
    setSucesso('');

    if (carrinho.length === 0) {
      setErro('Adicione pelo menos um item à venda.');
      return;
    }

    if (Number(valorRecebido) < total) {
      setErro('O valor recebido não pode ser menor que o total da venda.');
      return;
    }

    setFinalizando(true);

    try {
      await vendaService.vender({
        itens: carrinho,
        valorRecebido,
      });

      setSucesso('Venda finalizada com sucesso.');
      setCarrinho([]);
      setValorRecebido('');
      await carregarDados();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível finalizar a venda.'));
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9F9F9', minHeight: '100%', p: { xs: 3, lg: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            VENDAS / PDV RÁPIDO
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
            Pdv Rápido
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarDados}
          sx={{ borderColor: '#128654', color: '#128654', textTransform: 'none', fontWeight: 700 }}
        >
          Atualizar Produtos
        </Button>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#128654' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <AddShoppingCartIcon sx={{ color: '#128654' }} />
                <Typography sx={{ color: '#128654', fontWeight: 800 }}>
                  Adicionar Produto
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <TextField select label="Produto" name="produtoId" value={form.produtoId} onChange={alterarCampo} fullWidth>
                  {produtosDisponiveis.map((produto) => (
                    <MenuItem key={produto.id} value={produto.id} disabled={produto.quantidadeEstoque <= 0}>
                      {produto.nome} • R$ {Number(produto.precoVenda ?? produto.preco).toFixed(2)} • Estoque: {produto.quantidadeEstoque}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField label="Quantidade" name="quantidade" type="number" value={form.quantidade} onChange={alterarCampo} fullWidth />

                <Button
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={adicionarAoCarrinho}
                  sx={{ bgcolor: '#128654', py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                  Adicionar Ao Carrinho
                </Button>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
              <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
                Carrinho De Venda
              </Typography>

              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '15px', border: '1px solid #EEE', mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F6FBF8' }}>
                      <TableCell sx={{ fontWeight: 800 }}>Produto</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Qtd.</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Preço</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Subtotal</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {carrinho.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">Nenhum item adicionado.</TableCell>
                      </TableRow>
                    ) : (
                      carrinho.map((item, index) => (
                        <TableRow key={`${item.produtoId}-${index}`} hover>
                          <TableCell>{item.nomeProduto}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>R$ {Number(item.precoUnitario).toFixed(2)}</TableCell>
                          <TableCell>R$ {Number(item.subtotal).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <IconButton color="error" onClick={() => removerItem(index)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h5" sx={{ color: '#128654', fontWeight: 800 }}>
                    Total: R$ {total.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Valor Recebido" type="number" value={valorRecebido} onChange={(event) => setValorRecebido(event.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography sx={{ fontWeight: 800, color: troco < 0 ? '#C62828' : '#128654' }}>
                    Troco: R$ {Number.isFinite(troco) ? troco.toFixed(2) : '0.00'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Button
                fullWidth
                variant="contained"
                startIcon={<PointOfSaleIcon />}
                disabled={finalizando}
                onClick={finalizarVenda}
                sx={{ bgcolor: '#128654', py: 1.5, borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}
              >
                {finalizando ? 'Finalizando...' : 'Finalizar Venda'}
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PdvRapido;
