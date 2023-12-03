
import {useValue} from '../../context/ContextProvider' //import user value
import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField, IconButton } from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import "../NavBar/NavBar.css";
import PasswordField from './PasswordField';
import { useEffect, useRef, useState } from 'react';
import GoogleOneTapLogin from './GoogleOneTapLogin';
// import { login, register } from '../../actions/user';



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
        // testing loading; set to be true
        dispatch({ type: 'START_LOADING' });

        //used inside a timer; set to be false
        setTimeout(() => {
            dispatch({ type: 'END_LOADING' });
        }, 6000); //simulate loading for 6 sec.

        //testing Notification
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        if (password !== confirmPassword) {
            dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                    open: true,
                    severity: 'error',
                    message: 'Passwords do not match',
                },
            });
        }
    };
    //change the title depending on user state when clicking on button to register
    useEffect(() => {
        isRegister ? setTitle('Register') : setTitle( 'Login');
    }, [isRegister]);

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
                        color: (theme) => theme.palette.grey[500],
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
                    {isRegister && (
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
                        )}
                        {/*email*/}
                        <TextField
                        autoFocus = {!isRegister} //outer focus on the name
                        margin="normal"
                        variant="standard"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        inputRef={emailRef}
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
                <DialogActions sx={{ px: '19px' }}>
                    <Button type="submit" variant="contained" endIcon={<Send />}>
                        Submit
                    </Button>
                </DialogActions>
            </form>
        {/*  toggle state between login and reducer */}
            <DialogActions sx={{justifyContent: 'left', p: '5px 24px'}}>
                {isRegister
                    ? 'Do you have an account? Sign in now'
                    : "Don't have an account? Create one now"
                }
                <Button onClick={() => setIsRegister(!isRegister)}>
                    {/* text of button is dependent on the state of register; True = Login && False = Register */}
                    {isRegister ? 'Login' : 'Register'}
                </Button>
            </DialogActions>

            {/* Google one click login */}
            <DialogActions sx={{ justifyContent: 'center', py:'24px' }}>
                <GoogleOneTapLogin />
            </DialogActions>
        </Dialog>
    );
};

export default Login;