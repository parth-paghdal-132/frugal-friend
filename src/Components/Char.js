import { LineChart, Line, PieChart, Pie, Legend, Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';

function ChartComponent({chartType, chartData, title}) {
  let chartJsx;

  if (chartType === 'line') {
    chartJsx = (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  } else if (chartType === 'pie') {
    chartJsx = (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={chartData} dataKey="amount" nameKey="category" fill="#8884d8" />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  } else if (chartType === 'BarChart'){
    console.log(chartData);

    chartJsx = (
        
        <BarChart width={850} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
        
    ) 
  } else {
        chartJsx = null;
    }

  return (
    <div>
      <h2 className="chart-title">{title}</h2>
      {chartJsx}
    </div>
  );
}

export default ChartComponent