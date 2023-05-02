import { Brightness6, LogoutOutlined } from '@mui/icons-material'
import { AppBar, Button, Toolbar, IconButton, Grid, Typography, Menu, MenuItem } from '@mui/material';
import { getAuth } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { startLogout } from '../../store/auth/thunks';

// const pages = ['Home', 'Profile']
// {count === 0 && (
//     // aqiu va el resultado
// )}

export const NavBar = ({}) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const pages= ['Home', 'Profile']
    

    const dispatch = useDispatch();
    const onLogout = () => {
        dispatch( startLogout() );
    }
    
    // if((user.email).substring(0,1).toUpperCase == "A" || (user.email).substring(0,1).toUpperCase == "L"){
    //     pages.push('Home')
    //     pages.push('Profile')
        
    // }
    // else if((user.email).substring(0,1).toUpperCase == "A"){
    //     pages.push('Gestion de Usuarios')
    //     pages.push('Solicitudes')
    //     pages.push('Plan de Estudios')
    // }

    // console.log(pages)
    
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
                        <img src="/MindScript.svg"/>
                    </Grid>

                    <Grid item>
                        <Grid container justifyContent='flex-end'>
                            {pages.map((page) => 
                                <Grid item key={ page } sx={{  ml: 1 }}>
                                    <Button sx={{ color: 'appDark.text'}}>
                                        { page }
                                    </Button>
                                </Grid>
                            )}

                            <IconButton sx={{ color: 'appDark.icon', ml: 1 }}>
                                <Brightness6 />
                            </IconButton>

                            <IconButton onClick = {onLogout} sx={{ color: 'appDark.icon', ml: 1 }}>
                                <LogoutOutlined />
                            </IconButton>

                        </Grid>
                    </Grid>

                </Grid>
 
            </Toolbar>
        </AppBar>
    )
} 