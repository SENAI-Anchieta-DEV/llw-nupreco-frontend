import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CssBaseline,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  useTheme
} from '@mui/material';

import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ReportProblemIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/AllInbox';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/EditOutlined';
import ListAltIcon from '@mui/icons-material/ListAltOutlined';
import SaveIcon from '@mui/icons-material/Save';

import SidebarMenu from './components/SidebarMenu';

const categoriasPadrao = ['ALIMENTOS', 'BEBIDAS', 'LIMPEZA', 'UTILIDADES', 'GERAL'];

const Produto = ({
  onBack,
  onLogout,
  onSalvarProduto,
  aoExcluirProduto,
  produtosCadastrados = [],
  aoClicarEstoque,
  aoNotificar,
  aoIrVendas,
  aoIrUsuarios,
  aoIrPdv,
  aoIrContas
}) => {
  const theme = useTheme();

  const modulos = [
    { text: 'Início', icon: <HomeIcon />, action: onBack },
    { text: 'Usuário', icon: <PersonIcon />, action: aoIrUsuarios },
    { text: 'Vendas', icon: <AssessmentIcon />, action: aoIrVendas },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, action: aoIrPdv },
    { text: 'Contas', icon: <ReportProblemIcon />, action: aoIrContas },
    { text: 'Estoque', icon: <InventoryIcon />, action: aoClicarEstoque },
    { text: 'Produtos', icon: <CategoryIcon /> },
    { text: 'Sair', icon: <LogoutIcon />, action: onLogout }
  ];

  const [modoLista, setModoLista] = useState(false);
  const [acaoLista, setAcaoLista] = useState('');

  const [idInterno, setIdInterno] = useState(null);
  const [cod, setCod] = useState('');
  const [desc, setDesc] = useState('');
  const [categoria, setCategoria] = useState('GERAL');
  const [qtd, setQtd] = useState('');
  const [preco, setPreco] = useState('');

  const prepararLista = (acao) => {
    setAcaoLista(acao);
    setModoLista(true);
  };

  const limparCampos = () => {
    setIdInterno(null);
    setCod('');
    setDesc('');
    setCategoria('GERAL');
    setQtd('');
    setPreco('');
    setModoLista(false);
    setAcaoLista('');
  };

  const salvarOuRessalvar = () => {
    if (!cod || !desc || !preco || qtd === '') {
      aoNotificar?.('Preencha código, descrição, quantidade e preço!', 'warning');
      return;
    }

    if (Number(qtd) < 0 || Number(preco) <= 0) {
      aoNotificar?.('Quantidade inválida ou preço deve ser maior que zero!', 'warning');
      return;
    }

    const payload = {
      id: idInterno || Date.now().toString(),
      cod: cod.trim(),
      desc: desc.trim().toUpperCase(),
      categoria,
      qtd: Number(qtd),
      preco: Number(preco)
    };

    onSalvarProduto?.(payload);
    limparCampos();
  };

  const ActionCard = ({ label, icon }) => (
    <Card
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
            : '0px 10px 20px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Typography variant="body2" sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}>
        {label}
      </Typography>
      {icon}
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      <SidebarMenu modulos={modulos} />

      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
          CADASTRO / PRODUTOS
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3} onClick={limparCampos}>
            <ActionCard label="NOVO PRODUTO" icon={<AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '3rem' }} />} />
          </Grid>
          <Grid item xs={12} md={3} onClick={() => prepararLista('EXCLUIR')}>
            <ActionCard label="EXCLUIR PRODUTO" icon={<HighlightOffIcon sx={{ color: '#C62828', fontSize: '3rem' }} />} />
          </Grid>
          <Grid item xs={12} md={3} onClick={() => prepararLista('EDITAR')}>
            <ActionCard label="ALTERAR DADOS" icon={<EditIcon sx={{ color: '#FBC02D', fontSize: '3rem' }} />} />
          </Grid>
          <Grid item xs={12} md={3} onClick={() => prepararLista('CONSULTAR')}>
            <ActionCard label="CONSULTAR PRODUTOS" icon={<ListAltIcon sx={{ color: '#1976D2', fontSize: '3rem' }} />} />
          </Grid>
        </Grid>

        {modoLista ? (
          <TableContainer component={Paper} sx={{ borderRadius: '25px', maxHeight: '60vh', border: `1px solid ${theme.palette.divider}` }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: 'background.paper' }}><strong>Código</strong></TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper' }}><strong>Descrição</strong></TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper' }}><strong>Categoria</strong></TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper' }} align="center"><strong>Qtd</strong></TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper' }} align="right"><strong>Preço</strong></TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper' }} align="center"><strong>Ação</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtosCadastrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Nenhum produto cadastrado.</TableCell>
                  </TableRow>
                ) : (
                  produtosCadastrados.map((p) => (
                    <TableRow key={p.id || p.cod}>
                      <TableCell>{p.cod}</TableCell>
                      <TableCell>{p.desc}</TableCell>
                      <TableCell>{p.categoria || 'GERAL'}</TableCell>
                      <TableCell align="center">{p.qtd}</TableCell>
                      <TableCell align="right">
                        R$ {Number(p.preco).toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {acaoLista === 'EXCLUIR' ? (
                          <Button
                            onClick={() => aoExcluirProduto?.(p.id || p.cod)}
                            sx={{ color: '#D32F2F', fontWeight: 'bold' }}
                          >
                            REMOVER
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setIdInterno(p.id || null);
                              setCod(p.cod || '');
                              setDesc(p.desc || '');
                              setCategoria(p.categoria || 'GERAL');
                              setQtd(p.qtd ?? '');
                              setPreco(p.preco ?? '');
                              setModoLista(false);
                            }}
                            sx={{ color: '#ED6C02', fontWeight: 'bold' }}
                          >
                            EDITAR
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: '25px',
              boxShadow: theme.palette.mode === 'dark'
                ? '0px 4px 20px rgba(0,0,0,0.35)'
                : '0px 4px 20px rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: '#128654', fontWeight: 'bold' }}>
              {idInterno ? `Editando Produto: ${cod}` : 'Cadastrar Novo Produto'}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="CÓDIGO"
                  value={cod}
                  onChange={(e) => setCod(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  label="DESCRIÇÃO"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="CATEGORIA"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  fullWidth
                >
                  {categoriasPadrao.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="QUANTIDADE"
                  type="number"
                  value={qtd}
                  onChange={(e) => setQtd(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="PREÇO DE VENDA"
                  type="number"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
              {idInterno && (
                <Button onClick={limparCampos} sx={{ color: 'text.secondary' }}>
                  Cancelar
                </Button>
              )}
              <Button
                variant="contained"
                onClick={salvarOuRessalvar}
                startIcon={<SaveIcon />}
                sx={{ bgcolor: '#128654', borderRadius: '25px', px: 6, '&:hover': { bgcolor: '#0e6b43' } }}
              >
                {idInterno ? 'RESSALVAR ALTERAÇÕES' : 'SALVAR PRODUTO'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Produto;