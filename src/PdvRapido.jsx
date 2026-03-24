import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Card, IconButton, CssBaseline, 
  Grid, TextField, Button, Modal, MenuItem, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack
} from '@mui/material';

import HomeIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';

const PdvRapido = ({ onBack, onLogout, onRegistrarVenda, nomeVendedor, estoque = [], carregando, aoNotificar }) => {
  const [vendaAtiva, setVendaAtiva] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]);
  const [valorPago, setValorPago] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO');

  // Adicionar Item ao Carrinho com Verificação de Estoque
  const adicionarItem = useCallback(() => {
    const encontrado = estoque.find(p => p.cod === codigo);
    
    if (!encontrado) {
      aoNotificar("Produto não encontrado no sistema!", "error");
      return;
    }

    const qtdSolicitada = parseInt(quantidade);
    const itemNoCarrinho = carrinho.find(item => item.cod === codigo);
    const qtdJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

    // Validação de Estoque Real
    if (encontrado.qtd < (qtdSolicitada + qtdJaNoCarrinho)) {
      aoNotificar(`Estoque insuficiente! Você só possui ${encontrado.qtd} unidades de ${encontrado.desc}`, "warning");
      return;
    }

    if (qtdSolicitada <= 0) {
      aoNotificar("A quantidade deve ser maior que zero!", "warning");
      return;
    }

    const novoItem = {
      id: Date.now(),
      cod: encontrado.cod,
      desc: encontrado.desc,
      precoUnitario: encontrado.preco,
      qtd: qtdSolicitada,
      subtotal: encontrado.preco * qtdSolicitada
    };

    setCarrinho((prev) => [...prev, novoItem]);
    setCodigo('');
    setQuantidade(1);
    aoNotificar(`${encontrado.desc} adicionado!`, "success");
  }, [codigo, quantidade, estoque, carrinho, aoNotificar]);

  const removerItem = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  // Atalhos de Teclado (F3 e Enter)
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
      if (carrinho.length > 0) {
        setVendaAtiva(false); setCarrinho([]); setCodigo(''); setQuantidade(1);
        aoNotificar("Venda cancelada com sucesso.", "info");
      } else {
        setVendaAtiva(false);
      }
      return;
    }

    if (carrinho.length > 0 && onRegistrarVenda) {
      onRegistrarVenda({
        data: new Date().toLocaleDateString('pt-BR'),
        vendedor: nomeVendedor || 'SISTEMA',
        itens: carrinho,
        total: totalVenda,
        pagamento: formaPagamento,
        status: status
      }).then(() => {
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
      
      {/* Sidebar NuPreço */}
      <Box sx={{ width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}>
        <IconButton onClick={onBack} sx={{ color: 'white', mb: 4 }}><HomeIcon sx={{ fontSize: '2.5rem' }} /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onLogout} sx={{ color: 'white', mb: 2 }}><LogoutIcon sx={{ fontSize: '2.2rem' }} /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>PDV RÁPIDO</Typography>
                <Typography variant="caption" sx={{ color: '#999', fontWeight: 'bold' }}>VENDEDOR: {nomeVendedor?.toUpperCase() || 'GESTOR'}</Typography>
            </Box>
            <ShoppingCartIcon sx={{ fontSize: '3rem', color: '#EEE' }} />
        </Stack>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Card onClick={() => {setVendaAtiva(true); setCarrinho([]);}} sx={{ flex: 1, p: 2, borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: vendaAtiva ? '2px solid #128654' : '1px solid #EEE', transition: '0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
            <Typography sx={{ color: '#128654', fontWeight: 'bold' }}>NOVA VENDA (F2)</Typography>
            <AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '2.5rem' }} />
          </Card>
          <Card onClick={() => finalizarOperacao('CANCELADA')} sx={{ flex: 1, p: 2, borderRadius: '20px', textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#FFF5F5' } }}>
            <Typography sx={{ color: '#C62828', fontWeight: 'bold' }}>CANCELAR VENDA</Typography>
            <HighlightOffIcon sx={{ color: '#C62828', fontSize: '2.5rem' }} />
          </Card>
        </Box>

        {/* INPUT DE LANÇAMENTO */}
        <Grid container spacing={2} sx={{ opacity: vendaAtiva ? 1 : 0.4, pointerEvents: vendaAtiva ? 'auto' : 'none', bgcolor:'white', p: 3, borderRadius:'25px', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <Grid item xs={2}><TextField label="QTD" type="number" value={quantidade} onChange={(e)=>setQuantidade(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px', bgcolor: '#F9F9F9'}}} /></Grid>
          <Grid item xs={4}><TextField label="CÓDIGO DE BARRAS / EAN" value={codigo} onChange={(e)=>setCodigo(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px', bgcolor: '#F9F9F9'}}} placeholder="Bipe o produto..." autoFocus={vendaAtiva} /></Grid>
          <Grid item xs={4}><Typography variant="body2" sx={{mt:1.5, color:'#666'}}>DICA: Digite o código e aperte <strong>ENTER</strong>.<br/>Use <strong>F3</strong> para buscar no estoque.</Typography></Grid>
          <Grid item xs={2}><Button variant="contained" onClick={adicionarItem} fullWidth sx={{borderRadius:'15px', height: '55px', bgcolor:'#128654', fontWeight: 'bold'}}>INCLUIR</Button></Grid>
        </Grid>

        {/* LISTA DE ITENS NO CARRINHO */}
        <TableContainer component={Paper} sx={{ flexGrow: 1, borderRadius: '25px', boxShadow: 'none', border: '1px solid #EEE', overflowY:'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{bgcolor:'#128654', color:'white', fontWeight: 'bold'}}>#</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white', fontWeight: 'bold'}}>DESCRIÇÃO</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white', fontWeight: 'bold'}} align="center">QTD</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white', fontWeight: 'bold'}} align="right">UNITÁRIO</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white', fontWeight: 'bold'}} align="right">SUBTOTAL</TableCell>
                <TableCell sx={{bgcolor:'#128654', color:'white', fontWeight: 'bold'}} align="center">REMOVER</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carrinho.map((item, index) => (
                <TableRow key={item.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>{item.desc}</TableCell>
                  <TableCell align="center">{item.qtd}</TableCell>
                  <TableCell align="right">R$ {item.precoUnitario.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{color: '#128654', fontWeight: 'bold'}}>R$ {item.subtotal.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => removerItem(item.id)}><DeleteIcon sx={{color:'#C62828'}} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {carrinho.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{py:6, color:'#BBB', fontStyle: 'italic'}}>Nenhum produto no carrinho. Inicie uma venda!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* RESUMO E FINALIZAÇÃO */}
        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '30px', border: '1px solid #EEE', boxShadow: '0px -5px 20px rgba(0,0,0,0.02)' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="caption" sx={{fontWeight:'bold', color:'#128654', letterSpacing: 1}}>TOTAL DA COMPRA</Typography>
              <Typography variant="h3" sx={{fontWeight:'bold', color: '#128654'}}>R$ {totalVenda.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField label="VALOR RECEBIDO" type="number" value={valorPago} onChange={(e)=>setValorPago(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px'}}} placeholder="R$ 0,00" />
            </Grid>
            <Grid item xs={3}>
              <TextField select label="FORMA DE PAGAMENTO" value={formaPagamento} onChange={(e)=>setFormaPagamento(e.target.value)} fullWidth sx={{'& .MuiOutlinedInput-root':{borderRadius:'15px'}}}>
                <MenuItem value="DINHEIRO">💵 DINHEIRO</MenuItem>
                <MenuItem value="CARTÃO">💳 CARTÃO DE CRÉDITO/DÉBITO</MenuItem>
                <MenuItem value="PIX">⚡ PIX</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={3}>
               <Typography variant="caption" sx={{fontWeight:'bold', color:'#C62828'}}>TROCO A DEVOLVER</Typography>
               <Typography variant="h4" sx={{fontWeight:'bold', color: troco > 0 ? '#C62828' : '#333'}}>R$ {troco.toFixed(2)}</Typography>
            </Grid>
          </Grid>
          
          <Button 
            variant="contained" 
            fullWidth 
            disabled={!vendaAtiva || carrinho.length === 0 || carregando} 
            onClick={()=>finalizarOperacao('CONCLUIDA')} 
            sx={{bgcolor:'#128654', borderRadius:'20px', mt: 3, py: 2, fontWeight:'bold', fontSize:'1.2rem', boxShadow: '0px 4px 15px rgba(18, 134, 84, 0.3)', '&:hover': {bgcolor: '#0e6b43'}}}
          >
            {carregando ? "FINALIZANDO..." : `CONCLUIR VENDA - R$ ${totalVenda.toFixed(2)}`}
          </Button>
        </Box>
      </Box>

      {/* MODAL DE BUSCA RÁPIDA (F3) */}
      <Modal open={openModal} onClose={()=>setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'white', borderRadius: '30px', p: 4, maxHeight:'80vh', overflowY:'auto', boxShadow: 24 }}>
          <Typography variant="h6" sx={{ color: '#128654', mb: 3, fontWeight:'bold', textAlign: 'center' }}>PESQUISAR NO ESTOQUE</Typography>
          {estoque.length === 0 ? (
            <Typography align="center" sx={{color: '#999'}}>Nenhum produto cadastrado.</Typography>
          ) : (
            estoque.map(p => (
                <Box 
                  key={p.cod} 
                  onClick={()=>{setCodigo(p.cod); setOpenModal(false);}} 
                  sx={{ 
                    p:2, 
                    mb: 1,
                    borderRadius: '15px',
                    border:'1px solid #F0F0F0', 
                    cursor:'pointer', 
                    transition: '0.2s',
                    '&:hover':{bgcolor:'#F1F8F5', borderColor: '#128654'}, 
                    display:'flex', 
                    justifyContent:'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box>
                    <Typography sx={{fontWeight: 'bold'}}>{p.desc}</Typography>
                    <Typography variant="caption" color="textSecondary">CÓD: {p.cod} | ESTOQUE: {p.qtd}</Typography>
                  </Box>
                  <Typography sx={{color:'#128654', fontWeight:'bold'}}>R$ {Number(p.preco).toFixed(2)}</Typography>
                </Box>
              ))
          )}
          <Button onClick={()=>setOpenModal(false)} fullWidth sx={{mt: 2, color: '#999'}}>Fechar</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PdvRapido;