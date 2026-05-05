import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
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
  useTheme,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/EditOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';

import produtoService from '../../services/produtoService';
import estoqueService from '../../services/estoqueService';
import iotService from '../../services/iotService';
import { getApiErrorMessage } from '../../services/apiResponse';

const categoriasPadrao = ['ALIMENTOS', 'BEBIDAS', 'LIMPEZA', 'UTILIDADES', 'GERAL'];

const initialForm = {
  idInterno: null,
  cod: '',
  desc: '',
  categoria: 'GERAL',
  qtd: '',
  preco: '',
};

const Produto = () => {
  const theme = useTheme();

  const [produtos, setProdutos] = useState([]);
  const [itensEstoque, setItensEstoque] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const produtosComEstoque = useMemo(() => {
    return produtos.map((produto) => {
      const itemEstoque = itensEstoque.find((item) => item.produtoId === produto.id);
      return {
        ...produto,
        qtd: itemEstoque?.quantidade ?? produto.qtd ?? 0,
      };
    });
  }, [produtos, itensEstoque]);

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
      setErro(getApiErrorMessage(error, 'Não foi possível carregar produtos.'));
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

  const limparCampos = () => {
    setForm(initialForm);
  };

  const editarProduto = (produto) => {
    setForm({
      idInterno: produto.id,
      cod: produto.cod || produto.id,
      desc: produto.desc || produto.nome,
      categoria: produto.categoria || 'GERAL',
      qtd: produto.qtd ?? 0,
      preco: produto.precoVenda ?? produto.preco ?? produto.custoProduto ?? '',
    });
  };

  const salvarOuRessalvar = async () => {
    setErro('');
    setSucesso('');

    if (!form.cod || !form.desc || !form.preco || form.qtd === '') {
      setErro('Preencha código, descrição, quantidade e preço.');
      return;
    }

    if (Number(form.qtd) < 0 || Number(form.preco) <= 0) {
      setErro('Quantidade inválida ou preço deve ser maior que zero.');
      return;
    }

    setSalvando(true);

    try {
      const produtoSalvo = form.idInterno
        ? await produtoService.atualizar(form.idInterno, form)
        : await produtoService.criar(form);

      if (Number(form.qtd) > 0) {
        const estoqueAtual = itensEstoque.find((item) => item.produtoId === produtoSalvo.id);
        const quantidadeAtual = Number(estoqueAtual?.quantidade ?? 0);
        const quantidadeDesejada = Number(form.qtd);
        const diferenca = quantidadeDesejada - quantidadeAtual;

        if (diferenca > 0) {
          await estoqueService.adicionar(produtoSalvo.id, diferenca);
        }

        if (diferenca < 0) {
          await estoqueService.remover(produtoSalvo.id, Math.abs(diferenca));
        }
      }

      try {
        await iotService.enviar(produtoSalvo.nome, produtoSalvo.precoVenda ?? form.preco);
      } catch (iotError) {
        // A falha no display não deve impedir o cadastro do produto.
      }

      setSucesso('Produto salvo com sucesso.');
      limparCampos();
      await carregarDados();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível salvar o produto.'));
    } finally {
      setSalvando(false);
    }
  };

  const excluirProduto = async (produto) => {
    setErro('');
    setSucesso('');

    try {
      await produtoService.excluir(produto.id);
      setSucesso('Produto excluído com sucesso.');
      await carregarDados();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível excluir o produto.'));
    }
  };

  const ActionCard = ({ label, icon, onClick }) => (
    <Card
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: '25px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0px 10px 20px rgba(0,0,0,0.35)'
            : '0px 10px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Typography variant="body2" sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}>
        {label}
      </Typography>
      {icon}
    </Card>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100%', p: { xs: 3, lg: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            CADASTRO / PRODUTOS
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 800 }}>
            Produtos
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

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4} onClick={limparCampos}>
          <ActionCard label="NOVO PRODUTO" icon={<AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '3rem' }} />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard label="PRODUTOS CADASTRADOS" icon={<EditIcon sx={{ color: '#128654', fontSize: '3rem' }} />} onClick={carregarDados} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard label="ATUALIZAR LISTA" icon={<RefreshIcon sx={{ color: '#128654', fontSize: '3rem' }} />} onClick={carregarDados} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
              {form.idInterno ? 'Editar Produto' : 'Novo Produto'}
            </Typography>

            <Stack spacing={2}>
              <TextField label="Código" name="cod" value={form.cod} onChange={alterarCampo} fullWidth disabled={!!form.idInterno} />
              <TextField label="Descrição" name="desc" value={form.desc} onChange={alterarCampo} fullWidth />
              <TextField select label="Categoria" name="categoria" value={form.categoria} onChange={alterarCampo} fullWidth>
                {categoriasPadrao.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>
                ))}
              </TextField>
              <TextField label="Quantidade" name="qtd" type="number" value={form.qtd} onChange={alterarCampo} fullWidth />
              <TextField label="Preço" name="preco" type="number" value={form.preco} onChange={alterarCampo} fullWidth />

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={salvando}
                onClick={salvarOuRessalvar}
                sx={{ bgcolor: '#128654', py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
              >
                {salvando ? 'Salvando...' : 'Salvar Produto'}
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: '25px', border: '1px solid #F0F0F0' }}>
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
              Produtos Cadastrados
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
                      <TableCell sx={{ fontWeight: 800 }}>Qtd.</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Preço</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Tipo</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produtosComEstoque.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">Nenhum produto encontrado.</TableCell>
                      </TableRow>
                    ) : (
                      produtosComEstoque.map((produto) => (
                        <TableRow key={produto.id} hover>
                          <TableCell>{produto.id}</TableCell>
                          <TableCell>{produto.nome}</TableCell>
                          <TableCell>{produto.qtd}</TableCell>
                          <TableCell>R$ {Number(produto.precoVenda ?? produto.preco).toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip label={produto.tipoPrecificacao || 'VALOR_FIXO'} size="small" sx={{ bgcolor: '#E8F5E9', fontWeight: 700 }} />
                          </TableCell>
                          <TableCell align="right">
                            <Button size="small" startIcon={<EditIcon />} onClick={() => editarProduto(produto)} sx={{ color: '#128654', textTransform: 'none', fontWeight: 700 }}>
                              Editar
                            </Button>
                            <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => excluirProduto(produto)} sx={{ textTransform: 'none', fontWeight: 700 }}>
                              Excluir
                            </Button>
                          </TableCell>
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

export default Produto;
