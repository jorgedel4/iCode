// --------------------------------------------------------------------
// ** file="SProfile.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Grid, Typography, useTheme } from '@mui/material'
import Editor from '@monaco-editor/react';
import { getAuth } from "firebase/auth";

// MindScript Components
import { QuestionsDropdown, TestsTabs, Timer } from '../../components';

// ------------ ## End Imports region ------------

export const WorkEnv = ({ onPrueba }) => {

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
    let schoolID, email, displayName, emailVerified, uid, responseInfo;
    if (user !== null) {
        ({ email, displayName, emailVerified, uid } = user);
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Student work env user info", user)
        // console.log("Matrícula ", schoolID)
    }

    // ------------ # API region ------------

    //GET - Obtaining student's groups information
    const [homework, setHomework] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const homeworkID = "H0000000000000000001";

        const fetchData = async () => {
            try {
                const response = await fetch(`${riddleAPI}questions?id_assigment=${homeworkID}&id_student=${schoolID}`, options);
                const responseData = await response.json();
                setHomework(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    if (homework.info !== undefined) {
        responseInfo = JSON.parse(homework.info);
    }

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
        const homeworkID = "H0000000000000000001";

        const fetchData = async () => {
            try {
                const response = await fetch(`${riddleAPI}statusHomework?id_student=${schoolID}&id_homework=${homeworkID}`, options);
                const responseData = await response.json();
                setProgress(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, []);



    //POST - Request for obtaining new question
    const [content, setContent] = useState('');
    const [fetchResponse, setResponse] = useState([]);
    const [showComponent, setShowComponent] = useState(false);

    const requestNextQuestion = async () => {
        console.log("Next Question")
    }

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
        console.log(timerValue)
    }


    //Objeto para codeExec esto debe de ir mas arriba?
    const hwData = {
        code: content,
        id: homework.id_pregunta,
    }

    return (
        <Grid container padding={3} justifyContent='center' alignContent='center' spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main', color: 'appDark.text' }}>
            <Grid item xs={4}>
                <Grid container px={2} justifyContent='start' sx={{ bgcolor: 'secondary.main', color: 'appDark.text', height: '90vh' }}>
                    {/* Hw Description*/}
                    <Grid item xs={12}>
                        <Grid container py={2} alignItems='center'>
                            <Grid item xs={12} md={10}>
                                <Button href={'student/home'} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 16 }}>
                                    {'< Regresar'}
                                </Button>
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
                                {responseInfo !== undefined && (
                                    responseInfo.description
                                )}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container alignItems='flex-end'>
                        <Grid item xs={12} md={6} align='center' sx={{ mb: 2 }}>
                            <Button onClick={requestNextQuestion} variant="contained" sx={{ backgroundColor: 'appDark.adminButton' }}>
                                Siguiente Pregunta
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={6} align='center' sx={{ mb: 2 }}>
                            <Button onClick={() => { handleEditorDidMount(); printsec(); }} variant="contained" sx={{ backgroundColor: 'appDark.button' }}>
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
                                <Typography sx={{ color: 'appDark.text' }}>{progress.progress}/{progress.total}</Typography>
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