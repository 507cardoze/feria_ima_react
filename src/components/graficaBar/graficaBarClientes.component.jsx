import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

function GraficaClientes({ clientes, etiqueta }) {
  const [charData, setChartData] = useState({});

  useEffect(() => {
    const chart = () => {
      const label = clientes.map((cliente) => cliente.nombre_feria);
      const data = clientes.map((cliente) => cliente.clientes);
      const colores = "#3f51b5";
      setChartData({
        labels: label,
        datasets: [
          {
            label: etiqueta,
            data: data,
            backgroundColor: colores,
          },
        ],
      });
    };
    chart();
  }, [clientes]);

  return (
    <Bar
      data={charData}
      options={{
        responsive: true,
      }}
    />
  );
}

export default GraficaClientes;
