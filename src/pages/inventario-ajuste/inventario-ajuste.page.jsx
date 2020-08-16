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

function InventarioAjuste() {
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

  const [id_inventario, setIdInvenario] = useState("");
  const [id_feria, setIdFeria] = useState("");
  const [id_tipo_ajuste, setIdTipoAjuste] = useState("");
  const [cantidad_ajuste, setCantidadAjuste] = useState(0);
  const [observacion, setObservacion] = useState("");

  const [rows, setRows] = useState({});
  const [ferias, setFerias] = useState([]);
  const [inventarios, setInventarios] = useState([]);
  const [tipo_ajuste, setTipoAjuste] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const { results } = rows;
  const { total } = rows;

  const url = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/filtrada?page=${page}&limit=${limit}`;
  const urlCrear = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/crear`;
  const urlBusqueda = `${process.env.REACT_APP_BACK_END}/api/inventarios-ajuste/searchField/`;

  const urlFeria = `${process.env.REACT_APP_BACK_END}/api/feria/filtrada`;
  const urlInventario = `${process.env.REACT_APP_BACK_END}/api/inventarios/filtrada`;
  const urlTipoAjuste = `${process.env.REACT_APP_BACK_END}/api/tipo-ajustes/filtrada`;

  const bodyRequest = {
    id_inventario: parseInt(id_inventario),
    id_feria: parseInt(id_feria),
    id_tipo_ajuste: parseInt(id_tipo_ajuste),
    cantidad_ajuste: parseInt(cantidad_ajuste),
    observacion: observacion,
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
    { tittle: "# inventario" },
    { tittle: "Feria" },
    { tittle: "Tipo de ajuste" },
    { tittle: "Cantidad de ajuste" },
    { tittle: "Observacion" },
    { tittle: "Usuario Creacion" },
    { tittle: "Fecha Creacion" },
    { tittle: "Tiempo relativo" },
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
        msgError(error);
      }
    };
    fetchdata(url, header, setRows);
    fetchdata(urlFeria, header, setFerias);
    fetchdata(urlInventario, header, setInventarios);
    fetchdata(urlTipoAjuste, header, setTipoAjuste);
  }, [url]);

  return (
    <MainLayout Tittle="Inventario Ajuste">
      <Grid item xs={12} md={12} lg={12}>
        <div className="header-buttons">
          <Button variant="contained" color="primary" className="button-input">
            <Link to="/inventario">Atras</Link>
          </Button>
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
                    key={value.id}
                    to={`/inventario-ajuste/${value.id}`}
                  >{`#${value.id} - # inventario ${value.id_inventario} - ${value.observacion} - ${value.nombre_feria}`}</Link>
                );
              })}
            </ul>
          )}
        </SearchBox>
        <Paper>
          <form onSubmit={onClickGuardar} className="inputs-container">
            {/* <Grid item xs={12} md={6} lg={6}>
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
                <InputLabel id="producto-select-label">Productos</InputLabel>
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
                      <MenuItem key={pa.id_productos} value={pa.id_productos}>
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
                defaultValue={total_inicial_disponible}
                className="inputs"
                type="number"
                onChange={(e) => onChangeSetter(e, setTotalInicialDisponible)}
              />
              <TextField
                label="Disponible real"
                variant="outlined"
                defaultValue={disponible_real}
                className="inputs"
                type="number"
                onChange={(e) => onChangeSetter(e, setDisponibleReal)}
              />
              <TextField
                label="Total máximo diario"
                variant="outlined"
                defaultValue={total_max_diario}
                className="inputs"
                type="number"
                onChange={(e) => onChangeSetter(e, setTotalMaxDiario)}
              />
              <TextField
                label="Frecuencia de compra"
                variant="outlined"
                defaultValue={frecuencia_compra_dias}
                className="inputs"
                type="number"
                onChange={(e) => onChangeSetter(e, setFrecuenciaCompraDias)}
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
            </Grid> */}
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
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        <Link to={`/inventario-ajuste/${row.id}`}>
                          <IconButton aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      </TableCell>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.id_inventario}</TableCell>
                      <TableCell align="center">
                        {`${row.nombre_feria}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.id_tipo_ajuste}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.cantidad_ajuste}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.observacion}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.usuario_ajuste}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${moment(row.fecha_ajuste).format("D, MMMM YYYY")}`}
                      </TableCell>
                      <TableCell align="center">
                        {`${moment(row.fecha_ajuste).fromNow()}`}
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

export default memo(InventarioAjuste);
