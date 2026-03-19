import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, IconButton, Stack, CssBaseline, 
  Grid, TextField, Button, MenuItem, InputAdornment 
} from '@mui/material';

// Ícones da Identidade Visual (Conforme PDV)
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Novo
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Excluir
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'; // Cancelar

// Estilo dos Inputs PADRONIZADO conforme a imagem do PDV
const nuInputStyle = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#F5F5F5', // Fundo cinza claro
    borderRadius: '25px', // Bordas bem arredondadas
    height: '50px',
    '& fieldset': {
      borderColor: '#EEE', // Borda sutil
    },
    '&:hover fieldset': {
      borderColor: '#128654', // Verde no hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#128654', // Verde no foco
    },
  },
  '& .MuiInputLabel-root': {
    color: '#BBB', // Label cinza claro padrão
    fontWeight: 'bold',
    top: '-3px', // Ajuste para centralizar
    '&.Mui-focused, &.MuiInputLabel-shrink': {
      color: '#128654', // Verde quando ativo
      transform: 'translate(14px, -10px) scale(0.75)',
    }
  },
};

const Produto = ({ onBack, onLogout, onSalvarProduto }) => {
  // Estados dos campos (Baseados na imagem de cadastro)
  const [quantidade, setQuantidade] = useState('1');
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [valorDefinido, setValorDefinido] = useState('');
  const [categoria, setCategoria] = useState('');

  // Estados de cálculo
  const [valorSugerido, setValorSugerido] = useState('0.00');
  const [margemLucro, setMargemLucro] = useState('0.00%');

  const listaCategorias = ['MERCEARIA', 'BEBIDAS', 'LIMPEZA', 'OUTROS'];

  // Lógica de cálculo automática (Baseada nas suas instruções anteriores)
  useEffect(() => {
    const pago = parseFloat(valorPago.replace(',', '.'));
    const definido = parseFloat(valorDefinido.replace(',', '.'));

    if (!isNaN(pago)) {
      setValorSugerido((pago * 1.5).toFixed(2));
    }

    if (!isNaN(pago) && !isNaN(definido) && definido > 0) {
      const margem = ((definido - pago) / definido) * 100;
      setMargemLucro(`${margem.toFixed(2)}%`);
    }
  }, [valorPago, valorDefinido]);

  // Função para salvar e limpar
  const salvar = () => {
    if (!codigo || !descricao || !valorDefinido) {
      alert("Código, Descrição e Valor Definido são obrigatórios!");
      return;
    }

    const payload = {
      cod: codigo,
      desc: descricao.toUpperCase(),
      preco: parseFloat(valorDefinido.replace(',', '.')),
      qtd: parseInt(quantidade) || 0,
      custo: parseFloat(valorPago.replace(',', '.')) || 0,
      categoria: categoria,
      margem: margemLucro
    };

    onSalvarProduto(payload);
    // Limpa campos
    setCodigo(''); setDescricao(''); setValorPago(''); setValorDefinido(''); setQuantidade('1');
  };

  const sidebarIconStyle = { color: 'white', fontSize: '2.2rem' };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F9F9F9', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* SIDEBAR - CÓPIA EXATA DO PDV */}
      <Box sx={{ 
        width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', py: 3, height: '100vh', position: 'fixed', left: 0 
      }}>
        <IconButton onClick={onBack} sx={{ mb: 4 }}><HomeIcon sx={{ fontSize: '2.5rem', color: 'white' }} /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onLogout} sx={{ mb: 2 }}><LogoutIcon sx={sidebarIconStyle} /></IconButton>
      </Box>

      {/* ÁREA DE CONTEÚDO */}
      <Box sx={{ flexGrow: 1, ml: '85px', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="caption" sx={{ color: '#DDD', fontWeight: 'bold' }}>PRODUTO</Typography>
        
        {/* CARDS SUPERIORES - PADRONIZADOS COM PDV */}
        <Grid container spacing={4}>
          {[
            { label: 'PRODUTO NOVO', icon: <AddCircleOutlineIcon sx={{ color: '#128654', fontSize: '3.5rem' }} /> },
            { label: 'EXCLUIR PRODUTO', icon: <HighlightOffIcon sx={{ color: '#C62828', fontSize: '3.5rem' }} /> },
            { label: 'CANCELAR PRODUTO', icon: <CancelOutlinedIcon sx={{ color: '#BBB', fontSize: '3.5rem' }} /> }
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.label}>
              <Card sx={{ 
                p: 3, borderRadius: '25px', textAlign: 'center', bgcolor: 'white',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.03)', border: '1px solid #EEE',
                cursor: 'pointer', '&:hover': { transform: 'scale(1.02)', transition: '0.2s' }
              }}>
                <Typography sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}>{item.label}</Typography>
                {item.icon}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* INPUTS - PADRONIZADOS COM PDV (FUNDO CINZA) */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={2}>
            <TextField label="QTD" value={quantidade} onChange={(e)=>setQuantidade(e.target.value)} type="number" fullWidth sx={nuInputStyle} />
          </Grid>
          <Grid item xs={3}>
            <TextField label="CÓDIGO PRODUTO" value={codigo} onChange={(e)=>setCodigo(e.target.value)} fullWidth sx={nuInputStyle} />
          </Grid>
          <Grid item xs={7}>
            <TextField label="DESCRIÇÃO DO PRODUTO" value={descricao} onChange={(e)=>setDescricao(e.target.value)} fullWidth sx={nuInputStyle} />
          </Grid>
        </Grid>

        {/* LINHA DE VALORES (COM ESPAÇAMENTO DA IMAGEM) */}
        <Grid container spacing={3} sx={{ mt: 8 }}>
          <Grid item xs={3}>
            <TextField 
              label="VALOR PAGO" value={valorPago} onChange={(e)=>setValorPago(e.target.value)} fullWidth sx={nuInputStyle}
              InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} 
            />
          </Grid>
          {/* Valor Sugerido - readonly */}
          <Grid item xs={3}>
            <TextField 
              label="VALOR SUGERIDO" value={`R$ ${valorSugerido}`} fullWidth InputProps={{ readOnly: true }}
              sx={{ ...nuInputStyle, '& .MuiOutlinedInput-root': { ...nuInputStyle['& .MuiOutlinedInput-root'], bgcolor: '#E0E0E0' } }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField 
              label="VALOR DEFINIDO" value={valorDefinido} onChange={(e)=>setValorDefinido(e.target.value)} fullWidth sx={nuInputStyle}
              InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} 
            />
          </Grid>
          {/* Margem Lucro - readonly */}
          <Grid item xs={3}>
            <TextField 
              label="MARGEM LUCRO" value={margemLucro} fullWidth InputProps={{ readOnly: true }}
              sx={{ ...nuInputStyle, '& .MuiOutlinedInput-root': { ...nuInputStyle['& .MuiOutlinedInput-root'], bgcolor: '#E0E0E0' } }}
            />
          </Grid>
        </Grid>

        {/* CATEGORIA E BOTÃO CONCLUIR - PADRONIZADOS COM PDV */}
        <Box sx={{ display: 'flex', gap: 3, mt: 'auto' }}>
          <TextField select label="CATEGORIA" value={categoria} onChange={(e)=>setCategoria(e.target.value)} fullWidth sx={nuInputStyle}>
            {listaCategorias.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          
          {/* Botão de Concluir - Padronizado com PDV */}
          <Button 
            variant="contained" 
            onClick={salvar}
            sx={{ 
              bgcolor: '#128654', color: 'white', borderRadius: '25px', px: 8, fontWeight: 'bold', height: '50px',
              textTransform: 'uppercase', '&:hover': { bgcolor: '#0e6b43' },
              '&.Mui-disabled': { bgcolor: '#E0E0E0', color: '#AAA' }
            }}
          >
            CONCLUIR
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Produto;