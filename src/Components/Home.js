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
  Box,
} from "@mui/material";
import "../Home.css";
import axiosInstance from "../config/axiosConfig";

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

  const rows = [];
  for (let i = 0; i < data.length; i++) {
    rows.push(createData(i, data[i].username, data[i].points));
  }
  return rows;
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
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [savingGoal, setSavingGoal] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const rows = await mostPoints();
      setRows(rows);
      setUser(JSON.parse(localStorage.getItem("user")));

      const response = await axiosInstance.get("/api/session");

      const summaryDataRes = await axiosInstance.post("/api/summary-data", {
        userId: response.data._id,
      });

      setSummaryData(summaryDataRes.data[currentMonth + 1]);
      setTotalExpense(summaryDataRes.data[currentMonth + 1]);
      setTotalIncome(summaryDataRes.data[currentMonth + 1]);

      setIsLoading(false);
    }

    fetchData();
  }, []);

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/login" />;
  } else if (token && !isLoading) {
    return (
      <div>
        <br />
        <br />
        <div className="user">
          <Card sx={{ minWidth: 275 }}>
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
              <div hidden={!summaryData}>
                <Typography variant="body2">
                  You have {summaryData} expenses this month.
                </Typography>
              </div>
              <div hidden={summaryData}>
                <Typography variant="body2">
                  You have no expenses this month.
                </Typography>
              </div>
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
        </div>
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
                      {row.rank}
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
