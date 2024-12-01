import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { AddLocationAlt, Bed, LocationOn } from "@mui/icons-material";
import ClusterMap from "../map/ClusterMap";
import Rooms from "../rooms/Rooms";
import AddRoom from "../addRoom/AddRoom";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const [value, setValue] = useState(1);
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [value]);
  useEffect(() => {
    if (value === 1) navigate(`/upload/rooms`);
    if (value === 2) navigate(`/upload/upload`);
    if (value === 0) navigate(`/upload/map`);
  }, [value, navigate]);
  return (
    <Box ref={ref}>
      {
        {
          0: <ClusterMap />,
          1: <Rooms />,
          2: <AddRoom />,
        }[value]
      }
      <Paper
        elevation={3}
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2 }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
        >
          <BottomNavigationAction label="Map" icon={<LocationOn />} />
          <BottomNavigationAction label="Rooms" icon={<Bed />} />
          <BottomNavigationAction label="Upload " icon={<AddLocationAlt />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
