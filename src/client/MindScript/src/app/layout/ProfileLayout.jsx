import { Grid, Typography, useTheme } from '@mui/material'
import { NavBar } from '../components'
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

export const ProfileLayout = ({ children, pages }) => {
    const theme = useTheme();
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;
    if (user !== null) {
        //Desestructuración de user
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
    }
    const { route } = pages.find(route => route.name === "Home");

    return (
        <Grid container justifyContent='center' alignItems='center' align='center' alignContent='center' spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />

            <Grid item>
                <img src="/MindScript.svg" width="480" />
            </Grid>

            <Grid item xs={12}>
                <Typography sx={{ color: 'appDark.text', fontSize: 50 }}>
                    ¡Bienvenido(a), {displayName}!
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography sx={{ color: 'appDark.text', fontSize: 20 }}>
                    Comienza a descubrir todo lo que el aprendizaje computacional tiene reservado para ti
                </Typography>
            </Grid>

            <Grid item xs={12} sx={{mt:2}}>
                <Link to={route} style={{color: theme.palette.appDark.text}} >
                    Comenzar
                </Link>
            </Grid>

        </Grid>
    )
}