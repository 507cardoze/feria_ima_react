import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import DataTable from "../../components/dataTable/dataTable.component";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";
import TablePagination from "@material-ui/core/TablePagination";
import SearchBox from "../../components/searchBox/searchBox.compoent";
import moment from "moment";

function Clientes() {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);
  const msgSuccess = (msj) => toast.success(msj);

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const [num_documento, setNumDocumento] = useState("");
  const [nombre, setnombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [genero, setGenero] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [lugar_nacimiento, setLugarNacimiento] = useState("");
  const [tipo_sangre, setTipoSangre] = useState("NA");
  const [direccion, setDireccion] = useState("");
  const [fecha_expiracion, setFechaExpiracion] = useState("");

  const [rows, setRows] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { results } = rows;
  const { total } = rows;

  const url = `${process.env.REACT_APP_BACK_END}/api/clientes/filtrada?page=${page}&limit=${limit}`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/clientes/searchField/`;
  const urlCrear = `${process.env.REACT_APP_BACK_END}/api/clientes/crear`;

  const bodyRequest = {
    num_documento: num_documento.toUpperCase(),
    nombre: nombre.toUpperCase(),
    apellido: apellido.toUpperCase(),
    genero: genero,
    fecha_nacimiento: fecha_nacimiento,
    nacionalidad: nacionalidad.toUpperCase(),
    lugar_nacimiento: lugar_nacimiento.toUpperCase(),
    tipo_sangre: tipo_sangre,
    direccion: direccion.toUpperCase(),
    fecha_expiracion: fecha_expiracion,
  };

  const header = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    mode: "cors",
    cache: "default",
  };

  const headerPost = {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    body: JSON.stringify(bodyRequest),
  };

  const fetchdata = async (url, header, setter) => {
    setisLoading(false);
    try {
      const data = await fetch(url, header);
      const filtered = await data.json();
      UnauthorizedRedirect(filtered);
      setter(filtered);
      setisLoading(true);
    } catch (error) {
      msgError(error);
    }
  };

  const columns = [
    { tittle: "Cedula" },
    { tittle: "Nombre" },
    { tittle: "Apellido" },
    { tittle: "Genero" },
    { tittle: "Fecha de Nacimiento" },
    { tittle: "Nacionalidad" },
    { tittle: "Lugar de Nacimiento" },
    { tittle: "Tipo de Sangre" },
    { tittle: "Direccion" },
    { tittle: "Fecha expiracion" },
    { tittle: "Usuario Creacion" },
    { tittle: "Fecha Creacion" },
    { tittle: "Tiempo Relativo" },
  ];

  const onChangeSetter = (e, setter) => {
    setter(e.target.value);
  };

  const onClickGuardar = (e) => {
    e.preventDefault();
    fetch(urlCrear, headerPost)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        if (data === "success") {
          fetchdata(url, header, setRows);
          msgSuccess("Registro Exitoso.");
        } else {
          msgError(data);
        }
      });
  };

  const handleChangePage = (page) => {
    setPage(page + 1);
  };

  const handleChangeLimit = (limit) => {
    setLimit(limit);
  };

  const handleOnChangeSearchField = async (e) => {
    if (e.target.value.length > 3) {
      const data = await fetch(`${urlBusqueda}${e.target.value}`, header);
      const received_data = await data.json();

      try {
        setSearchResults(received_data);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const header = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token_key}`,
      },
      mode: "cors",
      cache: "default",
    };

    const fetchdata = async (url, header, setter) => {
      setisLoading(false);
      try {
        const data = await fetch(url, header);
        const filtered = await data.json();
        UnauthorizedRedirect(filtered);
        setter(filtered);
        setisLoading(true);
      } catch (error) {
        msgError(`No hay conexion... ${error}`);
      }
    };
    fetchdata(url, header, setRows);
  }, [url]);

  return (
    <MainLayout Tittle="Clientes">
      <Grid item xs={12} md={12} lg={12}>
        <SearchBox onChangeInput={handleOnChangeSearchField}>
          {searchResults.length > 0 && (
            <ul className="list">
              {searchResults.map((value) => {
                return (
                  <Link
                    className="list-item"
                    key={value.id_cliente}
                    to={`/clientes/${value.id_cliente}`}
                  >{`${value.num_documento} - ${value.nombre} - ${value.apellido}`}</Link>
                );
              })}
            </ul>
          )}
        </SearchBox>
        <Paper>
          <form onSubmit={onClickGuardar} className="inputs-container">
            <Grid item xs={12} md={6} lg={6}>
              <TextField
                label="Cedula"
                variant="outlined"
                defaultValue={num_documento}
                className="inputs"
                type="text"
                onChange={(e) => onChangeSetter(e, setNumDocumento)}
              />
              <TextField
                label="Nombre"
                variant="outlined"
                defaultValue={nombre}
                className="inputs"
                type="text"
                onChange={(e) => onChangeSetter(e, setnombre)}
              />
              <TextField
                label="Apellido"
                variant="outlined"
                defaultValue={apellido}
                className="inputs"
                type="text"
                onChange={(e) => onChangeSetter(e, setApellido)}
              />
              <TextField
                label="Nacionalidad"
                variant="outlined"
                defaultValue={nacionalidad}
                className="inputs"
                type="text"
                onChange={(e) => onChangeSetter(e, setNacionalidad)}
              />
              <TextField
                label="Lugar de Nacimiento"
                variant="outlined"
                defaultValue={lugar_nacimiento}
                className="inputs"
                multiline
                type="text"
                onChange={(e) => onChangeSetter(e, setLugarNacimiento)}
              />

              <TextField
                label="Direccion"
                variant="outlined"
                defaultValue={direccion}
                className="inputs"
                multiline
                type="text"
                onChange={(e) => onChangeSetter(e, setDireccion)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className="select-form">
                <InputLabel id="sangre-select-label">Tipo de sangre</InputLabel>
                <Select
                  labelId="sangre-select-label"
                  id="sangre-simple-select"
                  className="inputs"
                  onChange={(e) => onChangeSetter(e, setTipoSangre)}
                  autoWidth
                  defaultValue={tipo_sangre}
                >
                  <MenuItem value="O-">O negativo</MenuItem>
                  <MenuItem value="O+">O positivo</MenuItem>
                  <MenuItem value="A-">A negativo</MenuItem>
                  <MenuItem value="A+">A positivo</MenuItem>
                  <MenuItem value="B-">B negativo</MenuItem>
                  <MenuItem value="B+">B positivo</MenuItem>
                  <MenuItem value="AB+">AB negativo</MenuItem>
                  <MenuItem value="AB-">AB positivo</MenuItem>
                  <MenuItem value="NA">No Sabe</MenuItem>
                </Select>
              </div>
              <div className="select-form">
                <InputLabel id="genero-select-label">Genero</InputLabel>
                <Select
                  labelId="genero-select-label"
                  id="genero-simple-select"
                  className="inputs"
                  onChange={(e) => onChangeSetter(e, setGenero)}
                  autoWidth
                  defaultValue={genero}
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Select>
              </div>
              <div className="select-form">
                <InputLabel id="nacimiento-label">
                  Fecha de nacimiento
                </InputLabel>
                <TextField
                  labelId="nacimiento-label"
                  variant="outlined"
                  defaultValue={fecha_nacimiento}
                  className="inputs"
                  type="date"
                  onChange={(e) => onChangeSetter(e, setFechaNacimiento)}
                />
              </div>
              <div className="select-form">
                <InputLabel id="expiracion-label">
                  Fecha de expiracion
                </InputLabel>
                <TextField
                  labelId="expiracion-label"
                  variant="outlined"
                  defaultValue={fecha_expiracion}
                  className="inputs"
                  type="date"
                  onChange={(e) => onChangeSetter(e, setFechaExpiracion)}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Button
                className="inputs"
                variant="contained"
                color="primary"
                type="submit"
              >
                Crear Nuevo Clientes
              </Button>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        {!isLoading ? (
          <CircularProgress />
        ) : (
          results && (
            <>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 200]}
                labelRowsPerPage="Filas por página"
                component="div"
                count={total && total}
                rowsPerPage={limit}
                onChangeRowsPerPage={(event) =>
                  handleChangeLimit(parseInt(event.target.value))
                }
                page={page - 1}
                onChangePage={(event, page) => handleChangePage(page)}
              />
              <DataTable columns={columns}>
                {results.map((row) => {
                  return (
                    <TableRow key={row.id_cliente}>
                      <TableCell component="th" scope="row">
                        <Link to={`/clientes/${row.id_cliente}`}>
                          <IconButton aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      </TableCell>
                      <TableCell align="center">{row.num_documento}</TableCell>
                      <TableCell align="center">{row.nombre}</TableCell>
                      <TableCell align="center">{row.apellido}</TableCell>
                      <TableCell align="center">{row.genero}</TableCell>
                      <TableCell align="center">
                        {moment(row.fecha_nacimiento).format("D, MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">{row.nacionalidad}</TableCell>
                      <TableCell align="center">
                        {row.lugar_nacimiento}
                      </TableCell>
                      <TableCell align="center">{row.tipo_sangre}</TableCell>
                      <TableCell align="center">{row.direccion}</TableCell>
                      <TableCell align="center">
                        {moment(row.fecha_expiracion).format("D, MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        {row.usuario_creacion}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.fecha_creacion).format("D, MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.fecha_creacion).fromNow()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </DataTable>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100, 200]}
                labelRowsPerPage="Filas por página"
                component="div"
                count={total && total}
                rowsPerPage={limit}
                onChangeRowsPerPage={(event) =>
                  handleChangeLimit(parseInt(event.target.value))
                }
                page={page - 1}
                onChangePage={(event, page) => handleChangePage(page)}
              />
            </>
          )
        )}
      </Grid>
    </MainLayout>
  );
}

export default memo(Clientes);
