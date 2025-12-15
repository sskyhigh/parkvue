import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import Parkvue from "../ParkvueLogo/ParkvueLogo";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
} from "@mui/material";
import { alpha as muiAlpha } from "@mui/material/styles";
import {
  Map,
  Info,
  CloudUpload,
  AccountCircle,
  ExpandMore,
  Person,
  Settings,
  Logout,
  Login,
  Menu,
  Close,
  ExpandLess,
  GarageRounded as LocalParking,
  Dashboard,
} from "@mui/icons-material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import CheckIcon from "@mui/icons-material/Check";
import PLogo from "../ParkvueLogo/P_Logo";
import { Context } from "../../context/ContextProvider";
import { useAppTheme } from "../../context/themeContext";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const ctx = useContext(Context) || {};
  const { currentUser } = ctx;

  const muiTheme = useTheme();
  const { mode, toggleTheme } = useAppTheme();
  const alpha = muiAlpha;
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsOpenMobile, setOptionsOpenMobile] = useState(false);
  const [selectedTab, setSelectedTab] = useState(window.location.pathname);

  const toggleDrawer = () => setDrawerOpen((s) => !s);

  // theme mode handler
  const applyMode = (newMode) => {
    if (!["dark", "light", "system"].includes(newMode)) {
      console.warn(`Invalid mode '${newMode}' passed to applyMode`);
      return;
    }
    toggleTheme(newMode);
  };

  // update selected tab on route change
  const tabs = ["/map", "/about", "/upload", "/rooms"];
  useEffect(() => {
    if (!tabs.includes(location.pathname)) {
      setSelectedTab("null");
    }
  }, [location.pathname]);

  // helper for UI selection state
  const isSelected = (opt) => mode === opt;

  // dynamic colors based on theme
  const appBarBg =
    muiTheme.palette.mode === "dark"
      ? alpha(muiTheme.palette.background.paper, 0.65)
      : alpha(muiTheme.palette.background.paper, 0.95);

  const borderColor = alpha(muiTheme.palette.primary.main, 0.42);
  const buttonHoverBg = alpha(muiTheme.palette.primary.main, 0.16);
  const menuPaperBg = muiTheme.palette.background.paper;
  const menuBorder = alpha(muiTheme.palette.primary.main, 0.22);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: appBarBg,
          backdropFilter: "blur(32px)",
          boxShadow: `0 2px 20px ${alpha(muiTheme.palette.primary.main, 0.06)}`,
          borderBottom: `1px solid ${borderColor}`,
          transition: "all 0.3s ease",
          color: muiTheme.palette.text.primary,
          "&:hover": {
            boxShadow: `0 6px 30px ${alpha(muiTheme.palette.primary.main, 0.08)}`,
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1, position: "relative" }}>
            {/* Desktop Logo */}
            <Box
              onClick={() => setSelectedTab("null")}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                ml: 0,
                mr: 2,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Parkvue />
            </Box>

            {/* Mobile Logo */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                mr: "auto",
                alignItems: "center",
                minWidth: 0,
                flexShrink: 0,
              }}
            >
              <PLogo />
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                ml: 3,
              }}
            >
              {[
                { label: "Map", path: "/map", icon: <Map /> },
                {
                  label: "Upload",
                  path: "/upload",
                  icon: <CloudUpload />,
                  isActive: (tab) => tab.includes("/upload"),
                },
                { label: "Rooms", path: "/rooms", icon: <LocalParking /> },
                { label: "About", path: "/about", icon: <Info /> },
              ].map((item) => (
                <Button
                  key={item.label}
                  onClick={() => setSelectedTab(item.path)}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    background: (item.isActive ? item.isActive(selectedTab) : selectedTab === item.path)
                      ? buttonHoverBg
                      : "transparent",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      width: 0,
                      height: 2,
                      background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.info.main})`,
                      transition: "all 0.3s ease",
                      transform: "translateX(-50%)",
                    },
                    "&:hover": {
                      color: muiTheme.palette.primary.main,
                      background: buttonHoverBg,
                      transform: "translateY(-1px)",
                      "&:before": { width: "80%" },
                    },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "none", lg: "block" } }}>
                    {item.label}
                  </Box>
                </Button>
              ))}

              {/* Options Dropdown (desktop hover) */}
              <Box sx={{ position: "relative" }} onMouseLeave={() => setOptionsOpen(false)}>
                <Button
                  onMouseEnter={() => setOptionsOpen(true)}
                  startIcon={<Settings />}
                  endIcon={<ExpandMore />}
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    background: optionsOpen ? buttonHoverBg : "transparent",
                    hover: buttonHoverBg,
                    transition: "all 0.3s ease",
                    "&:hover": { background: buttonHoverBg, transform: "translateY(-1px)" },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "none", lg: "block" } }}>
                    Options
                  </Box>
                </Button>

                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: menuPaperBg,
                    borderRadius: 1.5,
                    boxShadow: `0 12px 40px ${alpha(muiTheme.palette.common.black, 0.14)}`,
                    border: `1px solid ${menuBorder}`,
                    overflow: "hidden",
                    opacity: optionsOpen ? 1 : 0,
                    visibility: optionsOpen ? "visible" : "hidden",
                    transform: optionsOpen ? "translateY(0)" : "translateY(-8px)",
                    transition: "all 0.22s cubic-bezier(.2,.9,.2,1)",
                    zIndex: 1400,
                    minWidth: 220,
                  }}
                  onMouseEnter={() => setOptionsOpen(true)}
                  onMouseLeave={() => setOptionsOpen(false)}
                >
                  <Button
                    onClick={() => applyMode("light")}
                    startIcon={<LightModeIcon />}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      px: 3,
                      py: 1.5,
                      color: muiTheme.palette.text.primary,
                      borderRadius: 0,
                      background: isSelected("light") ? alpha(muiTheme.palette.primary.main, 0.08) : "transparent",
                      "&:hover": {
                        background: alpha(muiTheme.palette.primary.main, 0.08),
                        color: muiTheme.palette.primary.main,
                      },
                    }}
                    endIcon={isSelected("light") ? <CheckIcon fontSize="small" /> : null}
                  >
                    Light
                  </Button>

                  <Button
                    onClick={() => applyMode("dark")}
                    startIcon={<DarkModeIcon />}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      px: 3,
                      py: 1.5,
                      color: muiTheme.palette.text.primary,
                      borderRadius: 0,
                      background: isSelected("dark") ? alpha(muiTheme.palette.primary.main, 0.08) : "transparent",
                      "&:hover": {
                        background: alpha(muiTheme.palette.primary.main, 0.08),
                        color: muiTheme.palette.primary.main,
                      },
                    }}
                    endIcon={isSelected("dark") ? <CheckIcon fontSize="small" /> : null}
                  >
                    Dark
                  </Button>

                  <Button
                    onClick={() => applyMode("system")}
                    startIcon={<SettingsBrightnessIcon />}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      px: 3,
                      py: 1.5,
                      color: muiTheme.palette.text.primary,
                      borderRadius: 0,
                      background: isSelected("system") ? alpha(muiTheme.palette.primary.main, 0.08) : "transparent",
                      "&:hover": {
                        background: alpha(muiTheme.palette.primary.main, 0.08),
                        color: muiTheme.palette.primary.main,
                      },
                    }}
                    endIcon={isSelected("system") ? <CheckIcon fontSize="small" /> : null}
                  >
                    System
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* User Menu - Desktop */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
                ml: "auto",
              }}
            >
              {currentUser ? (
                <Box
                  onMouseLeave={() => setDropDownOpen(false)}
                  sx={{
                    position: "relative",
                    ml: 1,
                  }}>
                  <Button
                    onMouseEnter={() => setDropDownOpen(true)}
                    startIcon={
                      currentUser?.photoURL ? (
                        <Avatar
                          src={currentUser.photoURL}
                          alt="User"
                          sx={{ width: 28, height: 28, ml: 0.5 }}
                        />
                      ) : (
                        <AccountCircle sx={{ ml: 0.5 }} />
                      )
                    }
                    endIcon={<ExpandMore />}
                    sx={{
                      color: muiTheme.palette.text.primary,
                      fontWeight: 500,
                      borderRadius: 2,
                      px: "auto",
                      py: 1,
                      background: buttonHoverBg,
                      border: `1px solid ${menuBorder}`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: alpha(muiTheme.palette.primary.main, 0.08),
                        transform: "translateY(-1px)",
                        boxShadow: `0 6px 18px ${alpha(muiTheme.palette.primary.main, 0.08)}`,
                      },
                    }}
                  >
                    {currentUser.fullName}
                  </Button>

                  {/* Dropdown Menu */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: menuPaperBg,
                      borderRadius: 1.5,
                      boxShadow: `0 12px 40px ${alpha(muiTheme.palette.common.black, 0.14)}`,
                      border: `1px solid ${menuBorder}`,
                      overflow: "hidden",
                      opacity: dropDownOpen ? 1 : 0,
                      visibility: dropDownOpen ? "visible" : "hidden",
                      transform: dropDownOpen ? "translateY(0)" : "translateY(-10px)",
                      transition: "all 0.22s cubic-bezier(.2,.9,.2,1)",
                      zIndex: 1400,
                      minWidth: 200,
                    }}
                  >
                    {[
                      { path: "/dashboard", label: "Dashboard", icon: <Dashboard /> },
                      { path: "/profile", label: "Profile", icon: <Person /> },
                      { path: "/logout", label: "Logout", icon: <Logout /> },
                    ].map((item, index) => (
                      <Button
                        key={item.path}
                        component={Link}
                        to={item.path}
                        onClick={() => setSelectedTab("null")}
                        startIcon={item.icon}
                        fullWidth
                        sx={{
                          justifyContent: "flex-start",
                          px: 3,
                          py: 1.5,
                          color: muiTheme.palette.text.primary,
                          borderRadius: 0,
                          borderBottom: index < 2 ? `1px solid ${alpha(muiTheme.palette.text.primary, 0.06)}` : "none",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: alpha(muiTheme.palette.primary.main, 0.06),
                            color: muiTheme.palette.primary.main,
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                  sx={{
                    background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.info.main})`,
                    color: "white",
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 4,
                    py: 1,
                    boxShadow: `0 6px 16px ${alpha(muiTheme.palette.primary.main, 0.18)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 20px ${alpha(muiTheme.palette.primary.main, 0.22)}`,
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: muiTheme.palette.primary.main,
                  background: alpha(muiTheme.palette.primary.main, 0.08),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: alpha(muiTheme.palette.primary.main, 0.14),
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Menu />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          zIndex: 12000, // Ensure drawer and backdrop cover floating chat buttons
          "& .MuiDrawer-paper": {
            background: muiTheme.customStyles?.neonGradient ?? muiTheme.palette.primary.main,
            color: muiTheme.palette.getContrastText(muiTheme.palette.primary.main),
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" style={{ width: 32, height: 32, borderRadius: "50%" }} />
              ) : (
                <AccountCircle sx={{ fontSize: 32 }} />
              )}
              <Typography variant="h6" fontWeight="600" sx={{ color: "white" }}>
                {currentUser ? currentUser.fullName : "Welcome"}
              </Typography>
            </Box>
            <IconButton
              onClick={toggleDrawer}
              sx={{
                color: "white",
                background: "rgba(255,255,255,0.08)",
                "&:hover": {
                  background: "rgba(255,255,255,0.12)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Navigation Items */}
          <List sx={{ flexGrow: 1 }}>
            <ListItemButton
              component={Link}
              to="/map"
              onClick={toggleDrawer}
              sx={{
                color: "white",
                borderRadius: 2,
                mb: 1,
                transition: "all 0.3s ease",
                "&:hover": { background: "rgba(255,255,255,0.08)", transform: "translateX(5px)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Map />
              </ListItemIcon>
              <ListItemText primary="Map" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/upload"
              onClick={toggleDrawer}
              sx={{
                color: "white",
                borderRadius: 2,
                mb: 1,
                transition: "all 0.3s ease",
                "&:hover": { background: "rgba(255,255,255,0.08)", transform: "translateX(5px)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <CloudUpload />
              </ListItemIcon>
              <ListItemText primary="Upload" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/rooms"
              onClick={toggleDrawer}
              sx={{
                color: "white",
                borderRadius: 2,
                mb: 1,
                transition: "all 0.3s ease",
                "&:hover": { background: "rgba(255,255,255,0.08)", transform: "translateX(5px)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <LocalParking />
              </ListItemIcon>
              <ListItemText primary="Rooms" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/about"
              onClick={toggleDrawer}
              sx={{
                color: "white",
                borderRadius: 2,
                mb: 1,
                transition: "all 0.3s ease",
                "&:hover": { background: "rgba(255,255,255,0.08)", transform: "translateX(5px)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Info />
              </ListItemIcon>
              <ListItemText primary="About" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>

            {/* Options (mobile) */}
            <ListItemButton
              onClick={() => setOptionsOpenMobile((s) => !s)}
              sx={{
                color: "white",
                borderRadius: 2,
                mb: 1,
                transition: "all 0.3s ease",
                "&:hover": { background: "rgba(255,255,255,0.08)", transform: "translateX(5px)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Options" primaryTypographyProps={{ fontWeight: 500 }} />
              {optionsOpenMobile ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
            </ListItemButton>

            <Collapse in={optionsOpenMobile} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => {
                    applyMode("light");
                    toggleDrawer();
                  }}
                  sx={{
                    pl: 4,
                    color: "white",
                    borderRadius: 2,
                    mb: 1,
                    transition: "all 0.3s ease",
                    background: isSelected("light") ? alpha(muiTheme.palette.common.white, 0.06) : "transparent",
                    "&:hover": { background: "rgba(255,255,255,0.08)" },
                  }}
                >
                  <ListItemText primary="Light Mode" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    applyMode("dark");
                    toggleDrawer();
                  }}
                  sx={{
                    pl: 4,
                    color: "white",
                    borderRadius: 2,
                    mb: 1,
                    transition: "all 0.3s ease",
                    background: isSelected("dark") ? alpha(muiTheme.palette.common.white, 0.06) : "transparent",
                    "&:hover": { background: "rgba(255,255,255,0.08)" },
                  }}
                >
                  <ListItemText primary="Dark Mode" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    applyMode("system");
                    toggleDrawer();
                  }}
                  sx={{
                    pl: 4,
                    color: "white",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    background: isSelected("system") ? alpha(muiTheme.palette.common.white, 0.06) : "transparent",
                    "&:hover": { background: "rgba(255,255,255,0.08)" },
                  }}
                >
                  <ListItemText primary="System Mode" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
              </List>
            </Collapse>

            {currentUser && (
              <>
                <ListItemButton
                  component={Link}
                  to="/dashboard"
                  onClick={toggleDrawer}
                  sx={{
                    color: "white",
                    borderRadius: 2,
                    mb: 1,
                    transition: "all 0.3s ease",
                    "&:hover": { background: "rgba(255,255,255,0.08)", transform: "translateX(5px)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/profile"
                  onClick={toggleDrawer}
                  sx={{
                    color: "white",
                    borderRadius: 2,
                    mb: 1,
                    transition: "all 0.3s ease",
                    "&:hover": { background: "rgba(255,255,255,0.08)", transform: "translateX(5px)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItemButton>
              </>
            )}
          </List>

          {/* Footer Action */}
          <Box sx={{ pt: 2 }}>
            {currentUser ? (
              <Button
                component={Link}
                to="/logout"
                fullWidth
                startIcon={<Logout />}
                sx={{
                  color: "white",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 3,
                  py: 1.5,
                  "&:hover": { background: "rgba(255,255,255,0.12)" },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                fullWidth
                startIcon={<Login />}
                sx={{
                  color: "white",
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 3,
                  py: 1.5,
                  "&:hover": { background: "rgba(255,255,255,0.16)" },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
