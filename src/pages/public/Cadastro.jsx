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
<<<<<<< HEAD
import { marcarGestorCadastrado } from "../../utils/firstAccess";

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65

function Cadastro() {
  const navigate = useNavigate();

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

<<<<<<< HEAD

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");


=======
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  const alterarCampo = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value,
    });
  };

<<<<<<< HEAD

const salvarCadastro = async () => {


  setErro("");


=======
const salvarCadastro = async () => {

  setErro("");

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  setSucesso("");
 
  if (!dados.nome || !dados.email || !dados.senha || !dados.confirmarSenha) {

<<<<<<< HEAD

    setErro("Preencha todos os campos.");


    return;


=======
    setErro("Preencha todos os campos.");

    return;

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  }
 
  if (dados.senha !== dados.confirmarSenha) {

<<<<<<< HEAD

    setErro("As senhas não coincidem.");


    return;


=======
    setErro("As senhas não coincidem.");

    return;

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  }
 
  const usuario = {

<<<<<<< HEAD

    nome: dados.nome,


    email: dados.email,


    senha: dados.senha,


=======
    nome: dados.nome,

    email: dados.email,

    senha: dados.senha,

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
  };
 
  try {

<<<<<<< HEAD

    await api.post("/usuarios/gestor", usuario);


    marcarGestorCadastrado();
=======
    await api.post("/usuarios/gestor", usuario);
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
 
    setSucesso("Conta criada com sucesso!");
 
    setTimeout(() => {

<<<<<<< HEAD

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
 


=======
      navigate("/entrar");

    }, 1500);

  } catch (error) {

    setErro(

      error.response?.data?.message ||

        error.response?.data?.detail ||

        "Não foi possível criar a conta."

    );

  }

};
 

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
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

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
      <Stack spacing={2}>
        <TextField
          label="Nome completo"
          name="nome"
          fullWidth
          value={dados.nome}
          onChange={alterarCampo}
        />

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        <TextField
          label="E-mail"
          name="email"
          type="email"
          fullWidth
          value={dados.email}
          onChange={alterarCampo}
        />

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        <TextField
          label="Senha"
          name="senha"
          type="password"
          fullWidth
          value={dados.senha}
          onChange={alterarCampo}
        />

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
        <TextField
          label="Confirmar senha"
          name="confirmarSenha"
          type="password"
          fullWidth
          value={dados.confirmarSenha}
          onChange={alterarCampo}
        />

<<<<<<< HEAD

        {erro && <Alert severity="error">{erro}</Alert>}
        {sucesso && <Alert severity="success">{sucesso}</Alert>}


=======
        {erro && <Alert severity="error">{erro}</Alert>}
        {sucesso && <Alert severity="success">{sucesso}</Alert>}

>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
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

<<<<<<< HEAD

=======
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
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

<<<<<<< HEAD

export default Cadastro;

=======
export default Cadastro;
>>>>>>> e974d01e537c9df46ae1deb54207faa6b1a77f65
