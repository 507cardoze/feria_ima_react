import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import AssignmentIcon from "@material-ui/icons/Assignment";
import "./secondaryList.styles.scss";

function SecondaryList() {
  return (
    <div>
      <ListSubheader inset>Consultas Guardados</ListSubheader>
      <ListItem button className="list-fix-padding">
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Mes actual" />
      </ListItem>
      <ListItem button className="list-fix-padding">
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Último cuarto" />
      </ListItem>
      <ListItem button className="list-fix-padding">
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Venta de fin de año" />
      </ListItem>
    </div>
  );
}

export default SecondaryList;
