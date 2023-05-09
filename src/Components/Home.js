import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import "../Home.css";
import axiosInstance from "../config/axiosConfig";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../Tally/redux/store";
function createData(rank, username, points) {
  return { rank, username, points };
}

const mostPoints = async () => {
  const response = await fetch("http://localhost:4000/mostPoints", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);

  const rows = [];
  for (let i = 0; i < data.length; i++) {
    rows.push(createData(i, data[i].username, data[i].points));
  }
  return rows;
};

const getReward = async () => {
  const response = await fetch("http://localhost:4000/reward", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};

const SERVER_BASE_URL = "http://localhost:4000/";
const IMAGE_PATH = `${SERVER_BASE_URL}uploads/images`;
const THUMB_PATH = `${SERVER_BASE_URL}uploads/thumbs`;

function getUserProfilePicture(user) {
  let image = null;

  if (user.thumb) {
    image = `${THUMB_PATH}/${user.thumb}`;
    return image;
  }

  if (user.image) {
    image = `${IMAGE_PATH}/${user.image}`;
    return image;
  }

  return image;
}

export default function Home() {
  const [rows, setRows] = useState([]);
  const [user, setUser] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  // current month is 0 based
  const [currentMonth] = useState(new Date().getMonth());
  const [savingGoal, setSavingGoal] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [points, setPoints] = useState(0);
  const [apiCallState, setApiCallState] = useState({
    loading: false,
    data: null,
    error: null,
    navigateToLogin: false,
  });

  function removeUserFromLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
  }

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    setApiCallState({ ...apiCallState, loading: true });
    try {
      const response = await axiosInstance.get("/api/session");
      try {
        const rows = await mostPoints();
        setRows(rows);

        const response = await axiosInstance.get("/api/session");
        console.log(response.data);
        const summaryDataRes = await axiosInstance.post("/api/summary-data", {
          userId: response.data._id,
        });

        const reward = await getReward();
        reward.forEach((element) => {
          if (element.username === response.data.username) {
            setPoints(element.points);
          }
        });

        setSummaryData(summaryDataRes.data);
        console.log("Summary Data:", summaryDataRes.data);
        console.log("Current Month:", currentMonth);
        console.log(
          "Summary Data for Current Month:",
          summaryDataRes.data[currentMonth].savingGoal
        );
        if (summaryDataRes.data[currentMonth].savingGoal !== undefined) {
          setSavingGoal(summaryDataRes.data[currentMonth].savingGoal);
          setTotalExpense(summaryDataRes.data[currentMonth].totalExpense);
          setTotalIncome(
            summaryDataRes.data[currentMonth].income.slice(-1)[0].amount
          );
        } else {
          setSavingGoal(0);
          setTotalExpense(0);
          setTotalIncome(0);
        }

        setApiCallState({ ...apiCallState, loading: false });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (exception) {
      setApiCallState({ ...apiCallState, loading: false });
      if (exception.response && exception.response.data) {
        let errorData = exception.response.data;
        console.log("errorData", errorData);
        if (errorData.sessionExpired) {
          removeUserFromLocalStorage();
          setApiCallState({ ...apiCallState, navigateToLogin: true });
        }
      }
    }
  }

  let token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  if (apiCallState.navigateToLogin) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div>
      <br />
      <br />
      <Grid
        container
        alignItems="center"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        justifyContent="center"
        rowSpacing={1}
        spacing={2}
        style={{ padding: "20px" }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              minWidth: 275,
              minHeight: 275,
              maxWidth: 275,
              maxHeight: 275,
            }}
          >
            <CardContent>
              <Avatar
                alt="user profile picture"
                src={getUserProfilePicture(user)}
                sx={{ width: 50, height: 50 }}
              />
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Hello, {user.username}! <br />
                Today is {new Date().toLocaleDateString()}
              </Typography>

              <Typography variant="body2">
                Your saving goal is ${savingGoal} this month.
              </Typography>

              <Typography variant="body2">
                You have ${totalIncome} incomes this month.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  window.location.href = "/myProfile";
                }}
              ></Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              minWidth: 275,
              minHeight: 275,
              maxWidth: 275,
              maxHeight: 275,
            }}
          >
            <CardContent>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Your points: {points}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => {
                  window.location.href = "/myProfile";
                }}
              ></Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              minWidth: 275,
              minHeight: 275,
              maxWidth: 275,
              maxHeight: 275,
            }}
          >
            <CardContent>
              <Typography variant="body2">
                Your total expense is ${totalExpense} this month.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br />
      <br />
      <div className="table">
        <h2>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Top 10 users with most points
          </Typography>
        </h2>

        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            size="small"
            aria-label="points rank table"
          >
            <TableHead>
              <TableRow>
                <TableCell>rank</TableCell>
                <TableCell>username</TableCell>
                <TableCell>points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.rank + 1}
                  </TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Provider store={store}>
        <Outlet />
      </Provider>
    </div>
  );
}
