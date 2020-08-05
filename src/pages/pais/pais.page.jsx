import React, { useState, useEffect } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import DataTable from "../../components/dataTable/dataTable.component";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./pais.styles.scss";
import moment from "moment";
import { toast } from "react-toastify";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";

function Pais() {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const columns = [
    { tittle: "Nomenclatura" },
    { tittle: "Pais" },
    { tittle: "Nacionalidad" },
    { tittle: "Estado" },
    { tittle: "Fecha Creación" },
    { tittle: "Tiempo Relativo" },
  ];

  const [nomesclatura, setNomesclatura] = useState("");
  const [pais, setPais] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [estado, setEstado] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const [edit, setEdit] = useState(false);

  const header = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    mode: "cors",
    cache: "default",
  };

  useEffect(() => {
    const fetchData = async () => {
      setisLoading(false);
      try {
        const data_pais = await fetch(
          `${process.env.REACT_APP_BACK_END}/api/pais`,
          header
        );
        const pa = await data_pais.json();
        if (pa === "No esta autorizado") {
          localStorage.clear();
          window.location.replace("/login");
        }
        setRows(pa);
        setisLoading(true);
      } catch (error) {
        msgError(error);
      }
    };
    fetchData();
  }, []);

  const onchangeNomesclatura = (e) => {
    setNomesclatura(e.target.value);
  };

  const onchangePais = (e) => {
    setPais(e.target.value);
  };

  const onchangeNacionalidad = (e) => {
    setNacionalidad(e.target.value);
  };

  const onchangeEstado = (e) => {
    setEstado(e.target.checked);
  };

  const headerPost = {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    body: JSON.stringify({
      nomesclatura: nomesclatura,
      pais: pais,
      nacionalidad: nacionalidad,
      estado: estado,
    }),
  };

  const onClickGuardar = () => {
    fetch(`${process.env.REACT_APP_BACK_END}/api/pais/crear`, headerPost)
      .then((response) => response.json())
      .then((data) => {
        if (data === "No esta autorizado") {
          localStorage.clear();
          window.location.replace("/login");
        } else {
          if (data === "success") {
            window.location.replace("/pais");
          } else {
            msgError(data);
          }
        }
      });
  };

  return (
    <MainLayout Tittle="Pais">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper className="pais-inputs-container">
              <TextField
                label="Nomenclatura"
                variant="outlined"
                className="pais-inputs"
                onChange={(e) => onchangeNomesclatura(e)}
              />
              <TextField
                label="Pais"
                variant="outlined"
                className="pais-inputs"
                onChange={(e) => onchangePais(e)}
              />
              <TextField
                label="Nacionalidad"
                variant="outlined"
                className="pais-inputs"
                onChange={(e) => onchangeNacionalidad(e)}
              />
              <Switch
                checked={estado}
                color="primary"
                inputProps={{ "aria-label": "primary checkbox" }}
                onChange={(e) => onchangeEstado(e)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={onClickGuardar}
              >
                Guardar
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <DataTable columns={columns}>
              {rows.map((row, i) => {
                return (
                  <TableRow>
                    <TableCell align="center">
                      {edit ? (
                        <IconButton
                          aria-label="close"
                          onClick={() => setEdit(false)}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="edit"
                          onClick={() => setEdit(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {edit && (
                        <IconButton aria-label="save">
                          <SaveIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {!edit ? (
                        row.id_pais
                      ) : (
                        <TextField
                          label="Nomenclatura"
                          variant="outlined"
                          defaultValue={row.id_pais}
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">{row.nombre_pais}</TableCell>
                    <TableCell align="center">
                      {row.nombre_nacionalidad}
                    </TableCell>
                    <TableCell align="center">
                      {row.estado === 1 ? "Activo" : "Inactivo"}
                    </TableCell>
                    <TableCell align="center">
                      {moment(row.fecha_creacion).format(
                        "D, MMMM YYYY, h:mm a"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {moment(row.fecha_creacion).fromNow()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </DataTable>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
}

export default Pais;
