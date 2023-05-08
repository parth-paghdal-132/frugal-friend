export const convertToNumber = (string) => {
  string = string.toString();
  const numbers = string.split(/[-+]/);
  console.log(numbers);
  const longestFloat = numbers.reduce((longest, number) => {
    const match = number.match(/^-?\d+(\.\d+)?$/); // Find the longest floating-point number in the number
    if (match && match[0].length > longest.length) {
      return match[0];
    }
    return longest;
  }, "");
  const result = eval(string.replace(longestFloat, parseFloat(longestFloat)));
  return result.toString();
};
