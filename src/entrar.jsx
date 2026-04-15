import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  CssBaseline,
  CircularProgress,
  Container
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LanguageIcon from '@mui/icons-material/Language';

const VERDE_NUPRECO = '#128654';

function Login({ aoVoltar, onLogin, listaUsuarios, aoNotificar }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({ email: false, senha: false });

  const lidarComLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInvalido = !emailRegex.test(email);
    const senhaInvalida = senha.length < 6;

    if (emailInvalido || senhaInvalida) {
      setErros({ email: emailInvalido, senha: senhaInvalida });

      if (emailInvalido) aoNotificar("E-mail inválido! Verifique o '@' e o domínio.", "error");
      else if (senhaInvalida) aoNotificar("Senha incorreta! A senha deve possuir no mínimo 6 caracteres.", "error");
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      const usuarioEncontrado = listaUsuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );

      if (usuarioEncontrado) {
        onLogin(usuarioEncontrado.nome);
      } else {
        setErros({ email: true, senha: true });
        aoNotificar("Usuário ou senha não encontrados.", "error");
        setCarregando(false);
      }
    }, 1200);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <CssBaseline />

      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            p: 4,
            borderRadius: '25px',
            bgcolor: 'background.paper',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0px 4px 20px rgba(0,0,0,0.35)'
                : '0px 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h2" sx={{ color: VERDE_NUPRECO, fontWeight: 'bold', fontSize: '4.5rem', mb: 2 }}>
            NuPreço
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 4 }}>
            Boas-vindas de volta!
          </Typography>

          <TextField
            fullWidth
            label="E-MAIL"
            variant="outlined"
            error={erros.email}
            helperText={erros.email ? "Insira um e-mail válido com @" : ""}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErros({ ...erros, email: false });
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="SENHA"
            type={mostrarSenha ? 'text' : 'password'}
            variant="outlined"
            error={erros.senha}
            helperText={erros.senha ? "A senha precisa ter 6 caracteres" : ""}
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErros({ ...erros, senha: false });
            }}
            onKeyDown={(e) => e.key === 'Enter' && lidarComLogin()}
            sx={{ mb: 4 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setMostrarSenha(!mostrarSenha)} edge="end">
                    {mostrarSenha ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={lidarComLogin}
            disabled={carregando}
            sx={{
              bgcolor: VERDE_NUPRECO,
              '&:hover': { bgcolor: '#0e6b43' },
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: '8px'
            }}
          >
            {carregando ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 3 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
              ou
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          <Button
            variant="outlined"
            fullWidth
            disabled={carregando}
            sx={{
              color: 'text.primary',
              borderColor: (theme) => theme.palette.divider,
              py: 1.2,
              borderRadius: '8px'
            }}
          >
            Continuar com Google
          </Button>

          <Button onClick={aoVoltar} sx={{ mt: 3, color: VERDE_NUPRECO, fontWeight: 'bold' }}>
            Não tem uma conta? <span style={{ textDecoration: 'underline', marginLeft: '4px' }}>Cadastre-se</span>
          </Button>
        </Box>
      </Container>

      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, opacity: 0.7 }}>
        <LanguageIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
          PT
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;