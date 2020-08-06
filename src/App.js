import React from "react";
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
import Corregimientos from "./pages/corregimientos/corregimientos.page";
import Distritos from "./pages/distritos/distritos.page";
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
          <Route exact path="/corregimientos" component={Corregimientos} />
          <Route exact path="/distritos" component={Distritos} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
