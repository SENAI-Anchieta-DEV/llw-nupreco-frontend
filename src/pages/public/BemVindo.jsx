import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ThemeToggleButton from "../../components/ThemeToggleButton";
import { verificarGestorCadastrado } from "../../utils/firstAccess";

export default function BemVindo() {
  const navigate = useNavigate();
  const [gestorCadastrado, setGestorCadastrado] = useState(false);

  useEffect(() => {
    let componenteMontado = true;

    const verificarCadastroInicial = async () => {
      const existeGestor = await verificarGestorCadastrado();

      if (componenteMontado) {
        setGestorCadastrado(existeGestor);
      }
    };

    verificarCadastroInicial();

    return () => {
      componenteMontado = false;
    };
  }, []);

  const verde = "#128654";

  const cardsProblema = [
    {
      titulo: "Processos manuais",
      texto:
        "Registros manuais e retrabalho que tomam tempo e geram erros.",
    },
    {
      titulo: "Falta de integração",
      texto:
        "Gestão e PDV desconectados, gerando divergências de preços e informações.",
    },
    {
      titulo: "Etiquetas de papel",
      texto:
        "Custo com impressão, logística e dificuldade para manter preços atualizados.",
    },
    {
      titulo: "Risco à rentabilidade",
      texto:
        "Erros de precificação e atrasos impactam diretamente no lucro.",
    },
  ];

  const equipe = [
    {
      img: "/willian.png",
      nome: "Willian Bruno",
      cargo: "Scrum Master",
      texto:
        "Liderança de projeto, Backend e modelagem de Banco de Dados.",
    },
    {
      img: "/laryssa.png",
      nome: "Laryssa Alves Mesquita",
      cargo: "Desenvolvedora Frontend",
      texto:
        "Desenvolvimento Frontend e interface Mobile focada em UX.",
    },
    {
      img: "/leticia.png",
      nome: "Letícia Uhren Castro",
      cargo: "Arquiteta Backend",
      texto:
        "Arquitetura Backend e integração de fluxos de dados.",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <ThemeToggleButton variant="public" />

      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              minHeight: "80px",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/image.png"
                sx={{ width: 42, height: 42 }}
              />
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: verde,
                }}
              >
                NuPreço
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {!gestorCadastrado && (
                <Button
                  variant="contained"
                  onClick={() => navigate("/cadastro")}
                  sx={{
                    bgcolor: verde,
                    textTransform: "none",
                    px: 4,
                    py: 1.2,
                    borderRadius: "10px",
                  }}
                >
                  Solicitar demonstração
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* HERO */}
      <Container maxWidth="lg" sx={{ pt: 18, pb: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                fontSize: { xs: "2.4rem", md: "3.5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Transforme a precificação do seu negócio com{" "}
              <Box component="span" sx={{ color: verde }}>
                tecnologia
              </Box>{" "}
              e{" "}
              <Box component="span" sx={{ color: verde }}>
                inteligência
              </Box>
              .
            </Typography>

            <Typography
              sx={{
                mt: 3,
                color: "text.secondary",
                fontSize: "1.1rem",
                maxWidth: "560px",
              }}
            >
              O NuPreço integra gestão e PDV, automatiza preços e atualiza
              etiquetas eletrônicas em tempo real, garantindo precisão,
              agilidade e mais lucro para o seu negócio.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
                flexWrap: "wrap",
              }}
            >
              {!gestorCadastrado && (
                <Button
                  variant="contained"
                  onClick={() => navigate("/cadastro")}
                  sx={{
                    bgcolor: verde,
                    textTransform: "none",
                    px: 4,
                    py: 1.3,
                    borderRadius: "10px",
                  }}
                >
                  Solicitar demonstração
                </Button>
              )}

              <Button
                variant="outlined"
                onClick={() => navigate("/entrar")}
                sx={{
                  borderColor: verde,
                  color: verde,
                  textTransform: "none",
                  px: 4,
                  py: 1.3,
                  borderRadius: "10px",
                }}
              >
                Ver como funciona
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(18,134,84,0.20)"
                    : "#DDF3EA",
                borderRadius: "50%",
                p: 4,
              }}
            >
              <Box
                component="img"
                src="/COMPUTER.png"
                sx={{
                  width: "100%",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* PROBLEMA */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography sx={{ color: verde, fontWeight: 800 }}>
          O PROBLEMA
        </Typography>

        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 800,
            mb: 5,
          }}
        >
          Desafios que impactam o seu negócio
        </Typography>

        <Grid container spacing={3}>
          {cardsProblema.map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  borderRadius: "16px",
                  height: "100%",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 10px 30px rgba(0,0,0,.30)"
                      : "0 10px 30px rgba(0,0,0,.05)",
                }}
              >
                <CardContent>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>
                    {item.titulo}
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: ".95rem",
                    }}
                  >
                    {item.texto}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SOLUÇÃO */}
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#111827" : "#EFF3F1",
          py: 12,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ color: verde, fontWeight: 800 }}>
            A SOLUÇÃO
          </Typography>

          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              mb: 6,
            }}
          >
            NuPreço: integração, automação e precisão
          </Typography>

          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography sx={{ mb: 2 }}>
                ✔ Precificação Automatizada
              </Typography>

              <Typography sx={{ mb: 2 }}>
                ✔ Integração IoT (Displays LCD)
              </Typography>

              <Typography sx={{ mb: 2 }}>
                ✔ Gestão de Fluxo e Alertas
              </Typography>

              <Typography>
                ✔ Estorno Descomplicado
              </Typography>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box
                component="img"
                src="/ETIQUETA.png"
                sx={{
                  width: "100%",
                  maxWidth: "620px",
                  display: "block",
                  mx: "auto",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* EQUIPE */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography sx={{ color: verde, fontWeight: 800 }}>
          QUEM FAZ O NUPREÇO ACONTECER
        </Typography>

        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: 800,
            mb: 6,
          }}
        >
          Um time comprometido com a inovação e o seu sucesso.
        </Typography>

        <Grid container spacing={3}>
          {equipe.map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card
                sx={{
                  borderRadius: "18px",
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Box
                  component="img"
                  src={item.img}
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    objectFit: "cover",
                    mb: 2,
                  }}
                />

                <Typography sx={{ fontWeight: 800 }}>
                  {item.nome}
                </Typography>

                <Typography
                  sx={{
                    color: verde,
                    fontWeight: 700,
                    fontSize: ".95rem",
                    mb: 1,
                  }}
                >
                  {item.cargo}
                </Typography>

                <Typography sx={{ color: "text.secondary" }}>
                  {item.texto}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* APP CTA */}
      <Box sx={{ bgcolor: verde, py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "2rem",
                  mb: 2,
                }}
              >
                Seu negócio na palma da mão.
              </Typography>

              <Typography sx={{ color: "#fff", mb: 4 }}>
                Automatize sua precificação e gerencie sua rentabilidade de
                qualquer lugar. Escaneie o QR Code ao lado e instale o app
                NuPreço agora mesmo.
              </Typography>

              <Button
                onClick={() => navigate("/cadastro")}
                sx={{
                  bgcolor: "background.paper",
                  color: verde,
                  textTransform: "none",
                  px: 4,
                  py: 1.3,
                  borderRadius: "10px",
                }}
              >
                Solicitar demonstração
              </Button>
            </Grid>

            {/* IMAGENS ALINHADAS E MAIORES */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: { xs: 4, md: 8 },
                  flexWrap: "nowrap",
                }}
              >
                <Box
                  component="img"
                  src="/Celular.png"
                  sx={{
                    width: { xs: "280px", md: "400px" },
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />

                <Box
                  component="img"
                  src="/qrcod.png"
                  sx={{
                    width: { xs: "170px", md: "220px" },
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ bgcolor: "#0A3F2A", color: "#fff", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography sx={{ fontWeight: 800, mb: 2 }}>
                NuPreço
              </Typography>

              <Typography>
                Integração, automação e precisão para transformar seu negócio.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={{ fontWeight: 800, mb: 2 }}>
                Soluções
              </Typography>
              <Typography>Precificação</Typography>
              <Typography>Integração IoT</Typography>
              <Typography>Gestão de Fluxo</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={{ fontWeight: 800, mb: 2 }}>
                Contato
              </Typography>
              <Typography>contato@nupreco.com.br</Typography>
              <Typography>(11) 99999-9999</Typography>
            </Grid>
          </Grid>

          <Typography
            sx={{
              mt: 5,
              pt: 3,
              borderTop: "1px solid rgba(255,255,255,.1)",
              textAlign: "center",
            }}
          >
            © 2025 NuPreço. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

