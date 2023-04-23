// const { ObjectId } = require("mongodb")

const checkIsValidMonth = (month) => {
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december"
    ];
    const monthIndex = monthNames.findIndex((m) => m.toLowerCase() === month.toLowerCase());
    if (monthIndex !== -1) {
      // Return the numeric value of the month (0-based index)
      return monthIndex + 1;
    }
    
    return -1;
  };

  


function checkIsProperString(str,strName){
    if(typeof str !== 'string' || str === null || str=== undefined){
        throw new Error(`${strName || 'provided variable'} should be string`)
    }
    if(str.trim().length == 0|| str.length == 0){
        throw new Error(`${strName || 'provided string'} cannot be empty or all spaces`)
    }
}

function checkIsValidObjectId(id) {
    // if(!ObjectId.isValid(id)){
    //     throw new Error(`The userId is not valid Object Id`);
    // }
}

function checkIsValidCategory(category) {
    if (category !== "Food and groceries" && category !== "Housing and utilities" && category !== "Transportation"
    && category !== "Personal care" && category !== "Entertainment") {
        throw new Error("The category is not valid")
    }
}

module.exports = {
    checkIsValidMonth,
    checkIsProperString,
    checkIsValidObjectId,
    checkIsValidCategory
}