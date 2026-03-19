import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, IconButton, Stack, CssBaseline, 
  Grid, TextField, Button, Modal, MenuItem 
} from '@mui/material';

import HomeIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// MODIFICAÇÃO: Agora recebe 'estoque' e 'nomeVendedor' via props
const PdvRapido = ({ onBack, onLogout, onRegistrarVenda, nomeVendedor, estoque = [] }) => {
  const [vendaAtiva, setVendaAtiva] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [produto, setProduto] = useState({ desc: '', preco: 0 });
  const [quantidade, setQuantidade] = useState(1);
  const [valorPago, setValorPago] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO');

  // BUSCA DINÂMICA: Agora ele procura na lista que vem do App.js
  useEffect(() => {
    if (codigo && vendaAtiva) {
      const encontrado = estoque.find(p => p.cod === codigo);
      setProduto(encontrado || { desc: 'NÃO ENCONTRADO', preco: 0 });
    }
  }, [codigo, vendaAtiva, estoque]);

  useEffect(() => {
    const handleF3 = (e) => { if (e.key === 'F3' && vendaAtiva) { e.preventDefault(); setOpenModal(true); } };
    window.addEventListener('keydown', handleF3);
    return () => window.removeEventListener('keydown', handleF3);
  }, [vendaAtiva]);

  const finalizarOperacao = (status) => {
    if (produto.preco > 0 && onRegistrarVenda) {
      onRegistrarVenda({
        id: 'TEMP', // O App.js vai gerar o ID 000001 oficial
        data: new Date().toLocaleDateString('pt-BR'),
        vendedor: nomeVendedor || 'SISTEMA', // Usa o nome de quem logou
        qtd: parseInt(quantidade),
        total: `R$ ${(quantidade * produto.preco).toFixed(2)}`,
        status: status
      });
    }
    setVendaAtiva(false); setCodigo(''); setProduto({ desc: '', preco: 0 }); setQuantidade(1); setValorPago('');
  };

  const totalVenda = quantidade * produto.preco;
  const troco = valorPago > totalVenda ? valorPago - totalVenda : 0;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F9F9F9', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <Box sx={{ width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        <IconButton onClick={onBack} sx={{ color: 'white' }}><HomeIcon sx={{ fontSize: '2.5rem' }} /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onLogout} sx={{ color: 'white', mb: 2 }}><LogoutIcon sx={{ fontSize: '2.2rem' }} /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="caption" sx={{ color: '#DDD', fontWeight: 'bold' }}>PDV RÁPIDO</Typography>
        
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Card onClick={() => setVendaAtiva(true)} sx={{ flex: 1, p: 3, borderRadius: '25px', textAlign: 'center', cursor: 'pointer', border: vendaAtiva ? '2px solid #128654' : '1px solid #EEE' }}>
            <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>NOVA VENDA</Typography>
            <AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '3.5rem' }} />
          </Card>
          <Card onClick={() => finalizarOperacao('CANCELADA')} sx={{ flex: 1, p: 3, borderRadius: '25px', textAlign: 'center', cursor: 'pointer' }}>
            <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>EXCLUIR / CANCELAR</Typography>
            <HighlightOffIcon sx={{ color: '#C62828', fontSize: '3.5rem' }} />
          </Card>
        </Box>

        <Grid container spacing={3} sx={{ opacity: vendaAtiva ? 1 : 0.4, pointerEvents: vendaAtiva ? 'auto' : 'none' }}>
          <Grid item xs={2}><TextField label="QTD" type="number" value={quantidade} onChange={(e)=>setQuantidade(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'25px'}}} /></Grid>
          <Grid item xs={3}><TextField label="CÓDIGO (F3)" value={codigo} onChange={(e)=>setCodigo(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'25px'}}} /></Grid>
          <Grid item xs={7}><TextField label="DESCRIÇÃO" value={produto.desc} fullWidth InputProps={{readOnly:true}} sx={{'& .MuiOutlinedInput-root':{borderRadius:'25px', bgcolor:'#F0F0F0'}}} /></Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 'auto', opacity: vendaAtiva ? 1 : 0.4 }}>
          <Grid item xs={4}><TextField label="TOTAL VENDA" value={`R$ ${totalVenda.toFixed(2)}`} fullWidth InputProps={{readOnly:true}} sx={{'& .MuiOutlinedInput-root':{borderRadius:'25px'}}} /></Grid>
          <Grid item xs={4}><TextField label="VALOR PAGO" type="number" value={valorPago} onChange={(e)=>setValorPago(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'25px'}}} /></Grid>
          <Grid item xs={4}><TextField label="TROCO" value={`R$ ${troco.toFixed(2)}`} fullWidth InputProps={{readOnly:true}} sx={{'& .MuiOutlinedInput-root':{borderRadius:'25px'}}} /></Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 3, opacity: vendaAtiva ? 1 : 0.4 }}>
          <TextField select label="FORMA DE PAGAMENTO" value={formaPagamento} onChange={(e)=>setFormaPagamento(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'25px'}}}>
            <MenuItem value="DINHEIRO">DINHEIRO</MenuItem>
            <MenuItem value="CARTÃO">CARTÃO</MenuItem>
            <MenuItem value="PIX">PIX</MenuItem>
          </TextField>
          <Button variant="contained" disabled={!vendaAtiva || totalVenda === 0} onClick={()=>finalizarOperacao('CONCLUIDA')} sx={{bgcolor:'#128654', borderRadius:'15px', px:8, fontWeight:'bold'}}>CONCLUIR</Button>
        </Box>
      </Box>

      {/* MODAL DE PRODUTOS DINÂMICO (F3) */}
      <Modal open={openModal} onClose={()=>setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', borderRadius: '25px', p: 4 }}>
          <Typography variant="h6" sx={{ color: '#128654', mb: 2 }}>ESTOQUE DISPONÍVEL (F3)</Typography>
          {estoque.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', py: 2 }}>Nenhum produto cadastrado.</Typography>
          ) : (
            estoque.map(p => (
              <Box key={p.cod} onClick={()=>{setCodigo(p.cod); setOpenModal(false);}} sx={{ p:2, borderBottom:'1px solid #EEE', cursor:'pointer', '&:hover':{bgcolor:'#F9F9F9'} }}>
                {p.cod} - {p.desc} (R$ {p.preco.toFixed(2)})
              </Box>
            ))
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default PdvRapido;