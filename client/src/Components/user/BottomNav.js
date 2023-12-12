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

const BottomNav = () => {
  const [value, setValue] = useState(0);
  const ref = useRef();
  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [value]);
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
          <BottomNavigationAction label="Space" icon={<Bed />} />
          <BottomNavigationAction label="Upload" icon={<AddLocationAlt />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNav;
