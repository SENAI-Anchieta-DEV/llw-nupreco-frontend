import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Card, IconButton, CssBaseline, 
  Grid, TextField, Button, Modal, MenuItem, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';

import HomeIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

const PdvRapido = ({ onBack, onLogout, onRegistrarVenda, nomeVendedor, estoque = [], carregando }) => {
  const [vendaAtiva, setVendaAtiva] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]);
  const [valorPago, setValorPago] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO');

  // Adicionar Item ao Carrinho (envelopado em useCallback para evitar avisos no useEffect)
  const adicionarItem = useCallback(() => {
    const encontrado = estoque.find(p => p.cod === codigo);
    
    if (!encontrado) {
      alert("Produto não encontrado!");
      return;
    }

    const novoItem = {
      id: Date.now(),
      cod: encontrado.cod,
      desc: encontrado.desc,
      precoUnitario: encontrado.preco,
      qtd: parseInt(quantidade),
      subtotal: encontrado.preco * parseInt(quantidade)
    };

    setCarrinho((prev) => [...prev, novoItem]);
    setCodigo('');
    setQuantidade(1);
  }, [codigo, quantidade, estoque]);

  const removerItem = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  // Atalhos de Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F3' && vendaAtiva) { e.preventDefault(); setOpenModal(true); }
      if (e.key === 'Enter' && codigo && vendaAtiva) { adicionarItem(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vendaAtiva, codigo, adicionarItem]);

  const totalVenda = carrinho.reduce((acc, item) => acc + item.subtotal, 0);
  const troco = valorPago > totalVenda ? valorPago - totalVenda : 0;

  const finalizarOperacao = (status) => {
    if (status === 'CANCELADA') {
      setVendaAtiva(false); setCarrinho([]); setCodigo(''); setQuantidade(1);
      return;
    }

    if (carrinho.length > 0 && onRegistrarVenda) {
      onRegistrarVenda({
        data: new Date().toLocaleDateString('pt-BR'),
        vendedor: nomeVendedor || 'SISTEMA',
        itens: carrinho,
        total: `R$ ${totalVenda.toFixed(2)}`,
        status: status
      }).then(() => {
        // Limpa após o sucesso da venda (que ocorre depois do loading no App.js)
        setVendaAtiva(false); 
        setCarrinho([]); 
        setCodigo(''); 
        setQuantidade(1); 
        setValorPago('');
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F9F9F9', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <Box sx={{ width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        <IconButton onClick={onBack} sx={{ color: 'white' }}><HomeIcon sx={{ fontSize: '2.5rem' }} /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onLogout} sx={{ color: 'white', mb: 2 }}><LogoutIcon sx={{ fontSize: '2.2rem' }} /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="caption" sx={{ color: '#AAA', fontWeight: 'bold' }}>PDV RÁPIDO - NuPreço</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Card onClick={() => {setVendaAtiva(true); setCarrinho([]);}} sx={{ flex: 1, p: 2, borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: vendaAtiva ? '2px solid #128654' : '1px solid #EEE' }}>
            <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>NOVA VENDA</Typography>
            <AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '2.5rem' }} />
          </Card>
          <Card onClick={() => finalizarOperacao('CANCELADA')} sx={{ flex: 1, p: 2, borderRadius: '20px', textAlign: 'center', cursor: 'pointer' }}>
            <Typography sx={{ color: '#C62828', fontWeight: 'bold' }}>CANCELAR TUDO</Typography>
            <HighlightOffIcon sx={{ color: '#C62828', fontSize: '2.5rem' }} />
          </Card>
        </Box>

        {/* INPUT DE LANÇAMENTO */}
        <Grid container spacing={2} sx={{ opacity: vendaAtiva ? 1 : 0.4, pointerEvents: vendaAtiva ? 'auto' : 'none', bgcolor:'white', p: 2, borderRadius:'20px', border:'1px solid #EEE' }}>
          <Grid item xs={2}><TextField label="QTD" type="number" value={quantidade} onChange={(e)=>setQuantidade(e.target.value)} fullWidth size="small" sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px'}}} /></Grid>
          <Grid item xs={3}><TextField label="CÓDIGO" value={codigo} onChange={(e)=>setCodigo(e.target.value)} fullWidth size="small" sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px'}}} /></Grid>
          <Grid item xs={5}><Typography variant="body2" sx={{mt:1, color:'#666'}}>Pressione <strong>ENTER</strong> para adicionar ou <strong>F3</strong> para estoque</Typography></Grid>
          <Grid item xs={2}><Button variant="outlined" onClick={adicionarItem} fullWidth sx={{borderRadius:'15px', color:'#128654', borderColor:'#128654'}}>ADD</Button></Grid>
        </Grid>

        {/* TABELA DE ITENS */}
        <TableContainer component={Paper} sx={{ flexGrow: 1, borderRadius: '20px', boxShadow: 'none', border: '1px solid #EEE', overflowY:'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{bgcolor:'#128654', color:'white'}}>Item</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white'}}>Descrição</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white'}}>Qtd</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white'}}>Unit.</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white'}}>Subtotal</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white'}} align="center">Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carrinho.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.desc}</TableCell>
                  <TableCell>{item.qtd}</TableCell>
                  <TableCell>R$ {item.precoUnitario.toFixed(2)}</TableCell>
                  <TableCell><strong>R$ {item.subtotal.toFixed(2)}</strong></TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => removerItem(item.id)}><DeleteIcon sx={{color:'#C62828'}} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {carrinho.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{py:4, color:'#AAA'}}>Aguardando produtos...</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* FECHAMENTO */}
        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '25px', border: '1px solid #EEE' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="caption" sx={{fontWeight:'bold', color:'#128654'}}>TOTAL GERAL</Typography>
              <Typography variant="h4" sx={{fontWeight:'bold'}}>R$ {totalVenda.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField label="VALOR PAGO" type="number" value={valorPago} onChange={(e)=>setValorPago(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px'}}} />
            </Grid>
            <Grid item xs={3}>
              <TextField select label="PAGAMENTO" value={formaPagamento} onChange={(e)=>setFormaPagamento(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px'}}}>
                <MenuItem value="DINHEIRO">DINHEIRO</MenuItem>
                <MenuItem value="CARTÃO">CARTÃO</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3}>
               <Typography variant="caption" sx={{fontWeight:'bold', color:'#C62828'}}>TROCO</Typography>
               <Typography variant="h5" sx={{fontWeight:'bold'}}>R$ {troco.toFixed(2)}</Typography>
            </Grid>
          </Grid>
          
          <Button 
            variant="contained" 
            fullWidth 
            disabled={!vendaAtiva || carrinho.length === 0 || carregando} 
            onClick={()=>finalizarOperacao('CONCLUIDA')} 
            sx={{bgcolor:'#128654', borderRadius:'15px', mt: 2, py: 1.5, fontWeight:'bold', fontSize:'1.1rem'}}
          >
            {carregando ? "PROCESSANDO..." : `FINALIZAR VENDA (R$ ${totalVenda.toFixed(2)})`}
          </Button>
        </Box>
      </Box>

      {/* MODAL F3 */}
      <Modal open={openModal} onClose={()=>setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, bgcolor: 'white', borderRadius: '25px', p: 4, maxHeight:'80vh', overflowY:'auto' }}>
          <Typography variant="h6" sx={{ color: '#128654', mb: 2, fontWeight:'bold' }}>ESTOQUE DISPONÍVEL</Typography>
          {estoque.map(p => (
            <Box key={p.cod} onClick={()=>{setCodigo(p.cod); setOpenModal(false);}} sx={{ p:2, borderBottom:'1px solid #EEE', cursor:'pointer', '&:hover':{bgcolor:'#F9F9F9'}, display:'flex', justifyContent:'space-between' }}>
              <Typography><strong>{p.cod}</strong> - {p.desc}</Typography>
              <Typography sx={{color:'#128654', fontWeight:'bold'}}>R$ {p.preco.toFixed(2)}</Typography>
            </Box>
          ))}
        </Box>
      </Modal>
    </Box>
  );
};

export default PdvRapido;