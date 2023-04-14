const mongoCollections = require("../config/mongoCollections")
const bcrypt = require("bcryptjs")
const authValidations = require("../helpers/authValidations")
const { ObjectId } = require("mongodb")
const xss = require("xss")
const helpers = require('../helpers/trackingValidation')


const userData = require('./authData');

const tracking = mongoCollections.tracking;



const setGoal = async (userId, month, year, estimatedIncome, savingGoal) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1

    // check if is proper userId
    helpers.checkIsProperString(userId);
    helpers.checkIsValidObjectId(userId);

    // check is proper month
    if (helpers.checkIsValidMonth(month) === -1) {
        throw new Error("Please provide valid month")
      } else {
          month = helpers.checkIsValidMonth(month);
      }
  
    // If the goal is for a previous month, don't allow modification, not making any sense right:)
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      throw new Error("Cannot modify goals for past months.");
    }
  
    // Check if the value is a valid number
    if (!Number.isFinite(Number(estimatedIncome))) {
      throw new Error("Please enter a valid number for estimated income.");
    }
  
    if (!Number.isFinite(Number(savingGoal))) {
      throw new Error("Please enter a valid number for saving goal.");
    }
  
    // Check if input is a positive number
    if (Number(estimatedIncome) < 0) {
      throw new Error("Please enter a positive number for estimated income.");
    }
  
    if (Number(savingGoal) < 0) {
      throw new Error("Please enter a positive number for saving goal.");
    }

    if (Number(estimatedIncome) <= Number(savingGoal)) {
        throw new Error("Estimated income should greater than saving goal");
    }
  
    // Sanitize input values to prevent XSS attacks
    const sanitizedEstimatedIncome = Number(xss(estimatedIncome));
    const sanitizedSavingGoal = Number(xss(savingGoal));
    
  
    // Check if there is already a goal set for the current month and user
    const trackingCollection = await tracking();
    let existingGoal = await trackingCollection.findOne({ "info.user._id": new ObjectId(userId), "info.month": month, "info.year": year });
    
    if (existingGoal) {
        // Update the existing goal
        existingGoal.income.push(
            {
                "amount": sanitizedEstimatedIncome,
                "description": "reset the saving goal or estimated income for this month",
                "date": currentMonth + "/" + new Date().getDate()
            }
        )
        existingGoal.savingGoal = sanitizedSavingGoal;
        existingGoal.leftToSpend = sanitizedEstimatedIncome - sanitizedSavingGoal - existingGoal.totalExpense; // could be negative

        const updatedInfo = await trackingCollection.updateOne(
            { _id: existingGoal._id }, 
            { $set: existingGoal }
        );

        if (updatedInfo.modifiedCount !==1) {
            throw new Error("Could not updated new goal successfully");
        }
    } else {
        // Create a new goal
        const returnUser = await userData.getUser(userId);
        const newGoal = ({
        info: { user: { _id: returnUser._id, username: returnUser.username, email: returnUser.email }, month, year },
        income: [],
        expense: [],
        totalExpense: 0,
        points: 0,
        leftToSpend: sanitizedEstimatedIncome,
        savingGoal: sanitizedSavingGoal
        });

        const insertInfo = await trackingCollection.insertOne(newGoal);
        if (!insertInfo.acknowledged) {
            throw new Error('Failed to create a new goal');
        }
    }
  };


const addExpense = async (userId, month, year, newExpense) => {

    // we can only add expense for this month
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1


    // check if is proper userId
    helpers.checkIsProperString(userId);
    helpers.checkIsValidObjectId(userId);

    // check valid description
    helpers.checkIsProperString(newExpense.description.trim());
  
    // Check if the value is a valid number
    if (!Number.isFinite(Number(newExpense.amount))) {
      throw new Error("Please enter a valid number for estimated income.");
    }
  
    // Check if input is a positive number
    if (Number(Number(newExpense.amount)) < 0) {
      throw new Error("Please enter a positive number for estimated income.");
    }

  
    // Sanitize input values to prevent XSS attacks
    const sanitizedAmount = Number(xss(newExpense.amount))
    const sanitizedCategory = xss(newExpense.category).trim();
    const sanitizedDescription = xss(newExpense.description).trim();
  
    // Check if there is existing budget otherwise throw error.
    const trackingCollection = await tracking();
    let existingBudget = await trackingCollection.findOne({ "info.user._id": new ObjectId(userId), "info.month": currentMonth, "info.year": currentYear });
    
    if (!existingBudget) {
        throw new Error("You need create your goal for this month before add expense!")
    } else {
        // add expense to the budget
        const newExpenseDoc = { category: sanitizedCategory, amount: sanitizedAmount,
            description: sanitizedDescription,
            date:   (new Date().getMonth() + 1) + "/" + new Date().getDate()
        };
        const updateDoc = {
            $push: { expense: newExpenseDoc },
            $inc: { totalExpense: sanitizedAmount, leftToSpend: -1 * sanitizedAmount }
        };

        const result = await trackingCollection.updateOne({ _id: existingBudget._id }, updateDoc);
        if (result.modifiedCount === 0) {
            throw new Error("Failed to add expense.");
        }
        
    }
};

async function updateIncome(userId, updatedMonth, year, updatedIncome, description) {

    const currentYear = new Date().getFullYear();

    // Input validation
    helpers.checkIsProperString(userId);
    helpers.checkIsValidObjectId(userId);
  
    // check is proper month
    if (helpers.checkIsValidMonth(updatedMonth) === -1) {
        throw new Error("Please provide valid month")
    } else {
        updatedMonth = helpers.checkIsValidMonth(updatedMonth);
    }

    // check updatedIncome
    if (!Number.isFinite(Number(updatedIncome))) {
        throw new Error("Please enter a valid number for updated income.");
      }
    
    // Check if input is a positive number
    if (Number(updatedIncome) < 0) {
    throw new Error("Please enter a positive number for updated income.");
    }

    // check description
    helpers.checkIsProperString(description);

    // xss protection
    const sanitizedUpdatedIncome = Number(xss(updatedIncome));
    const sanitizedDescription = xss(description);
    
    
  
   
  
    // Connect to the tracking collection
    const trackingCollection = await tracking();
  
    // Find the budget document for the given user, month, and year
    const existingBudget = await trackingCollection.findOne({
      "info.user._id": new ObjectId(userId),
      "info.month": updatedMonth,
      "info.year": currentYear,
    });
  
    if (!existingBudget) {
      throw new Error(
        "You need to create a budget for this month before updating income."
      );
    }
  
    // Update the income in the budget document
    const result = await trackingCollection.updateOne(
      { _id: existingBudget._id },
      {
        $push: {
          income: {
            amount: updatedIncome,
            description: sanitizedDescription,
            date: (new Date().getMonth() +  1) + "/" + new Date().getDate()
          },
        },
        $set: {leftToSpend: sanitizedUpdatedIncome - existingBudget.totalExpense}
    }
    );
  
    if (result.modifiedCount === 0) {
      throw new Error("Failed to update income.");
    }
  }

  // query specific month budget data, default for current year
async function getBudgetData(userId, month, year) {

    // check is proper month
    if (month) {
        if (helpers.checkIsValidMonth(month) === -1) {
            throw new Error("Please provide valid month")
        } else {
            month = helpers.checkIsValidMonth(month);
        }
    } else {
        month = new Date().getMonth() + 1;
    }
    
    
    // check is proper year
    // default current year but still can query other year
    year = year ? year : new Date().getFullYear();

    helpers.checkIsProperString(userId);
    helpers.checkIsValidObjectId(userId);


    
    const trackingCollection = await tracking();
    const budget = await trackingCollection.findOne({ "info.user._id": new ObjectId(userId), "info.month": month, "info.year": year });

    if (!budget) {
        return null;
    }


    return budget;
}
  



module.exports = {
    setGoal,
    addExpense,
    updateIncome,
    getBudgetData
}
  

