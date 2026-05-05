import React, { useEffect, useState } from 'react';
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

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState({ produtoId: '', quantidade: '' });
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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
            CONTROLE / ESTOQUE
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
                    {produto.nome}
                  </MenuItem>
                ))}
              </TextField>

              <TextField label="Quantidade" name="quantidade" type="number" value={form.quantidade} onChange={alterarCampo} fullWidth />

              <Button
                variant="contained"
                disabled={salvando}
                startIcon={<AddIcon />}
                onClick={() => movimentarEstoque('ADICIONAR')}
                sx={{ bgcolor: '#128654', py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
              >
                Adicionar
              </Button>

              <Button
                variant="outlined"
                disabled={salvando}
                color="error"
                startIcon={<RemoveIcon />}
                onClick={() => movimentarEstoque('REMOVER')}
                sx={{ py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
              >
                Remover
              </Button>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {itens.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">Nenhum item encontrado no estoque.</TableCell>
                      </TableRow>
                    ) : (
                      itens.map((item) => (
                        <TableRow key={item.produtoId} hover>
                          <TableCell>{item.produtoId}</TableCell>
                          <TableCell>{item.nomeProduto}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
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
