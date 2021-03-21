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
    aspectRatio: 4,
  };

  const now = new Date();
  const accumulatedPagesData = {
    datasets: [
      {
        label: 'Total acumulado de páginas lidas',
        data: metrics.accumulatedPerDate(data, metrics.formatDate(now)),
      },
    ],
  }

  return <charts.Line data={accumulatedPagesData} options={options} height={null} width={null}/>
}

export const ConnectedMetrics = connectWithData(Metrics);
