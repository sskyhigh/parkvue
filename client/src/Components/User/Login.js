
import {useValue} from '../../context/ContextProvider' //import user value
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, IconButton } from '@mui/material';
import { useState} from 'react'
import { Close } from '@mui/icons-material'
import "../NavBar/NavBar.css"


const Login = () => {
    //import variable states
    const {state:{openLogin}, dispatch} = useValue()
    //title = state (using same model for both) to toggle between register & login
    const [title, setTitle] = useState('Login') //default value is login
    const [isRegister, setIsRegister] = useState(false) //control all the state of model
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()



//action to close the login
    const handleClose = () => {
        dispatch({type: 'CLOSE_LOGIN' })
    }

    const handleSubmit = (e) => (
        e.preventDefault()
    )

    return (
        <Dialog {/*  update variable to close  */}
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
                            margin = 'normal'
                            variant = 'standard'
                            id = 'name'
                            label = 'Name'
                            type = 'text'
                            fullWidth
                            inputRef ={nameRef}
                            inputProps = {{minLength: 2}}
                            required
                        />
                        }
                        {/*email*/}
                        <TextField
                        autoFocus = {!isRegister}
                        margin = 'normal'
                        variant = 'standard'
                        id = 'email'
                        label = 'Email'
                        type = 'email'
                        fullWidth
                        inputRef ={nameRef}
                        required
                        />
                    {/*<Button type="submit" variant="contained" color="primary">*/}
                    {/*    Submit*/}
                    {/*</Button>*/}
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default Login