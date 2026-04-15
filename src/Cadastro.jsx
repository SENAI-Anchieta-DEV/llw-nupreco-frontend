import { useState, useEffect, useMemo } from "react";
import { Snackbar, Alert, ThemeProvider, CssBaseline, Fab, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { obterTemaNupreco } from "./theme";

import Inicio from "./inicio";
import VendaConsulta from "./VendaConsulta";
import PdvRapido from "./PdvRapido";
import BemVindo from "./BemVindo";
import Cadastro from "./Cadastro";
import Login from "./entrar";
import Produto from "./Produto";
import Estoque from "./Estoque";
import Contas from "./Contas";
import Usuarios from "./Usuarios";

function App() {
  const carregar = (chave, valorPadrao) => {
    const salvo = localStorage.getItem(chave);
    return salvo ? JSON.parse(salvo) : valorPadrao;
  };

  const [modoEscuro, setModoEscuro] = useState(() => carregar("nupreco_tema", false));
  const temaAtivo = useMemo(
    () => obterTemaNupreco(modoEscuro ? "dark" : "light"),
    [modoEscuro]
  );

  const alternarTema = () => {
    setModoEscuro((prev) => {
      const novo = !prev;
      localStorage.setItem("nupreco_tema", JSON.stringify(novo));
      return novo;
    });
  };

  const [telaAtiva, setTelaAtiva] = useState("bemvindo");
  const [logado, setLogado] = useState(false);
  const [subTela, setSubTela] = useState("menu");
  const [usuarioLogado, setUsuarioLogado] = useState("");
  const [produtosCadastrados, setProdutosCadastrados] = useState(() =>
    carregar("nupreco_produtos", [])
  );
  const [historicoVendas, setHistoricoVendas] = useState(() =>
    carregar("nupreco_vendas", [])
  );
  const [usuarioCadastrado, setUsuarioCadastrado] = useState(() =>
    carregar("nupreco_usuario", null)
  );
  const [contasCadastradas, setContasCadastradas] = useState(() =>
    carregar("nupreco_contas", [])
  );
  const [usuariosLista, setUsuariosLista] = useState(() =>
    carregar("nupreco_usuarios_lista", [])
  );
  const [estaCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState({
    aberto: false,
    mensagem: "",
    tipo: "success",
  });

  const mostrarMensagem = (msg, tipo = "success") =>
    setNotificacao({ aberto: true, mensagem: msg, tipo });

  useEffect(() => {
    localStorage.setItem("nupreco_produtos", JSON.stringify(produtosCadastrados));
  }, [produtosCadastrados]);

  useEffect(() => {
    localStorage.setItem("nupreco_vendas", JSON.stringify(historicoVendas));
  }, [historicoVendas]);

  useEffect(() => {
    localStorage.setItem("nupreco_contas", JSON.stringify(contasCadastradas));
  }, [contasCadastradas]);

  useEffect(() => {
    localStorage.setItem("nupreco_usuario", JSON.stringify(usuarioCadastrado));
  }, [usuarioCadastrado]);

  useEffect(() => {
    localStorage.setItem("nupreco_usuarios_lista", JSON.stringify(usuariosLista));
  }, [usuariosLista]);

  const handleLogout = () => {
    setLogado(false);
    setTelaAtiva("login");
    setSubTela("menu");
    mostrarMensagem("Sessão encerrada.", "info");
  };

  const salvarProduto = (produto) => {
    setProdutosCadastrados((prev) => {
      const existe = prev.some((p) => p.id === produto.id || p.cod === produto.cod);
      if (existe) {
        return prev.map((p) =>
          p.id === produto.id || p.cod === produto.cod ? { ...p, ...produto } : p
        );
      }
      return [produto, ...prev];
    });
    mostrarMensagem("Produto salvo com sucesso!");
  };

  const excluirProduto = (idOuCodigo) => {
    setProdutosCadastrados((prev) =>
      prev.filter((p) => p.id !== idOuCodigo && p.cod !== idOuCodigo)
    );
    mostrarMensagem("Produto removido com sucesso.", "info");
  };

  const atualizarQtdProduto = (codigo, novaQtd) => {
    setProdutosCadastrados((prev) =>
      prev.map((p) => (p.cod === codigo ? { ...p, qtd: novaQtd } : p))
    );
  };

  const salvarConta = (conta) => {
    setContasCadastradas((prev) => {
      const existe = prev.some((c) => c.id === conta.id);
      if (existe) {
        return prev.map((c) => (c.id === conta.id ? { ...c, ...conta } : c));
      }
      return [conta, ...prev];
    });
    mostrarMensagem("Conta salva com sucesso!");
  };

  const excluirConta = (id) => {
    setContasCadastradas((prev) => prev.filter((c) => c.id !== id));
    mostrarMensagem("Conta removida com sucesso.", "info");
  };

  const salvarUsuario = (usuario) => {
    setUsuariosLista((prev) => {
      const existe = prev.some((u) => u.id === usuario.id || u.email === usuario.email);
      if (existe) {
        return prev.map((u) =>
          u.id === usuario.id || u.email === usuario.email
            ? { ...u, ...usuario, senha: usuario.senha ? usuario.senha : u.senha }
            : u
        );
      }
      return [usuario, ...prev];
    });
    mostrarMensagem("Usuário salvo com sucesso!");
  };

  const excluirUsuario = (id) => {
    setUsuariosLista((prev) => prev.filter((u) => u.id !== id));
    mostrarMensagem("Usuário removido com sucesso.", "info");
  };

  const registrarVenda = (venda) => {
    setHistoricoVendas((prev) => [{ id: `VENDA-${prev.length + 1}`, ...venda }, ...prev]);
    mostrarMensagem("Venda realizada!");
  };

  const hoje = new Date().toISOString().split("T")[0];
  const contasDoDia = contasCadastradas.filter(
    (c) => c.dataVencimento === hoje && !c.paga
  );

  return (
    <ThemeProvider theme={temaAtivo}>
      <CssBaseline />

      <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
        <Fab color="primary" onClick={alternarTema} size="medium">
          {modoEscuro ? <Brightness7Icon /> : <Brightness4Icon />}
        </Fab>
      </Box>

      {!logado ? (
        <>
          {telaAtiva === "bemvindo" && (
            <BemVindo
              aoClicarCriar={() => setTelaAtiva("cadastro")}
              aoClicarEntrar={() => setTelaAtiva("login")}
            />
          )}

          {telaAtiva === "cadastro" && (
            <Cadastro
              aoVoltar={() => setTelaAtiva("bemvindo")}
              aoSalvarCadastro={(dados) => {
                const novoUsuario = { id: "ADMIN_ROOT", ...dados };
                setUsuarioCadastrado(dados);
                setUsuariosLista([novoUsuario]);
                setUsuarioLogado(dados.nome);
                setLogado(true);
                setSubTela("menu");
                mostrarMensagem("Conta criada!");
              }}
              aoNotificar={mostrarMensagem}
            />
          )}

          {telaAtiva === "login" && (
            <Login
              aoVoltar={() => setTelaAtiva("bemvindo")}
              listaUsuarios={usuariosLista}
              onLogin={(nome) => {
                setUsuarioLogado(nome);
                setLogado(true);
                setSubTela("menu");
              }}
              aoNotificar={mostrarMensagem}
            />
          )}
        </>
      ) : (
        <>
          {subTela === "menu" && (
            <Inicio
              onLogout={handleLogout}
              perfilUsuario={
                usuarioLogado === usuarioCadastrado?.nome ? "ADMINISTRADOR" : "FUNCIONÁRIO"
              }
              aoClicarVendas={() => setSubTela("vendas")}
              aoClicarPdv={() => setSubTela("pdv")}
              aoClicarProdutos={() => setSubTela("produto")}
              aoClicarEstoque={() => setSubTela("estoque")}
              aoClicarContas={() => setSubTela("contas")}
              aoClicarUsuarios={() => setSubTela("usuarios")}
              listaContasDoDia={contasDoDia}
            />
          )}

          {subTela === "pdv" && (
            <PdvRapido
              onBack={() => setSubTela("menu")}
              onLogout={handleLogout}
              onRegistrarVenda={registrarVenda}
              nomeVendedor={usuarioLogado}
              estoque={produtosCadastrados}
              carregando={estaCarregando}
              aoNotificar={mostrarMensagem}
              aoIrVendas={() => setSubTela("vendas")}
              aoIrUsuarios={() => setSubTela("usuarios")}
              aoIrProdutos={() => setSubTela("produto")}
              aoIrEstoque={() => setSubTela("estoque")}
              aoIrContas={() => setSubTela("contas")}
            />
          )}

          {subTela === "estoque" && (
            <Estoque
              produtos={produtosCadastrados}
              onBack={() => setSubTela("menu")}
              onLogout={handleLogout}
              aoAtualizarQtd={atualizarQtdProduto}
              aoNotificar={mostrarMensagem}
              aoIrVendas={() => setSubTela("vendas")}
              aoIrUsuarios={() => setSubTela("usuarios")}
              aoIrProdutos={() => setSubTela("produto")}
              aoIrPdv={() => setSubTela("pdv")}
              aoIrContas={() => setSubTela("contas")}
            />
          )}

          {subTela === "contas" && (
            <Contas
              onBack={() => setSubTela("menu")}
              onLogout={handleLogout}
              aoSalvarConta={salvarConta}
              aoExcluirConta={excluirConta}
              contasCadastradas={contasCadastradas}
              aoNotificar={mostrarMensagem}
              aoIrVendas={() => setSubTela("vendas")}
              aoIrUsuarios={() => setSubTela("usuarios")}
              aoIrProdutos={() => setSubTela("produto")}
              aoIrPdv={() => setSubTela("pdv")}
              aoIrEstoque={() => setSubTela("estoque")}
            />
          )}

          {subTela === "produto" && (
            <Produto
              onBack={() => setSubTela("menu")}
              onLogout={handleLogout}
              onSalvarProduto={salvarProduto}
              aoExcluirProduto={excluirProduto}
              produtosCadastrados={produtosCadastrados}
              aoClicarEstoque={() => setSubTela("estoque")}
              aoNotificar={mostrarMensagem}
              aoIrVendas={() => setSubTela("vendas")}
              aoIrUsuarios={() => setSubTela("usuarios")}
              aoIrPdv={() => setSubTela("pdv")}
              aoIrContas={() => setSubTela("contas")}
            />
          )}

          {subTela === "usuarios" && (
            <Usuarios
              onBack={() => setSubTela("menu")}
              usuariosCadastrados={usuariosLista}
              aoSalvarUsuario={salvarUsuario}
              aoExcluirUsuario={excluirUsuario}
              usuarioLogado={usuarioLogado}
              aoNotificar={mostrarMensagem}
              onLogout={handleLogout}
              aoIrVendas={() => setSubTela("vendas")}
              aoIrProdutos={() => setSubTela("produto")}
              aoIrPdv={() => setSubTela("pdv")}
              aoIrContas={() => setSubTela("contas")}
              aoIrEstoque={() => setSubTela("estoque")}
            />
          )}

          {subTela === "vendas" && (
            <VendaConsulta
              onBack={() => setSubTela("menu")}
              onLogout={handleLogout}
              historicoVendas={historicoVendas}
              aoIrUsuarios={() => setSubTela("usuarios")}
              aoIrProdutos={() => setSubTela("produto")}
              aoIrPdv={() => setSubTela("pdv")}
              aoIrContas={() => setSubTela("contas")}
              aoIrEstoque={() => setSubTela("estoque")}
            />
          )}
        </>
      )}

      <Snackbar
        open={notificacao.aberto}
        autoHideDuration={4000}
        onClose={() => setNotificacao((prev) => ({ ...prev, aberto: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={notificacao.tipo} variant="filled">
          {notificacao.mensagem}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;