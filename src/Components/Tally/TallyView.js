import React from "react";
import NumberPad from "./NumberPad";
const TallyView = () => {
  const [tally, setTally] = React.useState(0);
  const [date, setDate] = React.useState(new Date());

  const handleAdd = () => setTally(tally + 1);
  const handleSubtract = () => setTally(tally - 1);
  const handleDateChange = (event) => setDate(new Date(event.target.value));

  return (
    <div>
      <h1>Tally Page</h1>
      <p>Tally: {tally}</p>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleSubtract}>Subtract</button>
      <br />
      <label htmlFor="date-input">Date:</label>
      <input
        type="date"
        id="date-input"
        value={date.toISOString().substr(0, 10)}
        onChange={handleDateChange}
      />
      <NumberPad />
    </div>
  );
};

export default TallyView;
