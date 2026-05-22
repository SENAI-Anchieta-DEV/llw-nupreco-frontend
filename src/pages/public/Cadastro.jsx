import React, { useState } from "react";
import api from "../../services/api";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { marcarGestorCadastrado } from "../../utils/firstAccess";


function Cadastro() {
  const navigate = useNavigate();


  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });


  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");


  const alterarCampo = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value,
    });
  };


const salvarCadastro = async () => {


  setErro("");


  setSucesso("");
 
  if (!dados.nome || !dados.email || !dados.senha || !dados.confirmarSenha) {


    setErro("Preencha todos os campos.");


    return;


  }
 
  if (dados.senha !== dados.confirmarSenha) {


    setErro("As senhas não coincidem.");


    return;


  }
 
  const usuario = {


    nome: dados.nome,


    email: dados.email,


    senha: dados.senha,


  };
 
  try {


    await api.post("/usuarios/gestor", usuario);


    marcarGestorCadastrado();
 
    setSucesso("Conta criada com sucesso!");
 
    setTimeout(() => {


      navigate("/entrar");


    }, 1500);


  } catch (error) {


    const mensagemErro =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      "Não foi possível criar a conta.";


    const mensagemNormalizada = String(mensagemErro).toLowerCase();
    const gestorJaExiste =
      mensagemNormalizada.includes("gestor") &&
      (mensagemNormalizada.includes("existe") ||
        mensagemNormalizada.includes("cadastrado") ||
        mensagemNormalizada.includes("já") ||
        mensagemNormalizada.includes("ja"));


    if (gestorJaExiste) {
      marcarGestorCadastrado();
      setErro("Já existe um gestor cadastrado no sistema. A criação de conta fica disponível apenas no primeiro acesso.");


      setTimeout(() => {
        navigate("/");
      }, 1500);


      return;
    }


    setErro(mensagemErro);


  }


};
 


  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          color: "#128654",
          mb: 3,
          textAlign: "center",
        }}
      >
        Criar Conta
      </Typography>


      <Stack spacing={2}>
        <TextField
          label="Nome completo"
          name="nome"
          fullWidth
          value={dados.nome}
          onChange={alterarCampo}
        />


        <TextField
          label="E-mail"
          name="email"
          type="email"
          fullWidth
          value={dados.email}
          onChange={alterarCampo}
        />


        <TextField
          label="Senha"
          name="senha"
          type="password"
          fullWidth
          value={dados.senha}
          onChange={alterarCampo}
        />


        <TextField
          label="Confirmar senha"
          name="confirmarSenha"
          type="password"
          fullWidth
          value={dados.confirmarSenha}
          onChange={alterarCampo}
        />


        {erro && <Alert severity="error">{erro}</Alert>}
        {sucesso && <Alert severity="success">{sucesso}</Alert>}


        <Button
          variant="contained"
          fullWidth
          onClick={salvarCadastro}
          sx={{
            bgcolor: "#128654",
            py: 1.4,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
          }}
        >
          Criar Conta
        </Button>


        <Button
          fullWidth
          onClick={() => navigate("/entrar")}
          sx={{
            color: "#128654",
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Já tenho conta
        </Button>
      </Stack>
    </Box>
  );
}


export default Cadastro;

