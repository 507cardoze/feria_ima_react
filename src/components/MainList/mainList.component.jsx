import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import PublicIcon from "@material-ui/icons/Public";
import TerrainIcon from "@material-ui/icons/Terrain";
import HouseIcon from "@material-ui/icons/House";
import ListAltIcon from "@material-ui/icons/ListAlt";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import "./mainList.styles.scss";

function MainList() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const [openConsultas, setOpenConsultas] = useState(true);

  const handleClickConsultas = () => {
    setOpenConsultas(!openConsultas);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    links: {
      textDecoration: "none",
      cursor: "pointer",
      color: "black",
    },
  }));

  const classes = useStyles();
  return (
    <div>
      <Link to="/" className={classes.links}>
        <ListItem button className="list-fix-padding">
          <ListItemIcon>
            <DashboardIcon />
            <Link to="/"></Link>
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </Link>
      {/* <Link to="/transacciones" className={classes.links}>
        <ListItem button className="list-fix-padding">
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Transacciones" />
        </ListItem>
      </Link> */}
      <ListItem
        button
        onClick={handleClickConsultas}
        className="list-fix-padding"
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Consultas" />
        {openConsultas ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openConsultas} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/consultas-consumo" className={classes.links}>
            <ListItem button className={`${classes.nested} list-fix-padding`}>
              <ListItemIcon>
                <ShoppingBasketIcon />
              </ListItemIcon>
              <ListItemText primary="Por consumos" />
            </ListItem>
          </Link>
          <Link to="/consultas-clientes" className={classes.links}>
            <ListItem button className={`${classes.nested} list-fix-padding`}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Por clientes" />
            </ListItem>
          </Link>
        </List>
      </Collapse>
      <Link to="/inventario" className={classes.links}>
        <ListItem button className="list-fix-padding">
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Inventarios" />
        </ListItem>
      </Link>
      <Link to="/clientes" className={classes.links}>
        <ListItem button className="list-fix-padding">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
        </ListItem>
      </Link>
      <Link to="/productos" className={classes.links}>
        <ListItem button className="list-fix-padding">
          <ListItemIcon>
            <AddShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Productos" />
        </ListItem>
      </Link>
      <Link to="/feria" className={classes.links}>
        <ListItem button className="list-fix-padding">
          <ListItemIcon>
            <BeachAccessIcon />
          </ListItemIcon>
          <ListItemText primary="Ferias" />
        </ListItem>
      </Link>
      <ListItem button onClick={handleClick} className="list-fix-padding">
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Configuración" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link to="/pais" className={classes.links}>
            <ListItem button className={`${classes.nested} list-fix-padding`}>
              <ListItemIcon>
                <PublicIcon />
              </ListItemIcon>
              <ListItemText primary="Pais" />
            </ListItem>
          </Link>
          <Link to="/provincias" className={classes.links}>
            <ListItem button className={`${classes.nested} list-fix-padding`}>
              <ListItemIcon>
                <TerrainIcon />
              </ListItemIcon>
              <ListItemText primary="Provincias" />
            </ListItem>
          </Link>
          <Link to="/distritos" className={classes.links}>
            <ListItem button className={`${classes.nested} list-fix-padding`}>
              <ListItemIcon>
                <HomeWorkIcon />
              </ListItemIcon>
              <ListItemText primary="Distritos" />
            </ListItem>
          </Link>
          <Link to="/corregimientos" className={classes.links}>
            <ListItem button className={`${classes.nested} list-fix-padding`}>
              <ListItemIcon>
                <HouseIcon />
              </ListItemIcon>
              <ListItemText primary="Corregimientos" />
            </ListItem>
          </Link>
        </List>
      </Collapse>
    </div>
  );
}

export default MainList;
