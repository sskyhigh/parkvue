import { Logout, Settings } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useValue } from '../../context/ContextProvider';

//items related to menu; appear
const UserMenu = ({ anchorUserMenu, setAnchorUserMenu }) => {
    const {
        dispatch,
        state: { currentUser },
    } = useValue();
    const handleCloseUserMenu = () => {
        //not menu option (open = false)
        setAnchorUserMenu(null);
    };

    const testAuthorization = async() =>{
        const url = process.env.REACT_APP_SERVER_URL + '/room'
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //pass token to server
                    authorization: 'Bearer ${currentUser.token}',
                },
            });
            const data = await response.json();
            console.log(data);
            if(!data.success){
                throw new Error(data.message);
            }
        } catch (error) {
            dispatch({type:'UPDATE_ALERT', payload: { open:true, severity:'error', message:error.message } })
            console.log(error);

        }
    }

    return (
        <Menu
            //trigger display
            anchorEl={anchorUserMenu}
            //exist = True or Null = False
            open={Boolean(anchorUserMenu)}
            //Trigger if you click outside the menu
            onClose={handleCloseUserMenu}
            //Trigger action when any item in menu is clicked
            onClick={handleCloseUserMenu}
        >
            {/*Menu items displayed*/}
            <MenuItem onClick={ testAuthorization}>
                {/*inside the icon*/}
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Profile
            </MenuItem>

            {/*State: (Null = payload) */}
            <MenuItem
                onClick={() => dispatch({ type: 'UPDATE_USER', payload: null })}
            >
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    );
};

export default UserMenu;