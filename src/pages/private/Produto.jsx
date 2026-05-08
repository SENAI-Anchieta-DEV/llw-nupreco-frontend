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

import produtoService, { calcularMargemPercentual, calcularPrecoVenda } from '../../services/produtoService';
import estoqueService from '../../services/estoqueService';
import iotService from '../../services/iotService';
import { getApiErrorMessage } from '../../services/apiResponse';

const initialForm = {
  idInterno: null,
  id: '',
  nome: '',
  custoProduto: '',
  tipoPrecificacao: 'PERCENTUAL',
  margemLucro: '',
  lucroValor: '',
  qtd: '',
};

const formatMoney = (value) => {
  const number = Number(value || 0);
  return number.toFixed(2);
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
        lucroUnitario: Number(produto.precoVenda ?? 0) - Number(produto.custoProduto ?? 0),
      };
    });
  }, [produtos, itensEstoque]);

  const preview = useMemo(() => {
    const custoProduto = Number(form.custoProduto || 0);

    if (!custoProduto || custoProduto <= 0) {
      return null;
    }

    const precoVenda = calcularPrecoVenda(form);
    const lucroUnitario = precoVenda - custoProduto;
    const margemPercentual = form.tipoPrecificacao === 'VALOR_FIXO'
      ? calcularMargemPercentual(form)
      : Number(form.margemLucro || 0);

    return {
      precoVenda,
      lucroUnitario,
      margemPercentual,
    };
  }, [form]);

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
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'tipoPrecificacao') {
        return {
          ...next,
          margemLucro: value === 'PERCENTUAL' ? prev.margemLucro : '',
          lucroValor: value === 'VALOR_FIXO' ? prev.lucroValor : '',
        };
      }

      return next;
    });
  };

  const limparCampos = () => {
    setForm(initialForm);
  };

  const editarProduto = (produto) => {
    setForm({
      idInterno: produto.id,
      id: produto.id,
      nome: produto.nome,
      custoProduto: produto.custoProduto ?? '',
      tipoPrecificacao: produto.tipoPrecificacao || 'PERCENTUAL',
      margemLucro: produto.margemLucro ?? '',
      lucroValor: produto.lucroValor ?? '',
      qtd: produto.qtd ?? 0,
    });
  };

  const validarFormulario = () => {
    if (!form.id || !form.nome || !form.custoProduto || !form.tipoPrecificacao || form.qtd === '') {
      return 'Preencha código, nome, custo, tipo de precificação e quantidade.';
    }

    if (Number(form.custoProduto) <= 0) {
      return 'O custo do produto deve ser maior que zero.';
    }

    if (Number(form.qtd) < 0) {
      return 'A quantidade não pode ser negativa.';
    }

    if (form.tipoPrecificacao === 'PERCENTUAL' && (form.margemLucro === '' || Number(form.margemLucro) < 0)) {
      return 'Informe uma margem de lucro percentual válida.';
    }

    if (form.tipoPrecificacao === 'VALOR_FIXO' && (form.lucroValor === '' || Number(form.lucroValor) < 0)) {
      return 'Informe um lucro fixo válido.';
    }

    return null;
  };

  const salvarOuRessalvar = async () => {
    setErro('');
    setSucesso('');

    const mensagemErro = validarFormulario();

    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    setSalvando(true);

    try {
      const produtoSalvo = form.idInterno
        ? await produtoService.atualizar(form.idInterno, form)
        : await produtoService.criar(form);

      const estoqueAtual = itensEstoque.find((item) => item.produtoId === produtoSalvo.id);
      const quantidadeAtual = Number(estoqueAtual?.quantidade ?? 0);
      const quantidadeDesejada = Number(form.qtd || 0);
      const diferenca = quantidadeDesejada - quantidadeAtual;

      if (diferenca > 0) {
        await estoqueService.adicionar(produtoSalvo.id, diferenca);
      }

      if (diferenca < 0) {
        await estoqueService.remover(produtoSalvo.id, Math.abs(diferenca));
      }

      try {
        await iotService.enviar(produtoSalvo.nome, produtoSalvo.precoVenda);
      } catch (iotError) {
        // A falha no display não deve impedir o cadastro do produto.
      }

      setSucesso('Produto salvo com sucesso. O preço de venda foi calculado automaticamente.');
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
              <TextField label="Código De Barras" name="id" value={form.id} onChange={alterarCampo} fullWidth disabled={!!form.idInterno} />
              <TextField label="Nome Do Produto" name="nome" value={form.nome} onChange={alterarCampo} fullWidth />
              <TextField label="Custo Do Produto" name="custoProduto" type="number" value={form.custoProduto} onChange={alterarCampo} fullWidth />
              <TextField select label="Tipo De Precificação" name="tipoPrecificacao" value={form.tipoPrecificacao} onChange={alterarCampo} fullWidth>
                <MenuItem value="PERCENTUAL">Percentual</MenuItem>
                <MenuItem value="VALOR_FIXO">Valor Fixo</MenuItem>
              </TextField>

              {form.tipoPrecificacao === 'PERCENTUAL' ? (
                <TextField label="Margem De Lucro (%)" name="margemLucro" type="number" value={form.margemLucro} onChange={alterarCampo} fullWidth />
              ) : (
                <TextField label="Lucro Fixo (R$)" name="lucroValor" type="number" value={form.lucroValor} onChange={alterarCampo} fullWidth />
              )}

              <TextField label="Quantidade Inicial Em Estoque" name="qtd" type="number" value={form.qtd} onChange={alterarCampo} fullWidth />

              {preview && (
                <Alert severity="info">
                  {form.tipoPrecificacao === 'PERCENTUAL'
                    ? `Prévia: o preço final calculado será R$ ${formatMoney(preview.precoVenda)}.`
                    : `Prévia: a margem de lucro estimada será ${preview.margemPercentual.toFixed(2)}% e o preço final será R$ ${formatMoney(preview.precoVenda)}.`}
                </Alert>
              )}

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
                      <TableCell sx={{ fontWeight: 800 }}>Custo</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Margem</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Lucro Fixo</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Preço Venda</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Qtd.</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produtosComEstoque.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">Nenhum produto encontrado.</TableCell>
                      </TableRow>
                    ) : (
                      produtosComEstoque.map((produto) => (
                        <TableRow key={produto.id} hover>
                          <TableCell>{produto.id}</TableCell>
                          <TableCell>{produto.nome}</TableCell>
                          <TableCell>R$ {formatMoney(produto.custoProduto)}</TableCell>
                          <TableCell>
                            <Chip label={produto.tipoPrecificacao || 'PERCENTUAL'} size="small" sx={{ bgcolor: '#E8F5E9', fontWeight: 700 }} />
                          </TableCell>
                          <TableCell>{produto.margemLucro !== null && produto.margemLucro !== undefined ? `${Number(produto.margemLucro).toFixed(2)}%` : '-'}</TableCell>
                          <TableCell>{produto.lucroValor !== null && produto.lucroValor !== undefined ? `R$ ${formatMoney(produto.lucroValor)}` : '-'}</TableCell>
                          <TableCell>R$ {formatMoney(produto.precoVenda)}</TableCell>
                          <TableCell>{produto.qtd}</TableCell>
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
