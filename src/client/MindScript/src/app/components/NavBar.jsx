import { Brightness6, LogoutOutlined } from '@mui/icons-material'
import { AppBar, Button, Toolbar, IconButton, Grid, Typography, Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { startLogout } from '../../store/auth';

// const pages = ['Home', 'Profile']
const pages = ['Gestion de Usuarios', 'Solicitudes', 'Plan de Estudios']

export const NavBar = ({ drawerWidth = 240 }) => {

    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(startLogout());
    }

    return (
        <AppBar
            position='fixed'
            sx={{
                // ml: { sm: `${ drawerWidth }px` },
                boxShadow: 'none'
            }}
        >
            <Toolbar>
                <Grid container
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    spacing={2}
                >

                    <Grid item sx={{ mt: 1 }}>
                        <img src="/MindScript.svg" />
                    </Grid>

                    <Grid item>
                        <Grid container justifyContent='flex-end'>
                            {pages.map((page) =>
                                <Grid item key={page} sx={{ ml: 1 }}>
                                    <Button sx={{ color: 'appDark.text' }}>
                                        {page}
                                    </Button>
                                </Grid>
                            )}

                            <IconButton sx={{ color: 'appDark.icon', ml: 1 }}>
                                <Brightness6 />
                            </IconButton>

                            <IconButton onClick={onLogout} sx={{ color: 'appDark.icon', ml: 1 }}>
                                <LogoutOutlined />
                            </IconButton>

                        </Grid>
                    </Grid>

                </Grid>

            </Toolbar>
        </AppBar>
    )
} 