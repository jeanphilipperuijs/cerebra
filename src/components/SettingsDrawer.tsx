import React, { useState } from 'react';
import {
    Drawer,
    IconButton,
    Box,
    AppBar,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { SettingsPanel } from './SettingsPanel';

const SettingsDrawer: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Hamburger button in AppBar */}
            <AppBar position="fixed" sx={{ top: 0, right: 0, left: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Toolbar sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setOpen(true)}
                        aria-label="open settings"
                        sx={{ color: 'text.primary' }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 360, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Settings</Typography>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <SettingsPanel forceOpen />
                </Box>
            </Drawer>
        </>
    );
};

export default SettingsDrawer;
