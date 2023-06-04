// --------------------------------------------------------------------
// ** file="WorkEnv.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { Grid, Button, Typography, useTheme, Alert } from '@mui/material'
import * as React from 'react';
import { TestsTabs, Timer } from '../../components';
import { useState, useEffect, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { getAuth } from "firebase/auth";
import { useLocation } from 'react-router-dom';
import ConfettiExplosion from 'react-confetti-explosion';

export const WorkEnv = () => {
    const location = useLocation();
    let questionParams = location.state?.questionParams;
    const homeworkParams = location.state?.homeworkData; //hw data (id, name, group, etc)
    const questionInfo = JSON.parse(questionParams.info);

    const questionDescription = questionInfo.description //primera descripción
    let questionId = questionParams.id_pregunta;

    //Estados para cambiar la descripción
    const [questionid, setQuestionId] = useState(`${questionId}`);
    const [questiondes, setQuestionDes] = useState(`${questionDescription}`); //para manejar las descripciones de las siguientes preguntas


    // Initial States and Variables 
    const codeAPI = import.meta.env.VITE_APP_CODEEXEC;
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;
    const theme = useTheme();

    //Timer States
    const [timerValue, setTimerValue] = useState(0);
    const [resetTimer, setResetTimer] = useState(false);

    // Current user data
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;


    if (user !== null) {
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Student work env user info", user)
        // console.log("Matrícula ", schoolID)
    }

    //Feedback confetti
    const [isExploding, setIsExploding] = useState(false);


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
        if(homeworkParams.hw_id != undefined && homeworkParams.group_id != undefined){
            const homeworkID = homeworkParams.hw_id;
            const group = homeworkParams.group_id;
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



    //POST - Request for obtaining new question
    const [content, setContent] = useState('#Type your answer here');
    const [fetchResponse, setResponse] = useState([]);
    const [showComponent, setShowComponent] = useState(false);

    //Objeto para codeExec
    const hwData = {
        code: content,
        id: questionParams.id_pregunta,
    }

    const onClickNextQuestion = () => {
        console.log("click on next")
        if (fetchResponse.passed) {
            console.log("Valid next question")
            setShowComponent(false)
            setResponse([])
            setContent('#Type your question here')
            requestNextQuestion();
        }

    }

    //POST - Request for obtaining new question ------------
    const requestNextQuestion = async () => {
        console.log("Next Question loading")
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }
        const homeworkID = homeworkParams.hw_id;

        const fetchData = async () => {
            try {
                //mas adeltnte aqui debe de ir un if para ver si es una tarea o un módulo 
                const response = await fetch(`${riddleAPI}questions?id_assigment=${homeworkID}&id_student=${schoolID}`, options);
                const responseData = await response.json();

                //changing question description
                setQuestionId(responseData.id_pregunta)
                setQuestionDes(JSON.parse(responseData.info).description)

                console.log("requestNextQuestion", responseData)
            } catch (error) {
                console.error(error);
            }
        };


        fetchData();
    }

    //POST - to codeExec get testcases and 
    const handleEditorDidMount = async () => {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            mode: 'no-cors',
            body: JSON.stringify({
                // "id": "test/test/2",
                // "code": "def smallest(a, b):\n\treturn a if a < b else b"
                "id": hwData.id,
                "code": hwData.code
            })
        }

        fetch(`${codeAPI}exec`, options)
            .then(response => {
                // console.log(response)
                setResetTimer(true);
                return response.json()
            })
            .then(json => {
                setResponse(json)
                setShowComponent(true)
            })
            .catch(error => {
                console.log(error)
            })

    };
    const printsec = () => {
        console.log("completed in", timerValue)
    }



    return (

        <Grid container padding={3} justifyContent='center' alignContent='center' spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main', color: 'appDark.text' }}>
            {isExploding &&
                <ConfettiExplosion sx={{
                    align: "center",
                    force: 0.8,
                    duration: 3000,
                    particleCount: 80,
                    width: 1600,
                }} />
            }
            <Grid item xs={12}>
                <Button href={'student/home'} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 14 }}>
                    {'< Regresar'}
                </Button>
            </Grid>
            <Grid item xs={4}>
                <Grid container px={2} justifyContent='start' sx={{ bgcolor: 'secondary.main', color: 'appDark.text', height: '90vh' }}>
                    {/* Hw Description*/}
                    <Grid item xs={12}>
                        <Grid container py={2} alignItems='center'>
                            <Grid item xs={12} md={10}>
                                <Typography variant='h5' sx={{ color: 'appDark.text', fontWeight: 900, fontSize: 20 }}>
                                    Descripción
                                </Typography>
                            </Grid>
                            <Grid item align='right' xs={12} md={2}>
                                <Timer setTimerValue={setTimerValue} resetTimer={resetTimer} setResetTimer={setResetTimer} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} >
                            <Typography textAlign='justify' sx={{
                                overflowY: 'scroll',
                                height: '45vh',
                                "&::-webkit-scrollbar": {
                                    width: 5,
                                },
                                "&::-webkit-scrollbar-track": {
                                    backgroundColor: "secondary.main",
                                    borderRadius: 2,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "appDark.scrollBar",
                                    borderRadius: 2,
                                },
                            }}>
                                {questiondes && questiondes.length > 0 && (
                                    questiondes + "   " + questionid
                                )}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container alignItems='flex-end'>
                        <Grid item xs={12} md={6} align='center' sx={{ mb: 2 }}>
                            <Button onClick={onClickNextQuestion}
                                variant="contained" sx={{ backgroundColor: 'appDark.adminButton' }}>
                                Siguiente Pregunta
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={6} align='center' sx={{ mb: 2 }}>

                            <Button onClick={() => { handleEditorDidMount(); printsec(); setIsExploding(true) }} variant="contained" sx={{ backgroundColor: 'appDark.button' }}>
                                Submit
                            </Button>

                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

            <Grid item xs={8}>
                <Grid container px={1} justifyContent='end'>
                    {/* Code Editor */}
                    <Grid item xs={12}
                        sx={{ height: '50vh', bgcolor: 'secondary.main' }}>
                        <Editor
                            language='python'
                            theme="vs-dark"
                            value={content}
                            onChange={(value) => setContent(value)}
                        />
                    </Grid>
                    {/* Terminal*/}
                    <Grid item xs={12}
                        sx={{ height: '39vh', bgcolor: 'secondary.main', mt: '1vh', padding: '1.5vh' }}>
                        <Grid container alignItems='center' sx={{ height: '4vh' }}>
                            <Grid item xs={10}>
                                <Typography fontSize={20} sx={{ color: 'appDark.text' }}>Casos de Prueba</Typography>
                            </Grid>
                            <Grid item xs={2} align='right'>
                                <Typography sx={{ color: 'appDark.text' }}>{progress.answered}/{progress.needed}</Typography>
                            </Grid>

                        </Grid>
                        {/* Displaying TestCases */}
                        {showComponent && (
                            <TestsTabs tests={fetchResponse} />
                        )}


                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}