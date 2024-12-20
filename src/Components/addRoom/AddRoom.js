import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Step,
  StepButton,
  Stepper,
} from "@mui/material";
import ClusterMap from "../map/ClusterMap";
import AddDetails from "./addDetails/AddDetails";
import AddImages from "./addImages/AddImages";
import { useValue, Context } from "../../context/ContextProvider";
import { Send } from "@mui/icons-material";
import { db, doc, setDoc } from "../../firebase/config";
import { v4 as uuidv4 } from "uuid"; // For unique IDs
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const {
    state: { images, details, location },
    dispatch,
  } = useValue();
  const { currentUser } = useContext(Context);
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([
    { label: "Location", completed: false },
    { label: "Details", completed: false },
    { label: "Images", completed: false },
  ]);
  const [uploading, setUploading] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const checkStepCompletion = (index, condition) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[index].completed = condition;
      return updatedSteps;
    });
  };

  useEffect(() => {
    checkStepCompletion(0, !!location.lat && !!location.lng);
    checkStepCompletion(
      1,
      details.title.length > 4 && details.description.length > 9
    );
    checkStepCompletion(2, images.length > 0);
  }, [location, details, images]);

  useEffect(() => {
    setShowSubmit(steps.every((step) => step.completed));
  }, [steps]);

  const handleSubmit = async () => {
    if (!showSubmit) return;

    try {
      setUploading(true);
      dispatch({ type: "START_LOADING" });

      // Define uniqueRoomId for Firestore document
      const uniqueRoomId = uuidv4();

      // Define the room data
      const room = {
        id: uniqueRoomId,
        available: true,
        lng: location.lng,
        lat: location.lat,
        price: details.price,
        title: details.title,
        description: details.description,
        images: images,
        createdBy: currentUser.uid,
        ownerName: currentUser.fullName,
        createdAt: new Date().toISOString(), // Optional timestamp for sorting
      };

      // Save the room data in Firestore
      await setDoc(doc(db, "rooms", uniqueRoomId), room);

      // Dispatch success message if save is successful
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Room added successfully!",
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error:", error);

      // Dispatch error message if any step fails
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "error",
          message: currentUser.uid ? "Failed to add room" : "You have to be logged in to upload a room",
        },
      });
    } finally {
      setUploading(false);
      dispatch({ type: "END_LOADING" });
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={step.completed}>
            <StepButton onClick={() => setActiveStep(index)}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ pb: 7 }}>
        {
          {
            0: <ClusterMap />,
            1: <AddDetails />,
            2: <AddImages />,
          }[activeStep]
        }
        <Stack direction="row" sx={{ pt: 2, justifyContent: "space-around" }}>
          <Button color="inherit" disabled={!activeStep} onClick={handleBack}>
            Back
          </Button>
          <Button disabled={activeStep >= steps.length} onClick={handleNext}>
            Next
          </Button>
        </Stack>
        {showSubmit && (
          <Stack sx={{ alignItems: "center", mt: 2 }}>
            <Button
              variant="contained"
              endIcon={<Send />}
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default AddRoom;
