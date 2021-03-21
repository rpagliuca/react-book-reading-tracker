import * as metrics from './../model/metrics.js';
import * as charts from 'react-chartjs-2';
import { connectWithData } from './../model/actions.js';

function Metrics({data}) {
  if (!data) {
    return null;
  }

  const options = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          round: 'day',
          minUnit: 'day',
        },
      }],
    },
    aspectRatio: 6,
  };

  const now = new Date();

  const accumulatedPagesData = {
    datasets: [
      {
        label: 'Total acumulado de páginas lidas',
        data: metrics.accumulatedPerDate(data, metrics.formatDate(now)),
        backgroundColor: 'rgba(67, 85, 163, 0.2)',
        borderColor: 'rgba(67, 85, 163, 0.5)',
      },
    ],
  }

  const newPagesData = {
    datasets: [
      {
        label: 'Quantidade diária de páginas lidas',
        data: metrics.newPagesPerDate(data, metrics.formatDate(now)),
        backgroundColor: 'rgba(102, 151, 91, 0.2)',
        borderColor: 'rgba(102, 151, 91, 0.5)',
      },
    ],
  }

  return (
    <>
      <charts.Line data={accumulatedPagesData} options={options} height={null} width={null}/>
      <charts.Line data={newPagesData} options={options} height={null} width={null}/>
    </>
  );
}

export const ConnectedMetrics = connectWithData(Metrics);
