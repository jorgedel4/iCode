// --------------------------------------------------------------------
// ** file="MultiOpt.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region ------------

// Core components from MUI
import { Button, Grid, Typography, useTheme } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar, OptionButton } from "../../components";
import { Link } from 'react-router-dom';
import { async } from "@firebase/util";


export const MultiOpt = () => {
    const theme = useTheme();
    //que necesitamos aqui? si es para tarea necesitamos la tarea y el grupo
    //si es para módulo el nombre del 
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;

    const location = useLocation();
    const questionParams = location.state?.questionParams; //objeto: id_pregunta,info, type 
    const homeworkParams = location.state?.homeworkData; //hw data (id, name, group, etc)
    const questionInfo = JSON.parse(questionParams.info); //options, question, n_options, explanation, correct option, options

    // console.log("questionInfo", questionInfo)
    const questionDescription = questionInfo.question //primera descripción
    let questionId = questionParams.id_pregunta;

    //Estados para cambiar la descripción
    const [questionid, setQuestionId] = useState(`${questionId}`);
    const [questiondes, setQuestionDes] = useState(questionDescription); //para manejar las descripciones de las siguientes preguntas
    const [fetchResponse, setResponse] = useState([]);


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

    let group = "";
    let homeworkID = "";
    if (homeworkParams.hw_id != undefined && homeworkParams.group_id != undefined) {
        group = homeworkParams.group_id
        homeworkID = homeworkParams.hw_id;
    }

    // ------------ # API region ------------

    //GET - Obtaining student's homework progress
    const [progress, setProgress] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            try {
                // const response = await fetch(`${riddleAPI}statusHomework?id_student=${schoolID}&id_homework=${homeworkID}`, options);
                const response = await fetch(`${riddleAPI}studentprogress?student=${schoolID}&assignment=${homeworkID}&group=${group}`, options);
                const responseData = await response.json();
                setProgress(responseData);
                // console.log(progress)
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, [progress]); //porque esta aqui?



    // const group = homeworkParams.group_id
    const module = questionInfo.module
    const qNumber = "Pregunta #"+progress.answered

    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

    const onClickNextQuestion = async () => {
        console.log("Next Question loading")
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            try {
                //mas adeltnte aqui debe de ir un if para ver si es una tarea o un módulo 
                const response = await fetch(`${riddleAPI}questions?id_assigment=${homeworkID}&id_student=${schoolID}`, options);
                const responseData = await response.json();

                //changing question description
                console.log(responseData) //id_pregunta, info and type
                setResponse(responseData)

                // setQuestionId(responseData.id_pregunta)
                // setQuestionDes(JSON.parse(responseData.info).description)

                console.log("requestNextQuestion", responseData)
            } catch (error) {
                console.error(error);
            }
        };


        fetchData();
    }

    const handleSubmission = async () => {
        // if(passed){
        onClickNextQuestion()
        // }else{
        //     console.log("show explanation??")
        // }

    }

    // ------------ # End API region ------------



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
                Módulo: { module}
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
                                questiondes + " " + questionid
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
                                onClick={() => { handleSubmission(); }}
                                sx={{
                                    color: 'appDark.text',
                                    bgcolor: 'appDark.button',
                                    fontWeight: 900,
                                    ':hover': { backgroundColor: 'appDark.button', opacity: 0.7 }
                                }}>
                                {/* {fetchResponse != undefined && fetchResponse != null
                                    ? < Link
                                        to={{
                                            pathname: fetchResponse.type === 'codep' ? "/student/workenv" : fetchResponse.type === 'multi' ? "/student/multiopt" : ""
                                        }}
                                        state={{ questionParams: fetchResponse, homeworkData: homeworkParams }}
                                        style={{ textDecoration: 'none', color: theme.palette.appDark.textBlack }}
                                    />
                                    : null
                                } */}
                                {'Entregar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    )
}