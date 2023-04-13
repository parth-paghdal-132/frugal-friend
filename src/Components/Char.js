import { LineChart, Line, PieChart, Pie, Legend, Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, Cell } from 'recharts';

function ChartComponent({chartType, chartData, title}) {
  let chartJsx;

  if (chartType === 'line') {
    chartJsx = (
      <div>
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <XAxis dataKey="month"/>
          <YAxis />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" >
          </Line>
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
      </div>
    );
  } else if (chartType === 'pie') {
    chartJsx = (
      <div>
      <h2 className="chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={chartData} dataKey="amount" nameKey="category">
          {
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'][index % 5]} />
              ))
            }
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>  
      </div>
      
    );
  } else if (chartType === 'BarChart'){
    console.log(chartData);
    if (title === 'Monthly Saving') {
        chartJsx = (
            <div>
            <h3 className="chart-title">{title}</h3>
            <BarChart width={850} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8">
            </Bar>
            </BarChart>
            </div>
        )
    } else {
        chartJsx = (
        <div>
        <h2 className="chart-title">{title}</h2>
        <BarChart width={850} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="transparent">
        {
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'][index % 5]} />
              ))
            }
        </Bar>
        </BarChart>
        </div>
        
    ) 
    }
    
  } else {
        chartJsx = null;
    }

  return (
    <div>
      {chartJsx}
    </div>
  );
}

export default ChartComponent