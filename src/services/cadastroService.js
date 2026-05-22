const USER_REGISTER_KEY = "usuario_nupreco";

const cadastroService = {
  cadastrar(dados) {
    if (!dados.nome || !dados.email || !dados.senha || !dados.confirmarSenha) {
      throw new Error("Preencha todos os campos.");
    }

    if (dados.senha !== dados.confirmarSenha) {
      throw new Error("As senhas não coincidem.");
    }

    const usuario = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
    };

    localStorage.setItem(USER_REGISTER_KEY, JSON.stringify(usuario));

    return usuario;
  },

  buscarUsuarioCadastrado() {
    const usuarioSalvo = localStorage.getItem(USER_REGISTER_KEY);

    if (!usuarioSalvo) {
      return null;
    }

    return JSON.parse(usuarioSalvo);
  },
};

export default cadastroService;