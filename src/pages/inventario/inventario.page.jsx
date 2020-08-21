import React, { useState, useEffect, memo } from "react";
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TablePagination from "@material-ui/core/TablePagination";
import SearchBox from "../../components/searchBox/searchBox.compoent";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

function Inventario() {
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

  const [id_pais, setIdPais] = useState("");
  const [id_provincia, setIdProvincia] = useState("");
  const [id_distrito, setIdDistrito] = useState("");
  const [id_corregimiento, setIdCorregimiento] = useState("");
  const [id_feria, setIdFeria] = useState("");
  const [id_producto, setIdProducto] = useState("");
  const [total_inicial_disponible, setTotalInicialDisponible] = useState(0);
  const [disponible_real, setDisponibleReal] = useState(0);
  const [frecuencia_compra_dias, setFrecuenciaCompraDias] = useState(0);
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [observacion, setObservacion] = useState("");
  const [estado, setEstado] = useState(true);

  const [rows, setRows] = useState({});
  const [ferias, setFerias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pais, setPais] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { results } = rows;
  const { total } = rows;

  const url = `${process.env.REACT_APP_BACK_END}/api/inventarios/filtrada?page=${page}&limit=${limit}`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/inventarios/searchField/`;
  const urlCrear = `${process.env.REACT_APP_BACK_END}/api/inventarios/crear`;
  const urlBuscar = `${process.env.REACT_APP_BACK_END}/api/feria/buscar/`;

  const urlFeria = `${process.env.REACT_APP_BACK_END}/api/feria/filtrada`;
  const urlProducto = `${process.env.REACT_APP_BACK_END}/api/productos/filtrada`;
  const urlPais = `${process.env.REACT_APP_BACK_END}/api/pais/filtrada`;

  const bodyRequest = {
    id_pais: id_pais,
    id_provincia: parseInt(id_provincia),
    id_distrito: parseInt(id_distrito),
    id_corregimiento: parseInt(id_corregimiento),
    id_feria: parseInt(id_feria),
    id_producto: parseInt(id_producto),
    total_inicial_disponible: parseInt(total_inicial_disponible),
    disponible_real: parseInt(disponible_real),
    frecuencia_compra_dias: parseInt(frecuencia_compra_dias),
    fecha_inicio: fecha_inicio,
    fecha_fin: fecha_fin,
    observacion: observacion,
    estado: estado,
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
    { tittle: "#" },
    { tittle: "Producto" },
    { tittle: "Frecuencia de compra" },
    { tittle: "Total inicial disponible" },
    { tittle: "Disponible real" },
    { tittle: "Inicio" },
    { tittle: "Fin" },
    { tittle: "Observación" },
    { tittle: "Feria" },
    { tittle: "país" },
    { tittle: "Provincia" },
    { tittle: "Distrito" },
    { tittle: "Corregimiento" },
    { tittle: "Usuario Creación" },
    { tittle: "Fecha Creación" },
    { tittle: "Tiempo relativo" },
    { tittle: "Estado" },
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

  const fetchDataBuscar = async (e) => {
    setIdFeria(e.target.value);
    try {
      const data = await fetch(`${urlBuscar}${e.target.value}`, header);
      const dat = await data.json();
      UnauthorizedRedirect(dat);
      dat.forEach((dt) => {
        setIdProvincia(dt.id_provincia);
        setIdDistrito(dt.id_distrito);
        setIdCorregimiento(dt.id_corregimiento);
      });
    } catch (error) {
      msgError(error);
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
    fetchdata(urlFeria, header, setFerias);
    fetchdata(urlProducto, header, setProductos);
    fetchdata(urlPais, header, setPais);
  }, [url, urlFeria, urlProducto, urlPais]);

  return (
    <MainLayout Tittle="Inventarios">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid item xs={12} md={12} lg={12}>
            <div className="header-buttons">
              <Button
                variant="contained"
                color="primary"
                className="button-input"
              >
                <Link to="/inventario-ajuste">Inventario Ajuste</Link>
              </Button>
              {/* <Button variant="contained" color="primary" className="button-input">
            <Link to="/tipo-ajustes">Tipo Ajuste</Link>
          </Button> */}
            </div>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <SearchBox onChangeInput={handleOnChangeSearchField}>
              {searchResults.length > 0 && (
                <ul className="list">
                  {searchResults.map((value) => {
                    return (
                      <Link
                        className="list-item"
                        key={value.id_inventario}
                        to={`/inventario/${value.id_inventario}`}
                      >{`${value.nombre_productos} - ${value.nombre_feria} - ${value.nombre_provincia}- ${value.nombre_distrito}- ${value.nombre_corregimiento}`}</Link>
                    );
                  })}
                </ul>
              )}
            </SearchBox>
            <Paper>
              <form onSubmit={onClickGuardar} className="inputs-container">
                <Grid item xs={12} md={6} lg={6}>
                  <div className="select-form">
                    <InputLabel id="pais-select-label">Pais</InputLabel>
                    <Select
                      labelId="pais-select-label"
                      id="pais-simple-select"
                      className="inputs"
                      onChange={(e) => onChangeSetter(e, setIdPais)}
                      autoWidth
                      defaultValue={id_pais}
                    >
                      {pais.map((pa) => {
                        return (
                          <MenuItem key={pa.id_pais} value={pa.id_pais}>
                            {pa.nombre_pais}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="select-form">
                    <InputLabel id="feria-select-label">Ferias</InputLabel>
                    <Select
                      labelId="feria-select-label"
                      id="feria-simple-select"
                      className="inputs"
                      onChange={fetchDataBuscar}
                      autoWidth
                      defaultValue={id_feria}
                    >
                      {ferias.map((pa) => {
                        return (
                          <MenuItem key={pa.id_feria} value={pa.id_feria}>
                            {pa.nombre_feria}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="select-form">
                    <InputLabel id="producto-select-label">
                      Productos
                    </InputLabel>
                    <Select
                      labelId="producto-select-label"
                      id="producto-simple-select"
                      className="inputs"
                      onChange={(e) => onChangeSetter(e, setIdProducto)}
                      autoWidth
                      defaultValue={id_producto}
                    >
                      {productos.map((pa) => {
                        return (
                          <MenuItem
                            key={pa.id_productos}
                            value={pa.id_productos}
                          >
                            {pa.nombre_productos}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <TextField
                    label="Observación"
                    variant="outlined"
                    defaultValue={observacion}
                    className="inputs"
                    type="text"
                    rows={3}
                    multiline
                    onChange={(e) => onChangeSetter(e, setObservacion)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    label="Total inicial disponible"
                    variant="outlined"
                    value={total_inicial_disponible}
                    className="inputs"
                    type="number"
                    onChange={(e) => {
                      if (parseInt(e.target.value) >= 0) {
                        onChangeSetter(e, setTotalInicialDisponible);
                        onChangeSetter(e, setDisponibleReal);
                      }
                    }}
                  />

                  <TextField
                    label="Frecuencia de compra"
                    variant="outlined"
                    value={frecuencia_compra_dias}
                    className="inputs"
                    type="number"
                    onChange={(e) => {
                      if (parseInt(e.target.value) >= 0) {
                        onChangeSetter(e, setFrecuenciaCompraDias);
                      }
                    }}
                  />
                  <div className="select-form">
                    <InputLabel id="inicio-label">Fecha de inicio</InputLabel>
                    <TextField
                      labelId="inicio-label"
                      variant="outlined"
                      defaultValue={fecha_inicio}
                      className="inputs"
                      type="date"
                      onChange={(e) => onChangeSetter(e, setFechaInicio)}
                    />
                  </div>
                  <div className="select-form">
                    <InputLabel id="fin-label">Fecha fin</InputLabel>
                    <TextField
                      labelId="fin-label"
                      variant="outlined"
                      defaultValue={fecha_fin}
                      className="inputs"
                      type="date"
                      onChange={(e) => onChangeSetter(e, setFechaFin)}
                    />
                  </div>
                  <FormControlLabel
                    label={estado ? "Activo" : "Inactivo"}
                    className="inputs"
                    control={
                      <Switch
                        checked={estado}
                        color="primary"
                        className="inputs"
                        inputProps={{ "aria-label": "primary checkbox" }}
                        onChange={() => setEstado(!estado)}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Button
                    className="inputs"
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Crear Nuevo Inventario
                  </Button>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {results && (
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
                      <TableRow key={row.id_inventario}>
                        <TableCell component="th" scope="row">
                          <Link to={`/inventario/${row.id_inventario}`}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          {row.id_inventario}
                        </TableCell>
                        <TableCell align="center">
                          {row.nombre_productos}
                        </TableCell>
                        <TableCell align="center">
                          {`${row.frecuencia_compra_dias} Días`}
                        </TableCell>
                        <TableCell align="center">
                          {`${row.total_inicial_disponible}`}
                        </TableCell>
                        <TableCell align="center">
                          {`${row.disponible_real}`}
                        </TableCell>
                        <TableCell align="center">
                          {`${moment(row.fecha_inicio).format("D, MMMM YYYY")}`}
                        </TableCell>
                        <TableCell align="center">{`${moment(
                          row.fecha_fin
                        ).format("D, MMMM YYYY")}`}</TableCell>
                        <TableCell align="center">{`${row.observacion}`}</TableCell>
                        <TableCell align="center">{`${row.nombre_feria}`}</TableCell>
                        <TableCell align="center">{`${row.id_pais}`}</TableCell>
                        <TableCell align="center">
                          {`${row.nombre_provincia}`}
                        </TableCell>
                        <TableCell align="center">
                          {`${row.nombre_distrito}`}
                        </TableCell>
                        <TableCell align="center">
                          {`${row.nombre_corregimiento}`}
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
                        <TableCell
                          align="center"
                          className={`${row.estado === 1 ? "green" : "red"}`}
                        >
                          <span
                            className={`${row.estado === 1 ? "green" : "red"}`}
                          >
                            {row.estado === 1 ? "Activo" : "Inactivo"}
                          </span>
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
            )}
          </Grid>
        </>
      )}
    </MainLayout>
  );
}

export default memo(Inventario);
