import React, { useState } from 'react';
import { 
  Box, Typography, Card, IconButton, Stack, CssBaseline, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Pagination, Drawer, List, ListItem, ListItemIcon, ListItemText 
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
  // 1. ESTADO PARA O MENU
  const [menuAberto, setMenuAberto] = useState(false);
  const toggleMenu = () => setMenuAberto(!menuAberto);

  // 2. LÓGICA DE SOMA TOTAL
  const totalVendido = vendas
    .filter(v => v.status === 'CONCLUIDA')
    .reduce((acc, v) => {
      let valorLimpo = v.total.replace('R$', '').replace(/\s/g, '');
      if (valorLimpo.includes(',')) {
        valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
      } 
      const numero = parseFloat(valorLimpo) || 0;
      return acc + numero;
    }, 0);

  const vendasConcluidas = vendas.filter(v => v.status === 'CONCLUIDA').length;
  const taxaCrescimento = vendas.length > 0 ? ((vendasConcluidas / vendas.length) * 100).toFixed(0) : 0;

  // Itens do Menu
  const itensMenu = [
    { text: 'INÍCIO', icon: <HomeIcon />, action: onBack },
    { text: 'USUÁRIO', icon: <PersonIcon /> },
    { text: 'VENDAS', icon: <AssessmentIcon /> },
    { text: 'ESTOQUE', icon: <InventoryIcon />, action: onBack },
    { text: 'CONTAS', icon: <WarningIcon /> },
    { text: 'SAIR', icon: <LogoutIcon />, action: onLogout },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#F9F9F9', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />

      {/* MENU LATERAL EXPANSÍVEL (DRAWER) */}
      <Drawer
        anchor="left"
        open={menuAberto}
        onClose={toggleMenu}
        PaperProps={{
          sx: { width: 280, bgcolor: '#128654', color: 'white', pt: 2 }
        }}
      >
        <Typography variant="h5" sx={{ p: 3, fontWeight: 'bold', textAlign: 'center' }}>NuPreço</Typography>
        <List>
          {itensMenu.map((item) => (
            <ListItem button key={item.text} onClick={() => { item.action?.(); toggleMenu(); }} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ color: 'white', minWidth: 50 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* SIDEBAR NUPREÇO (FIXA E MINIMALISTA) */}
      <Box sx={{ width: 85, bgcolor: '#128654', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, height: '100vh', zIndex: 1200 }}>
        <IconButton onClick={toggleMenu} sx={{ color: 'white' }}>
          <MenuIcon sx={{ fontSize: '2.8rem' }} />
        </IconButton>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="caption" sx={{ color: '#AAA', fontWeight: 'bold', mb: -2, letterSpacing: 1 }}>
          SISTEMA / VENDA CONSULTA
        </Typography>

        {/* CARDS RESUMO */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Card sx={{ flex: 1, maxWidth: 350, p: 3, borderRadius: '25px', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0px 10px 30px rgba(0,0,0,0.03)', border: '1px solid #F0F0F0' }}>
            <Box sx={{ bgcolor: '#E8F5E9', p: 2, borderRadius: '50%', color: '#128654', display: 'flex' }}><GroupIcon /></Box>
            <Box>
              <Typography variant="caption" color="textSecondary">Total vendido</Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#128654' }}>
                {totalVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TrendingUpIcon sx={{ fontSize: 14, color: '#128654' }} />
                <Typography variant="caption" sx={{ color: '#128654', fontWeight: 'bold' }}>{taxaCrescimento}% de conversão</Typography>
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

        {/* TABELA */}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Pagination count={1} shape="rounded" color="primary" size="small" />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default VendaConsulta;