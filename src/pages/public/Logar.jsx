import React, { useState } from 'react';
import { Box, Button, Link as MuiLink, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { verificarGestorCadastrado } from '../../utils/firstAccess';


function Logar() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    nome: '',
    senha: '',
  });


  const [erro, setErro] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificandoCadastro, setVerificandoCadastro] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleCadastroClick = async (event) => {
    event.preventDefault();
    setErroCadastro('');
    setVerificandoCadastro(true);


    try {
      const existeGestor = await verificarGestorCadastrado();


      if (existeGestor) {
        setErroCadastro('Já existe um gestor cadastrado no sistema. Para acessar, utilize a tela de login.');
        return;
      }


      navigate('/cadastro');
    } finally {
      setVerificandoCadastro(false);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');


    if (form.senha.length < 6) {
      setErro('Senha incorreta. A senha deve conter no mínimo 6 caracteres.');
      return;
    }


    setLoading(true);


    try {
      await login(form.nome, form.senha);
      navigate('/inicio', { replace: true });
    } catch (error) {
      setErro('Senha incorreta. A senha deve conter no mínimo 6 caracteres.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Nome"
        name="nome"
        type="text"
        value={form.nome}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Senha"
        name="senha"
        type="password"
        value={form.senha}
        onChange={handleChange}
        margin="normal"
        required
      />

      {erro && (
        <Typography sx={{ color: 'error.main', mt: 1 }}>
          {erro}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 2, mb: 2, bgcolor: '#128654' }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>


      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Não possui conta?{' '}
        <MuiLink
          component="button"
          type="button"
          onClick={handleCadastroClick}
          disabled={verificandoCadastro}
          sx={{
            border: 0,
            bgcolor: 'transparent',
            color: '#128654',
            cursor: verificandoCadastro ? 'default' : 'pointer',
            font: 'inherit',
            fontWeight: 600,
            p: 0,
            textDecoration: 'underline',
          }}
        >
          {verificandoCadastro ? 'Verificando...' : 'Cadastre-se'}
        </MuiLink>
      </Typography>


      {erroCadastro && (
        <Typography
          variant="body2"
          sx={{
            color: 'error.main',
            mt: 1,
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {erroCadastro}
        </Typography>
      )}
    </Box>
  );
}


export default Logar;

