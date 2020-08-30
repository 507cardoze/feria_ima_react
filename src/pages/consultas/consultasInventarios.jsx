import React, { useState, useEffect, memo } from "react";
import MainLayout from "../../components/MainLayOut/mainLayout.component";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";
import Totales from "../../components/cuadroTotales/cuadroTotales.component";
import InputLabel from "@material-ui/core/InputLabel";
import "./consultas.styles.scss";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import "moment/locale/es.js";

function ConsultasInventarios() {
  toast.configure({
    autoClose: 6000,
    draggable: true,
  });
  const msgError = (msj) => toast.error(msj);

  const UnauthorizedRedirect = (data) => {
    if (data === "No esta autorizado") {
      localStorage.clear();
      window.location.replace("/login");
    }
  };

  const [isLoading, setisLoading] = useState(true);
  const [feria, setFeria] = useState([]);
  const [productos, setProductos] = useState([]);
  const [id_feria, setIdFeria] = useState("");
  const [id_producto, setIdProducto] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [disponibleReal, setDisponibleReal] = useState(0);

  const urlFeria = `${process.env.REACT_APP_BACK_END}/api/feria/filtrada/`;
  const urlProductosByFeria = `${process.env.REACT_APP_BACK_END}/api/productos/buscarByFeria/`;
  const urlConsultaDisponibleReal = `${process.env.REACT_APP_BACK_END}/api/consultas/disponible-real/`;

  const header = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token_key}`,
    },
    mode: "cors",
    cache: "default",
  };

  const onChangeFeriaBuscarProducto = (e) => {
    setIdFeria(e.target.value);
    setIdProducto("");
    setDisponibleReal(0);
    fetch(`${urlProductosByFeria}${e.target.value}`, header)
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        setProductos(data);
      });
  };

  const onChangeProducto = (e) => {
    setIdProducto(e.target.value);
    fetch(
      `${urlConsultaDisponibleReal}${id_feria}/${e.target.value}?desde=${desde}&hasta=${hasta}`,
      header
    )
      .then((response) => response.json())
      .then((data) => {
        UnauthorizedRedirect(data);
        setDisponibleReal(data);
      });
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
        if (filtered.length === 0) {
          msgError("No hay registros.");
        }
        setter(filtered);
        setisLoading(true);
      } catch (error) {
        msgError(error);
      }
    };
    fetchdata(urlFeria, header, setFeria);
    setDesde(moment().format().toString().slice(0, 10));
    setHasta(moment().format().toString().slice(0, 10));
    // setDesde("2020-08-28");
    // setHasta("2020-08-28");
  }, [urlFeria]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (id_feria && id_producto) {
        fetch(
          `${urlConsultaDisponibleReal}${id_feria}/${id_producto}?desde=${desde}&hasta=${hasta}`,
          header
        )
          .then((response) => response.json())
          .then((data) => {
            UnauthorizedRedirect(data);
            setDisponibleReal(data);
          });
      }
    }, 5000);

    return () => clearInterval(interval);
  });

  return (
    <MainLayout Tittle="Por Inventarios">
      {!isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper item xs={12} className="grid-principal-inputs">
            <div className="consultas-por-feria-select">
              <div className="select-form">
                <Typography
                  component="h2"
                  variant="h6"
                  color="primary"
                  gutterBottom
                >
                  Inventario actual
                </Typography>
                <div className="select-form">
                  <InputLabel id="feria-select-label">Ferias</InputLabel>
                  <Select
                    labelId="feria-select-label"
                    id="feria-simple-select"
                    className="inputs"
                    onChange={(e) => onChangeFeriaBuscarProducto(e)}
                    autoWidth
                    value={id_feria}
                  >
                    {feria.map((pa) => {
                      return (
                        <MenuItem key={pa.id_feria} value={pa.id_feria}>
                          {pa.nombre_feria}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <div className="select-form">
                  <InputLabel id="productos-select-label">Productos</InputLabel>
                  <Select
                    labelId="productos-select-label"
                    id="productos-simple-select"
                    className="inputs"
                    onChange={(e) => onChangeProducto(e)}
                    autoWidth
                    value={id_producto}
                    disabled={productos.length === 0 ? true : false}
                  >
                    {productos.map((pa) => {
                      return (
                        <MenuItem key={pa.id_producto} value={pa.id_producto}>
                          {pa.producto}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
              </div>
            </div>
          </Paper>
          <div className="grafica-consulta" container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              {disponibleReal.length > 0 && (
                <Grid item xs={12} md={12} lg={12}>
                  <Paper className="grafica-space">
                    <Totales
                      title={"Disponible Actualmente"}
                      amount={disponibleReal[0].disponible_real}
                      body={`Hoy`}
                    />
                  </Paper>
                </Grid>
              )}
              {disponibleReal.length === 0 && id_feria && id_producto && (
                <Grid item xs={12} md={12} lg={12}>
                  <Paper className="grafica-space">
                    <Totales
                      title={"Disponible Actualmente"}
                      amount={disponibleReal.length}
                      body={`Hoy`}
                    />
                  </Paper>
                </Grid>
              )}
            </Grid>
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default memo(ConsultasInventarios);
