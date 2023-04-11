import React, { useState, useEffect } from "react";
import ChartComponent from "./Char";


const Tracking = () => {
  const [estimatedIncome, setEstimatedIncome] = useState(0);
  const [estimatedExpense, setEstimatedExpense] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [addExpenseMonth, setAddExpenseMonth] = useState(null);
  const [showMonth, setShowMonth] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expenseAmount, setExpenseAmount] = useState(0);
  // test data
  const data = [
    { category: "Food and groceries", amount: 500 },
    { category: "Housing and utilities", amount: 800 },
    { category: "Transportation", amount: 300 },
    { category: "Personal care", amount: 200 },
    { category: "Entertainment", amount: 400 }
  ];

  const [charData, setCharData] = useState(data);

  useEffect(() => {
    // const fetchData = async () => {
    //   const data = await ///// fetch from database

    //   console.log(data);
    //   setCharData(data);
    // };
    // fetchData();
  }, [showMonth]);




  const handleIncomeChange = (event) => {
    setEstimatedIncome(event.target.value);
  };

  const handleExpenseChange = (event) => {
    setEstimatedExpense(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleAddMonthChange = (event) => {
    setAddExpenseMonth(event.target.value);
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

  
  

  return (
    <div className="container">
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
          <label htmlFor="estimated-expense">Estimated Expense:</label>
          <input
            type="number"
            id="estimated-expense"
            value={estimatedExpense}
            onChange={handleExpenseChange}
          />
        </div>

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
        <div className="form-input">
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
          </div>
          
        </div>
        <button className="add-btn">Add</button>

      </div>

      <div className="chart-container">
        <ChartComponent chartType='BarChart' chartData={charData} title='April'/>
      </div>
    </div>
  );
};

export default Tracking;

