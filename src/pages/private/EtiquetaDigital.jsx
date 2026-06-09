import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Divider,
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
import displayLcdService from '../../services/displayLcdService';
import { getApiErrorMessage } from '../../services/apiResponse';
 
 
 
 
const normalizarTexto = (value) => String(value ?? '').trim().toLowerCase();
 
 
 
 
const formatMoney = (value) => Number(value || 0).toFixed(2);
 
 
 
 
const campoPadrao = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    bgcolor: 'background.paper',
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
  const [etiquetaDigitalId, setEtiquetaDigitalId] = useState('');
  const [etiquetasDigitais, setEtiquetasDigitais] = useState([]);
  const [novoCodigoSerial, setNovoCodigoSerial] = useState('');
  const [cadastrandoEtiqueta, setCadastrandoEtiqueta] = useState(false);
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
 
 
 
 
  const carregarDados = async () => {
    setCarregando(true);
    setErro('');
 
    try {
      const [produtosApi, etiquetasApi] = await Promise.all([
        produtoService.listar(),
        displayLcdService.listar(),
      ]);
 
      setProdutos(produtosApi);
      setEtiquetasDigitais(etiquetasApi);
 
      if (!etiquetaDigitalId && etiquetasApi.length > 0) {
        setEtiquetaDigitalId(etiquetasApi[0].id);
      }
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível carregar os produtos e as etiquetas digitais.'));
    } finally {
      setCarregando(false);
    }
  };
 
  useEffect(() => {
    carregarDados();
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
 
 
 
 
 
  const cadastrarEtiquetaDigital = async () => {
    setErro('');
    setSucesso('');
 
    if (!produtoSelecionado) {
      setErro('Selecione um produto antes de cadastrar a etiqueta digital.');
      return;
    }
 
    if (!novoCodigoSerial.trim()) {
      setErro('Informe o código serial da etiqueta digital. Exemplo: LCD-01.');
      return;
    }
 
    setCadastrandoEtiqueta(true);
 
    try {
      const etiquetaCriada = await displayLcdService.criar({
        codigoSerial: novoCodigoSerial.trim(),
        chavePublica: novoCodigoSerial.trim(),
        ativo: true,
        produtoId: produtoSelecionado.id,
      });
 
      const etiquetasAtualizadas = [...etiquetasDigitais, etiquetaCriada].sort((a, b) =>
        String(a.codigoSerial || '').localeCompare(String(b.codigoSerial || ''), 'pt-BR')
      );
 
      setEtiquetasDigitais(etiquetasAtualizadas);
      setEtiquetaDigitalId(etiquetaCriada.id);
      setNovoCodigoSerial('');
      setSucesso(`Etiqueta digital ${etiquetaCriada.codigoSerial} cadastrada e vinculada ao produto selecionado.`);
    } catch (error) {
      setErro(getApiErrorMessage(error, 'Não foi possível cadastrar a etiqueta digital.'));
    } finally {
      setCadastrandoEtiqueta(false);
    }
  };
 
  const etiquetaSelecionada = etiquetasDigitais.find((etiqueta) => etiqueta.id === etiquetaDigitalId);
 
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
 
 
 
 
      setSucesso(`Informações enviadas para a ${etiquetaSelecionada?.codigoSerial || 'etiqueta digital'} com sucesso.`);
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
 
 
 
 
      {erro && <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2, flexShrink: 0 }}>{sucesso}</Alert>}
 
 
 
 
      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={12} md={4} sx={{ minHeight: 0 }}>
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
                border: (theme) => `1px solid ${theme.palette.divider}`,
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                p: 1.2,
                bgcolor: 'background.paper',
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
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        cursor: 'pointer',
                        transition: '0.2s ease',
                        '&:hover': {
                          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8',
                          borderColor: '#128654',
                        },
                      }}
                    >
                      <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '0.92rem' }}>
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
              border: (theme) => `1px solid ${theme.palette.divider}`,
              height: '100%',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 10px 26px rgba(0,0,0,0.28)' : '0 10px 26px rgba(0,0,0,0.035)',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: '16px',
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.18)' : '#E8F5E9',
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
                  label="Etiqueta Digital Cadastrada"
                  value={etiquetaDigitalId}
                  onChange={(event) => setEtiquetaDigitalId(event.target.value)}
                  fullWidth
                  sx={campoPadrao}
                  helperText="Selecione uma etiqueta cadastrada no backend."
                >
                  {etiquetasDigitais.map((etiqueta) => (
                    <MenuItem key={etiqueta.id} value={etiqueta.id}>
                      {etiqueta.codigoSerial} {etiqueta.ativo ? '' : '- Inativa'}
                    </MenuItem>
                  ))}
                  {etiquetasDigitais.length === 0 && (
                    <MenuItem value="" disabled>
                      Nenhuma etiqueta cadastrada
                    </MenuItem>
                  )}
                </TextField>
              </Grid>
            </Grid>
 
            <Divider sx={{ my: 2.5 }} />
 
            <Grid container spacing={2.5} sx={{ flexShrink: 0 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Código Serial Da Nova Etiqueta"
                  value={novoCodigoSerial}
                  onChange={(event) => setNovoCodigoSerial(event.target.value)}
                  fullWidth
                  sx={campoPadrao}
                  helperText="Use o mesmo código configurado no ESP32. Exemplo: LCD-01."
                />
              </Grid>
 
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  disabled={cadastrandoEtiqueta || !produtoSelecionado}
                  onClick={cadastrarEtiquetaDigital}
                  fullWidth
                  sx={{
                    height: '56px',
                    borderColor: '#128654',
                    color: '#128654',
                    textTransform: 'none',
                    fontWeight: 900,
                    borderRadius: '14px',
                  }}
                >
                  {cadastrandoEtiqueta ? 'Cadastrando...' : 'Cadastrar Etiqueta'}
                </Button>
              </Grid>
            </Grid>
 
            <Card
              sx={{
                mt: 3,
                p: 3,
                borderRadius: '22px',
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.35)' : '#E8F5E9'}`,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(18,134,84,0.14)' : '#F6FBF8',
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
                    {etiquetaSelecionada?.codigoSerial || 'Nenhuma etiqueta selecionada'}
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

