import React, { useState } from 'react'; 
import { Box, Typography, Card, IconButton, Stack, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

// Ícones da identidade visual NuPreço
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined'; 
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined'; 
import ReportProblemIcon from '@mui/icons-material/WarningAmber'; 
import InventoryIcon from '@mui/icons-material/AllInbox'; 
import CategoryIcon from '@mui/icons-material/CategoryOutlined'; 
import LogoutIcon from '@mui/icons-material/ExitToAppOutlined'; 

const Inicio = ({ onLogout, aoClicarVendas, aoClicarPdv, aoClicarProdutos, aoClicarEstoque, aoClicarContas, aoClicarUsuarios, notificacaoConta }) => {
  
  const [menuAberto, setMenuAberto] = useState(false);
  const toggleMenu = () => setMenuAberto(!menuAberto);

  const modulos = [
    { text: "INÍCIO", icon: <HomeIcon /> }, 
    { text: "USUÁRIO", icon: <PersonIcon />, action: aoClicarUsuarios }, // Ação adicionada aqui
    { text: "VENDAS", icon: <AssessmentIcon />, action: aoClicarVendas },
    { text: "PVD RAPIDO", icon: <StorefrontIcon />, action: aoClicarPdv },
    { text: "CONTAS", icon: <ReportProblemIcon />, action: aoClicarContas },
    { text: "ESTOQUE", icon: <InventoryIcon />, action: aoClicarEstoque },
    { text: "PRODUTOS", icon: <CategoryIcon />, action: aoClicarProdutos },
    { text: "SAIR", icon: <LogoutIcon />, action: onLogout },
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
          {modulos.map((item) => (
            <ListItem button key={item.text} onClick={() => { item.action?.(); toggleMenu(); }} sx={{ py: 2 }}>
              <ListItemIcon sx={{ color: 'white', minWidth: 50 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'bold' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* SIDEBAR VERDE (FIXA) */}
      <Box sx={{ 
        width: { xs: 70, lg: 85 }, bgcolor: '#128654', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', py: 3, height: '100vh', zIndex: 1200,
        borderTopRightRadius: '15px', borderBottomRightRadius: '15px'
      }}>
        <Stack spacing={{ xs: 2, lg: 4 }} alignItems="center">
          <IconButton onClick={toggleMenu} sx={{ color: 'white' }}>
            <MenuIcon sx={{ fontSize: { xs: '2.5rem', lg: '2.8rem' } }} />
          </IconButton>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
      </Box>

      {/* ÁREA CENTRAL */}
      <Box sx={{ 
        flexGrow: 1, 
        px: { xs: 3, lg: 8 }, py: { xs: 2, lg: 4 },
        display: 'flex', flexDirection: 'column', 
        justifyContent: 'space-between',
        height: '100vh'
      }}>
        
        {/* HEADER */}
        <Box sx={{ 
          width: '100%', height: '10vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: { xs: 2, md: 4 }, mb: { xs: 2, lg: 4 }
        }}>
          <Box sx={{ display: { xs: 'none', lg: 'block' }, flexGrow: 1 }} />
          <Box sx={{ 
            px: { xs: 5, lg: 12 }, py: { xs: 1.5, lg: 2.5 }, 
            borderRadius: '25px', bgcolor: 'white', 
            boxShadow: '0px 4px 15px rgba(0,0,0,0.05)', border: '1px solid #EEE'
          }}>
            <Typography sx={{ color: '#128654', fontWeight: 'bold', letterSpacing: 2, fontSize: { xs: '0.75rem', lg: '1rem' } }}>
              ADMINISTRADOR
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', lg: 'block' }, flexGrow: 1 }} />
          <Typography variant="h4" sx={{ 
            color: '#128654', fontWeight: 'bold',
            fontSize: { xs: '1.2rem', sm: '1.8rem', lg: '2.1rem' },
            ml: { lg: 'auto' }, pr: { xs: 0, lg: 5 }, letterSpacing: 1
          }}>
            NuPreço
          </Typography>
        </Box>

        {/* GRID DE CARDS - Mantendo filtrado para não mostrar o card de Usuário no centro */}
        <Box sx={{ 
          width: '100%', maxWidth: '1100px', margin: '0 auto',
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 4, lg: 6 }, maxHeight: '70vh'
        }}>
          {modulos.filter(item => item.text !== 'INÍCIO' && item.text !== 'USUÁRIO' && item.text !== 'SAIR').map((item, index) => (
            <Card 
              key={index}
              onClick={item.action} 
              sx={{ 
                width: '100%', 
                aspectRatio: { xs: '1.4 / 1', md: '1.2 / 1' },
                borderRadius: { xs: '20px', lg: '25px' }, 
                display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                bgcolor: 'white', border: '1px solid #F0F0F0',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                '&:hover': { transform: { md: 'translateY(-5px) scale(1.02)' }, boxShadow: '0px 15px 40px rgba(0,0,0,0.06)' }
              }}
            >
              <Typography sx={{ color: '#128654', fontWeight: 'bold', mb: 1, fontSize: { xs: '0.9rem', lg: '1.2rem' } }}>
                {item.text}
              </Typography>
              <Box sx={{ color: '#128654', '& svg': { fontSize: { xs: '60px', md: '70px', lg: '90px' } } }}>
                {item.icon}
              </Box>
            </Card>
          ))}
        </Box>

        {/* BARRA INFERIOR */}
        <Box sx={{ 
          width: '100%', maxWidth: '900px', margin: '0 auto',
          height: '8vh', minHeight: '60px', borderRadius: { xs: '20px', lg: '40px' }, 
          bgcolor: 'white', display: 'flex', alignItems: 'center', 
          px: { xs: 4, lg: 10 }, py: 1.5,
          boxShadow: '0px 5px 20px rgba(0,0,0,0.04)', border: '1px solid #F0F0F0', mb: { xs: 1, lg: 2 }
        }}>
          <ReportProblemIcon sx={{ color: '#128654', fontSize: { xs: '2rem', lg: '2.5rem' }, mr: { xs: 3, lg: 8 } }} />
          <Box sx={{ 
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '100%',
            color: '#128654', fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem', lg: '0.9rem' },
            letterSpacing: { xs: 0.5, lg: 1.5 }
          }}>
            <Box>
              {notificacaoConta ? notificacaoConta.fornecedor.toUpperCase() : "CONTA DO DIA"}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              {notificacaoConta ? `R$ ${notificacaoConta.valor}` : "VALOR"}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              {notificacaoConta ? notificacaoConta.dataVencimento : "DATA"}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Inicio;