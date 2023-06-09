// --------------------------------------------------------------------
// ** file="MultiOpt.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region ------------

// Core components from MUI
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography, useTheme } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar, OptionButton } from "../../components";
import { Link } from 'react-router-dom';
import { async } from "@firebase/util";

// MindScript Components
import { TestsTabs, Timer } from '../../components';


export const MultiOpt = () => {
    const theme = useTheme();
    const [componentKey, setComponentKey] = useState(0);
    const handleNewQuestion = () => {
        // Increment the key value to force a rerender of the component
        setComponentKey(prevKey => prevKey + 1);
    };
    //que necesitamos aqui? si es para tarea necesitamos la tarea y el grupo
    //si es para módulo el id del modulo y el grupo
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;

    const location = useLocation();
    const questionParams = location.state?.questionParams; //objeto: id_pregunta,info, type 
    const assParams = location.state?.homeworkParams; //moduledata (id, group)

    // console.log("assParams", assParams)
    const questionInfo = JSON.parse(questionParams.info); //options, question, n_options, explanation, correct option, options
    const questionDescription = questionInfo.question //primera descripción
    let questionId = questionParams.id_pregunta;

    //Estados para cambiar la descripción
    const [questionid, setQuestionId] = useState(`${questionId}`);
    const [questiondes, setQuestionDes] = useState(questionDescription); //para manejar las descripciones de las siguientes preguntas
    const [fetchResponse, setResponse] = useState([]);
    const [fetchAttemptResponse, setAttemptResponse] = useState([]); //explanation y si paso o no

    //Timer States
    const [timerValue, setTimerValue] = useState(0);
    const [resetTimer, setResetTimer] = useState(false);

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

    let assid;
    let assgroup;
    let asscourse;

    //Esto es para tarea
    if (assParams.hw_id && assParams.group_id && assParams.course_id) {
        assid = assParams.hw_id;
        assgroup = assParams.group_id;
        asscourse = assParams.course_id;

    }
    //Esto es para modulo
    if (assParams.id && assParams.group) {
        assid = assParams.id;
        assgroup = assParams.group;
        asscourse = assParams.course;
    }

    //Estado y funcion para guardar las opciones seleccionadas
    const [results, setResult] = useState([]);

    const changeSelected = (value, selected) => {
        if (selected) {
            results.push(value);
        } else {
            const index = results.indexOf(value);
            results.splice(index, 1);
        }
    }

    //Estados y funciones necesarias para el dialogo con retro
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // ------------ # API region ------------

    //GET - Obtaining student's homework progress
    const [progress, setProgress] = useState([]);
    useEffect(() => {
        setResult([]); //Aqui se inicializa el valir de results para que no se inicialice simpre que se renderiza la pagina

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
    }, []);
    // console.log("progress",progress)


    // const group = homeworkParams.group_id
    const module = questionInfo.module //esto no se puede porque no existe
    const qNumber = "Pregunta #" + progress.answered

    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

    //GET next question information
    const onClickNextQuestion = async () => {
        console.log("Next Question loading")
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        //mas adeltnte aqui debe de ir un if para ver si es una tarea o un módulo 
        fetch(`${riddleAPI}questions?id_assigment=${assid}&id_student=${schoolID}&id_group=${assgroup}`, options)
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                setResponse(responseData);
                setQuestionDes(JSON.parse(responseData.info).description)
                console.log("requestNextQuestion", responseData)
            })
            .catch(error => {
                console.log(error);
            })
    }
    // console.log("response data", fetchResponse) //id_pregunta, info and type

    //POST - to codeExec get testcases and register attempt
    const submitAttemp = async () => {
        // console.log(assid, assgroup, schoolID)

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            mode: 'no-cors',

            body: JSON.stringify({

                "question": questionId,
                "assignment": assid,
                "student": schoolID,
                "attempt_time": timerValue,
                "group": assgroup,
                "answers": results

            })
        }

        // console.log("body", options.body)

        fetch(`${riddleAPI}submitAttempt/multipleChoice`, options)
            .then(response => {
                // setResetTimer(true);
                return response.json()
            })
            .then(json => {
                setAttemptResponse(json) //fetchResponse for code (passed, explanation)
            })
            .catch(error => {
                console.log(error)
            })

    };
    // console.log("fetchAttemptResponse", fetchAttemptResponse)

    const handleSubmission = async () => {
        await submitAttemp();
        // console.log("respuesta", fetchAttemptResponse) //se bora

    }
    useEffect(() => {
        if (fetchAttemptResponse.passed) {
            console.log("fetchAttemptResponse handle", fetchAttemptResponse)
            onClickNextQuestion()
            setOpen(true)
        }

    }, [fetchAttemptResponse]);
    
    if (progress.answered !== undefined && progress.needed !== undefined) {
        if(progress.answered === progress.needed - 1 && fetchAttemptResponse.passed){
            window.location.href = `/student/modules/${assgroup}/${asscourse}`
        }
    }
    // ------------ # End API region ------------
    // console.log(progress.answered, progress.needed)

    return (
        <Grid container direction='column' padding={5} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />

            {/* Button to return to modules */}
            <Grid item xs={12} sx={{ mt: 4, height: '24px' }}>
                <Button href={`/student/modules/${assgroup}/${asscourse}`} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 14 }}>
                    {'< Regresar a ' + assgroup}
                </Button>
            </Grid>

            <Grid container direction='row'>
                {/* Tal vez aqui se pone el progreso */}
                <Grid item xs={6}>
                    <Typography fontWeight={900} fontSize={18} sx={{ color: 'appDark.text' }}>
                        Módulo: {module} {/* esto no se puede porque no existe */}
                    </Typography>
                </Grid>

                <Grid item xs={6} align='right' sx={{ color: 'appDark.text' }}>
                    <Timer setTimerValue={setTimerValue} resetTimer={resetTimer} setResetTimer={setResetTimer} />
                </Grid>
            </Grid>

            {/* Inside card */}
            <Grid item xs={12} sx={{ mt: 2, bgcolor: 'secondary.main', borderRadius: 1 }}>
                <Grid sx={{ mt: 2, ml: 2 }}>
                    <Typography sx={{ color: 'appDark.text' }}>{progress.answered}/{progress.needed}</Typography>
                </Grid>
                <Grid container padding={4} direction="column" justifyContent="center" alignItems="center">
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
                                <OptionButton key={index} option={option} changeSelected={changeSelected} />
                            ))
                        )}
                    </Grid>

                    {/* Buttons section */}
                    <Grid container direction='row'>
                        <Grid item xs={12} align='right' sx={{ mt: 5 }} >

                            <Button
                                onClick={() => { handleSubmission(); }}
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

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: { bgcolor: 'primary.main', color: 'appDark.text' }
                }}
            >
                <DialogTitle align='center'>
                    {fetchAttemptResponse.passed ? "Correcto" : "Incorrecto"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{ color: 'appDark.text' }}
                    >
                        {fetchAttemptResponse.passed ? fetchAttemptResponse.explanation : null}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {fetchAttemptResponse.passed ?
                        // console.log("passed?", fetchResponse) &&

                        fetchResponse != undefined && fetchResponse != null
                            ? < Link
                                to={{
                                    pathname: fetchResponse.type === 'codep' ? "/student/workenv" : fetchResponse.type === 'multi' ? "/student/multiopt" : ""
                                }}
                                key={componentKey}
                                state={{ questionParams: fetchResponse, homeworkParams: assParams }}
                                style={{ textDecoration: 'none', color: theme.palette.appDark.textBlack }}
                            >
                                <Button autoFocus onClick={handleNewQuestion} sx={{ color: 'success.main' }}>
                                    {"Siguiente Pregunta"}
                                </Button>
                            </Link>
                            : null
                        :
                        <Button onClick={handleClose} autoFocus sx={{ color: 'error.main' }}>
                            Volver a Intentar
                        </Button>
                    }
                </DialogActions>
            </Dialog>

        </Grid >
    )
}