import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';


import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';


import produtoService from '../../services/produtoService';
import iotService from '../../services/iotService';
import { getApiErrorMessage } from '../../services/apiResponse';


const etiquetasDigitais = [
  { id: 'LCD-01', label: 'Etiqueta Digital 01' },
  { id: 'LCD-02', label: 'Etiqueta Digital 02' },
  { id: 'LCD-03', label: 'Etiqueta Digital 03' },
  { id: 'LCD-04', label: 'Etiqueta Digital 04' },
];


const normalizarTexto = (value) => String(value ?? '').trim().toLowerCase();


const formatMoney = (value) => Number(value || 0).toFixed(2);


const campoPadrao = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    bgcolor: '#FFFFFF',
    fontWeight: 700,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 800,
  },
};


const EtiquetaDigital = () => {
  const [produtos, setProdutos] = useState([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [valorEtiqueta, setValorEtiqueta] = useState('');
  const [etiquetaDigitalId, setEtiquetaDigitalId] = useState('LCD-01');
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');


  const produtosFiltrados = useMemo(() => {
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


  const carregarProdutos = async () => {
    setCarregando(true);
    setErro('');


    try {
      const produtosApi = await produtoService.listar();
      setProdutos(produtosApi);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar a lista de produtos.'));
    } finally {
      setCarregando(false);
    }
  };


  useEffect(() => {
    carregarProdutos();
  }, []);


  const limparSelecao = () => {
    setBuscaProduto('');
    setProdutoSelecionado(null);
    setDescricao('');
    setValorEtiqueta('');
  };


  const selecionarProduto = (produto) => {
    setErro('');
    setSucesso('');
    setProdutoSelecionado(produto);
    setBuscaProduto(`${produto.id} - ${produto.nome}`);
    setDescricao(produto.nome || '');
    setValorEtiqueta(formatMoney(produto.precoVenda));
  };


  const confirmarAlteracao = async () => {
    setErro('');
    setSucesso('');


    if (!produtoSelecionado) {
      setErro('Selecione um produto antes de confirmar a alteração da etiqueta digital.');
      return;
    }


    if (!descricao.trim()) {
      setErro('A descrição do produto é obrigatória.');
      return;
    }


    if (!etiquetaDigitalId) {
      setErro('Selecione o ID da etiqueta digital que será alterada.');
      return;
    }


    const valorNumerico = Number(String(valorEtiqueta).replace(',', '.'));


    if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
      setErro('Informe um valor válido para enviar à etiqueta digital.');
      return;
    }


    setEnviando(true);


    try {
      await iotService.enviarEtiquetaDigital({
        nome: descricao.trim(),
        preco: valorNumerico,
        etiquetaDigitalId,
      });


      setSucesso(`Informações enviadas para a ${etiquetaDigitalId} com sucesso.`);
      limparSelecao();
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível enviar as informações para a etiqueta digital.'));
    } finally {
      setEnviando(false);
    }
  };


  return (
    <Box
      sx={{
        bgcolor: '#F9F9F9',
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
            DISPLAY LCD / IOT
          </Typography>
          <Typography variant="h4" sx={{ color: '#128654', fontWeight: 900 }}>
            Etiqueta Digital
          </Typography>
        </Box>


        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarProdutos}
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


      {erro && <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2, flexShrink: 0 }}>{sucesso}</Alert>}


      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={12} md={4} sx={{ minHeight: 0 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: '25px',
              border: '1px solid #F0F0F0',
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography sx={{ color: '#128654', fontWeight: 900, mb: 2, flexShrink: 0 }}>
              Lista De Produtos
            </Typography>


            <TextField
              label="Buscar Por Código Ou Nome"
              value={buscaProduto}
              onChange={(event) => {
                setBuscaProduto(event.target.value);
                setProdutoSelecionado(null);
                setDescricao('');
                setValorEtiqueta('');
                setErro('');
                setSucesso('');
              }}
              fullWidth
              sx={{ ...campoPadrao, mb: 2, flexShrink: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#128654' }} />
                  </InputAdornment>
                ),
              }}
            />


            <Paper
              elevation={0}
              sx={{
                borderRadius: '18px',
                border: '1px solid #EEEEEE',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                p: 1.2,
                bgcolor: '#FFFFFF',
              }}
            >
              {carregando ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress sx={{ color: '#128654' }} />
                </Box>
              ) : !buscaProduto ? (
                <Typography sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center', py: 4 }}>
                  Digite o código ou o nome do produto para pesquisar.
                </Typography>
              ) : produtosFiltrados.length === 0 && !produtoSelecionado ? (
                <Typography sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center', py: 4 }}>
                  Nenhum produto encontrado.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {produtosFiltrados.map((produto) => (
                    <Box
                      key={produto.id}
                      onClick={() => selecionarProduto(produto)}
                      sx={{
                        p: 1.4,
                        borderRadius: '14px',
                        border: '1px solid #F0F0F0',
                        cursor: 'pointer',
                        transition: '0.2s ease',
                        '&:hover': {
                          bgcolor: '#F6FBF8',
                          borderColor: '#128654',
                        },
                      }}
                    >
                      <Typography sx={{ color: '#1B2635', fontWeight: 900, fontSize: '0.92rem' }}>
                        {produto.nome}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Código: {produto.id}
                      </Typography>
                      <Typography sx={{ color: '#128654', fontWeight: 900, fontSize: '0.86rem', mt: 0.4 }}>
                        R$ {formatMoney(produto.precoVenda)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Card>
        </Grid>


        <Grid item xs={12} md={8} sx={{ minHeight: 0 }}>
          <Card
            sx={{
              p: { xs: 2.5, lg: 3.5 },
              borderRadius: '25px',
              border: '1px solid #F0F0F0',
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 26px rgba(0,0,0,0.035)',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '16px',
                  bgcolor: '#E8F5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalOfferOutlinedIcon sx={{ color: '#128654' }} />
              </Box>
              <Box>
                <Typography sx={{ color: '#128654', fontWeight: 900, fontSize: '1.05rem' }}>
                  Alterar Informações Da Etiqueta Digital
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  Selecione um produto, confira a descrição, ajuste o valor se necessário e envie para o display LCD.
                </Typography>
              </Box>
            </Stack>


            <Grid container spacing={2.5} sx={{ flexShrink: 0 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Descrição Do Produto"
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                  fullWidth
                  sx={campoPadrao}
                  helperText="Preenchido automaticamente ao selecionar um produto."
                />
              </Grid>


              <Grid item xs={12} md={3}>
                <TextField
                  label="Valor Da Etiqueta"
                  type="number"
                  value={valorEtiqueta}
                  onChange={(event) => setValorEtiqueta(event.target.value)}
                  fullWidth
                  sx={campoPadrao}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  helperText="Opcional alterar antes de enviar."
                />
              </Grid>


              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="ID Da Etiqueta Digital"
                  value={etiquetaDigitalId}
                  onChange={(event) => setEtiquetaDigitalId(event.target.value)}
                  fullWidth
                  sx={campoPadrao}
                  helperText="Selecione o display que será alterado."
                >
                  {etiquetasDigitais.map((etiqueta) => (
                    <MenuItem key={etiqueta.id} value={etiqueta.id}>
                      {etiqueta.label} - {etiqueta.id}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>


            <Card
              sx={{
                mt: 3,
                p: 3,
                borderRadius: '22px',
                border: '1px solid #E8F5E9',
                bgcolor: '#F6FBF8',
                flexShrink: 0,
              }}
            >
              <Typography sx={{ color: '#128654', fontWeight: 900, mb: 1 }}>
                Prévia Do Envio
              </Typography>


              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    PRODUTO
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    {descricao || 'Nenhum produto selecionado'}
                  </Typography>
                </Grid>


                <Grid item xs={12} md={4}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    VALOR
                  </Typography>
                  <Typography sx={{ color: '#128654', fontWeight: 900 }}>
                    R$ {formatMoney(valorEtiqueta)}
                  </Typography>
                </Grid>


                <Grid item xs={12} md={4}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    ETIQUETA DIGITAL
                  </Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    {etiquetaDigitalId}
                  </Typography>
                </Grid>
              </Grid>
            </Card>


            <Box sx={{ flex: 1, minHeight: 0 }} />


            <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 3, flexShrink: 0 }}>
              <Button
                variant="outlined"
                disabled={enviando}
                onClick={limparSelecao}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 800,
                  px: 4,
                }}
              >
                Limpar
              </Button>


              <Button
                variant="contained"
                startIcon={<SendOutlinedIcon />}
                disabled={enviando}
                onClick={confirmarAlteracao}
                sx={{
                  bgcolor: '#128654',
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 900,
                  px: 4,
                  py: 1.25,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#0E6B43' },
                }}
              >
                {enviando ? 'Enviando...' : 'Confirmar Alteração'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};


export default EtiquetaDigital;



