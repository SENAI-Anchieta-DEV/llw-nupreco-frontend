import React from "react";
import {
  Box,
  Typography,
  CssBaseline,
  Container,
} from "@mui/material";
import ThemeToggleButton from "../../components/ThemeToggleButton";


const PublicLayout = ({ title, subtitle, children }) => {
  const verde = "#128654";


  return (
    <>
      <CssBaseline />
      <ThemeToggleButton variant="public" />


      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: 'background.default',
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* LADO ESQUERDO */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            minHeight: "100vh",
            bgcolor: 'background.paper',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 0 },
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ width: "100%", position: "relative" }}>


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
                    color: 'text.primary',
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
                    color: 'text.secondary',
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
                    color: 'text.secondary',
                    lineHeight: 1,
                  }}
                >
                  🌐
                </Typography>


                <Typography
                  sx={{
                    fontSize: ".85rem",
                    color: 'text.secondary',
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
              boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 25px 50px rgba(0,0,0,.42)' : '0 25px 50px rgba(0,0,0,.18)',
            }}
          />
        </Box>
      </Box>
    </>
  );
};


export default PublicLayout;

