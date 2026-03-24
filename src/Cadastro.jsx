import React, { useState } from 'react';
import { Box, Button, Typography, Grid, TextField, InputAdornment, IconButton, Divider, CssBaseline, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LanguageIcon from '@mui/icons-material/Language';

// Adicionada a prop aoNotificar para feedback visual (LLW-140)
function Cadastro({ aoVoltar, aoSalvarCadastro, aoNotificar }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  // ESTADOS PARA SALVAR OS DADOS
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const lidarComCadastro = () => {
    // Validação de campos (LLW-141)
    if (nome && email && senha) {
      setCarregando(true);
      
      // Simula um carregamento de 1.5 segundos
      setTimeout(() => {
        setCarregando(false);
        // Envia os dados para o App.js
        aoSalvarCadastro({ nome, email, senha });
        // O feedback de sucesso é disparado pelo App.js, mas você pode reforçar aqui se desejar
      }, 1500);
    } else {
      // Substituído alert por notificação profissional (LLW-140)
      aoNotificar("Por favor, preencha todos os campos para realizar o cadastro!", "warning");
    }
  };

  return (
    <>
      <CssBaseline />
      <Grid container sx={{ height: '100vh', width: '100vw', m: 0, p: 0 }}>
        
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
          alignItems: 'center', p: 6, bgcolor: 'white' 
        }}>
          
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
            
            <Typography variant="h3" sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}>
              NuPreço
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', mb: 4, textAlign: 'center' }}>
              Crie sua conta para começar a gerenciar seus preços
            </Typography>

            <TextField 
              fullWidth label="NOME" variant="outlined" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#128654' } } }} 
            />
            
            <TextField 
              fullWidth label="E-MAIL" variant="outlined" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#128654' } } }} 
            />

            <TextField 
              fullWidth label="SENHA" type={mostrarSenha ? 'text' : 'password'} variant="outlined"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#128654' } } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarSenha(!mostrarSenha)}>
                      {mostrarSenha ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button 
              variant="contained" 
              fullWidth 
              onClick={lidarComCadastro}
              disabled={carregando}
              sx={{ bgcolor: '#128654', '&:hover': { bgcolor: '#0e6b43' }, py: 1.5, textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' }}
            >
              {carregando ? <CircularProgress size={24} color="inherit" /> : "Criar nova conta"}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 3 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ mx: 2, color: '#999' }}>ou</Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Button 
              variant="outlined" fullWidth 
              startIcon={<img src="https://www.google.com/favicon.ico" width="20" alt="google" />} 
              sx={{ color: '#15181E', borderColor: '#DDD', py: 1.2, textTransform: 'none', borderRadius: '8px' }}
            >
              Continue with Google
            </Button>

            <Button onClick={aoVoltar} sx={{ mt: 2, color: '#128654', textTransform: 'none', fontWeight: 'bold' }}>
              Já tem uma conta? Entrar
            </Button>
          </Box>

          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LanguageIcon fontSize="small" sx={{ color: '#363F4D' }} />
            <Typography variant="caption" sx={{ color: '#363F4D', fontWeight: 'bold' }}>PT</Typography>
          </Box>
        </Grid>

        {/* LADO DIREITO: VERDE */}
        <Grid item xs={0} md={6} sx={{ 
          bgcolor: '#128654', display: { xs: 'none', md: 'flex' }, height: '100vh', m: 0, p: 0
        }} />
        
      </Grid>
    </>
  );
}

export default Cadastro;