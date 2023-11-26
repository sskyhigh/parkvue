
import {useValue} from '../../context/ContextProvider' //import user value
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField, IconButton } from '@mui/material';
import { useState, useRef } from 'react'
import { Close, Send } from '@mui/icons-material'
import "../NavBar/NavBar.css"
import PasswordField from './PasswordField'


const Login = () => {
    //import variable states
    const {
        state:{ openLogin },
        dispatch,
    } = useValue();
    //title = state (using same model for both) to toggle between register & login
    const [title, setTitle] = useState('Login'); //default value is login
    const [isRegister, setIsRegister] = useState(false); //control all the state of model
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();



//action to close the login
    const handleClose = () => {
        dispatch({ type: 'CLOSE_LOGIN' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        //update variable to close
        <Dialog
                open = {openLogin}
                onClose = {handleClose}
            >
            <DialogTitle>
                {title}
                {/*use to close model when clicked on icon*/}
                <IconButton
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                    onClick = {handleClose}
                    >
                    <Close />
                </IconButton>
            </DialogTitle>
        {/* Add fields */}
            <form onSubmit = {handleSubmit}>
                <DialogContent dividers>
                    {/*message for user & divider :  content/title section/ and actions*/}
                    <DialogContentText>
                        Please fill in your information in the fields below:
                    </DialogContentText>
                    {isRegister &&
                        <TextField
                            autoFocus
                            margin="normal"
                            variant="standard"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            inputRef={nameRef}
                            inputProps={{minLength: 2}}
                            required
                        />
                        }
                        {/*email*/}
                        <TextField
                        autoFocus = {!isRegister}
                        margin="normal"
                        variant="standard"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        inputRef={nameRef}
                        required
                        />
                    <PasswordField {...{ passwordRef }} />
                    {isRegister && (
                        <PasswordField
                            passwordRef = {confirmPasswordRef}
                            id="confirmPassword"
                            label="ConfirmPassword"
                        />
                        )}
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" endIcon={<Send />}>
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default Login;