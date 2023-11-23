import { Logout, Settings } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useValue } from '../context/ContextProvider';

//Associating which items are related to the menu; elements that appear
const UserMenu = ({ anchorUserMenu, setAnchorUserMenu }) => {
    const { dispatch } = useValue();
    //function
    const handleCloseUserMenu = () => {
        //set the anchor user to menu: if no element related to menu then open receive a false
        setAnchorUserMenu(null);
    };

    return (
        <Menu
            //anchor EL means anchor element is related to element to trigger display
            anchorEl={anchorUserMenu}
            //Boolean parameter: changes element into a boolean if it exist = True or Null = False
            open={Boolean(anchorUserMenu)}
            //Trigger if you click outside the menu
            onClose={handleCloseUserMenu}
            //Trigger action when any item in menu is clicked
            onClick={handleCloseUserMenu}
        >
            {/*Menu items displayed*/}
            <MenuItem>
                {/*inside the icon*/}
                <ListItemIcon>
                    {/*settings for profile*/}
                    <Settings fontSize="small" />
                </ListItemIcon>
                Profile
            </MenuItem>

            {/*same update but pass the null value as payload to change the state to represent user*/}
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