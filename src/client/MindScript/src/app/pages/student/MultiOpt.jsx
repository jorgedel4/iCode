// --------------------------------------------------------------------
// ** file="MultiOpt.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region ------------

// Core components from MUI
import { Button, Grid, Typography } from "@mui/material";
import { getAuth } from "firebase/auth";

// MindScript Components
import { NavBar, OptionButton, QuestionsDropdown } from '../../components';

// ------------ ## End Imports region ------------


export const MultiOpt = () => {

    // Initial States and Variables 
    const batmanAPI = import.meta.env.VITE_APP_BATMAN;
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

    //Current user data
    const auth = getAuth();
    const user = auth.currentUser;
    const schoolID = (user.email).substring(0, 9);
    if (user !== null) {
        // Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        // console.log("Student home user info", user)
        // console.log("Matrícula ", schoolID)
    }


    // ------------ # API region ------------

    const group = 'TC1028 (Gpo. 404)'
    const module = 'Variables'
    const qNumber = 'Pregunta #'
    const qContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

    const questions = [
        'Pregunta 1',
        'Pregunta 2',
        'Pregunta 3',
        'Pregunta 4',
        'Pregunta 5',
        'Pregunta 6',
        'Pregunta 7',
        'Pregunta 8',
        'Pregunta 9',
        'Pregunta #',
    ];

    const options = [
        'ABCDxggedfds',
        'abcddvfbggb',
        'AbCdfvfvdvdv',
        'aBcDffgfffv'
    ]

    // ------------ ## End API region -------

    // ------- # Functions and Events region -------
    // ---- ## End Functions and Events region -----

    return (
        <Grid container direction='column' padding={5} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />

            {/* Button to return to modules */}
            <Grid item xs={12} sx={{ mt: 4, height: '24px' }}>
                <Button sx={{ color: 'appDark.text', fontWeight: 900, fontSize: 16 }}>
                    {'<' + group}
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography fontWeight={900} fontSize={18} sx={{ color: 'appDark.text' }}>
                    {module}
                </Typography>
            </Grid>

            {/* Inside card */}
            <Grid item xs={12} sx={{ mt: 2, bgcolor: 'secondary.main', borderRadius: 1 }}>
                <Grid container padding={5} direction="column" justifyContent="center" alignItems="center">
                    {/* Question name */}
                    <Grid item xs={12} >
                        <Typography sx={{ color: 'appDark.text', fontWeight: 900, fontSize: 25 }}>{qNumber}</Typography>
                    </Grid>

                    {/* Question description */}
                    <Grid item xs={12} mt={5}>
                        <Typography align='justify' sx={{ color: 'appDark.text', fontSize: 20 }}>{qContent}</Typography>
                    </Grid>

                    {/* Container with the options */}
                    <Grid container direction='row' justifyContent="center">
                        {options.map((option, index) => (
                            <OptionButton key={index} option={option} />
                        ))}
                    </Grid>

                    {/* Buttons section */}
                    <Grid container direction='row'>
                        <Grid item xs={12} sm={8} md={9} lg={10} xl={11} mt={2} >
                            <QuestionsDropdown questions={questions} qName={'Pregunta #'} />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3} lg={2} xl={1} mt={2} align='right' >
                            <Button
                                sx={{
                                    color: 'appDark.text',
                                    bgcolor: 'appDark.button',
                                    fontWeight: 900,
                                    ':hover': { backgroundColor: 'appDark.button', opacity: 0.7 }
                                }}>
                                {'Entregar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}