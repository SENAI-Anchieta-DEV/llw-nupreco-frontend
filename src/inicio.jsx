import React from 'react';
// Importações baseadas no manual MUI_React2
import { Box, Container, Grid, Card, Typography, IconButton, CssBaseline, Stack, Tooltip } from '@mui/material';

// Importação dos ícones conforme a estética da sua imagem
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'; 
import PersonIcon from '@mui/icons-material/Person'; 
import AssessmentIcon from '@mui/icons-material/Assessment'; // Ícone Vendas
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Ícone Estoque
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Ícone Contas/Atenção
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Ícone Sair

function Inicio({ onLogout }) {

  // Definição dos 4 cartões centrais idênticos à imagem
  const menusModulos = [
    { text: "VENDAS", icon: AssessmentIcon },
    { text: "CONTAS", icon: ReportProblemIcon },
    { text: "ESTOQUE", icon: Inventory2Icon },
    { text: "SAIR", icon: ExitToAppIcon, action: onLogout }
  ];

  const whiteIconStyle = { color: 'white', fontSize: '1.8rem' };
  const greenMenuIconStyle = { color: '#128654', fontSize: '4.5rem' };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'white', minHeight: '100vh', width: '100vw' }}>
      <CssBaseline />
      
      {/* SIDEBAR VERDE - Identidade Visual NuPreço */}
      <Box 
        sx={{ 
          width: '70px', bgcolor: '#128654', display: 'flex', 
          flexDirection: 'column', justifyContent: 'space-between', 
          alignItems: 'center', py: 3, position: 'fixed', height: '100vh'
        }}
      >
        <Stack spacing={2} alignItems="center">
          <IconButton sx={{ color: 'white' }}><MenuIcon /></IconButton>
          <IconButton><HomeIcon sx={whiteIconStyle} /></IconButton>
          <IconButton><PersonIcon sx={whiteIconStyle} /></IconButton>
          <IconButton><AssessmentIcon sx={whiteIconStyle} /></IconButton>
          <IconButton><Inventory2Icon sx={whiteIconStyle} /></IconButton>
          <IconButton><ReportProblemIcon sx={whiteIconStyle} /></IconButton>
        </Stack>

        <IconButton onClick={onLogout} sx={{ mb: 2 }}>
          <ExitToAppIcon sx={whiteIconStyle} />
        </IconButton>
      </Box>

      {/* ÁREA DE CONTEÚDO */}
      <Box sx={{ flexGrow: 1, ml: '70px', p: 3 }}>
        
        {/* Header Central (Pílula) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Card sx={{ width: '300px', height: '50px', borderRadius: '25px', bgcolor: '#F8F8F8', border: '1px solid #EEE', boxShadow: 'none' }} />
        </Box>

        {/* LOGO NUPREÇO (SÓ TEXTO - CANTO DIREITO) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4, mt: -1 }}>
          <Typography variant="h6" sx={{ color: '#128654', fontWeight: 'bold' }}>
            NuPreço
          </Typography>
        </Box>

        {/* GRID DE 4 CARDS */}
        <Container maxWidth="md">
          <Grid container spacing={4} justifyContent="center">
            {menusModulos.map((item, index) => {
              const IconeModulo = item.icon;
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    onClick={item.action}
                    sx={{ 
                      height: '200px', borderRadius: '16px', bgcolor: '#F8F8F8', 
                      display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                      alignItems: 'center', border: '1px solid #EEE', cursor: item.action ? 'pointer' : 'default'
                    }} 
                  >
                    <Typography variant="body2" sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}>
                      {item.text}
                    </Typography>
                    <IconeModulo sx={greenMenuIconStyle} />
                  </Card>
                </Grid>
              );
            })}

            {/* BARRA INFERIOR COM ÍCONE */}
            <Grid item xs={12}>
              <Card sx={{ height: '60px', borderRadius: '30px', bgcolor: '#F8F8F8', border: '1px solid #EEE', display: 'flex', alignItems: 'center', px: 3 }}>
                <ReportProblemIcon sx={{ color: '#128654' }} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Inicio;