import React from 'react';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';

const Cadastro = ({ aoFinalizar }) => {
  return (
    <Box sx={{ bgcolor: 'secondary.main', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="overline" sx={{ bgcolor: '#82D633', px: 2, py: 0.5, borderRadius: 5, fontWeight: 'bold' }}>
            Primeiro Acesso: Gestor
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, color: 'primary.main', fontWeight: 'bold' }}>
            Crie sua conta
          </Typography>
          
          <Box component="form" sx={{ mt: 3 }}>
            <TextField fullWidth label="Nome do Gestor" margin="normal" variant="outlined" />
            <TextField fullWidth label="E-mail" margin="normal" variant="outlined" />
            <TextField fullWidth label="Senha" type="password" margin="normal" variant="outlined" />
            
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ mt: 3, py: 1.5 }}
              onClick={aoFinalizar}
            >
              Finalizar e Acessar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Cadastro;