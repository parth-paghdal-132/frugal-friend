import React, { useState, useEffect } from "react";
import ChartComponent from "./Char";
import { Alert, Button, Divider, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Typography, useTheme } from "@mui/material";


const Tracking = () => {
  const [estimatedIncome, setEstimatedIncome] = useState(0);
  const [estimatedExpense, setEstimatedExpense] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [incomeMonth, setIncomeMonth] = useState(null);
  const [showMonth, setShowMonth] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [selectedChart, setSelectedChart] = useState('BarChart');
  const [updatedIncome, setUpdatedIncome] = useState(0);
  const [savingGoal, setSavingGoal] = useState(0);
  
  

  
  // test data
  const data = [
    { category: "Food and groceries", amount: 500 },
    { category: "Housing and utilities", amount: 800 },
    { category: "Transportation", amount: 300 },
    { category: "Personal care", amount: 200 },
    { category: "Entertainment", amount: 400 }
  ];

  const monthlyExpenses = [
    { month: 'January', amount: 100 },
    { month: 'February', amount: 200 },
    { month: 'March', amount: 150 },
    { month: 'April', amount: 300 },
  ];
  
  const [monthlyExpense, setMonthlyExpense] = useState(monthlyExpenses);

  const [charData, setCharData] = useState(data);

  const [monthlySaving, setMonthlySaving] = useState(monthlyExpense);

  useEffect(() => {
    // const fetchData = async () => {
    //   const data = await ///// fetch from database

    //   console.log(data);
    //   setCharData(data);
    // };
    // fetchData();
  }, [showMonth]);




  const handleIncomeChange = (event) => {
    const input = event.target.value;
    
    // Check if the value is a valid number
    if (!Number.isFinite(Number(input))) {
        alert("Please enter a valid number for estimated income.");
        return;
    }

    // Check if input is a positive number
    if (Number(input) < 0) {
        // If input is negative, update state with empty string and return
        alert("Please enter a positive number for estimated income.");
        return;
    }
  
    setEstimatedIncome(event.target.value);
  };

  const handleExpenseChange = (event) => {
    const input = event.target.value;
    
    // Check if the value is a valid number
    if (!Number.isFinite(Number(input))) {
        alert("Please enter a valid number for estimated expense.");
        return;
    }

    // Check if input is a positive number
    if (Number(input) < 0) {
        // If input is negative, update state with empty string and return
        alert("Please enter a positive number for estimated expense.");
        return;
    }
    setEstimatedExpense(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleIncomeMonthChange = (event) => {
    setIncomeMonth(event.target.value);
  };

  const handleShowMonthChange = (event) => {
    setShowMonth(event.target.value);
  };

  const handleCategoryExpenseChange = (event) => {
    setExpenseAmount(event.target.value);
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  }

  const handleChartsChange = (event) => {
    setSelectedChart(event.target.value);
  }

  const handleUpdateIncome = (event) => {

    const input = event.target.value;
    // Check if the value is a valid number
    if (!Number.isFinite(Number(input))) {
        alert("Please enter a valid number for updated income.");
        return;
    }

    // Check if input is a positive number
    if (Number(input) < 0) {
        // If input is negative, update state with empty string and return
        alert("Please enter a positive number for updated income.");
        return;
    }
    setUpdatedIncome(event.target.value);
  }

  const handleSavingGoalChange = (event) => {
    const input = event.target.value;
    // Check if the value is a valid number
    if (!Number.isFinite(Number(input))) {
        alert("Please enter a valid number for saving goal.");
        return;
    }

    // Check if input is a positive number
    if (Number(input) < 0) {
        // If input is negative, update state with empty string and return
        alert("Please enter a positive number for saving goal.");
        return;
    }
    setSavingGoal(event.target.value);
  }

  const handleSetClick = () => {
    if (selectedMonth) {
      setEstimatedIncome(0);
      setEstimatedExpense(0);
    }
  };

  const handleUpdateClick = () => {
        if (isNaN(estimatedIncome) || estimatedIncome < 0) {
            alert("Please enter a valid updated income.");
            return;
        }
    
    } 


  const handleAddClick = () => {
    if (selectedCategory && expenseAmount) {
      const newChartData = charData.map((item) => {
        if (item.category === selectedCategory) {
          return {
            category: item.category,
            amount: item.amount + parseInt(expenseAmount),
          };
        } else {
          return item;
        }
      });
      setCharData(newChartData);
      setExpenseAmount(0);
      setSelectedCategory(null);
    }
  };

  const now = new Date();
  

  
  

  return (
    <div className="container">

      <div className="info-bar">
        <h2>{now.toLocaleString('default', { month: 'long' })} {now.getDate()} </h2>
        <h2>$2800 left to spend</h2>
      </div>
      <div className="input-part">

      <div className="set-goal">
      <h2>Set Your Goal</h2>
      <div className="form-container">
        <div className="form-input">
          <label htmlFor="estimated-income">Estimated Income:</label>
          <input
            type="number"
            id="estimated-income"
            value={estimatedIncome}
            onChange={handleIncomeChange}
          />
        </div>

        <div className="form-input">
          <label htmlFor="saving-goal">Saving Goal:</label>
          <input
            type="number"
            id="saving-goal"
            value={savingGoal}
            onChange={handleSavingGoalChange}
          />
        </div>

        {/* <div className="form-input">
          <label htmlFor="estimated-expense">Estimated Expense:</label>
          <input
            type="number"
            id="estimated-expense"
            value={estimatedExpense}
            onChange={handleExpenseChange}
          />
        </div> */}

        <div className="form-input">
          <label htmlFor="month-selection">Select Month:</label>
          <div className="select-container"><select
            id="month-selection"
            value={selectedMonth}
            onChange={handleMonthChange}>
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

        <button className="add-btn">Set</button>
       </div>
    
     <div className="add-expense">
        <h2>Add Expense</h2>
      </div>
      <div className="addExpenseForm">
        <div className="form-input">
          <label htmlFor="expense-amount">Expense amount:</label>
          <input
            type="number"
            id="expense-amount"
            value={expenseAmount}
            onChange={handleCategoryExpenseChange}
          />
        </div>
        <div className="form-input">
          <label htmlFor="expense-category">Expense category:</label>
          <select
            id="expense-category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select a Category</option>
            <option value="Food and groceries">Food and groceries</option>
            <option value="Housing and utilities">Housing and utilities</option>
            <option value="Transportation">Transportation</option>
            <option value="Personal care">Personal care</option>
          </select>

        </div>
        {/* <div className="form-input">
          <label htmlFor="month-selection">Select Month:</label>
          <div className="select-container">
            <select
            id="month-selection"
            value={addExpenseMonth}
            onChange={handleAddMonthChange}
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
          </div> */}
          
        
        <button className="add-btn">Add</button>
      </div>
      </div>

      <div className="update-income">
      <h2>Update Income</h2>
      <h3>If your actual income is lower or higher than your estimated income, you can update it here</h3>
      <div className="form-container">
        <div className="form-input">
          <label htmlFor="updated-income">Updated Income:</label>
          <input
            type="number"
            id="updated-income"
            value={updatedIncome}
            onChange={handleUpdateIncome}
          />
        </div>

        <div className="form-input">
          <label htmlFor="month-selection">Select Month:</label>
          <div className="select-container"><select
            id="month-selection"
            // value={selectedMonth}
            onChange={handleIncomeMonthChange}>
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
          <button onClick={handleUpdateClick}>Update Income</button>
          
        </div>
        </div>


      <div className="chart-container">
        <h2>Visualization of your Expense</h2>
        <div className="form-input">
          <label htmlFor="month-selection">Select Month:</label>
          <div className="select-container">
            <select
            id="month-selection"
        
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
          <label htmlFor="charts-selection">Select Charts Type:</label>
          <div className="select-container">
            <select
            id="charts-selection"
            value={selectedChart}
            onChange={handleChartsChange}
          >
            <option value="">Select a Month</option>
            <option value="BarChart">Histogram</option>
            <option value="pie">Pie</option>
          </select>
          </div>
          
        </div>
        <ChartComponent chartType={selectedChart} chartData={charData} title={showMonth}/>

        <h2>Saving Summary</h2>

        <ChartComponent chartType="BarChart" chartData={monthlyExpense} title="Monthly Saving" />
        <ChartComponent chartType="line" chartData={monthlyExpense} title="Monthly Expenses" />
      </div>
    </div>
    </div>
    </div>
  );
};

export default Tracking;

