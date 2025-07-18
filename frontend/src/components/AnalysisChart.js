import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalysisChart = ({ sentiment }) => {
  // Extraemos las puntuaciones (negativo, neutral, positivo)
  const { neg, neu, pos } = sentiment;

  const data = {
    labels: ['Negativo', 'Neutral', 'Positivo'],
    datasets: [
      {
        label: 'Análisis de Sentimientos',
        data: [neg, neu, pos],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // Rojo para Negativo
          'rgba(201, 203, 207, 0.6)', // Gris para Neutral
          'rgba(75, 192, 192, 0.6)',  // Verde/Azul para Positivo
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
            color: '#e0e0e0' // Color del texto de la leyenda
        }
      },
      title: {
        display: true,
        text: 'Distribución de Sentimientos en la Letra',
        color: '#ffffff', // Color del texto del título
        font: {
            size: 16
        }
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default AnalysisChart;