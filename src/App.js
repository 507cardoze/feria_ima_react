import React, { memo } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard.page";
import Clientes from "./pages/clientes/clientes.page";
import ClientesModify from "./pages/clientes/clientes-modify/clientes-modify.page";
import Productos from "./pages/productos/productos.page";
import ProductosModify from "./pages/productos/productos-modify/productos-modify.page";
import ConsultasConsumo from "./pages/consultas/consultas.page";
import ConsultasClientes from "./pages/consultas/consultasClientes";
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
import Inventario from "./pages/inventario/inventario.page";
import InventarioModify from "./pages/inventario/inventario-modify/inventario-modify.page";
import InventarioAjuste from "./pages/inventario-ajuste/inventario-ajuste.page";
import InventarioAjusteModify from "./pages/inventario-ajuste/inventario-ajuste-modify/inventario-ajuste-modify.page";
import NotFoundView from "./pages/notFound/notFound.page";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {localStorage.token_key === undefined && <Redirect to="/login" />}
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/inventario" component={Inventario} />
          <Route path="/inventario/:id" component={InventarioModify} />
          <Route exact path="/inventario-ajuste" component={InventarioAjuste} />
          <Route
            path="/inventario-ajuste/:id"
            component={InventarioAjusteModify}
          />
          <Route exact path="/clientes" component={Clientes} />
          <Route path="/clientes/:id" component={ClientesModify} />
          <Route exact path="/productos" component={Productos} />
          <Route path="/productos/:id" component={ProductosModify} />
          <Route exact path="/consultas-consumo" component={ConsultasConsumo} />
          <Route
            exact
            path="/consultas-clientes"
            component={ConsultasClientes}
          />
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
          <Route path="*" component={NotFoundView} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default memo(App);
