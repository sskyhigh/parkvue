import { IconButton, InputAdornment, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import React, {useState} from 'react'

const PasswordField = ({passwordRef, id='password', label='Password', }) => {
    //new state = false means hidden
    const [showPassword, setShowPassword] = useState(false);

    const handleClick = () =>{ //toggle between false and true
        setShowPassword(!showPassword);
    };

    const handleMouseDown = (e) =>{ //focus stays on password field
        e.preventDefault()
    };

    return (
        //change properties to the user information
        <TextField
            autoFocus
            margin ='normal'
            variant = 'standard'
            id = {id}
            label ={label}
            type = {showPassword ? 'text' : 'password'}
            fullWidth
            inputRef = {passwordRef}
            inputProps = {{minLength: 6}}
            required
            InputProps = {{
                //icon to switch between text and password
                endAdornment: (
                    <InputAdornment position ='end'>
                        <IconButton onClick = {handleClick} onMouseDown = {handleMouseDown}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            />
    )
}

export default PasswordField