import * as React from "react";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axiosInstance from "../config/axiosConfig"
import { GoogleAuthProvider, getAuth, signOut } from 'firebase/auth'
import fireabseApp from '../firebase/Firebase'

const provider = new GoogleAuthProvider()
const auth = getAuth(fireabseApp)

const SERVER_BASE_URL = "http://localhost:4000/"
const IMAGE_PATH = `${SERVER_BASE_URL}uploads/images`
const THUMB_PATH = `${SERVER_BASE_URL}uploads/thumbs`

const Navbar = () => {

	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);
	const [apiCallState, setApiCallState] = React.useState({op:null, loading: false, data: null, error: null})
	const [snackbarState, setSnackbarState] = React.useState(false)
	
	const [token, setToken] = React.useState(localStorage.getItem("token"))
	const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")))
	const navigate = useNavigate()

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	React.useEffect(() => {
		window.addEventListener("storage", (event) => {
			setToken(localStorage.getItem("token"))
			setUser(JSON.parse(localStorage.getItem("user")))
		})
	}, [])
	
	async function performLogout() {
		handleCloseUserMenu()
		setApiCallState(prev => ({...prev, loading: true, op:"logout"}))
		try {
			let response = await axiosInstance.get("/auth/logout")
			setApiCallState(prev => ({...prev, loading:false}))
			if(response.status === 200) {
				signOut(auth)
				removeUserFromLocalStorage()
				navigate("/auth/login", { replace: false, state: {successMessage: "You have been logged out successfully."}}, 1)
			} else {
				setSnackbarState(true)
				setApiCallState(prev => ({...prev, error: "Can not log out you at this moment."}))
			}
		} catch(exception) {
			setApiCallState(prev => ({...prev, loading: false, op: "logout"}))
			removeUserFromLocalStorage()
			navigate("/auth/login", { replace: false, state: {successMessage: "You have been logged out successfully."}}, 1)
		}
	}

	function handleSnackbarClose(event, reason) {
        if (reason === 'clickaway') {
            return
        }
        setSnackbarState(false)
    }

	function gotoMyProfile() {
		navigate("/myProfile", { replace: false }, 1)
		handleCloseUserMenu()
	}

	function gotoSignUp(){
		navigate("/auth/signup", { replace: true }, 1)
		handleCloseUserMenu()
	}

	function gotoLogin() {
		navigate("/auth/login", { replace: true }, 1)
		handleCloseUserMenu()
	}
	
	function getUserProfilePicture(user) {
		let image = null
		if(!user) {
			return image
		}
		if(user.thumb) {
			image = `${THUMB_PATH}/${user.thumb}`
			return image
		}

		if(user.image) {
			image = `${IMAGE_PATH}/${user.image}`
			return image
		}
		return image
	}

	function removeUserFromLocalStorage() {
		localStorage.removeItem("token")
		localStorage.removeItem("user")
		window.dispatchEvent(new Event("storage"))
	}

	if(!token) {
		return <div></div>
	}
	return (
		<AppBar position="static">
		<Container maxWidth="xl">
			<Toolbar disableGutters>
				<Snackbar open={snackbarState} autoHideDuration={6000} onClose={handleSnackbarClose}>
					<Alert onClose={handleSnackbarClose} severity="error" sx={{width: "100%"}}>
						{apiCallState.error ? apiCallState.error : "Something went wrong"}    
					</Alert> 
				</Snackbar>
				<Typography
					variant="h6"
					component="h1"
					noWrap
					sx={{
					mr: 2,
					display: { xs: "none", md: "flex" },
					fontFamily: "monospace",
					fontWeight: 700,
					letterSpacing: ".1rem",
					}}
				>
					<Link
						to="/"
						style={{
							color: "inherit",
							textDecoration: "none",
						}}
						>
						Frugal Friend
					</Link>
				</Typography>

			<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					onClick={handleOpenNavMenu}
					color="inherit">
					<MenuIcon />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorElNav}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					keepMounted
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
					open={Boolean(anchorElNav)}
					onClose={handleCloseNavMenu}
					sx={{
						display: { xs: "block", md: "none" },
					}}>
					<MenuItem onClick={handleCloseNavMenu}>
						<Link
							to="/"
							style={{ textDecoration: "none", color: "inherit" }}
							>
						<Typography textAlign="center">Home</Typography>
						</Link>
					</MenuItem>
					<MenuItem onClick={handleCloseNavMenu}>
						<Link
						to="/Tracking"
						style={{ textDecoration: "none", color: "inherit" }}
						>
						<Typography textAlign="center">Add Transaction</Typography>
						</Link>
					</MenuItem>
					<MenuItem onClick={handleCloseNavMenu}>
						<Link
						to="/budget"
						style={{ textDecoration: "none", color: "inherit" }}
						>
						<Typography textAlign="center">View Budget</Typography>
						</Link>
					</MenuItem>
				</Menu>
			</Box>

			<Typography
				variant="h5"
				component="h1"
				noWrap
				sx={{
				mr: 2,
				display: { xs: "flex", md: "none" },
				flexGrow: 1,
				fontFamily: "monospace",
				fontWeight: 700,
				letterSpacing: ".1rem",
				color: "inherit",
				textDecoration: "none",
				}}
			>
				<Link
					to="/"
					style={{
						color: "inherit",
						textDecoration: "none",
					}}
					>
					Frugal Friends
				</Link>
			</Typography>

			<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
				<Button 
					sx={{ my: 2, color: "white", display: "block" }}
					component={NavLink}
					to="/"
				>
					Home
				</Button>
				<Button 
					sx={{ my: 2, color: "white", display: "block" }}
					component={NavLink}
					to="/Tracking"
				>
					Add Transaction
				</Button>
				<Button 
					sx={{ my: 2, color: "white", display: "block" }}
					component={NavLink}
					to="/budget"
				>
					View Budget
				</Button>
			</Box>

			<Box sx={{ flexGrow: 0 }}>
				<IconButton component="div" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
					<Avatar alt="Remy Sharp" src={getUserProfilePicture(user)} />
				</IconButton>
				<Menu
					sx={{ mt: "45px" }}
					id="menu-profile"
					anchorEl={anchorElUser}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					keepMounted
					transformOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					open={Boolean(anchorElUser)}
					onClose={handleCloseUserMenu}>
						{token ? 
							<Stack component="li">
								<MenuItem component="span" onClick={gotoMyProfile}>
									View Profile
								</MenuItem>
								<MenuItem component="span" onClick={performLogout}>
									Logout
								</MenuItem>		
							</Stack>
						: 	<Stack component="li">
								<MenuItem component="span" onClick={gotoSignUp}>
									Sign Up
								</MenuItem>
								<MenuItem component="span" onClick={gotoLogin}>
									Login
								</MenuItem>
							</Stack>
						}
				</Menu>
			</Box>
			</Toolbar>
		</Container>
		</AppBar>
	);
};

export default Navbar;
