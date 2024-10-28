import { React, useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import Parkvue from "../ParkvueLogo/ParkvueLogo";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Menu, Close, Lock } from "@mui/icons-material";
import PLogo from "../ParkvueLogo/P_Logo";
import { Context } from "../../context/ContextProvider";

const NavBar = () => {
  const { currentUser } = useContext(Context);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  console.log(currentUser);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#00acca", color: "#333" }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo and desktop navigation */}
            <Typography
              variant="h6"
              component="div"
              noWrap
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  md: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "3rem",
                  marginLeft: "4rem",
                }}
              >
                <Parkvue />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "start",
                }}
              >
                <ul className="navbar">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/map">Map</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <Link to="/space">Space</Link>
                  </li>
                  <li>
                    {currentUser ? (
                      <Link to="/logout">{currentUser.fullName}</Link>
                    ) : (
                      <Link to="/login">
                        <Lock
                          sx={{ fontSize: "1rem", verticalAlign: "middle" }}
                        />{" "}
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              </Box>
            </Typography>

            {/* Mobile view with logo and drawer button */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
              }}
            >
              <PLogo />
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
              <IconButton
                edge="end"
                size="large"
                color="inherit"
                onClick={toggleDrawer}
              >
                <Menu />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{ "& .MuiDrawer-paper": { backgroundColor: "#00acca" } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: 2,
          }}
          role="presentation"
        >
          {/* Close Button */}
          <IconButton onClick={toggleDrawer} sx={{ alignSelf: "flex-end" }}>
            <Close />
          </IconButton>

          {/* User/Login Button */}
          <List sx={{ width: "100%" }}>
            <ListItem
              button
              component={Link}
              to={currentUser ? "/logout" : "/login"}
            >
              <ListItemText primary={currentUser.fullName || "Login"} />
            </ListItem>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/map">
              <ListItemText primary="Map" />
            </ListItem>
            <ListItem button component={Link} to="/about">
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={Link} to="/upload">
              <ListItemText primary="Upload" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default NavBar;
