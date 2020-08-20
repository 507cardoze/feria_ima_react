import React from "react";
import { Box, Container, Typography, makeStyles } from "@material-ui/core";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import imagen from "../../img/not_found.png";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
}));

const NotFoundView = () => {
  const classes = useStyles();

  return (
    <MainLayout Tittle="404: Error de pagina">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Typography align="center" color="textPrimary" variant="h2">
            404: La página que estás buscando no está aquí.
          </Typography>
          <Typography align="center" color="textPrimary" variant="subtitle2">
            Intentaste alguna ruta equivocada o viniste aquí por error. Sea lo
            que sea, intente usar la navegación.
          </Typography>
          <Box textAlign="center">
            <img
              alt="Under development"
              className={classes.image}
              src={imagen}
            />
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
};

export default NotFoundView;
