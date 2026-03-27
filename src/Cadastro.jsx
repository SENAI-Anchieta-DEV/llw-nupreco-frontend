import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, TextField, InputAdornment, IconButton, Divider, CssBaseline, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LanguageIcon from '@mui/icons-material/Language';

// ADICIONADO: erroServidor nas props (LLW-142)
function Cadastro({ aoVoltar, aoSalvarCadastro, erroServidor }) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  
  // ESTADOS PARA VALIDAÇÃO (LLW-141)
  const [erros, setErros] = useState({ nome: false, email: false, senha: false });
  const [mensagensErro, setMensagensErro] = useState({ nome: "", email: "", senha: "" });

  // --- MONITORAR ERROS DO SERVIDOR (LLW-142) ---
  useEffect(() => {
    if (erroServidor && erroServidor.fields) {
      const novosErros = { nome: false, email: false, senha: false };
      const novasMensagens = { nome: "", email: "", senha: "" };

      // Mapeia os erros que vem do ProblemDetail do Java
      erroServidor.fields.forEach(f => {
        if (novosErros.hasOwnProperty(f.name)) {
          novosErros[f.name] = true;
          novasMensagens[f.name] = f.userMessage;
        }
      });

      setErros(novosErros);
      setMensagensErro(novasMensagens);
      setCarregando(false);
    }
  }, [erroServidor]);

  const validarEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const lidarComCadastro = () => {
    const novosErros = {
      nome: !nome,
      email: !email || !validarEmail(email),
      senha: !senha || senha.length < 6
    };

    const novasMensagens = {
      nome: novosErros.nome ? "O nome é obrigatório" : "",
      email: novosErros.email ? (!email ? "E-mail obrigatório" : "Formato de e-mail inválido") : "",
      senha: novosErros.senha ? (!senha ? "A senha é obrigatória" : "Mínimo de 6 caracteres") : ""
    };

    setErros(novosErros);
    setMensagensErro(novasMensagens);

    if (!novosErros.nome && !novosErros.email && !novosErros.senha) {
      setCarregando(true);
      // O App.js cuidará do redirecionamento (LLW-143)
      aoSalvarCadastro({ nome, email, senha });
    }
  };

  return (
    <>
      <CssBaseline />
      <Grid container sx={{ height: '100vh', width: '100vw', m: 0, p: 0 }}>
        
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
              fullWidth 
              label="NOME COMPLETO" 
              variant="outlined" 
              required
              error={erros.nome}
              helperText={mensagensErro.nome}
              onChange={(e) => {
                setNome(e.target.value);
                if(erros.nome) setErros({...erros, nome: false});
              }}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#128654' } } }} 
            />
            
            <TextField 
              fullWidth 
              label="E-MAIL" 
              variant="outlined" 
              required
              type="email"
              error={erros.email}
              helperText={erros.email ? mensagensErro.email : "Ex: contato@nupreco.com.br"}
              onChange={(e) => {
                setEmail(e.target.value);
                if(erros.email) setErros({...erros, email: false});
              }}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#128654' } } }} 
            />

            <TextField 
              fullWidth 
              label="SENHA" 
              type={mostrarSenha ? 'text' : 'password'} 
              variant="outlined"
              required
              error={erros.senha}
              helperText={erros.senha ? mensagensErro.senha : "Mínimo 6 caracteres"}
              onChange={(e) => {
                setSenha(e.target.value);
                if(erros.senha) setErros({...erros, senha: false});
              }}
              onKeyPress={(e) => { if (e.key === 'Enter') lidarComCadastro(); }}
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

        <Grid item xs={0} md={6} sx={{ 
          bgcolor: '#128654', display: { xs: 'none', md: 'flex' }, height: '100vh', m: 0, p: 0
        }} />
        
      </Grid>
    </>
  );
}

export default Cadastro;