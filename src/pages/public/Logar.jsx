import React, { useState } from 'react';
<<<<<<< HEAD
import { Box, Button, Link as MuiLink, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { verificarGestorCadastrado } from '../../utils/firstAccess';

=======
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65

function Logar() {
  const navigate = useNavigate();
  const { login } = useAuth();

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const [form, setForm] = useState({
    nome: '',
    senha: '',
  });

<<<<<<< HEAD

  const [erro, setErro] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificandoCadastro, setVerificandoCadastro] = useState(false);

=======
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65

  const handleChange = (event) => {
    const { name, value } = event.target;

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

<<<<<<< HEAD

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
=======
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await login(form.nome, form.senha);
      navigate('/inicio');
    } catch (error) {
      setErro('Nome ou senha inválidos.');
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
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

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
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

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
      {erro && (
        <Typography sx={{ color: 'error.main', mt: 1 }}>
          {erro}
        </Typography>
      )}

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{ mt: 2, mb: 2, bgcolor: '#128654' }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

<<<<<<< HEAD

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
=======
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Não possui conta? <Link to="/cadastro">Cadastre-se</Link>
      </Typography>
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
    </Box>
  );
}

<<<<<<< HEAD

export default Logar;

=======
export default Logar;
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
