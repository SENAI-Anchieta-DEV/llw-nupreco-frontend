import React, { useState } from 'react';
import { Box, Typography, Card, IconButton, Stack, CssBaseline, Badge, Menu, MenuItem, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import ReportProblemIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/AllInbox';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SidebarMenu from './components/SidebarMenu';

const Inicio = ({
  onLogout,
  perfilUsuario,
  aoClicarVendas,
  aoClicarPdv,
  aoClicarProdutos,
  aoClicarEstoque,
  aoClicarContas,
  aoClicarUsuarios,
  listaContasDoDia = []
}) => {
  const theme = useTheme();
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  const handleOpenNotif = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);

  const modulos = [
    { text: 'Início', icon: <HomeIcon /> },
    { text: 'Usuário', icon: <PersonIcon />, action: aoClicarUsuarios },
    { text: 'Vendas', icon: <AssessmentIcon />, action: aoClicarVendas },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, action: aoClicarPdv },
    { text: 'Contas', icon: <ReportProblemIcon />, action: aoClicarContas },
    { text: 'Estoque', icon: <InventoryIcon />, action: aoClicarEstoque },
    { text: 'Produtos', icon: <CategoryIcon />, action: aoClicarProdutos },
    { text: 'Sair', icon: <LogoutIcon />, action: onLogout },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <CssBaseline />
      <SidebarMenu modulos={modulos} />

      <Box sx={{ flexGrow: 1, px: { xs: 3, lg: 8 }, py: { xs: 2, lg: 4 }, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
          <Box sx={{ width: 48, display: { xs: 'none', lg: 'block' } }} />

          <Box
            sx={{
              px: { xs: 5, lg: 12 },
              py: 2,
              borderRadius: '25px',
              bgcolor: 'background.paper',
              boxShadow: theme.palette.mode === 'dark'
                ? '0px 4px 15px rgba(0,0,0,0.35)'
                : '0px 4px 15px rgba(0,0,0,0.05)',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography sx={{ color: '#128654', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' }}>
              {perfilUsuario || 'USUÁRIO'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="h4" sx={{ color: '#128654', fontWeight: 'bold' }}>
              NuPreço
            </Typography>
            <IconButton onClick={handleOpenNotif} sx={{ color: listaContasDoDia.length > 0 ? '#D32F2F' : '#128654' }}>
              <Badge badgeContent={listaContasDoDia.length} color="error">
                <NotificationsNoneIcon sx={{ fontSize: '2.5rem' }} />
              </Badge>
            </IconButton>
          </Stack>

          <Menu
            anchorEl={anchorElNotif}
            open={Boolean(anchorElNotif)}
            onClose={handleCloseNotif}
            PaperProps={{ sx: { width: 320, borderRadius: '15px', mt: 1.5 } }}
          >
            <Typography sx={{ p: 2, fontWeight: 'bold', color: '#D32F2F', borderBottom: `1px solid ${theme.palette.divider}` }}>
              Atenção: Contas do Dia
            </Typography>
            {listaContasDoDia.length > 0 ? (
              listaContasDoDia.map((conta, index) => (
                <MenuItem key={index} onClick={handleCloseNotif} sx={{ py: 1.5 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {conta.fornecedor}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#D32F2F' }}>
                      R$ {conta.valor} • Vence Hoje
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleCloseNotif}>Nenhuma pendência hoje</MenuItem>
            )}
          </Menu>
        </Box>

        <Box
          sx={{
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 6
          }}
        >
          {modulos.filter((item) => item.text !== 'Início' && item.text !== 'Usuário').map((item, index) => (
            <Card
              key={index}
              onClick={item.action}
              sx={{
                aspectRatio: '1.2 / 1',
                borderRadius: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.mode === 'dark' ? '#2C2C2C' : '#F0F0F0'}`,
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0px 15px 40px rgba(0,0,0,0.45)'
                    : '0px 15px 40px rgba(0,0,0,0.06)'
                }
              }}
            >
              <Typography sx={{ color: item.text === 'Sair' ? '#D32F2F' : '#128654', fontWeight: 'bold', mb: 1 }}>
                {item.text.toUpperCase()}
              </Typography>
              <Box sx={{ color: item.text === 'Sair' ? '#D32F2F' : '#128654', '& svg': { fontSize: '85px' } }}>
                {item.icon}
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Inicio;