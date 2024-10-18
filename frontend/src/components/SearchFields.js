import React from "react";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function SearchFields() {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'SearchFields' : undefined;

    return (
        <div className="SearchFields">
            <Button aria-describedby={id} variant="contained" onClick={handleClick} sx={{backgroundColor: '#f8f9fa', color: 'black', minWidth: '163px'}}>
                Search Options
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Typography sx={{p: 2}}>The content of the Popover.</Typography>
            </Popover>
        </div>
    );
}