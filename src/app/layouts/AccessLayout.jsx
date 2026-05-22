import React from 'react';
import { Box, Typography, Grid, CssBaseline, useTheme } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const AccessLayout = ({ title, subtitle, children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <CssBaseline />

      <Grid
        container
        spacing={0}
        sx={{
          minHeight: '100vh',
          width: '100vw',
          m: 0,
          p: 0,
          overflow: 'hidden'
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 4,
            bgcolor: 'background.paper',
            minHeight: '100vh'
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: '#128654',
                fontWeight: 'bold',
                fontSize: '4.5rem',
                mb: 2
              }}
            >
              NuPreço
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: '320px',
                    mt: 1,
                    textAlign: 'center'
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Box sx={{ width: '100%', maxWidth: '400px' }}>{children}</Box>
          </Box>

          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
            <LanguageIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              PT
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={0}
          md={6}
          sx={{
            bgcolor: '#128654',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            p: 6,
            textAlign: 'center',
            minHeight: '100vh'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Venda com eficiência, onde você estiver
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '500px', mb: 6, opacity: 0.9 }}>
            Gestão moderna e ágil para microempreendedores que buscam mais controle, mais
            organização e mais lucro, com a simplicidade e eficiência que o dia a dia exige.
          </Typography>

          <Box component="img" src="EXEMPLODESISTEMA.png" sx={{ width: '85%', maxWidth: '500px' }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccessLayout;