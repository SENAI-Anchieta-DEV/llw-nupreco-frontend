import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';

import estoqueService from '../../services/estoqueService';
import produtoService from '../../services/produtoService';
import { getApiErrorMessage } from '../../services/apiResponse';

const formatMoney = (value) => Number(value || 0).toFixed(2);

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState({ produtoId: '', quantidade: '' });
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const itensComProduto = useMemo(() => {
    return itens.map((item) => {
      const produto = produtos.find((produtoItem) => produtoItem.id === item.produtoId);
      const custoProduto = Number(produto?.custoProduto ?? 0);
      const precoVenda = Number(produto?.precoVenda ?? 0);
      const lucroUnitario = precoVenda - custoProduto;
      const quantidade = Number(item.quantidade ?? 0);

      return {
        ...item,
        nomeProduto: item.nomeProduto || produto?.nome || 'Produto',
        custoProduto,
        precoVenda,
        lucroUnitario,
        quantidade,
        lucroTotalEstimado: lucroUnitario * quantidade,
      };
    });
  }, [itens, produtos]);

  const carregarDados = async () => {
    setCarregando(true);
    setErro('');

    try {
      const [produtosApi, itensApi] = await Promise.all([
        produtoService.listar(),
        estoqueService.listarItens(),
      ]);

      setProdutos(produtosApi);
      setItens(itensApi);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar o estoque.'));
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

  const movimentarEstoque = async (tipo) => {
    setErro('');
    setSucesso('');

    if (!form.produtoId || !form.quantidade) {
      setErro('Selecione um produto e informe a quantidade.');
      return;
    }

    if (Number(form.quantidade) <= 0) {
      setErro('A quantidade deve ser maior que zero.');
      return;
    }

    setSalvando(true);

    try {
      if (tipo === 'ADICIONAR') {
        await estoqueService.adicionar(form.produtoId, form.quantidade);
        setSucesso('Quantidade adicionada ao estoque.');
      } else {
        await estoqueService.remover(form.produtoId, form.quantidade);
        setSucesso('Quantidade removida do estoque.');
      }

      setForm({ produtoId: '', quantidade: '' });
      await carregarDados();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível movimentar o estoque.'));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9F9F9', minHeight: '100%', p: { xs: 3, lg: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            ESTOQUE / MOVIMENTAÇÃO
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
            Estoque
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarDados}
          sx={{ borderColor: '#128654', color: '#128654', textTransform: 'none', fontWeight: 700 }}
        >
          Atualizar
        </Button>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
              Movimentar Estoque
            </Typography>

            <Stack spacing={2}>
              <TextField select label="Produto" name="produtoId" value={form.produtoId} onChange={alterarCampo} fullWidth>
                {produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.nome} • R$ {formatMoney(produto.precoVenda)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField label="Quantidade" name="quantidade" type="number" value={form.quantidade} onChange={alterarCampo} fullWidth />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={salvando}
                  onClick={() => movimentarEstoque('ADICIONAR')}
                  sx={{ bgcolor: '#128654', py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                  Adicionar
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RemoveIcon />}
                  disabled={salvando}
                  onClick={() => movimentarEstoque('REMOVER')}
                  sx={{ borderColor: '#C62828', color: '#C62828', py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                >
                  Remover
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
              Itens Em Estoque
            </Typography>

            {carregando ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#128654' }} />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '15px', border: '1px solid #EEE' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F6FBF8' }}>
                      <TableCell sx={{ fontWeight: 800 }}>Código</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Produto</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Quantidade</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Custo Unitário</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Preço Venda</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Lucro Unitário</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Lucro Total Estimado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itensComProduto.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">Nenhum item em estoque.</TableCell>
                      </TableRow>
                    ) : (
                      itensComProduto.map((item) => (
                        <TableRow key={item.produtoId} hover>
                          <TableCell>{item.produtoId}</TableCell>
                          <TableCell>{item.nomeProduto}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>R$ {formatMoney(item.custoProduto)}</TableCell>
                          <TableCell>R$ {formatMoney(item.precoVenda)}</TableCell>
                          <TableCell>R$ {formatMoney(item.lucroUnitario)}</TableCell>
                          <TableCell>R$ {formatMoney(item.lucroTotalEstimado)}</TableCell>
                        </TableRow>
                      ))
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

export default Estoque;
