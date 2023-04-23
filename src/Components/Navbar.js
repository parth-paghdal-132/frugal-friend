import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
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
              Frugal Friends
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
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
              }}
            >
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
                  to="/transation"
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
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/auth/signup"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">Sign up</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link
                  to="/auth/login"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">Login</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            variant="h5"
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
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <NavLink
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Home
              </NavLink>
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <NavLink
                to="/tracking"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Add Transaction
              </NavLink>
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <NavLink
                to="/budget"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                View Budget
              </NavLink>
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <NavLink
                to="/auth/signup"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Sign up
              </NavLink>
            </Button>
            <Button sx={{ my: 2, color: "white", display: "block" }}>
              <NavLink
                to="/auth/login"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Login
              </NavLink>
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
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
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Link
                  to="/myprofile"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">View Profile</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Link
                  to="/logout"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
