const express = require("express")
const xss = require("xss")
const data = require("../data")
const trackingData = data.trackingData;
const helpers = require('../helpers/trackingValidation')


const router = express.Router();

const testExpenseData = [
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

// retrieve current month whole budget data
router.get('/api/budget-data', async (req, res) => {
    let month;
    if (req.body.month) {
        month = xss(req.body.month)
    }
    
    let year = req.body.year ? req.body.year : new Date().getFullYear();
    year = Number(xss(year));
    let userId = xss(req.body.userId);

    try {
        helpers.checkIsProperString(userId);
        helpers.checkIsValidObjectId(userId);
        
        if (year < 1900 || year > 2100) {
            throw new Error("Please enter a valid year.");
        }
    } catch(e) {
        return res.status(400).send(e);
    }
    try {
        
        
        const budgetData = await trackingData.getBudgetData(userId, month, year);
        if (budgetData == null) {
            throw new Error("No budget data for this month")
        }
        res.json(budgetData);
    } catch (e) {
        if (e === "No budget data for this month") {
            res.status(404).send('No Data')
        }
        console.error(e.message);
        res.status(500).send('Server Error');

    }
});

// retrieve current/other month  expense
router.get('/api/expense-data', async (req, res) => {
    try {
        let month = xss(req.query.month).trim() || new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        const expenses = await trackingData.getExpense(month, year);
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// retrieve existed month expense
router.get('/api/monthly-expenses', async (req, res) => {
    try {
        let year = req.query.year || new Date().getFullYear();
        const monthlyExpenses = await trackingData.getMonthlyExpense(year);
        res.json(monthlyExpenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// retrieve monthly income
router.get('/api/monthly-income', async (req, res) => {
    try {
        let year = new Date().getFullYear();
        const monthlyIncome = await trackingData.getMonthlyIncome(year);
        res.json(monthlyIncome);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

router.post('/api/set-goal', async (req, res) => {
    const estimatedIncome = xss(req.body.estimatedIncome).trim();
    const savingGoal = xss(req.body.savingGoal).trim();
    let month = xss(req.body.month).trim();
    const userId = xss(req.body.userId).trim();

    const year = new Date().getFullYear();
    try {
        // Check if the value is a valid number

        if (!Number.isFinite(Number(estimatedIncome))) {
          res.status(400).json({ message: "Please enter a valid number for estimated income." });
          return;
        }
    
        if (!Number.isFinite(Number(savingGoal))) {
          res.status(400).json({ message: "Please enter a valid number for saving goal." });
          return;
        }
    
        if (helpers.checkIsValidMonth(month) === -1) {
          res.status(400).json({ message: "Please enter a valid month." });
          return;
        } else {
            month = helpers.checkIsValidMonth(month);
        }
    
        // Check if input is a positive number
        if (Number(estimatedIncome) < 0) {
          // If input is negative, update state with empty string and return
          res.status(400).json({ message: "Please enter a positive number for estimated income." });
          return;
        }
    
        if (Number(savingGoal) < 0) {
          // If input is negative, update state with empty string and return
          res.status(400).json({ message: "Please enter a positive number for saving goal." });
          return;
        }

        if (Number(savingGoal) >= Number(estimatedIncome)) {
            res.status(400).json({ message: "Estimated income should be greater than saving goal"})
        }
    
        await trackingData.setGoal(userId, month, year, estimatedIncome, savingGoal);
    
        // Return success message
        res.json({ message: "Saving goal set successfully." });
      } catch (e) {
        console.error(e);
        res.status(500).send("Server Error");
      }

});



router.post('/api/update-income', async (req, res) => {
  const updatedIncome = Number(xss(req.body.updatedIncome).trim());
  const updatedMonth = xss(req.body.updatedMonth).trim();
  const description = xss(req.body.description).trim();
  const userId = xss(req.body.userId);
  let year = new Date().getFullYear();
  

  try{
    // check valid Id
    helpers.checkIsProperString(userId);
    helpers.checkIsValidObjectId(userId);


    if (helpers.checkIsValidMonth(updatedMonth) === -1) {
        res.status(400).json({ message: "Please enter a valid month for updated income month." });
        return;
    }
    
    // Check if the value is a valid number
    if (!Number.isFinite(Number(updatedIncome))) {
        res.status(400).json({ message: "Please enter a valid number for updated income." });
        return;
    }

    // Check if input is a positive number
    if (Number(updatedIncome) < 0) {
        // If input is negative, update state with empty string and return
        res.status(400).json({ message: "Please enter a positive number for updated income." });
        return;
    }

  } catch(e) {
    return res.status(500).send('Server Error');
  }
  

  // update income 
  try {
    await trackingData.updateIncome(userId, updatedMonth, year, updatedIncome, description);
    return res.json({ message: 'Income updated successfully.' });
  } catch {
    return res.status(500).send('Server Error');
  }
  
  
  
});


// add expense for current month
router.post('/api/add-expense', async (req, res) => {


  const year = new Date().getFullYear();
  const month = new Date().getMonth + 1; 
  const userId = xss(req.body.userId).trim(); // session??
  const category = xss(req.body.category).trim();
  let amount = xss(req.body.amount).trim()
  const description = xss(req.body.description.trim());

  // Check valid Id
  helpers.checkIsProperString(userId);
  helpers.checkIsValidObjectId(userId);

  // Check the description
  helpers.checkIsProperString(description);

  // Check if the value is a valid number
  if (!Number.isFinite(Number(amount))) {
      res.status(400).json({ message: "Please enter a valid number for expense amount." });
      return;
  }

  // Check if input is a positive number
  if (Number(amount) < 0) {
      // If input is negative, update state with empty string and return
      res.status(400).json({ message: "Please enter a positive number for expense amount." });
      return;
  }

  amount = Number(amount);

  // Check if is valid category
  helpers.checkIsProperString(category);
  helpers.checkIsValidCategory(category);


  // Add the new expense to the data
  const newExpense = { category, amount, description };
  try {
    await trackingData.addExpense(userId, month, year, newExpense);
  } catch (e) {
    if (e === "You need create your goal for this month before add expense!") {
        return res.status(400).send(e)
    }
    return res.status(500).send('Server Error');
  }
  

  // TODO: Implement database update code here
  res.json({ message: 'Expense added successfully.' });
});

module.exports = router;
