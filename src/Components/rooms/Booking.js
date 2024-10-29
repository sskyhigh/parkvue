import React, { useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import { useValue, Context } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import NotFound from "../../NotFound/NotFound";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
} from "@mui/material";

const Booking = () => {
  const { dispatch } = useValue();
  const { currentUser } = useContext(Context);
  const { state } = useLocation();
  const { roomId } = useParams();
  const room = state?.room;
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const navigate = useNavigate();

  const handleBookNow = async () => {
    try {
      // Step 1: Add a new reservation to the "reservations" collection
      const reservationRef = collection(db, "reservations");
        await addDoc(reservationRef, {
          reserverId: currentUser.uid,
          roomId: room.id,
          paymentMethod,
          reservedAt: serverTimestamp(),
        });

      // Step 2: Update the room's availability in the "rooms" collection
      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, { available: false });
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Room reserved successfully!",
        },
      });
    navigate("/space/rooms");
    } catch (error) {
      console.error("Error booking room:", error);
    }
  };

  return (
    <>
    {room ? (
    <Box sx={{ padding: 1 }}>
      <Card>
        <CardMedia
          component="img"
          height="350"
          image={room?.images[0]}
          alt={room?.title}
        />
        <CardContent>
          <Typography variant="h6">{room?.title}</Typography>
          <Typography variant="body1">Price: ${room?.price}</Typography>
          <Typography variant="body2" color="text.secondary">
            Owner: {room?.ownerName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: {room?.lng}, {room?.lat}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description: {room?.description}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>
          Payment Method:
        </Typography>
        <FormControl component="fieldset" sx={{ mr: 2 }}>
          <RadioGroup
            aria-label="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            row // This ensures the radio button is displayed in a row layout
          >
            <FormControlLabel sx={{ ml: 1 }}
              value="cash"
              control={<Radio />}
              label="Cash"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleBookNow}
        sx={{ display: 'block', mx: 'auto', mt: 1 }} // Center the button
      >
        Book Now
      </Button>
    </Box>
  ) : <NotFound information={"parking space"}/> }
  </>
  );
};

export default Booking;
