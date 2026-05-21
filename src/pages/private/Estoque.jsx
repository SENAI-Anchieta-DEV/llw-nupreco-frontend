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
} from '@mui/material';


import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';


import estoqueService from '../../services/estoqueService';
import produtoService from '../../services/produtoService';
import { getApiErrorMessage } from '../../services/apiResponse';


const formatMoney = (value) => Number(value || 0).toFixed(2);


const normalizarTexto = (value) => String(value ?? '').trim().toLowerCase();


const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeEditada, setQuantidadeEditada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');


  const itensComProduto = useMemo(() => {
    return itens
      .map((item) => {
        const produto = produtos.find((produtoItem) => produtoItem.id === item.produtoId);
        const custoProduto = Number(produto?.custoProduto ?? 0);
        const precoVenda = Number(produto?.precoVenda ?? 0);
        const lucroUnitario = precoVenda - custoProduto;
        const quantidade = Number(item.quantidade ?? 0);


        return {
          ...item,
          produtoId: item.produtoId,
          nomeProduto: item.nomeProduto || produto?.nome || 'Produto',
          custoProduto,
          precoVenda,
          lucroUnitario,
          quantidade,
          lucroTotalEstimado: lucroUnitario * quantidade,
        };
      })
      .sort((a, b) =>
        String(a.nomeProduto || '').localeCompare(String(b.nomeProduto || ''), 'pt-BR', {
          sensitivity: 'base',
        })
      );
  }, [itens, produtos]);


  const produtosFiltradosPesquisa = useMemo(() => {
    const termo = normalizarTexto(buscaProduto);


    if (!termo || produtoSelecionado) return [];


    return produtos
      .filter((produto) => {
        const codigo = normalizarTexto(produto.id);
        const nome = normalizarTexto(produto.nome);


        return codigo.startsWith(termo) || nome.startsWith(termo);
      })
      .sort((a, b) =>
        String(a.nome || '').localeCompare(String(b.nome || ''), 'pt-BR', {
          sensitivity: 'base',
        })
      );
  }, [buscaProduto, produtos, produtoSelecionado]);


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


  const limparPesquisa = () => {
    setBuscaProduto('');
    setProdutoSelecionado(null);
    setQuantidadeEditada('');
  };


  const selecionarProduto = (produto) => {
    const itemEstoque = itens.find((item) => item.produtoId === produto.id);


    setErro('');
    setSucesso('');
    setProdutoSelecionado(produto);
    setQuantidadeEditada(String(itemEstoque?.quantidade ?? 0));
    setBuscaProduto(`${produto.id} - ${produto.nome}`);
  };


  const buscarProduto = () => {
    setErro('');
    setSucesso('');


    const termo = normalizarTexto(buscaProduto);


    if (!termo) {
      setErro('Digite o código ou o nome do produto para pesquisar.');
      return;
    }


    const produtoEncontrado = produtos.find((produto) => {
      const codigo = normalizarTexto(produto.id);
      const nome = normalizarTexto(produto.nome);


      return codigo === termo || codigo.startsWith(termo) || nome.startsWith(termo);
    });


    if (!produtoEncontrado) {
      setProdutoSelecionado(null);
      setQuantidadeEditada('');
      setErro('Produto não encontrado.');
      return;
    }


    selecionarProduto(produtoEncontrado);
  };


  const selecionarParaEditar = (item) => {
    const produto = produtos.find((produtoItem) => produtoItem.id === item.produtoId);


    setErro('');
    setSucesso('');
    setBuscaProduto(`${item.produtoId} - ${item.nomeProduto}`);
    setProdutoSelecionado(
      produto || {
        id: item.produtoId,
        nome: item.nomeProduto,
        custoProduto: item.custoProduto,
        precoVenda: item.precoVenda,
      }
    );
    setQuantidadeEditada(String(item.quantidade));
  };


  const salvarQuantidade = async () => {
    setErro('');
    setSucesso('');


    if (!produtoSelecionado) {
      setErro('Pesquise ou selecione um produto antes de salvar.');
      return;
    }


    const novaQuantidade = Number(quantidadeEditada);


    if (!Number.isFinite(novaQuantidade) || novaQuantidade < 0) {
      setErro('Informe uma quantidade válida.');
      return;
    }


    setSalvando(true);


    try {
      const itemAtual = itens.find((item) => item.produtoId === produtoSelecionado.id);
      const quantidadeAtual = Number(itemAtual?.quantidade ?? 0);
      const diferenca = novaQuantidade - quantidadeAtual;


      if (diferenca > 0) {
        await estoqueService.adicionar(produtoSelecionado.id, diferenca);
      }


      if (diferenca < 0) {
        await estoqueService.remover(produtoSelecionado.id, Math.abs(diferenca));
      }


      setItens((prev) => {
        const semItemAtual = prev.filter((item) => item.produtoId !== produtoSelecionado.id);


        return [
          ...semItemAtual,
          {
            produtoId: produtoSelecionado.id,
            nomeProduto: produtoSelecionado.nome,
            quantidade: novaQuantidade,
          },
        ];
      });


      setSucesso('Quantidade do produto atualizada com sucesso.');
      limparPesquisa();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível atualizar o estoque.'));
    } finally {
      setSalvando(false);
    }
  };


  const excluirProduto = async (item) => {
    setErro('');
    setSucesso('');


    try {
      await produtoService.excluir(item.produtoId);


      setProdutos((prev) => prev.filter((produto) => produto.id !== item.produtoId));
      setItens((prev) => prev.filter((estoqueItem) => estoqueItem.produtoId !== item.produtoId));


      if (produtoSelecionado?.id === item.produtoId) {
        limparPesquisa();
      }


      setSucesso('Produto excluído com sucesso.');
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível excluir o produto.'));
    }
  };


  return (
    <Box
      sx={{
        bgcolor: 'background.default',
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
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            ESTOQUE / CONSULTA
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


      {erro && <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2, flexShrink: 0 }}>{sucesso}</Alert>}


      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={12} md={4} sx={{ minHeight: 0 }}>
          <Card sx={{ p: 3, borderRadius: '25px', border: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2 }}>
              Pesquisar Produto
            </Typography>


            <Stack spacing={2}>
              <TextField
                label="Código Ou Nome Do Produto"
                value={buscaProduto}
                onChange={(event) => {
                  setBuscaProduto(event.target.value);
                  setProdutoSelecionado(null);
                  setQuantidadeEditada('');
                  setErro('');
                  setSucesso('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    buscarProduto();
                  }
                }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#128654' }} />
                    </InputAdornment>
                  ),
                }}
              />


              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                disabled={salvando}
                onClick={buscarProduto}
                sx={{ bgcolor: '#128654', py: 1.3, borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
              >
                Pesquisar
              </Button>


              {buscaProduto && produtosFiltradosPesquisa.length > 0 && !produtoSelecionado && (
                <Card sx={{ p: 1.5, borderRadius: '16px', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.35)' : '#E8F5E9'}`, bgcolor: 'background.paper' }}>
                  <Typography sx={{ color: '#128654', fontWeight: 800, mb: 1 }}>
                    Produtos Encontrados
                  </Typography>


                  <Stack spacing={1} sx={{ maxHeight: 220, overflowY: 'auto' }}>
                    {produtosFiltradosPesquisa.map((produto) => {
                      const itemEstoque = itens.find((item) => item.produtoId === produto.id);


                      return (
                        <Box
                          key={produto.id}
                          onClick={() => selecionarProduto(produto)}
                          sx={{
                            p: 1.2,
                            borderRadius: '12px',
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8',
                              borderColor: '#128654',
                            },
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>
                            {produto.nome}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Código: {produto.id} | Estoque: {itemEstoque?.quantidade ?? 0}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Card>
              )}


              {buscaProduto && produtosFiltradosPesquisa.length === 0 && !produtoSelecionado && (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  Nenhum produto encontrado para essa pesquisa.
                </Alert>
              )}


              {produtoSelecionado && (
                <Card sx={{ p: 2, borderRadius: '16px', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.35)' : '#E8F5E9'}`, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>
                  <Typography sx={{ color: '#128654', fontWeight: 800 }}>
                    {produtoSelecionado.nome}
                  </Typography>


                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                    Código: {produtoSelecionado.id}
                  </Typography>


                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                    Preço De Venda: R$ {formatMoney(produtoSelecionado.precoVenda)}
                  </Typography>


                  <TextField
                    label="Quantidade Em Estoque"
                    type="number"
                    value={quantidadeEditada}
                    onChange={(event) => setQuantidadeEditada(event.target.value)}
                    fullWidth
                    sx={{ mt: 1 }}
                  />


                  <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={salvando}
                      onClick={salvarQuantidade}
                      sx={{ bgcolor: '#128654', borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                    >
                      {salvando ? 'Salvando...' : 'Salvar'}
                    </Button>


                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={salvando}
                      onClick={limparPesquisa}
                      sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
                    >
                      Limpar
                    </Button>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Card>
        </Grid>


        <Grid item xs={12} md={8} sx={{ minHeight: 0 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '25px',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography sx={{ color: '#128654', fontWeight: 800, mb: 2, flexShrink: 0 }}>
              Itens Em Estoque
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
                  borderRadius: '15px',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>
                      <TableCell sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Código</TableCell>
                      <TableCell sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Produto</TableCell>
                      <TableCell sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Quantidade</TableCell>
                      <TableCell sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Custo Unitário</TableCell>
                      <TableCell sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Preço Venda</TableCell>
                      <TableCell sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Lucro Unitário</TableCell>
                      <TableCell sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Lucro Total Estimado</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>


                  <TableBody>
                    {itensComProduto.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          Nenhum item em estoque.
                        </TableCell>
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
                          <TableCell align="right">
                            <Tooltip title="Editar Quantidade">
                              <IconButton onClick={() => selecionarParaEditar(item)}>
                                <EditOutlinedIcon sx={{ color: '#F4B000' }} />
                              </IconButton>
                            </Tooltip>


                            <Tooltip title="Excluir Produto">
                              <IconButton onClick={() => excluirProduto(item)}>
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
        </Grid>
      </Grid>
    </Box>
  );
};


export default Estoque;







