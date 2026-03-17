import React from 'react';
// Importações seguindo o padrão dos manuais de Design System do SENAI
import { Box, Button, Typography, Grid, CssBaseline } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const BemVindo = ({ aoClicarCriar, aoClicarEntrar }) => {
  return (
    <>
      {/* CssBaseline: Normaliza o CSS e remove margens que causam bordas brancas */}
      <CssBaseline />
      
      <Grid 
        container 
        disableEqualOverflow 
        spacing={0} 
        sx={{ 
          minHeight: '100vh', 
          width: '100vw', 
          m: 0, 
          p: 0, 
          overflow: 'hidden',
          display: 'flex',
          flexWrap: 'nowrap' 
        }}
      >
        
        {/* LADO ESQUERDO: 50% BRANCO (md={6}) */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 4,
          bgcolor: 'white',
          minHeight: '100vh' 
        }}>
          {/* Box para centralizar o conteúdo conforme os manuais de UI */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            
            <Typography variant="h2" sx={{ 
              color: '#128654', 
              fontWeight: 'bold', 
              fontSize: '4.5rem',
              mb: 2 
            }}>
              NuPreço
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#15181E' }}>
                Boas-vindas!
              </Typography>
              <Typography variant="body2" sx={{ color: '#363F4D', maxWidth: '280px', mt: 1, textAlign: 'center' }}>
                Gestão Simples e eficiente para quem faz tudo sozinho? É com a NuPreço
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              onClick={aoClicarCriar}
              sx={{ 
                bgcolor: '#128654', 
                '&:hover': { bgcolor: '#0e6b43' },
                borderRadius: '8px', 
                py: 1.5, 
                maxWidth: '320px',
                textTransform: 'none',
                fontWeight: 'bold',
                mb: 1
              }}
            >
              Criar nova conta
            </Button>

            <Button 
              onClick={aoClicarEntrar}
              sx={{ 
                color: '#363F4D', 
                textTransform: 'none',
                fontWeight: '500' 
              }}
            >
              Entrar
            </Button>

            <Box 
              component="img" 
              src="mascote.png" 
              sx={{ width: 400, }} 
            />
          </Box>

          {/* Rodapé do lado esquerdo */}
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
            <LanguageIcon fontSize="small" sx={{ color: '#363F4D' }} />
            <Typography variant="caption" sx={{ color: '#363F4D', fontWeight: 'bold' }}>PT</Typography>
          </Box>
        </Grid>

        {/* LADO DIREITO: 50% VERDE (md={6}) */}
        <Grid item xs={0} md={6} sx={{ 
          bgcolor: '#128654', 
          display: { xs: 'none', md: 'flex' }, 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          color: 'white',
          p: 6, 
          m: 0, 
          textAlign: 'center',
          minHeight: '100vh', 
          width: '100%' 
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Venda com eficiência, onde você estiver
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '500px', mb: 6, opacity: 0.9 }}>
Gestão moderna e ágil para microempreendedores que buscam mais controle, mais organização e mais lucro, 
com a simplicidade e eficiência que o dia a dia exige.          </Typography>
          
          <Box 
            component="img" 
            src="EXEMPLODESISTEMA.png" 
            sx={{ width: '85%', maxWidth: '500px' }} 
          />
        </Grid>
      </Grid>
    </>
  );
};

export default BemVindo;