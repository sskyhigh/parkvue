import { Logout, Settings } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useValue } from '../../context/ContextProvider';

//items related to menu; appear
const UserMenu = ({ anchorUserMenu, setAnchorUserMenu }) => {
    const { dispatch } = useValue()
    const handleCloseUserMenu = () => {
        //not menu option (open = false)
        setAnchorUserMenu(null);
    };

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
            <MenuItem>
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