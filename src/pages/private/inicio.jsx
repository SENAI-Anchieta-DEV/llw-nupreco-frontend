import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Stack,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';


import SellOutlinedIcon from '@mui/icons-material/SellOutlined';


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
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


import useAuth from '../../hooks/useAuth';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import contaService from '../../services/contaService';
import { formatarMoeda, getNotificacoesContas, getTotalAPagar } from '../../utils/contasStatus';


const formatarPerfil = (role) => {
  if (!role) return 'USUÁRIO';
  if (role === 'GESTOR') return 'ADMINISTRADOR';
  if (role === 'FUNCIONARIO') return 'FUNCIONÁRIO';
  return String(role).replace('_', ' ');
};


const Inicio = ({
  onLogout,
  perfilUsuario,
  listaContasDoDia = [],
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();


  const [menuAberto, setMenuAberto] = useState(false);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [contasApi, setContasApi] = useState([]);


  const toggleMenu = () => setMenuAberto(!menuAberto);
  const handleOpenNotif = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorElNotif(null);


  useEffect(() => {
    const carregarContas = async () => {
      try {
        const contas = await contaService.listar();
        setContasApi(contas);
      } catch (error) {
        setContasApi([]);
      }
    };


    carregarContas();
  }, []);


  const contasBase = useMemo(() => {
    return listaContasDoDia.length > 0 ? listaContasDoDia : contasApi;
  }, [listaContasDoDia, contasApi]);


  const notificacoes = useMemo(() => getNotificacoesContas(contasBase), [contasBase]);
  const totalAPagar = useMemo(() => getTotalAPagar(contasBase), [contasBase]);


  const sair = () => {
    if (onLogout) {
      onLogout();
      return;
    }


    logout();
    navigate('/entrar');
  };


  const modulos = [
    { text: 'Início', icon: <HomeIcon />, action: () => navigate('/inicio') },
    { text: 'Usuário', icon: <PersonIcon />, action: () => navigate('/usuarios') },
    { text: 'Vendas', icon: <AssessmentIcon />, action: () => navigate('/vendas') },
    { text: 'Pdv Rápido', icon: <StorefrontIcon />, action: () => navigate('/pdv') },
    { text: 'Contas', icon: <ReportProblemIcon />, action: () => navigate('/contas') },
    { text: 'Estoque', icon: <InventoryIcon />, action: () => navigate('/estoque') },
    { text: 'Produtos', icon: <CategoryIcon />, action: () => navigate('/produtos') },
    { text: 'Etiqueta Digital', icon: <SellOutlinedIcon />, action: () => navigate('/etiqueta-digital') },
    { text: 'Sair', icon: <LogoutIcon />, action: sair },
  ];


  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <CssBaseline />


      {/* MENU LATERAL */}
      <Drawer
        anchor="left"
        open={menuAberto}
        onClose={toggleMenu}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: '#128654',
            color: 'white',
            pt: 2,
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            p: 3,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          NuPreço
        </Typography>


        <List>
          {modulos.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                item.action?.();
                toggleMenu();
              }}
              sx={{ py: 2 }}
            >
              <ListItemIcon
                sx={{
                  color: 'white',
                  minWidth: 50,
                }}
              >
                {item.icon}
              </ListItemIcon>


              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 'bold',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>


      {/* SIDEBAR FIXA */}
      <Box
        sx={{
          width: { xs: 70, lg: 85 },
          bgcolor: '#128654',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
          minHeight: '100vh',
          zIndex: 1200,
          flexShrink: 0,
          borderTopRightRadius: '15px',
          borderBottomRightRadius: '15px',
        }}
      >
        <IconButton onClick={toggleMenu} sx={{ color: 'white' }}>
          <MenuIcon
            sx={{
              fontSize: {
                xs: '2.5rem',
                lg: '2.8rem',
              },
            }}
          />
        </IconButton>


        <Box sx={{ flexGrow: 1 }} />


        <ThemeToggleButton variant="sidebar" />
      </Box>


      {/* ÁREA CENTRAL */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, sm: 3, lg: 8 },
          py: { xs: 2, lg: 4 },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 6,
            gap: 2,
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          <Box sx={{ width: 48, display: { xs: 'none', lg: 'block' } }} />


          <Box
            sx={{
              px: { xs: 4, sm: 5, lg: 12 },
              py: 2,
              borderRadius: '25px',
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.palette.mode === 'dark' ? '0px 4px 18px rgba(0,0,0,0.35)' : '0px 4px 15px rgba(0,0,0,0.05)',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              order: { xs: 2, md: 1 },
              mx: { xs: 'auto', md: 0 },
            }}
          >
            <Typography
              sx={{
                color: '#128654',
                fontWeight: 'bold',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {perfilUsuario || formatarPerfil(user?.role)}
            </Typography>
          </Box>


          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              order: { xs: 1, md: 2 },
              ml: { xs: 'auto', md: 0 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#128654',
                fontWeight: 'bold',
              }}
            >
              NuPreço
            </Typography>


            <IconButton
              onClick={handleOpenNotif}
              sx={{
                color: notificacoes.length > 0 ? '#d32f2f' : '#128654',
                zIndex: 2,
              }}
            >
              <Badge badgeContent={notificacoes.length} color="error">
                <NotificationsNoneIcon sx={{ fontSize: '2.5rem' }} />
              </Badge>
            </IconButton>
          </Stack>


          <Menu
            anchorEl={anchorElNotif}
            open={Boolean(anchorElNotif)}
            onClose={handleCloseNotif}
            PaperProps={{
              sx: {
                width: 320,
                borderRadius: '15px',
                mt: 1.5,
                zIndex: 1500,
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: '#d32f2f',
                }}
              >
                Atenção: Contas Em Aberto
              </Typography>


              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 700,
                }}
              >
                Total a pagar: {formatarMoeda(totalAPagar)}
              </Typography>
            </Box>


            {notificacoes.length > 0 ? (
              notificacoes.map((conta, index) => {
                const vencida = conta.status === 'VENCIDA';


                return (
                  <MenuItem
                    key={conta.id || index}
                    onClick={handleCloseNotif}
                    sx={{ py: 1.5 }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {conta.fornecedor || conta.nome}
                      </Typography>


                      <Typography
                        variant="caption"
                        sx={{
                          color: vencida ? '#d32f2f' : '#F57F17',
                          fontWeight: 700,
                        }}
                      >
                        {formatarMoeda(conta.valor)} • {vencida ? 'Conta vencida' : 'Conta válida até hoje'}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem onClick={handleCloseNotif}>
                Nenhuma conta vencendo hoje ou vencida
              </MenuItem>
            )}
          </Menu>
        </Box>


        {/* GRID CENTRAL */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { xs: 3, md: 6 },
            pb: 4,
          }}
        >
          {modulos
            .filter(
              (item) =>
                item.text !== 'Início' &&
                item.text !== 'Usuário' &&
                item.text !== 'Etiqueta Digital'
            )
            .map((item, index) => (
              <Card
                key={index}
                onClick={item.action}
                sx={{
                  aspectRatio: { xs: 'auto', sm: '1.2 / 1' },
                  minHeight: { xs: 150, sm: 'auto' },
                  borderRadius: '25px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: 'background.paper',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  transition: '0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 15px 40px rgba(0,0,0,0.06)',
                    bgcolor: (theme) => item.text === 'Sair' ? (theme.palette.mode === 'dark' ? 'rgba(198,40,40,0.14)' : '#fff5f5') : theme.palette.background.paper,
                  },
                }}
              >
                <Typography
                  sx={{
                    color: item.text === 'Sair' ? '#d32f2f' : '#128654',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  {item.text.toUpperCase()}
                </Typography>


                <Box
                  sx={{
                    color: item.text === 'Sair' ? '#d32f2f' : '#128654',
                    '& svg': {
                      fontSize: {
                        xs: '64px',
                        md: '85px',
                      },
                    },
                  }}
                >
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







