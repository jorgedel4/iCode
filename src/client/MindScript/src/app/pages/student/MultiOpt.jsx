// --------------------------------------------------------------------
// ** file="MultiOpt.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region ------------

// Core components from MUI
import { Button, Grid, Typography } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar, OptionButton } from "../../components";

export const MultiOpt = () => {
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;

    const location = useLocation();
    const questionParams = location.state?.questionParams;
    const homeworkParams = location.state?.homeworkData; //hw data (id, name, group, etc)
    console.log(homeworkParams)
    const questionInfo = JSON.parse(questionParams.info);

    const questionDescription = questionInfo.description //primera descripción
    let questionId = questionParams.id_pregunta;

    //Estados para cambiar la descripción
    const [questionid, setQuestionId] = useState(`${questionId}`);
    const [questiondes, setQuestionDes] = useState(`${questionDescription}`); //para manejar las descripciones de las siguientes preguntas


    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;

    if (user !== null) {
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Student work env user info", user)
        // console.log("Matrícula ", schoolID)
    }


    // ------------ # API region ------------
    
    const group = "G000001"
    if(homeworkParams.hw_id != undefined && homeworkParams.group_id != undefined){
        const homeworkID = homeworkParams.hw_id;
        const group = "G000001";
    }
    // const group = homeworkParams.group_id
    const module = 'Variables'
    const qNumber = 'Pregunta #'

    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]


    return (
        <Grid container direction='column' padding={5} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />

            {/* Button to return to modules */}
            <Grid item xs={12} sx={{ mt: 4, height: '24px' }}>
                <Button href={'student/home'} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 14 }}>
                    {'< Regresar a ' + group}
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