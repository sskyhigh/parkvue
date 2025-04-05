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
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#00acca", color: "#333", overflow: "visible" }}
      >
        <Container
          maxWidth="lg"
          sx={{
            overflow: "visible", // Ensure container allows overflow
          }}
        >
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
                    <Link to="/upload">Upload</Link>
                  </li>
                </ul>
                <Box
                  className="navbar"
                  sx={{
                    position: "absolute",
                    right: 20,
                    top: 24,
                  }}
                >
                  {currentUser ? (
                    <>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropDownOpen(!dropDownOpen);
                        }}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {currentUser.fullName}
                      </Link>
                      {dropDownOpen && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            backgroundColor: "#00bcca",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "4px",
                            zIndex: 50,
                            padding: "0.5rem 1rem",
                            minWidth: "150px",
                          }}
                        >
                          <Link
                            to="/profile"
                            style={{ display: "block", padding: "0.5rem 0" }}
                          >
                            Profile
                          </Link>
                          <Link
                            to="/settings"
                            style={{ display: "block", padding: "0.5rem 0" }}
                          >
                            Settings
                          </Link>
                          <Link
                            to="/logout"
                            style={{ display: "block", padding: "0.5rem 0" }}
                          >
                            Logout
                          </Link>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Link to="/login">Login</Link>
                  )}
                </Box>
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
              to={currentUser ? "#00bcca" : "/login"}
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
            {currentUser && (
              <ListItem button component={Link} to="/logout">
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default NavBar;
