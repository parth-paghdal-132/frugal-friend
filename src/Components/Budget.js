import React, { useState, useEffect } from "react";
import { Button } from "@mui/material"
import axiosInstance from "../config/axiosConfig"
import ChartComponent from "./Char";
import { Navigate } from "react-router-dom";

function Budget() {
  // state for dropdown menus and picking which month expense chart to render / email
  const [showMonth, setShowMonth] = useState(new Date().toLocaleString('default', {month: 'long'}));
  const [selectedChart, setSelectedChart] = useState('BarChart');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // state for images of the chart for emailing user (yearly)
  const [monthExpensesIMG, setMonthExpensesIMG] = useState(null);

  // state for telling ChartComponent to generate image
  const [getImageClicked, setGetImageClicked] = useState(false);

  function handleMonthExpensesIMG(data) {
    setMonthExpensesIMG(data);
    setGetImageClicked(false);
  }

  const [charData, setCharData] = useState([]);
  const [emailData, setEmailData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);

  const monthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

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
          "Personal care": 0,
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
      console.log('fetching summary data');
      try {
        const response = await axiosInstance.get("/api/session");
        const summaryData = await axiosInstance.post("/api/summary-data", {
          userId: response.data._id
        });
        setSummaryData(summaryData.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e)
      }
      
    }

    fetchSummary()
  }, [])

  const parseSummaryData = (data, type) => {
    if (type === "Monthly Expense") {
      return data.map((perMonth) => {
        if (isNaN(perMonth)) {
          return {
          month: monthOptions[perMonth.info.month - 1],
          amount: perMonth.totalExpense 
        }
        } else {
          return  {
          month: monthOptions[perMonth - 1],
          amount: 0
          }
        }
        
      })
    }
    if (type === "Monthly Income") {
      return data.map((perMonth) => {
        if (isNaN(perMonth)) {
          return {
          month: monthOptions[perMonth.info.month - 1],
          amount: perMonth.income[perMonth.income.length - 1].amount}
        } else {
          return  {
          month: monthOptions[perMonth - 1],
          amount: 0
          }
        }
        
      })
    }
    if (type === "Monthly Saving") {
      return data.map((perMonth) => {
        if (isNaN(perMonth)) {
          return {
          month: monthOptions[perMonth.info.month - 1],
          amount: perMonth.leftToSpend + perMonth.savingGoal}
        } else {
          return  {
          month: monthOptions[perMonth - 1],
          amount: 0
          }
        }
        
      })
    }
  }

  React.useEffect(() => {
    let timer;
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2500);
    }
    return () => {
      clearTimeout(timer);
    }
  }, [isSuccess]);

  React.useEffect(() => {
    let timer;
    if (isSent) {
      timer = setTimeout(() => {
        setIsSent(false);
      }, 2500);
    }
    return () => {
      clearTimeout(timer);
    }
  }, [isSent]);

  useEffect(() => {
    async function createEmail() {
      try {
        let emailBody = {
          chartUrl: monthExpensesIMG,
          expense: emailData,
          month: showMonth
        }
        setMonthExpensesIMG(undefined);
        setIsSent(true);
        const {data} = await axiosInstance.post('/budget/email/monthly', emailBody);
        if (data.created && data.created === true) {
          setIsSuccess(true);
        }
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
          <div>
            {isSuccess &&
              <h3 style={{color: 'green', textAlign: 'center'}}>Successfully sent email</h3>
            }
            {(isSent && !isSuccess) && 
              <h3 style={{textAlign: 'center'}}>Sending email...</h3>
            }
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            {!isLoading &&
              <Button variant="contained" onClick={handleMonthEmail}>
                Receive Email about selected month's expenses
              </Button>
            }
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


      <h2 style={{textAlign: 'center'}}>Yearly Summaries</h2>
      {isLoading ? (
        <div> Loading... </div>
      ) : (
        <div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <ChartComponent chartType="BarChart" chartData={parseSummaryData(summaryData, "Monthly Saving")} title="Monthly Saving" />
            <ChartComponent chartType="BarChart" chartData={parseSummaryData(summaryData, "Monthly Income")} title="Monthly Income" />
          </div>
          <div>
            <ChartComponent chartType="line" chartData={parseSummaryData(summaryData, "Monthly Expense")} title="Monthly Expenses" />
          </div>
          <div style={{marginBottom: 100}}/>
      </div>
      )}
    </div>
  )
}

export default Budget;