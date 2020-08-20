import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

function GraficaConsumo({ ferias, etiqueta }) {
  const [charData, setChartData] = useState({});

  useEffect(() => {
    const chart = () => {
      const label = ferias.map((feria) => feria.feria);
      const data = ferias.map((feria) => feria.consumo);
      const colores = "#626eb5";
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
  }, [ferias, etiqueta]);

  return (
    <Bar
      data={charData}
      options={{
        responsive: true,
      }}
    />
  );
}

export default GraficaConsumo;
