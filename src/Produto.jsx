import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, IconButton, CssBaseline, 
  Grid, TextField, Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment
} from '@mui/material';

// Ícones
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; 
import EditIcon from '@mui/icons-material/EditOutlined'; 
import ListAltIcon from '@mui/icons-material/ListAltOutlined'; 
import SaveIcon from '@mui/icons-material/Save';

const nuInputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#F5F5F5', borderRadius: '25px', height: '50px',
    '& fieldset': { borderColor: '#EEE' },
    '&:hover fieldset': { borderColor: '#128654' },
    '&.Mui-focused fieldset': { borderColor: '#128654' },
  },
  '& .MuiInputLabel-root': {
    color: '#BBB', fontWeight: 'bold', top: '-3px', 
    '&.Mui-focused, &.MuiInputLabel-shrink': {
      color: '#128654', transform: 'translate(14px, -10px) scale(0.75)',
    }
  },
};

const Produto = ({ onBack, onLogout, onSalvarProduto, produtosCadastrados, onExcluirProduto, aoClicarEstoque }) => {
  const [modoLista, setModoLista] = useState(false);
  const [acaoLista, setAcaoLista] = useState(''); 

  // Estados dos campos
  const [idInterno, setIdInterno] = useState(null);
  const [quantidade, setQuantidade] = useState('1');
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [valorDefinido, setValorDefinido] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valorSugerido, setValorSugerido] = useState('0.00');
  const [margemLucro, setMargemLucro] = useState('0.00%');

  const listaCategorias = ['MERCEARIA', 'BEBIDAS', 'LIMPEZA', 'OUTROS'];

  // Lógica de cálculo automática
  useEffect(() => {
    const pago = parseFloat(valorPago.toString().replace(',', '.'));
    const definido = parseFloat(valorDefinido.toString().replace(',', '.'));
    if (!isNaN(pago)) setValorSugerido((pago * 1.5).toFixed(2));
    if (!isNaN(pago) && !isNaN(definido) && definido > 0) {
      const margem = ((definido - pago) / definido) * 100;
      setMargemLucro(`${margem.toFixed(2)}%`);
    }
  }, [valorPago, valorDefinido]);

  const limparCampos = () => {
    setIdInterno(null);
    setCodigo(''); setDescricao(''); setValorPago(''); setValorDefinido(''); setQuantidade('1'); setCategoria('');
  };

  const prepararLista = (acao) => {
    if (acao === 'CONSULTAR') {
        aoClicarEstoque(); // Vai para a tela de estoque conforme solicitado
        return;
    }
    setAcaoLista(acao);
    setModoLista(true);
  };

  const salvarOuRessalvar = () => {
    if (!codigo || !descricao || !valorDefinido) {
      alert("Preencha os campos obrigatórios!"); return;
    }

    const payload = {
      id: idInterno || Date.now(),
      cod: codigo,
      desc: descricao.toUpperCase(),
      preco: parseFloat(valorDefinido.toString().replace(',', '.')),
      qtd: parseInt(quantidade) || 0,
      custo: parseFloat(valorPago.toString().replace(',', '.')) || 0,
      categoria: categoria,
      margem: margemLucro
    };

    onSalvarProduto(payload); // O App.js deve lidar com a lógica de update se o ID já existir
    alert(idInterno ? "Produto atualizado!" : "Produto cadastrado!");
    setModoLista(false);
    limparCampos();
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F9F9F9', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      <Box sx={{ width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, height: '100vh', position: 'fixed', left: 0 }}>
        <IconButton onClick={onBack} sx={{ mb: 4 }}><HomeIcon sx={{ fontSize: '2.5rem', color: 'white' }} /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onLogout} sx={{ mb: 2 }}><LogoutIcon sx={{ color: 'white', fontSize: '2.2rem' }} /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, ml: '85px', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="caption" sx={{ color: '#DDD', fontWeight: 'bold' }}>PRODUTOS</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={3} onClick={() => {setModoLista(false); limparCampos();}}><ActionCard label="NOVO PRODUTO" icon={<AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '3rem' }} />} /></Grid>
          <Grid item xs={3} onClick={() => prepararLista('EXCLUIR')}><ActionCard label="EXCLUIR PRODUTO" icon={<HighlightOffIcon sx={{ color: '#C62828', fontSize: '3rem' }} />} /></Grid>
          <Grid item xs={3} onClick={() => prepararLista('EDITAR')}><ActionCard label="ALTERAR PRODUTO" icon={<EditIcon sx={{ color: '#FBC02D', fontSize: '3rem' }} />} /></Grid>
          <Grid item xs={3} onClick={() => prepararLista('CONSULTAR')}><ActionCard label="CONSULTAR ESTOQUE" icon={<ListAltIcon sx={{ color: '#1976D2', fontSize: '3rem' }} />} /></Grid>
        </Grid>

        {modoLista ? (
          <TableContainer component={Paper} sx={{ borderRadius: '25px', maxHeight: '60vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Cód</strong></TableCell>
                  <TableCell><strong>Descrição</strong></TableCell>
                  <TableCell><strong>Preço</strong></TableCell>
                  <TableCell><strong>Qtd</strong></TableCell>
                  <TableCell align="center"><strong>Ação</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtosCadastrados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.cod}</TableCell>
                    <TableCell>{p.desc}</TableCell>
                    <TableCell>R$ {p.preco.toFixed(2)}</TableCell>
                    <TableCell>{p.qtd}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => {
                        if(acaoLista === 'EXCLUIR') {
                            if(window.confirm("Apagar produto?")) onExcluirProduto(p.id);
                        } else {
                            setIdInterno(p.id); setCodigo(p.cod); setDescricao(p.desc); 
                            setValorPago(p.custo); setValorDefinido(p.preco); setQuantidade(p.qtd);
                            setCategoria(p.categoria); setModoLista(false);
                        }
                      }} sx={{color: acaoLista === 'EXCLUIR' ? 'red' : 'orange'}}>
                        {acaoLista === 'EXCLUIR' ? 'APAGAR' : 'EDITAR'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography sx={{color:'#128654', fontWeight:'bold'}}>ID: {idInterno || "NOVO PRODUTO"}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={2}><TextField label="QTD" value={quantidade} onChange={(e)=>setQuantidade(e.target.value)} type="number" fullWidth sx={nuInputStyle} /></Grid>
              <Grid item xs={3}><TextField label="CÓDIGO" value={codigo} onChange={(e)=>setCodigo(e.target.value)} fullWidth sx={nuInputStyle} /></Grid>
              <Grid item xs={7}><TextField label="DESCRIÇÃO" value={descricao} onChange={(e)=>setDescricao(e.target.value)} fullWidth sx={nuInputStyle} /></Grid>
              
              <Grid item xs={3}><TextField label="VALOR PAGO" value={valorPago} onChange={(e)=>setValorPago(e.target.value)} fullWidth sx={nuInputStyle} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} /></Grid>
              <Grid item xs={3}><TextField label="SUGERIDO" value={`R$ ${valorSugerido}`} fullWidth InputProps={{ readOnly: true }} sx={{ ...nuInputStyle, '& .MuiOutlinedInput-root': { bgcolor: '#E0E0E0' } }} /></Grid>
              <Grid item xs={3}><TextField label="DEFINIDO" value={valorDefinido} onChange={(e)=>setValorDefinido(e.target.value)} fullWidth sx={nuInputStyle} InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} /></Grid>
              <Grid item xs={3}><TextField label="MARGEM" value={margemLucro} fullWidth InputProps={{ readOnly: true }} sx={{ ...nuInputStyle, '& .MuiOutlinedInput-root': { bgcolor: '#E0E0E0' } }} /></Grid>
              
              <Grid item xs={12}>
                <TextField select label="CATEGORIA" value={categoria} onChange={(e)=>setCategoria(e.target.value)} fullWidth sx={nuInputStyle}>
                  {listaCategorias.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={salvarOuRessalvar} startIcon={<SaveIcon />} sx={{ bgcolor: '#128654', borderRadius: '25px', px: 10, height: '50px', fontWeight: 'bold' }}>
                {idInterno ? "RESSALVAR PRODUTO" : "SALVAR PRODUTO"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const ActionCard = ({ label, icon }) => (
  <Card sx={{ p: 2, borderRadius: '25px', textAlign: 'center', cursor: 'pointer', border: '1px solid #EEE', boxShadow: '0px 4px 10px rgba(0,0,0,0.02)', '&:hover': { transform: 'scale(1.02)', transition: '0.2s' } }}>
    <Typography variant="body2" sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}>{label}</Typography>
    {icon}
  </Card>
);

export default Produto;