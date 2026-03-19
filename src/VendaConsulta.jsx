import React from 'react';
import { 
  Box, Typography, Card, IconButton, Stack, CssBaseline, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Pagination 
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined'; 
import InventoryIcon from '@mui/icons-material/AllInbox';
import WarningIcon from '@mui/icons-material/WarningAmber';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindowsOutlined';

const VendaConsulta = ({ onBack, onLogout, vendas }) => {
  
  // 1. LÓGICA DE SOMA TOTAL (Corrigida para não multiplicar por 100)
  const totalVendido = vendas
    .filter(v => v.status === 'CONCLUIDA')
    .reduce((acc, v) => {
      // Remove R$ e espaços em branco
      let valorLimpo = v.total.replace('R$', '').replace(/\s/g, '');

      // Se o valor contiver VÍRGULA (ex: 16,00), removemos o ponto de milhar e trocamos a vírgula por ponto
      if (valorLimpo.includes(',')) {
        valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
      } 
      // Se NÃO contiver vírgula mas contiver ponto (ex: 16.00 da sua imagem), 
      // o JS já entende como decimal, então não removemos o ponto.
      
      const numero = parseFloat(valorLimpo) || 0;
      return acc + numero;
    }, 0);

  const vendasConcluidas = vendas.filter(v => v.status === 'CONCLUIDA').length;
  
  const taxaCrescimento = vendas.length > 0 
    ? ((vendasConcluidas / vendas.length) * 100).toFixed(0) 
    : 0;

  const sidebarIconStyle = { color: 'white', fontSize: '2.2rem' };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F9F9F9', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />

      {/* SIDEBAR NUPREÇO */}
      <Box sx={{ width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, height: '100vh', zIndex: 1200 }}>
        <Stack spacing={4} alignItems="center">
          <IconButton sx={{ color: 'white' }}><MenuIcon sx={{ fontSize: '2.8rem' }} /></IconButton>
          <IconButton onClick={onBack}><HomeIcon sx={sidebarIconStyle} /></IconButton>
          <IconButton><PersonIcon sx={sidebarIconStyle} /></IconButton>
          <IconButton><AssessmentIcon sx={sidebarIconStyle} /></IconButton>
          <IconButton onClick={onBack}><InventoryIcon sx={sidebarIconStyle} /></IconButton>
          <IconButton><WarningIcon sx={sidebarIconStyle} /></IconButton>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={onLogout} sx={{ mb: 2 }}><LogoutIcon sx={sidebarIconStyle} /></IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="caption" sx={{ color: '#DDD', fontWeight: 'bold', mb: -2 }}>VENDA CONSULTA</Typography>

        {/* CARDS COM O TOTAL CORRIGIDO (SOMA REAL) */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Card sx={{ flex: 1, maxWidth: 350, p: 3, borderRadius: '25px', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0px 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}>
            <Box sx={{ bgcolor: '#E8F5E9', p: 2, borderRadius: '50%', color: '#128654', display: 'flex' }}><GroupIcon /></Box>
            <Box>
              <Typography variant="caption" color="textSecondary">Total vendido (Concluídas)</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#128654' }}>
                {/* Formata para Moeda Brasileira corretamente */}
                {totalVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendingUpIcon sx={{ fontSize: 14, color: '#128654' }} />
                <Typography variant="caption" sx={{ color: '#128654', fontWeight: 'bold' }}>
                  {taxaCrescimento}% de conversão
                </Typography>
              </Stack>
            </Box>
          </Card>

          <Card sx={{ flex: 1, maxWidth: 350, p: 3, borderRadius: '25px', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0px 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}>
            <Box sx={{ bgcolor: '#E8F5E9', p: 2, borderRadius: '50%', color: '#128654', display: 'flex' }}><PersonIcon /></Box>
            <Box>
              <Typography variant="caption" color="textSecondary">Mês Atual</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#444' }}>MARÇO</Typography>
              <Typography variant="caption" sx={{ color: '#128654', fontWeight: 'bold' }}>Vendas ativas: {vendasConcluidas}</Typography>
            </Box>
          </Card>

          <Card sx={{ flex: 1, maxWidth: 350, p: 3, borderRadius: '25px', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0px 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}>
            <Box sx={{ bgcolor: '#E8F5E9', p: 2, borderRadius: '50%', color: '#128654', display: 'flex' }}><DesktopWindowsIcon /></Box>
            <Box>
              <Typography variant="caption" color="textSecondary">Registros em Tela</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#444' }}>{vendas.length}</Typography>
              <Typography variant="caption" color="textSecondary">Incluindo canceladas</Typography>
            </Box>
          </Card>
        </Box>

        {/* TABELA DE VENDAS */}
        <Card sx={{ flexGrow: 1, borderRadius: '25px', p: 2, boxShadow: '0px 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ maxHeight: '50vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['ID', 'DATA', 'VENDEDOR', 'QUANTIDADE', 'VALOR TOTAL', 'Status'].map((head) => (
                    <TableCell key={head} sx={{ color: '#BBB', fontWeight: 'bold', borderBottom: '1px solid #F5F5F5', bgcolor: 'white' }}>{head}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {vendas.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#444' }}>{row.id}</TableCell>
                    <TableCell>{row.data}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.vendedor}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{row.qtd}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.total}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} 
                        sx={{ 
                          bgcolor: row.status === 'CONCLUIDA' ? '#C8E6C9' : '#FFCDD2',
                          color: row.status === 'CONCLUIDA' ? '#2E7D32' : '#C62828',
                          fontWeight: 'bold', borderRadius: '8px'
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Pagination count={1} shape="rounded" color="primary" size="small" />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default VendaConsulta;