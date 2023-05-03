import React, { useState, useEffect } from "react";
import { Button } from "@mui/material"
import axiosInstance from "../config/axiosConfig"
import ChartComponent from "./Char";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Budget() {
  // state for dropdown menus and picking which month expense chart to render / email
  const [showMonth, setShowMonth] = useState(new Date().toLocaleString('default', {month: 'long'}));
  const [selectedChart, setSelectedChart] = useState('BarChart');

  // state for images of the chart for emailing user (yearly)
  const [monthExpensesIMG, setMonthExpensesIMG] = useState(null);


  // state for telling ChartComponent to generate image
  const [getImageClicked, setGetImageClicked] = useState(false);

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
  const [emailData, setEmailData] = useState([]);
  const [monthlySaving, setMonthlySaving] = useState(monthlyExpenses);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        let {data} = await axiosInstance.post(`/api/budget-data?month=${showMonth}`);
        setEmailData(data.expense);
        // group same category amounts together
        const startingMonthExpenses = {
          "Food and groceries": 0,
          "Housing and utilities": 0,
          "Transportation": 0,
          "Personal Care": 0,
          "Entertainment": 0
        }

        data.expense.forEach((item) => {
          startingMonthExpenses[item.category] += item.amount
        })

        let monthChartData = Object.keys(startingMonthExpenses).reduce((acc, item) => {
          acc.push({ category: item, amount: startingMonthExpenses[item] })
          return acc
        }, []);

        setCharData(monthChartData);
      } catch (e) {
        // potentially there is no budget data for this month
        setCharData([]);
        setEmailData([]);
        console.log(e);
      }
    }

    fetchExpenses();
  }, [showMonth])

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await axiosInstance.get("/api/session");
        const summaryData = await axiosInstance.post("/api/summary-data", {
          userId: response.data._id
        });
        setSummaryData(summaryData.data);
      } catch (e) {
        console.log(e)
      }
      
    }

    fetchSummary()
  }, [])

  useEffect(() => {
    async function createEmail() {
      try {
        let emailBody = {
          chartUrl: monthExpensesIMG,
          expense: emailData,
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
  }, [monthExpensesIMG, emailData, showMonth])

  async function handleMonthEmail() {
    setGetImageClicked(true);
  }

  const handleShowMonthChange = (event) => {
    setShowMonth(event.target.value);
  };

  const handleChartsChange = (event) => {
    setSelectedChart(event.target.value);
  }

  let token = localStorage.getItem("token")
  if (!token) {
    return <Navigate to="/auth/login" state={{otherError: "Please login to view your budget."}} />;
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
            <option value="Pie">Pie</option>
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
              chartStyling={selectedChart === "Pie" ? {width: '100%'} : {}}
            />
          </div>
        </div>
        ) : (
          <h2 style={{marginBottom: 256, marginTop: 256, textAlign: 'center'}}>You have no expenses for {showMonth}</h2>
        )}


      <h1 style={{textAlign: 'center'}}>Yearly Summaries</h1>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <ChartComponent chartType="BarChart" chartData={monthlySaving} title="Monthly Saving" />
        <ChartComponent chartType="BarChart" chartData={monthlyIncome} title="Monthly Income" />
      </div>
      <div>
        <ChartComponent chartType="line" chartData={monthlyExpense} title="Monthly Expenses" />
      </div>
      <div style={{marginBottom: 100}}/>
    </div>
  )
}

export default Budget;