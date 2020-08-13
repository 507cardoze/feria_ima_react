import React, { memo } from "react";
import "fontsource-roboto";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard.page";
import EntradasSalidas from "./pages/entradas&salidas/entrada&salidas.page";
import Clientes from "./pages/clientes/clientes.page";
import Productos from "./pages/productos/productos.page";
import Consultas from "./pages/consultas/consultas.page";
import Login from "./pages/login/login.page";
import Pais from "./pages/pais/pais.page";
import PaisModify from "./pages/pais/pais-modify/pais-modify.page";
import Provincias from "./pages/provincias/provincias.page";
import ProvinciaModify from "./pages/provincias/provincias-modify/provincia-modify.page";
import Corregimientos from "./pages/corregimientos/corregimientos.page";
import CorregimientoModify from "./pages/corregimientos/corregimiento-modify/corregimiento-modify.page";
import Distritos from "./pages/distritos/distritos.page";
import DistritoModify from "./pages/distritos/distrito-modify/distrito-modify.page";
import Feria from "./pages/feria/feria.page";
import FeriaModify from "./pages/feria/feria-modify/feria-modify.page";
import TipoAjustes from "./pages/tipo-ajustes/tipo-ajustes.page";
import TipoModify from "./pages/tipo-ajustes/tipo-ajuste-modify/tipo-ajuste-modify.page";
import "moment/locale/es.js";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {localStorage.token_key === undefined && <Redirect to="/login" />}
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/entradas-salidas" component={EntradasSalidas} />
          <Route exact path="/clientes" component={Clientes} />
          <Route exact path="/productos" component={Productos} />
          <Route exact path="/consultas" component={Consultas} />
          <Route exact path="/pais" component={Pais} />
          <Route path="/pais/:id" component={PaisModify} />
          <Route exact path="/provincias" component={Provincias} />
          <Route path="/provincias/:id" component={ProvinciaModify} />
          <Route exact path="/corregimientos" component={Corregimientos} />
          <Route path="/corregimientos/:id" component={CorregimientoModify} />
          <Route exact path="/distritos" component={Distritos} />
          <Route path="/distritos/:id" component={DistritoModify} />
          <Route exact path="/feria" component={Feria} />
          <Route path="/feria/:id" component={FeriaModify} />
          <Route exact path="/tipo-ajustes" component={TipoAjustes} />
          <Route exact path="/tipo-ajustes/:id" component={TipoModify} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default memo(App);
