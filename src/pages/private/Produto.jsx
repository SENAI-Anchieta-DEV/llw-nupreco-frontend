import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';


import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';


import { useNavigate } from 'react-router-dom';


import produtoService from '../../services/produtoService';
import estoqueService from '../../services/estoqueService';
import iotService from '../../services/iotService';
import { getApiErrorMessage } from '../../services/apiResponse';


const initialForm = {
  idInterno: null,
  id: '',
  nome: '',
  custoProduto: '',
  qtd: '1',
  precoVendaManual: '',
  margemReal: '',
  origemPrecificacao: 'SUGERIDO',
};


const toNumber = (value) => {
  const number = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(number) ? number : 0;
};


const formatMoney = (value) => {
  return Number(value || 0).toFixed(2);
};


const calcularPrecoSugerido = (custo) => {
  const custoNumerico = toNumber(custo);
  if (custoNumerico <= 0) return 0;
  return custoNumerico + custoNumerico * 0.5;
};


const calcularMargemPeloPreco = (custo, precoVenda) => {
  const custoNumerico = toNumber(custo);
  const precoNumerico = toNumber(precoVenda);


  if (custoNumerico <= 0 || precoNumerico <= 0) return '';
  return ((precoNumerico - custoNumerico) / custoNumerico) * 100;
};


const calcularPrecoPelaMargem = (custo, margem) => {
  const custoNumerico = toNumber(custo);
  const margemNumerica = toNumber(margem);


  if (custoNumerico <= 0 || margem === '') return '';
  return custoNumerico + (custoNumerico * margemNumerica) / 100;
};


const Produto = () => {
  const theme = useTheme();
  const navigate = useNavigate();


  const [produtos, setProdutos] = useState([]);
  const [itensEstoque, setItensEstoque] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');


  const precoSugerido = useMemo(() => {
    return calcularPrecoSugerido(form.custoProduto);
  }, [form.custoProduto]);


  const produtosComEstoque = useMemo(() => {
    return produtos
      .map((produto) => {
        const itemEstoque = itensEstoque.find((item) => item.produtoId === produto.id);
        const custoProduto = toNumber(produto.custoProduto);
        const precoVenda = toNumber(produto.precoVenda);
        const margemReal = custoProduto > 0 ? ((precoVenda - custoProduto) / custoProduto) * 100 : 0;


        return {
          ...produto,
          qtd: itemEstoque?.quantidade ?? produto.qtd ?? 0,
          precoSugerido: calcularPrecoSugerido(custoProduto),
          margemReal,
          lucroUnitario: precoVenda - custoProduto,
        };
      })
      .sort((a, b) =>
        String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', {
          sensitivity: 'base',
        })
      );
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


  const limparCampos = () => {
    setForm(initialForm);
    setErro('');
    setSucesso('');
  };


  const alterarCampo = (event) => {
    const { name, value } = event.target;


    setForm((prev) => {
      const next = { ...prev, [name]: value };


      if (name === 'custoProduto') {
        if (prev.origemPrecificacao === 'PRECO' && prev.precoVendaManual !== '') {
          next.margemReal = calcularMargemPeloPreco(value, prev.precoVendaManual);
        }


        if (prev.origemPrecificacao === 'MARGEM' && prev.margemReal !== '') {
          next.precoVendaManual = calcularPrecoPelaMargem(value, prev.margemReal);
        }


        return next;
      }


      if (name === 'precoVendaManual') {
        next.origemPrecificacao = 'PRECO';
        next.margemReal = value === '' ? '' : calcularMargemPeloPreco(prev.custoProduto, value);
        return next;
      }


      if (name === 'margemReal') {
        next.origemPrecificacao = 'MARGEM';
        next.precoVendaManual = value === '' ? '' : calcularPrecoPelaMargem(prev.custoProduto, value);
        return next;
      }


      return next;
    });
  };


  const validarFormulario = () => {
    if (!form.id || !form.nome || !form.custoProduto || form.qtd === '') {
      return 'Preencha quantidade inicial, código/EAN, nome do produto e valor de custo.';
    }


    if (toNumber(form.custoProduto) <= 0) {
      return 'O valor de custo deve ser maior que zero.';
    }


    if (toNumber(form.qtd) < 0) {
      return 'A quantidade inicial não pode ser negativa.';
    }


    if (form.precoVendaManual !== '' && toNumber(form.precoVendaManual) < toNumber(form.custoProduto)) {
      return 'O preço de venda não pode ser menor que o valor de custo.';
    }


    if (form.margemReal !== '' && toNumber(form.margemReal) < 0) {
      return 'A margem real não pode ser negativa.';
    }


    return null;
  };


  const montarProdutoParaApi = () => {
    const custoProduto = toNumber(form.custoProduto);


    if (form.origemPrecificacao === 'PRECO' && form.precoVendaManual !== '') {
      return {
        id: form.id,
        nome: form.nome,
        custoProduto,
        tipoPrecificacao: 'VALOR_FIXO',
        margemLucro: '',
        lucroValor: toNumber(form.precoVendaManual) - custoProduto,
      };
    }


    const margemLucro = form.margemReal !== '' ? toNumber(form.margemReal) : 50;


    return {
      id: form.id,
      nome: form.nome,
      custoProduto,
      tipoPrecificacao: 'PERCENTUAL',
      margemLucro,
      lucroValor: '',
    };
  };


const salvarProduto = async () => {
  setErro('');
  setSucesso('');


  const mensagemErro = validarFormulario();


  if (mensagemErro) {
    setErro(mensagemErro);
    return;
  }


  setSalvando(true);


  try {
    const produtoParaSalvar = montarProdutoParaApi();


    const produtoSalvo = form.idInterno
      ? await produtoService.atualizar(form.idInterno, produtoParaSalvar)
      : await produtoService.criar(produtoParaSalvar);


    const quantidadeDesejada = toNumber(form.qtd);


    setProdutos((prev) => {
      const semProdutoAtual = prev.filter((produto) => produto.id !== produtoSalvo.id);


      return [...semProdutoAtual, produtoSalvo].sort((a, b) =>
        String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', {
          sensitivity: 'base',
        })
      );
    });


    setItensEstoque((prev) => {
      const semEstoqueAtual = prev.filter((item) => item.produtoId !== produtoSalvo.id);


      return [
        ...semEstoqueAtual,
        {
          produtoId: produtoSalvo.id,
          quantidade: quantidadeDesejada,
        },
      ];
    });


    setForm({ ...initialForm });
    setSucesso('Produto salvo com sucesso.');
    setSalvando(false);


    try {
      const estoqueAtual = itensEstoque.find((item) => item.produtoId === produtoSalvo.id);
      const quantidadeAtual = Number(estoqueAtual?.quantidade ?? 0);
      const diferenca = quantidadeDesejada - quantidadeAtual;


      if (diferenca > 0) {
        await estoqueService.adicionar(produtoSalvo.id, diferenca);
      }


      if (diferenca < 0) {
        await estoqueService.remover(produtoSalvo.id, Math.abs(diferenca));
      }
    } catch {
      setErro('Produto salvo, mas não foi possível atualizar o estoque automaticamente.');
    }


    try {
      await iotService.enviar(produtoSalvo.nome, produtoSalvo.precoVenda);
    } catch {
      // A falha no display não deve impedir o cadastro do produto.
    }
  } catch (error) {
    setErro(getApiErrorMessage(error, 'Não foi possível salvar o produto.'));
    setSalvando(false);
  }
};




  const editarProduto = (produto) => {
    const margemReal = calcularMargemPeloPreco(produto.custoProduto, produto.precoVenda);


    setForm({
      idInterno: produto.id,
      id: produto.id,
      nome: produto.nome,
      custoProduto: produto.custoProduto ?? '',
      qtd: produto.qtd ?? 0,
      precoVendaManual: produto.precoVenda ?? '',
      margemReal: margemReal === '' ? '' : Number(margemReal).toFixed(2),
      origemPrecificacao: produto.tipoPrecificacao === 'VALOR_FIXO' ? 'PRECO' : 'MARGEM',
    });
  };


  const excluirProduto = async (produto) => {
    setErro('');
    setSucesso('');


    try {
      await produtoService.excluir(produto.id);


      setProdutos((prev) => prev.filter((item) => item.id !== produto.id));
      setItensEstoque((prev) => prev.filter((item) => item.produtoId !== produto.id));


      setSucesso('Produto excluído com sucesso.');
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível excluir o produto.'));
    }
  };


  const campoPadrao = {
    '& .MuiOutlinedInput-root': {
      height: 52,
      borderRadius: '22px',
      bgcolor: theme.palette.mode === 'dark' ? '#1F2933' : '#F2F2F2',
      fontWeight: 700,
    },
    '& .MuiInputLabel-root': {
      color: '#007F4E',
      fontWeight: 900,
      fontSize: '0.72rem',
      textTransform: 'uppercase',
    },
  };


  const ActionCard = ({ label, icon, onClick }) => (
    <Card
      onClick={onClick}
      sx={{
        width: 145,
        height: 112,
        borderRadius: '18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 7px 18px rgba(0,0,0,0.35)' : '0 7px 18px rgba(0,0,0,0.06)',
        transition: '0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 22px rgba(0,0,0,0.09)',
        },
      }}
    >
      <Typography sx={{ color: '#008653', fontWeight: 900, fontSize: '0.78rem', mb: 1 }}>
        {label}
      </Typography>
      {icon}
    </Card>
  );


  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#F8F8F8',
        height: '100%',
        maxHeight: '100vh',
        overflow: 'hidden',
        p: { xs: 3, lg: 4 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3, flexShrink: 0 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900 }}>
            CONTROLE DE PRODUTOS
          </Typography>
        </Box>


        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarDados}
          sx={{
            borderColor: '#128654',
            color: '#128654',
            textTransform: 'none',
            fontWeight: 800,
            borderRadius: '12px',
          }}
        >
          Atualizar
        </Button>
      </Stack>


      <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3, flexShrink: 0 }}>
        <ActionCard
          label="NOVO PRODUTO"
          onClick={limparCampos}
          icon={<AddCircleOutlineIcon sx={{ color: '#008653', fontSize: '2.6rem' }} />}
        />


        <ActionCard
          label="VER ESTOQUE"
          onClick={() => navigate('/estoque')}
          icon={<Inventory2OutlinedIcon sx={{ color: '#1976D2', fontSize: '2.6rem' }} />}
        />
      </Stack>


      {erro && <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2, flexShrink: 0 }}>{sucesso}</Alert>}


      <Card
        sx={{
          p: { xs: 2.5, lg: 3.5 },
          borderRadius: '28px',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 12px 30px rgba(0,0,0,0.32)' : '0 12px 30px rgba(0,0,0,0.04)',
          mb: 3,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ color: '#008653', fontWeight: 900, mb: 3 }}>
          {form.idInterno ? 'CADASTRO DE PRODUTO / EDITANDO PRODUTO' : 'CADASTRO DE NOVO PRODUTO'}
        </Typography>


        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={1.4}>
            <TextField
              label="QTD INICIAL"
              name="qtd"
              type="number"
              value={form.qtd}
              onChange={alterarCampo}
              fullWidth
              sx={campoPadrao}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>


          <Grid item xs={12} md={2}>
            <TextField
              label="CÓDIGO / EAN"
              name="id"
              value={form.id}
              onChange={alterarCampo}
              disabled={Boolean(form.idInterno)}
              fullWidth
              sx={campoPadrao}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>


          <Grid item xs={12} md={2.2}>
            <TextField
              label="NOME DO PRODUTO"
              name="nome"
              value={form.nome}
              onChange={alterarCampo}
              fullWidth
              sx={campoPadrao}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>


          <Grid item xs={12} md={1.8}>
            <TextField
              label="VALOR DE CUSTO"
              name="custoProduto"
              type="number"
              value={form.custoProduto}
              onChange={alterarCampo}
              fullWidth
              sx={campoPadrao}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Grid>


          <Grid item xs={12} md={1.8}>
            <TextField
              label="SUGERIDO (+50%)"
              value={`R$ ${formatMoney(precoSugerido)}`}
              fullWidth
              disabled
              sx={campoPadrao}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>


          <Grid item xs={12} md={1.8}>
            <TextField
              label="PREÇO DE VENDA"
              name="precoVendaManual"
              type="number"
              value={form.precoVendaManual}
              onChange={alterarCampo}
              fullWidth
              sx={campoPadrao}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Grid>


          <Grid item xs={12} md={1.6}>
            <TextField
              label="MARGEM REAL"
              name="margemReal"
              type="number"
              value={form.margemReal}
              onChange={alterarCampo}
              fullWidth
              sx={campoPadrao}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>


          <Grid item xs={12} md={0.4}>
            <Tooltip title="O sistema calcula automaticamente preço pela margem ou margem pelo preço.">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  bgcolor: '#F2F2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.disabled',
                }}
              >
                <CalculateOutlinedIcon fontSize="small" />
              </Box>
            </Tooltip>
          </Grid>
        </Grid>


        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={salvando}
            onClick={salvarProduto}
            sx={{
              bgcolor: '#0B8754',
              px: 5,
              py: 1.3,
              borderRadius: '24px',
              textTransform: 'uppercase',
              fontWeight: 900,
              boxShadow: '0 7px 13px rgba(0,0,0,0.18)',
              '&:hover': { bgcolor: '#076B42' },
            }}
          >
            {salvando ? 'SALVANDO...' : 'SALVAR NO ESTOQUE'}
          </Button>
        </Stack>
      </Card>


      <Card
        sx={{
          p: { xs: 2.5, lg: 3 },
          borderRadius: '25px',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 10px 26px rgba(0,0,0,0.28)' : '0 10px 26px rgba(0,0,0,0.035)',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography sx={{ color: '#008653', fontWeight: 900, mb: 2, flexShrink: 0 }}>
          PRODUTOS CADASTRADOS
        </Typography>


        {carregando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#128654' }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Produto</TableCell>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Qtd.</TableCell>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Custo</TableCell>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Sugerido (+50%)</TableCell>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Preço De Venda</TableCell>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Margem Real</TableCell>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Lucro Unitário</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Ações</TableCell>
                </TableRow>
              </TableHead>


              <TableBody>
                {produtosComEstoque.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      Nenhum produto cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  produtosComEstoque.map((produto) => (
                    <TableRow key={produto.id} hover>
                      <TableCell>{produto.id}</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>{produto.nome}</TableCell>
                      <TableCell>{produto.qtd}</TableCell>
                      <TableCell>R$ {formatMoney(produto.custoProduto)}</TableCell>
                      <TableCell>R$ {formatMoney(produto.precoSugerido)}</TableCell>
                      <TableCell sx={{ color: '#128654', fontWeight: 900 }}>
                        R$ {formatMoney(produto.precoVenda)}
                      </TableCell>
                      <TableCell>{Number(produto.margemReal || 0).toFixed(2)}%</TableCell>
                      <TableCell>R$ {formatMoney(produto.lucroUnitario)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar Produto">
                          <IconButton onClick={() => editarProduto(produto)}>
                            <EditOutlinedIcon sx={{ color: '#F4B000' }} />
                          </IconButton>
                        </Tooltip>


                        <Tooltip title="Excluir Produto">
                          <IconButton onClick={() => excluirProduto(produto)}>
                            <DeleteOutlineIcon sx={{ color: '#C62828' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
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


export default Produto;







