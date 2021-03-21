import * as metrics from './../model/metrics.js';
import * as charts from 'react-chartjs-2';
import { connectWithData } from './../model/actions.js';

function Metrics({data}) {
  if (!data) {
    return null;
  }
  const summary = metrics.calculateSummary(data);
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
  return <charts.Line data={summary} options={options} height={null} width={null}/>
}

export const ConnectedMetrics = connectWithData(Metrics);
