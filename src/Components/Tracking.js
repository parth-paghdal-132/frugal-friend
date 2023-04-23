import React, { useState, useEffect } from "react";
import ChartComponent from "./Char";
import { Alert, Button, Divider, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Typography, useTheme } from "@mui/material";


const Tracking = () => {
  const [estimatedIncome, setEstimatedIncome] = useState(0);
  const [estimatedExpense, setEstimatedExpense] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [incomeMonth, setIncomeMonth] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [updatedIncome, setUpdatedIncome] = useState(0);
  const [savingGoal, setSavingGoal] = useState(0);
  const [budgetData, setBudgetData] = useState(null);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [updatedIncomeDescription, setUpdatedIncomeDescription] = useState("");
  
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

  const [monthlyIncome, setMonthlyIncome] = useState(monthlyExpenses);

  const [charData, setCharData] = useState(data);

  const [monthlySaving, setMonthlySaving] = useState(monthlyExpenses);

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

  const handleCategoryExpenseChange = (event) => {
    setExpenseAmount(event.target.value);
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  }

  const handleExpenseDescriptionChange = (event) => {
    setExpenseDescription(event.target.value);
  }

  const handleIncomeDescriptionChange = (event) => {
    setUpdatedIncomeDescription(event.target.value);
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
      setSavingGoal(0);
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
        <h2>Your Estimated Income: {budgetData && budgetData.totalIncome ? budgetData.totalIncome : "$3000"}</h2>
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
            <option value="Entertainment">Entertainment</option>
            
          </select>

        </div>
        <div className="form-input">
          <label htmlFor="expense-description">Expense description:</label>
          <input
            type="string"
            id="expense-description"
            value={expenseDescription}
            onChange={handleExpenseDescriptionChange}
          />

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
          <label htmlFor="updatedIncome-description">Description:</label>
          <input
            type="string"
            id="updatedIncome-description"
            value={updatedIncomeDescription}
            onChange={handleIncomeDescriptionChange}
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


      
    </div>
    </div>
    </div>
  );
};

export default Tracking;

