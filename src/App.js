import { useState } from "react";
import BemVindo from "./BemVindo";
import Cadastro from "./Cadastro";
import Login from "./entrar"; 
import Inicio from "./inicio";

function App() {
  const [telaAtiva, setTelaAtiva] = useState("bemvindo");
  const [logado, setLogado] = useState(false);
  
  // Estado para guardar os dados que o usuário criou no cadastro
  const [usuarioCadastrado, setUsuarioCadastrado] = useState(null);

  // LÓGICA DE NAVEGAÇÃO
  if (!logado) {
    return (
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
            // Quando o botão 'Criar conta' for clicado e carregar:
            aoSalvarCadastro={(dados) => {
              setUsuarioCadastrado(dados); // Salva Nome, E-mail e Senha
              setLogado(true); // LOGA AUTOMATICAMENTE E VAI PARA O INICIO
            }}
          />
        )}

        {telaAtiva === "login" && (
          <Login 
            aoVoltar={() => setTelaAtiva("bemvindo")} 
            dadosParaConferir={usuarioCadastrado}
            onLogin={() => setLogado(true)} 
          />
        )}
      </>
    );
  }

  // TELA PRINCIPAL (SIDEBAR VERDE + CARDS)
  // Só aparece se logado === true
  return <Inicio onLogout={() => setLogado(false)} />;
}

export default App;