import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const BemVindo = ({ aoClicarCriar }) => {
  return (
    <Grid container sx={{ height: '100vh', width: '100vw', m: 0, p: 0 }}>
      
      {/* LADO ESQUERDO: BRANCO */}
      <Grid item xs={12} md={5} sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 4,
        bgcolor: 'white'
      }}>
        {/* Espaçador superior para alinhar o conteúdo ao centro */}
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
            <Typography variant="body2" sx={{ color: '#363F4D', maxWidth: '280px', mt: 1 }}>
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
              fontWeight: 'bold'
            }}
          >
            Criar nova conta
          </Button>

          <Button sx={{ color: '#363F4D', mt: 1, textTransform: 'none' }}>
            Entrar
          </Button>

          {/* Mascote no rodapé do lado esquerdo */}
          <Box 
            component="img" 
            src="/mascote.png" // Certifique-se de que a imagem está na pasta public
            sx={{ width: 160, mt: 4 }} 
          />
        </Box>

        {/* Seletor de Idioma no Canto Inferior */}
        <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LanguageIcon fontSize="small" sx={{ color: '#363F4D' }} />
          <Typography variant="caption" sx={{ color: '#363F4D' }}>PT</Typography>
        </Box>
      </Grid>

      {/* LADO DIREITO: VERDE COM MOCKUP */}
      <Grid item xs={12} md={7} sx={{ 
        bgcolor: '#128654', 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        color: 'white',
        p: 6,
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Venda sem enrolação, direto no celular
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '500px', mb: 6, opacity: 0.9 }}>
          Chega de anotar tudo no caderno! Registre suas venda em segundos. Tenha seus produtos, valores, clientes, formas de pagamento e recibo, tudo salvo!
        </Typography>
        
        {/* Mockup do Sistema (Imagem do celular e recibo) */}
        <Box 
          component="img" 
          src="/mockup-nupreco.png" // Imagem que você enviou (image_3e0beb.png)
          sx={{ width: '85%', maxWidth: '700px' }} 
        />
      </Grid>
    </Grid>
  );
};

export default BemVindo;