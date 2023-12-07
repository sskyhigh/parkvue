import React, {useState} from 'react';
import {Box, Button, Container, Stack, Step, StepButton, Stepper} from "@mui/material";
import AddLocation from "./addLocation/AddLocation";
import AddDetails from "./addDetails/AddDetails";
import AddImages from "./addImages/AddImages";

const AddRoom = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [steps, setSteps] = useState([
        {label: 'Location', completed: true},
        {label: 'Details', completed: false},
        {label: 'Images', completed: false}
    ])

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep => activeStep + 1);
        } else {
            const stepIndex = notFinished();
            setActiveStep(stepIndex);
        }
    }
    const checkDisabled = () => {
        if (activeStep < steps.length - 1) return false;
        const index = notFinished();
        return index === -1;
    }
    const notFinished = () => {
        return steps.findIndex(step => !step.completed)
    }
    return (
        <div>
            <Container sx={{my: 4}}>
                <Stepper
                    alternativeLabel
                    nonLinear
                    activeStep={activeStep}
                    sx={{mb: 3}}
                >
                    {steps.map((step, index) => (
                        <Step key={step.label} completed={step.completed}>
                            <StepButton onClick={() => setActiveStep}>
                                {step.label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>

                <Box>
                    {{
                        0:<AddLocation />,
                        1:<AddDetails />,
                        2:<AddImages />
                    }[activeStep]}
                </Box>

                <Stack
                    direction='row'
                    sx={{pt: 2, pb: 7, justifyContent: 'space-around'}}
                >
                    <Button
                        color="inherit"
                        disabled={!activeStep}
                        onClick={() => setActiveStep(activeStep => activeStep - 1)}
                    >
                        Back
                    </Button>
                    <Button
                        disabled={checkDisabled()}
                        onClick={handleNext}
                    >
                        Next
                    </Button>
                </Stack>
            </Container>
        </div>
    );
};

export default AddRoom;