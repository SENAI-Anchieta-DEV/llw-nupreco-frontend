import React, { useState } from 'react';
// Importações conforme o padrão do material MUI_React2
import { Box, Button, Typography, Grid, TextField, InputAdornment, IconButton, Divider, CssBaseline, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LanguageIcon from '@mui/icons-material/Language';

// Alteração: Agora recebemos listaUsuarios e aoNotificar para os feedbacks visuais (LLW-140)
function Login({ aoVoltar, onLogin, listaUsuarios = [], aoNotificar }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  
  // Estados para capturar o que o usuário digita
  const [emailDigitado, setEmailDigitado] = useState("");
  const [senhaDigitada, setSenhaDigitada] = useState("");

  // Função de validação atualizada (LLW-140/141)
  const lidarComLogin = () => {
    // Validação de campos vazios (Feedback visual em vez de alert)
    if (!emailDigitado || !senhaDigitada) {
      aoNotificar("Por favor, preencha todos os campos!", "warning");
      return;
    }

    if (!listaUsuarios || listaUsuarios.length === 0) {
      aoNotificar("Nenhum usuário cadastrado no sistema!", "error");
      return;
    }

    // Procura na lista se existe alguém com esse e-mail e senha
    const usuarioEncontrado = listaUsuarios.find(
      (u) => u.email.toLowerCase() === emailDigitado.toLowerCase() && u.senha === senhaDigitada
    );

    if (usuarioEncontrado) {
      setCarregando(true);
      // Simula o carregamento antes de entrar na Home
      setTimeout(() => {
        setCarregando(false);
        onLogin(usuarioEncontrado.nome); 
        aoNotificar(`Bem-vindo de volta, ${usuarioEncontrado.nome}!`, "success");
      }, 1500);
    } else {
      // Mensagem de erro profissional (LLW-140)
      aoNotificar("E-mail ou senha incorretos! Tente novamente.", "error");
    }
  };

  // Função para o link de recuperação de senha
  const recuperarSenha = () => {
    aoNotificar("Um link de recuperação foi enviado para o seu e-mail.", "info");
  };

  return (
    <>
      <CssBaseline />
      <Grid container sx={{ minHeight: '100vh', width: '100vw', m: 0, p: 0 }}>
        
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
          alignItems: 'center', p: 6, bgcolor: 'white' 
        }}>
          
          <Box sx={{ 
            flexGrow: 1, display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '400px' 
          }}>
            
            <Typography variant="h3" sx={{ color: '#128654', fontWeight: 'bold', mb: 1 }}>
              NuPreço
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', mb: 4, textAlign: 'center' }}>
              Faça login para continuar acessando sua conta
            </Typography>

            <TextField 
              fullWidth label="E-MAIL" variant="outlined" 
              value={emailDigitado}
              onChange={(e) => setEmailDigitado(e.target.value)}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#128654' } } }} 
            />

            <TextField 
              fullWidth label="SENHA" 
              type={mostrarSenha ? 'text' : 'password'} 
              variant="outlined"
              value={senhaDigitada}
              onChange={(e) => setSenhaDigitada(e.target.value)}
              sx={{ mb: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#128654' } } }}
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

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Typography 
                  variant="caption" 
                  onClick={recuperarSenha}
                  sx={{ color: '#128654', cursor: 'pointer', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}
                >
                  Esqueceu a senha?
                </Typography>
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              onClick={lidarComLogin}
              disabled={carregando}
              sx={{ 
                bgcolor: '#128654', '&:hover': { bgcolor: '#0e6b43' }, 
                py: 1.5, textTransform: 'none', fontWeight: 'bold', borderRadius: '8px' 
              }}
            >
              {carregando ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 3 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" sx={{ mx: 2, color: '#999' }}>ou</Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<img src="https://www.google.com/favicon.ico" width="20" alt="google" />} 
              sx={{ color: '#15181E', borderColor: '#DDD', py: 1.2, textTransform: 'none', borderRadius: '8px' }}
            >
              Entrar com Google
            </Button>

            <Button onClick={aoVoltar} sx={{ mt: 2, color: '#128654', textTransform: 'none', fontWeight: 'bold' }}>
              Não tem uma conta? Cadastre-se
            </Button>
          </Box>

          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LanguageIcon fontSize="small" sx={{ color: '#363F4D' }} />
            <Typography variant="caption" sx={{ color: '#363F4D', fontWeight: 'bold' }}>PT</Typography>
          </Box>
        </Grid>

        {/* LADO DIREITO: VERDE */}
        <Grid item xs={0} md={6} sx={{ 
          bgcolor: '#128654', display: { xs: 'none', md: 'flex' }, minHeight: '100vh' 
        }} />
        
      </Grid>
    </>
  );
}

export default Login;