import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import fondo from "../../img/prototipo-fondo.png";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright Anthony Cardoze © "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${fondo})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login() {
  const classes = useStyles();
  toast.configure({
    autoClose: 6000,
    draggable: true,
    position: toast.POSITION.TOP_CENTER,
  });
  const errorToast = (data) => toast.error(data);
  const [Islogged, setIslogged] = useState(false);
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChangeUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let header = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify({
        UserName: UserName,
        Password: Password,
      }),
    };

    fetch(`${process.env.REACT_APP_BACK_END}/api/auth/login`, header)
      .then((response) => response.json())
      .then((user) => {
        if (user.accessToken) {
          localStorage.setItem("token_key", user.accessToken);
          setIslogged(true);
        } else {
          errorToast(`ERROR_MESSAGE: ${user}`);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        errorToast(`CONNECTION_PROBLEM: ${error}`);
        setIsLoading(false);
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      {Islogged && <Redirect to="/" />}
      {localStorage.token_key && <Redirect to="/" />}
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Control de Acceso
          </Typography>
          <form className={classes.form} onSubmit={handleOnSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Usuario"
              value={UserName}
              autoFocus
              onChange={handleOnChangeUserName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              value={Password}
              autoComplete="current-password"
              onChange={handleOnChangePassword}
            />
            {isLoading ? (
              <Box mt={5}>
                <CircularProgress />
              </Box>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Entrar
              </Button>
            )}
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default Login;
