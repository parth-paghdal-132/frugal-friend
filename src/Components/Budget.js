import React, { useState, useEffect, useRef } from "react";
import { Cell, Legend, Tooltip, BarChart, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Bar, PieChart, Pie } from 'recharts';
import {Button} from "@mui/material"
import axiosInstance from "../config/axiosConfig"
import ChartComponent from "./Char";
import { ShowChart } from "@mui/icons-material";

function Budget() {
  // state for dropdown menus and picking which month expense chart to render / email
  const [showMonth, setShowMonth] = useState(new Date().toLocaleString('default', {month: 'long'}));
  const [selectedChart, setSelectedChart] = useState('BarChart');

  // state for images of the chart for emailing user (yearly)
  const [monthExpensesIMG, setMonthExpensesIMG] = useState(null);

  //maybe do use effect on once monthExpensesImg is set? -> then do axios call

  const [monthlySavingIMG, setMonthlySavingIMG] = useState(null);
  const [monthlyIncomeIMG, setMonthlyIncomeIMG] = useState(null);

  // state for telling ChartComponent to generate image
  const [getImageClicked, setGetImageClicked] = useState(false);

  function handleMonthlySavingIMG(data) {
    setMonthlySavingIMG(data);
    setGetImageClicked(false);
  }

  function handleMonthlyIncomeIMG(data) {
    setMonthlyIncomeIMG(data);
    setGetImageClicked(false);
  }

  function handleMonthExpensesIMG(data) {
    setMonthExpensesIMG(data);
    setGetImageClicked(false);
  }

  const monthlyExpenses = [
    { month: 'January', amount: 100 },
    { month: 'February', amount: 200 },
    { month: 'March', amount: 150 },
    { month: 'April', amount: 300 },
  ];

  // this needs to be populated otherwise
  const [monthlyExpense, setMonthlyExpense] = useState(monthlyExpenses);
  const [monthlyIncome, setMonthlyIncome] = useState(monthlyExpenses);
  const [charData, setCharData] = useState([]);
  const [monthlySaving, setMonthlySaving] = useState(monthlyExpenses);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const {data} = await axiosInstance.get(`/api/budget-data?month=${showMonth}`);
        setCharData(data.expense);
      } catch (e) {
        // potentially there is no budget data for this month
        setCharData([]);
        console.log(e);
      }
    }

    fetchExpenses();
  }, [showMonth])

  useEffect(() => {
    async function createEmail() {
      try {
        let emailBody = {
          chartUrl: monthExpensesIMG,
          expense: charData,
          month: showMonth
        }
        setMonthExpensesIMG(undefined);
        const data = await axiosInstance.post('/budget/email/monthly', emailBody);
      } catch (e) {
        console.log(e);
      }
    }
    if (monthExpensesIMG) {
      createEmail();
    }
  }, [monthExpensesIMG, charData, showMonth])

  async function handleMonthEmail() {
    setGetImageClicked(true);
  }

  const handleShowMonthChange = (event) => {
    setShowMonth(event.target.value);
  };

  const handleChartsChange = (event) => {
    setSelectedChart(event.target.value);
  }

  return (
    <div>
      <div>
        <h1 style={{textAlign: 'center'}}>Your Monthly Expenses</h1>
      </div>

      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className="form-input" style={{marginRight: 20}}>
          <label htmlFor="month-selection" style={{marginRight: 0}}>Select Month:</label>
          <div className="select-container">
            <select
            id="month-selection"
            value={showMonth}
            onChange={handleShowMonthChange}
          >
            <option value="">Select a Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          </div> 
        </div>

        <div className="form-input">
          <label htmlFor="charts-selection" style={{marginRight: 0}}>Select Charts Type:</label>
          <div className="select-container">
            <select
            id="charts-selection"
            value={selectedChart}
            onChange={handleChartsChange}
          >
            <option value="BarChart">Histogram</option>
            <option value="pie">Pie</option>
          </select>
          </div>
        </div>
      </div>

      {charData.length !== 0 ? (
        <div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button variant="contained" onClick={handleMonthEmail}>
              Receive Email about selected month's expenses
            </Button>
          </div>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <ChartComponent 
              onChildData={handleMonthExpensesIMG}
              getImage={getImageClicked}
              chartType={selectedChart} 
              chartData={charData} 
              title={showMonth} 
              chartStyling={selectedChart === "pie" ? {width: '100%'} : {}}
            />
          </div>
        </div>
        ) : (
          <h2 style={{marginBottom: 256, marginTop: 256, textAlign: 'center'}}>You have no expenses for {showMonth}</h2>
        )}


      <h1 style={{textAlign: 'center'}}>Yearly Summaries</h1>
      <div style={{display: 'flex'}}>
        <ChartComponent onChildData={handleMonthlySavingIMG} getImage={getImageClicked} chartType="BarChart" chartData={monthlySaving} title="Monthly Saving" />
        <ChartComponent onChildData={handleMonthlyIncomeIMG} getImage={getImageClicked} chartType="BarChart" chartData={monthlyIncome} title="Monthly Income" />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h3 className="chart-title">Monthly Expenses</h3>
        <ResponsiveContainer width="75%" height={400}>
          <LineChart data={monthlyExpense}>
            <XAxis dataKey="month"/>
            <YAxis />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" >
            </Line>
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{marginBottom: 100}}/>
    </div>
  )
}

export default Budget;