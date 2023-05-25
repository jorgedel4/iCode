import { Box } from '@mui/material';
import { Grid, Typography, Toolbar, List } from '@mui/material'
import { NavBar, HomeworkBoard, SHHomeworkCard, PHHomeworkCard } from '../components'
import { getAuth } from "firebase/auth";

export const ProfileLayout = ({ children, pages }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;
    if (user !== null) {
        //Desestructuración de user
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
    }

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

        </Grid>
    )
}