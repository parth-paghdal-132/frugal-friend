import { useEffect } from 'react'
import { LineChart, Line, PieChart, Pie, Legend, Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, Cell } from 'recharts';
import { useCurrentPng } from 'recharts-to-png';

function ChartComponent({chartType, chartData, title, onChildData, chartStyling, getImage}) {
  let chartJsx;

  const [getPng, { ref, isLoading }] = useCurrentPng();

  // use effect for creating reference of selected chart and sending image to parent component
  useEffect(() => {
    const createIMG = async () => {
      const png = await getPng();
      // console.log(png)
      onChildData(png);
    }

    if (ref && getImage) {
      console.log('generating image')
      createIMG();
    }

  }, [ref, onChildData, getPng, getImage]);

  if (chartType === 'line') {
    chartJsx = (
      <div>
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart ref={ref} data={chartData}>
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
      <div style={{width: "100%"}}>
        <h2 className="chart-title">{title}'s Expenses</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart ref={ref}>
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
    if (title === 'Monthly Saving' || title === 'Monthly Income') {
        chartJsx = (
            <div>
            <h3 className="chart-title">{title}</h3>
            <BarChart ref={ref} width={850} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill= {title === 'Monthly Saving' ? "#8884d8" : "#ff9900"}>
            </Bar>
            </BarChart>
            </div>
        )
    } else {
        chartJsx = (
        <div>
        <h2 className="chart-title">{title}'s Expenses</h2>
        <BarChart ref={ref} width={850} height={400} data={chartData}>
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
    <div style={chartStyling}>
      {chartJsx}
    </div>
  );
}

export default ChartComponent