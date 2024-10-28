import React, { useEffect, useState } from "react";
import { collection, getDocs, db } from "../../firebase/config";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      const roomCollection = collection(db, "rooms");
      const roomSnapshot = await getDocs(roomCollection);
      const roomData = roomSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomData);
    };

    fetchRooms();
  }, []);

  // Open the dialog with room details
  const handleOpenDialog = (room) => {
    setSelectedRoom(room);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card onClick={() => handleOpenDialog(room)}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  image={room.images[0]} // Display the first image in the array
                  alt={room.title}
                />
                <CardContent>
                  <Typography variant="h6">{room.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${room.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {room.lng}, {room.lat}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for detailed room information */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {selectedRoom && (
          <>
            <DialogTitle>{selectedRoom.title}</DialogTitle>
            <DialogContent>
              <Box
                component="img"
                src={selectedRoom.images[0]}
                alt={selectedRoom.title}
                width="100%"
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Owner: {selectedRoom.ownerName}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Uploade Date: {selectedRoom.createdAt}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Description: {selectedRoom.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${selectedRoom.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {selectedRoom.lng}, {selectedRoom.lat}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
              <Button color="secondary" variant="contained">
                Book
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Rooms;
