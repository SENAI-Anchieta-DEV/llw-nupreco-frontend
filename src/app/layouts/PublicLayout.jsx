import React from "react";
import {
  Box,
  Typography,
  CssBaseline,
  Container,
} from "@mui/material";

const PublicLayout = ({ title, subtitle, children }) => {
  const verde = "#128654";

  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#F8F9F8",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* LADO ESQUERDO */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            minHeight: "100vh",
            bgcolor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 0 },
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  color: verde,
                  fontWeight: 800,
                  fontSize: { xs: "2.3rem", md: "3.5rem" },
                  textAlign: "center",
                  mb: 1,
                }}
              >
                NuPreço
              </Typography>

              {title && (
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.6rem",
                    textAlign: "center",
                    color: "#111",
                    mb: 1,
                  }}
                >
                  {title}
                </Typography>
              )}

              {subtitle && (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#666",
                    fontSize: ".95rem",
                    mb: 4,
                    maxWidth: "420px",
                    mx: "auto",
                  }}
                >
                  {subtitle}
                </Typography>
              )}

              <Box sx={{ width: "100%" }}>{children}</Box>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.7,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: 18,
                    color: "#777",
                    lineHeight: 1,
                  }}
                >
                  🌐
                </Typography>

                <Typography
                  sx={{
                    fontSize: ".85rem",
                    color: "#777",
                    fontWeight: 700,
                  }}
                >
                  PT-BR
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* LADO DIREITO */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            minHeight: "100vh",
            display: { xs: "none", md: "flex" },
            bgcolor: verde,
            color: "#fff",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 6,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "2.4rem",
              mb: 2,
              maxWidth: "520px",
            }}
          >
            Venda com eficiência, onde você estiver
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              opacity: 0.95,
              maxWidth: "500px",
              mb: 6,
              lineHeight: 1.7,
            }}
          >
            Gestão moderna e ágil para microempreendedores que buscam mais
            controle, mais organização e mais lucro, com a simplicidade e
            eficiência que o dia a dia exige.
          </Typography>

          <Box
            component="img"
            src="/EXEMPLODESISTEMA.png"
            alt="Sistema NuPreço"
            sx={{
              width: "100%",
              maxWidth: "540px",
              borderRadius: "18px",
              boxShadow: "0 25px 50px rgba(0,0,0,.18)",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default PublicLayout;