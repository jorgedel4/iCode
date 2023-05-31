import { Grid, Button, Typography } from '@mui/material'
import { NavBar, QuestionsDropdown, OptionButton } from '../../components'
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const MultiOpt = () => {
    const location = useLocation();
    const data = location.state?.data;
    const questionParams = location.state?.questionParams;
    const questionInfo = JSON.parse(questionParams.info);
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;

    if (user !== null) {
        // console.log("Student work env user info", user)
        //Desestructuración de user
        ({ email, displayName, emailVerified, uid } = user);
        //Matrícula A00000000
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Matrícula ", schoolID)
    }


    const group = 'TC1028 (Gpo. 404)'
    const module = 'Variables'
    const qNumber = 'Pregunta #'

    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

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
                        <Typography align='justify' sx={{ color: 'appDark.text', fontSize: 20 }}>
                            {questionInfo !== undefined && (
                                questionInfo.question
                            )}
                        </Typography>
                    </Grid>

                    {/* Container with the options */}
                    <Grid container direction='row' justifyContent="center">
                        {questionInfo !== undefined && questionInfo.options && questionInfo.options.length > 0 && (
                            questionInfo.options.map((option, index) => (
                                <OptionButton key={index} option={option} />
                            ))
                        )}
                    </Grid>

                    {/* Buttons section */}
                    <Grid container direction='row'>
                        <Grid item xs={12} align='right' >
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