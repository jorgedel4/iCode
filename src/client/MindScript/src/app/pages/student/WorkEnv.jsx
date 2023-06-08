// --------------------------------------------------------------------
// ** file="WorkEnv.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import * as React from 'react';
import { Alert, Button, Grid, Typography, useTheme } from '@mui/material'
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import Editor from '@monaco-editor/react';

// MindScript Components
import ConfettiExplosion from 'react-confetti-explosion';
import { TestsTabs, Timer } from '../../components';


export const WorkEnv = () => {
    const location = useLocation();
    //esto puede venir de SHHomeworkCard, SMHomeworkCard, SModuleCard
    let questionParams = location.state?.questionParams;
    let homeworkParams = location.state?.homeworkParams; //hw data (id, name, group, etc)
    const assParams = location.state?.homeworkParams; //hw data (id, name, group, etc) //si es módulo trae id y group
    // const homeworkParams = location.state?.homeworkData; //hw data (id, name, group, course, etc)

    // console.log("assassement params", assParams)
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

    // const homeworkID = homeworkParams.hw_id;
    // const group = homeworkParams.group_id;
    let assid = "";
    let assgroup = "";

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
        // console.log("Matrícula ", schoolID)
    }

    //Feedback confetti
    const [isExploding, setIsExploding] = useState(false);
    
    
    if (assParams.hw_id && assParams.group_id) {
        assid = assParams.hw_id;
        assgroup = assParams.group_id;
    }
    //Esto es para modulo
    if (assParams.id && assParams.group) {
        assid = assParams.id;
        assgroup = assParams.group;
    }
    // -------------------- # API region --------------------------

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
                const response = await fetch(`${riddleAPI}studentprogress?student=${schoolID}&assignment=${assid}&group=${assgroup}`, options);
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
    const [showComponent, setShowComponent] = useState(false); //tests component

    //Objeto para codeExec
    const hwData = {
        code: content,
        id: questionParams.id_pregunta,
    }

    let nextQuestion;
    const onClickNextQuestion = async () => {
        console.log("click on next")
        if (fetchResponse.passed) {
            console.log("Valid next question")
            setShowComponent(false)
            setResponse([])
            setContent('#Type your question here')
            try {
                const question = await requestNextQuestion();
                nextQuestion = question;
                // console.log(nextQuestion);
            } catch (error) {
                console.error(error);
            }
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
        // const homeworkID = homeworkParams.hw_id;

        const fetchData = async () => {
            try {
                const response = await fetch(`${riddleAPI}questions?id_assigment=${assid}&id_student=${schoolID}`, options);
                const responseData = await response.json();
                return responseData;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        return fetchData();
    }

    //POST - to codeExec get testcases and register attempt
    const handleEditorDidMount = async () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            mode: 'no-cors',
            body: JSON.stringify({
                "question": questionid,
                "assignment": assid,
                "student": schoolID,
                "attempt_time": timerValue,
                "group": assgroup,
                "code": content,
            })
        }
        console.log(options.body)

        //for multi questions only
        // fetch(`${riddleAPI}submitAttempt/multi`, options)

        //for code questions only
        fetch(`${riddleAPI}submitAttempt/code`, options)
            .then(response => {
                // console.log(response)
                // setResetTimer(true);
                return response.json()
            })
            .then(json => {
                setResponse(json) //fetchResponse for code (error, showntests, hiddentests,shownPassed,shownFailed, passed)
                setShowComponent(true)
            })
            .catch(error => {
                console.log(error)
            })

    };

    // -------------------- ## End API region ------------------


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
                    {/* Question Description*/}
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
                            {nextQuestion && (
                                <Link
                                    to={{
                                        pathname: nextQuestion !== undefined && nextQuestion.type === 'codep' ? "/student/workenv" : nextQuestion !== undefined && nextQuestion.type === 'multi' ? "/student/multiopt" : ""
                                    }}
                                    state={{ questionParams: nextQuestion }}
                                    style={{ textDecoration: 'none', color: theme.palette.appDark.textBlack }}
                                >
                                    <Button onClick={async () => {
                                        // await onClickNextQuestion();
                                        console.log(nextQuestion);
                                    }}
                                        variant="contained" sx={{ backgroundColor: 'appDark.adminButton' }}>
                                        Siguiente Pregunta
                                    </Button>
                                </Link>
                            )}
                        </Grid>

                        <Grid item xs={12} md={6} align='center' sx={{ mb: 2 }}>

                            <Button onClick={() => { handleEditorDidMount(); printsec(); setIsExploding(true); }} variant="contained" sx={{ backgroundColor: 'appDark.button' }}>
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