import {Mail, Notifications} from '@mui/icons-material';
import {Avatar, Badge, Box, IconButton, Tooltip} from '@mui/material';
import React, {useState} from 'react';
import {useValue} from '../../context/ContextProvider';
// import useCheckToken from '../../hooks/useCheckToken';
import UserMenu from './UserMenu';

const UserIcons = () => {
    // useCheckToken();
    const {
        state: {currentUser}
    } = useValue();
    const [anchorUserMenu, setAnchorUserMenu] = useState(null);
    return (
        <Box>
            <IconButton size="large" color="inherit">
                {/*Badge: error to be read as a notification; content {5 messages}*/}
                <Badge color="error" badgeContent={5}>
                    {/*Icon*/}
                    <Mail/>
                </Badge>
            </IconButton>

            <IconButton size="large" color="inherit">
                {/*Badge: error to be read as a notification; content {20 request}*/}
                <Badge color="error" badgeContent={20}>
                    {/*Icon*/}
                    <Notifications/>
                </Badge>
            </IconButton>

            <Tooltip title="Open User Settings">
                {/*Icon*/}
                <IconButton onClick={(e) => setAnchorUserMenu(e.currentTarget)}>
                    {/*Avatar = current elements attach in button menu*/}
                    {/*Question not to trigger*/}
                    <Avatar src={currentUser?.photoURL} alt={currentUser?.name}>
                        {/*charAt function: If no photo url attached then will display the users first name initial extracted by char at*/}
                        {currentUser?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                </IconButton>
            </Tooltip>
            {/*User menu components*/}
            <UserMenu {...{anchorUserMenu, setAnchorUserMenu}} />
        </Box>
    );
};

export default UserIcons;