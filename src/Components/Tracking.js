import React, { useState, useEffect, useCallback } from "react";
import ChartComponent from "./Char";
import { Alert, Select, Button, MenuItem, Tooltip, Divider, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Typography, useTheme
,TextField, 
responsiveFontSizes} from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios'
import { Navigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import axiosInstance from "../config/axiosConfig"
import helpers from "../helpers/trackingValidation"




const Tracking = () => {
  
  const [estimatedIncome, setEstimatedIncome] = useState(null);
  const [estimatedExpense, setEstimatedExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [incomeMonth, setIncomeMonth] = useState(null);
  const [showMonth, setShowMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState(null);
  const [selectedChart, setSelectedChart] = useState('BarChart');
  const [updatedIncome, setUpdatedIncome] = useState(null);
  const [savingGoal, setSavingGoal] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [updatedIncomeDescription, setUpdatedIncomeDescription] = useState("");
  const [sessionData, setSessionData] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [charData, setCharData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);



  
  // test data
  
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
  const categoryOptions = [
    "Food and groceries",
    "Housing and utilities",
    "Transportation",
    "Personal care",
    "Entertainment"
  ]

  const chartTypeOptions = [
    "BarChart",
    "Pie"
  ]

  const monthlyExpenses = [
    { month: 'January', amount: 100 },
    { month: 'February', amount: 200 },
    { month: 'March', amount: 150 },
    { month: 'April', amount: 300 },
  ];
  
  const parseChartData = (data) => {

    let amount1 = 0;
    let amount2 = 0;
    let amount3 = 0;
    let amount4 = 0;
    let amount5 = 0;
    for (let i = 0; i < data.expense.length; i++) {
      if (data.expense[i].category === "Food and groceries") {
        amount1 = amount1 + data.expense[i].amount
      }
      if (data.expense[i].category === "Housing and utilities") {
        amount2 = amount2 + data.expense[i].amount
      }
      if (data.expense[i].category === "Transportation") {
        amount3 = amount3 + data.expense[i].amount
      }
      if (data.expense[i].category === "Personal care") {
        amount4 = amount4 + data.expense[i].amount
      }
      if (data.expense[i].category === "Entertainment") {
        amount5 = amount5 + data.expense[i].amount
      }  
    }
    let res = [
      { category: "Food and groceries", amount: amount1 },
      { category: "Housing and utilities", amount: amount2 },
      { category: "Transportation", amount: amount3 },
      { category: "Personal care", amount: amount4 },
      { category: "Entertainment", amount: amount5 }];
    return res;
  }
  
  const parseSummaryData = (data, type) => {
    if (type == "Monthly Expense") {
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
    if (type == "Monthly Income") {
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

  let token = localStorage.getItem("token")

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axiosInstance.get("/api/session");
        const budgetData = await axiosInstance.post("/api/budget-data", {
          userId: response.data._id,
        });

        const summaryDataRes = await axiosInstance.post("/api/summary-data", {
          userId:response.data._id,
        })

        setBudgetData(budgetData.data);
        setSessionData(response.data);
        setSummaryData(summaryDataRes.data);
        setIsLoading(false)
        if (showMonth && helpers.checkIsValidMonth(showMonth) == new Date().getMonth + 1) {
          setCharData()
        }
      
      } catch(e) {
        console.log(e);
      }
    }
    fetchSessionData();
    
  }, [selectedMonth, expenseAmount, setIncomeMonth, showMonth]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axiosInstance.post("/api/budget-data", {
          userId: sessionData._id,
          month: showMonth
        });
        setCharData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (showMonth) {
      fetchChartData();
    }
  }, [showMonth, sessionData]);




   
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
    setExpenseAmount(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleIncomeMonthChange = (event) => {
    setIncomeMonth(event.target.value);
  };

  const handleShowMonthChange = (event) => {
    if (helpers.checkIsValidMonth(event.target.value) > new Date().getMonth() + 1) {
      alert("You can only show your current or past month budget")
      setShowMonth(new Date().toLocaleString('default', { month: 'long' }))
    } else {
      setShowMonth(event.target.value);
    }
    
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

  const handleSetClick = async (event) => {
    event.preventDefault();
    if (!selectedMonth || !estimatedIncome || !savingGoal) {
      return alert("Pleas fill out all the fields")
    }
    if (helpers.checkIsValidMonth(selectedMonth) < new Date().getMonth() + 1) {
        return alert("You can only set goal for current or future month ")
      }
    if (savingGoal >= estimatedIncome ) {
      alert("Saving goals should less than estimated income")
      
    } else {
      try {
      const response = await axiosInstance.post("/api/set-goal", {
        userId: sessionData._id,
        month: selectedMonth,
        estimatedIncome: estimatedIncome,
        savingGoal: savingGoal,
      });

        alert("Set Goal Successfully")
        setEstimatedIncome(null);
        setSavingGoal(null);
        setSelectedMonth(null)
      } catch (error) {
        console.error(error);
      }

      setEstimatedIncome(0);
      setSavingGoal(0);
    }
    

  };

  const handleUpdateClick = async() => {
      if (helpers.checkIsValidMonth(incomeMonth) > new Date().getMonth() + 1) {
        return alert("You can only update income for current or past month ")
      }
      if (!incomeMonth || !updatedIncomeDescription || !updatedIncome) {
        return alert("Pleas fill out all the fields");
      } else {
        try {
          const response = await axiosInstance.post("/api/update-income", {
            userId: sessionData._id,
            updatedIncome: updatedIncome,
            updatedMonth: incomeMonth,
            description: updatedIncomeDescription
          }); // update the charData   
            alert("Update Income Successfully")
            setUpdatedIncome(null);
            setIncomeMonth(null);
            setUpdatedIncomeDescription(null)
        } catch (error) {
            console.error(error);
          }

         
    
        }
        
    } 


  const handleAddClick = async (event) => {
    event.preventDefault();
    if (!budgetData) {
      alert("You need set goal for current month before add expense")
    }
    if (selectedCategory && expenseAmount) {
      try {
        const response = await axiosInstance.post("/api/add-expense", {
          userId: sessionData._id,
          category: selectedCategory,
          amount: expenseAmount,
          description: expenseDescription
        });
  
          alert("Add Expense Successfully")
          setSelectedCategory(null);
          setExpenseAmount("");
          setExpenseDescription("");
        } catch (error) {
          console.error(error);
        }

      // // update the charData
      // const newChartData = charData.map((item) => {
      //   if (item.category === selectedCategory) {
      //     return {
      //       category: item.category,
      //       amount: item.amount + parseInt(expenseAmount),
      //     };
      //   } else {
      //     return item;
      //   }
      // });
      // setCharData(newChartData);
    } else {
      return alert("Pleas fill out all the fields")
    }
  };

  const now = new Date();
  
  


  if (token) {
    if (isLoading) {
    return <h1>Loading</h1>
   }
    return (
    
  
    <div className="container">
     
      {budgetData ? <div className="info-bar">
        <h2>{now.toLocaleString('default', { month: 'long' })} {now.getDate()} </h2>
        <h2>Estimated Income: {budgetData && budgetData.income[budgetData.income.length - 1].amount ? budgetData.income[budgetData.income.length - 1].amount : "$3000"}</h2>
        <h2>Saving Goal: {budgetData && budgetData.income[budgetData.income.length - 1].amount ? budgetData.savingGoal : "$3000"}</h2>
        <h2>{budgetData.leftToSpend}$ left to spend</h2>
      </div> : (
        <h2>You haven't set goal for this month. Let's set it below!</h2>
      )}
      
      <div className="trackingForm-container">
      <div className="set-goal">
      <Tooltip title="You can set your goal for current or next month in this year">
      <IconButton>
      <HelpIcon />
      </IconButton>
      </Tooltip>
        <form >
        <Typography variant="h5" component="h1" align="center">
        Set Your Goal
        </Typography>
        <TextField
          fullWidth
          required
          label="Estimated Income"
          value={estimatedIncome}
          onChange={handleIncomeChange}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          label="Saving Goal"
          value={savingGoal}
          onChange={handleSavingGoalChange}
          margin="normal"
        />
        <InputLabel id="month-select-label">Month</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          value={selectedMonth}
          label="Month"
          onChange={handleMonthChange}
        >
          {monthOptions.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSetClick}
        >
        Set
        </Button>
        </form>
      </div>
    
      <div className="add-expense">
        <form >
        <Tooltip title="Add expense for current month">
        <IconButton>
        <HelpIcon />
        </IconButton>
        </Tooltip>
        <Typography variant="h5" component="h1" align="center">
        Add Expenses
        </Typography>
        <TextField
          fullWidth
          required
          label="Expense amount"
          value={expenseAmount}
          onChange={handleExpenseChange}
          margin="normal"
        />
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select-label"
          value={selectedCategory}
          label="Category"
          onChange={handleCategoryChange}
        >
          {categoryOptions.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          required
          label="Expense Description"
          value={expenseDescription}
          onChange={handleExpenseDescriptionChange}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleAddClick}
        >
        Add
        </Button>
        </form>
      </div> 


      <div className="update-income">
        <form >
        <Tooltip title="If you find your actual income is lower or higher that your estimated income after that month, you can update it here.">
        <IconButton>
        <HelpIcon />
        </IconButton>
        </Tooltip>
        <Typography variant="h5" component="h1" align="center">
        Update Income
        </Typography>
        <TextField
          fullWidth
          required
          label="Updated Income"
          value={updatedIncome}
          onChange={handleUpdateIncome}
          margin="normal"
        />
        <TextField
          fullWidth
          required
          label="Expense Description"
          value={updatedIncomeDescription}
          onChange={handleIncomeDescriptionChange}
          margin="normal"
        />
        <InputLabel id="incomeMonth-select-label">Month</InputLabel>
        <Select
          labelId="incomeMonth-select-label"
          id="incomeMonth-select"
          value={incomeMonth}
          label="Month"
          onChange={handleIncomeMonthChange}
        >
          {monthOptions.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleUpdateClick}
        >
        Update
        </Button>
        </form>
      </div>
      </div>


      <div className="chart-container">
        <div className="expense-chart">
          <h2> Visualization of your Expense </h2>
          <InputLabel id="chartMonth-select-label">Month</InputLabel>
          <Select
            labelId="chartMonth-select-label"
            id="chartMonth-select"
            value={showMonth}
            label="Month"
            onChange={handleShowMonthChange}
          >
            {monthOptions.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
          <InputLabel id="chartType-selection">Select Chart Type</InputLabel>
          <Select
            labelId="chartType-selection"
            id="chartType-selection"
            value={selectedChart}
            label="Select Charts Type"
            onChange={handleChartsChange}
          >
            {chartTypeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {charData && <ChartComponent chartType={selectedChart} chartData={parseChartData(charData)} title={showMonth}/>}
        </div>
        
        <div className="saving-chart">
          <h2>Saving Summary</h2>
          <ChartComponent chartType="BarChart" chartData={parseSummaryData(summaryData, "Monthly Saving")} title="Monthly Saving" />
          <ChartComponent chartType="BarChart" chartData={parseSummaryData(summaryData, "Monthly Income")} title="Monthly Income" />
          <ChartComponent chartType="line" chartData={parseSummaryData(summaryData, "Monthly Expense")} title="Monthly Expense" />
        </div>
      </div>



    </div>


  );
  } else {

    return (
      <div>
       <Link to="/auth/login" style={{ fontSize: '20px' }}>Login First! Go to login page</Link>
      </div>
    );
    
  }
  
};

export default Tracking;

