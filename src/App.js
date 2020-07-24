import React from "react";
import "fontsource-roboto";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/home/home.page";
import Login from "./pages/login/login.page";
import "moment/locale/es.js";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {localStorage.token_key === undefined && <Redirect to="/login" />}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
