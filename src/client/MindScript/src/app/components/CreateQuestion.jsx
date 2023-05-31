import { Grid, InputLabel, useTheme, useMediaQuery, Modal, FormControlLabel, OutlinedInput, Button, IconButton, Typography, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { Add, Delete, LoopSharp } from '@mui/icons-material';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { UploadFile } from '@mui/icons-material'

import { AddTestCasesOC } from './';
import { AddTestCases } from './';
import { AddMultiQ } from './';


export const CreateQuestion = ({ open, close, schoolID }) => {
    

    const theme = useTheme();
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const containerWidth = isXLargeScreen ? '80vw' : isLargeScreen ? '90vw' : isMediumScreen ? '80vw' : '95vw';

    const batmanAPI = import.meta.env.VITE_APP_BATMAN;
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;
    //Prueba
    const checked = true;
    const tipo = 'codep'

    //Description
    const { qdescription, onInputChange } = useForm({
        qdescription: '',
    });

    //Selector de modulo
    const [qmodule, setQModule] = useState('');
    const handleQModuleSelection = (event) => {
        setQModule(event.target.value);
        // console.log(qmodule)
    };

    //Selector de tipo de pregunta 
    const [qtype, setQType] = useState('');
    const handleQTypeSelection = (event) => {
        setQType(event.target.value);
        console.log(qtype)
    };
    // setQType('multiQ'); // Se borra

    //Selector de curso 
    const [course, setCourse] = useState('');
    const handleCourseSelection = (event) => {
        setCourse(event.target.value);
    };

    //GET course information
    const [coursesData, setCourseRequest] = useState([]);
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
                const response = await fetch(`${batmanAPI}courses`, options);
                const responseData = await response.json();
                setCourseRequest(responseData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const questionTypes = ["codep", "multi"]
    const createQuestion = {
        qdescription: qdescription,
        module: "M0000000000000000001",
        q_type: qtype,
        info: "{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a sefunction that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}",
        created_by: schoolID

    }
    // console.log(schoolID)


    /*API region */
    //POST question request from JSON file




    // console.log(schoolID)


    /*API region */
    //POST question request from JSON file

    const requestAQuestion = async () => {
        console.log(qtype)

        if (qtype === "multi") {
            const multiq = [];
            const multiqC = [];

            multiQ.map((tc) => {
                multiq.push(tc.opcion)
            })

            cMultiQ.map((tc) => {
                multiq.push(tc.opcion)
                multiqC.push(tc.opcion)
            })

            console.log("todas", multiq)
            console.log("correctas", multiqC)
        } else {
            const hinputs = [];
            const houtputs = [];
            const sinputs = [];
            const soutputs = [];

            testCasesS.map((tc) => {
                sinputs.push(tc.input);
                soutputs.push(tc.output);
            })
            testCasesH.map((tc) => {
                hinputs.push(tc.input);
                houtputs.push(tc.output);
            })

            console.log("input visibles", sinputs)
            console.log("input oculto", hinputs)

            sinputs.map((I, index) => {
                const tmp = I.split("\n");
                // console.log("njkdnasd", tmp)
                sinputs[index] = tmp;
            })
            hinputs.map((I, index) => {
                const tmp = I.split("\n");
                hinputs[index] = tmp;
            })

            console.log("input visibles", sinputs)
            console.log("output visibles", soutputs)
            console.log("input oculto", hinputs)
            console.log("output oculto", houtputs)
        }

        // const options = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },

        //     mode: 'cors',
        //     body: JSON.stringify({
        //         "module": "M0000000000000000001",
        //         "q_type": createQuestion.q_type,
        //         "info": `{\"hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"${createQuestion.qdescription}\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"]}`,
        //         "created_by": createQuestion.created_by
        //     })


        // }
        // console.log(options)
        // fetch(`${riddleAPI}requestQuestion  `, options)
        //     .then(response => {
        //         if (response.status === 201) {
        //             close();
        //         }
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })
    };



    //GET modules information
    const [modulesData, setModule] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            if (course) {
                try {
                    const response = await fetch(`${batmanAPI}coursemodules/${course}`, options);
                    const responseData = await response.json();
                    setModule(responseData);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, [course]);

    let modules = [];
    modulesData.map((module) => (
        modules.push({
            id: module.id,
            name: module.name,
            n_questions: 0,
            checked: true,
            key: module.id
        })
    ))

    // //POST Create Homework



    // console.log("POST Register Homework", createHomework)

    /*end API region */


    /* Datos necesarios para la interfaz de los test cases */

    const [multiQ, setMultiQ] = useState([]);
    const [cMultiQ, setCMultiQ] = useState([]);
    const [testCasesS, setTestCaseS] = useState([]);
    const [testCasesH, setTestCaseH] = useState([]);
    // const [testCasesInput, setInput] = useState([]);

    useEffect(() => {
        if (open) {
            setTestCaseS([]);
            setTestCaseH([]);
            setCourse('');
            setMultiQ([]);
            setCMultiQ([]);
            setQType('');
            setQModule('');
        }
    }, [open]);

    /* Fin de test cases */

    /*File upload section */
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target.result;
            console.log(fileContent); // Do something with the file content
            console.log(JSON.stringify(fileContent))
        };
        // console.log(file)

        reader.readAsText(file);
    };

    const handleUpload = (TC_1, TC_2) => {
        const multiq = [];
        const multiqC = [];

        TC_1.map((tc) => {
            multiq.push(tc.opcion)
        })

        TC_2.map((tc) => {
            multiq.push(tc.opcion)
            multiqC.push(tc.opcion)
        })

        console.log("todas", multiq)
        console.log("correctas", multiqC)
    }

    return (
        <Modal
            id="Modal prrona Crear Pregunta"
            open={open}
            onClose={close}
            aria-labelledby="Nueva Pregunta"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                id="Grid container Crear Pregunta"
                justifyContent='space-between'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: containerWidth,
                    height: '80vh',
                    overflowY: 'scroll',
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

                <Grid item xs={12} id="PrimeraSección">
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        Creación de Pregunta
                    </Typography>
                </Grid>

                {/* Primera Seccion */}
                <Grid item xs={12} lg={6} md={6} sx={{ mt: 2 }}>

                    <Grid container justifyContent="center" sx={{
                        py: 2,
                        overflowY: 'scroll',
                        height: '60vh',
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

                        <Grid item xs={10}>
                            <FormControl variant="filled" sx={{ mt: 3, width: '100%' }}>
                                <InputLabel id="courseSelectorInputLabel"
                                    sx={{
                                        color: 'appDark.text',
                                        '&:hover': {
                                            color: 'appDark.text' //change label color
                                        },
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}
                                >Curso</InputLabel>

                                <Select
                                    id="courseSelector"
                                    value={course}
                                    onChange={handleCourseSelection}
                                    sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: 'appDark.bgBox',
                                            },
                                        },
                                    }}
                                >
                                    {coursesData.map((course) => (
                                        <MenuItem
                                            sx={{
                                                color: "appDark.text",
                                                bgcolor: 'appDark.bgBox',
                                                '&:hover': {
                                                    bgcolor: 'appDark.selectHover' //change label color
                                                },
                                            }}
                                            key={course.id}
                                            value={course.id}
                                        >
                                            {course.id} {course.name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>


                        {/* Module Selector */}
                        <Grid item xs={10}>
                            <FormControl variant="filled" sx={{ mt: 3, width: '100%' }}>
                                <InputLabel id="courseSelectorInputLabel"
                                    sx={{
                                        color: 'appDark.text',
                                        '&:hover': {
                                            color: 'appDark.text' //change label color
                                        },
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}
                                >Módulo</InputLabel>

                                <Select
                                    id="moduleSelector"
                                    value={qmodule}
                                    onChange={handleQModuleSelection}
                                    sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: 'appDark.bgBox',
                                            },
                                        },
                                    }}
                                >
                                    {modulesData.map((module) => (
                                        <MenuItem
                                            sx={{
                                                color: "appDark.text",
                                                bgcolor: 'appDark.bgBox',
                                                '&:hover': {
                                                    bgcolor: 'appDark.selectHover' //change label color
                                                },
                                            }}
                                            key={module.id}
                                            value={module.id}
                                            // key={module}
                                            // value={module}
                                        >
                                            {module.id} {module.name}
                                            {/* {module} */}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Type Selector (code or multiple selection)*/}
                        <Grid item xs={10}>
                            <FormControl variant="filled" sx={{ mt: 3, width: '100%' }}>
                                <InputLabel id="questionTypeSelectorInputLabel"
                                    sx={{
                                        color: 'appDark.text',
                                        '&:hover': {
                                            color: 'appDark.text' //change label color
                                        },
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}
                                >Tipo de pregunta</InputLabel>


                                <Select
                                    id="questionTypeSelector"
                                    value={qtype}
                                    onChange={handleQTypeSelection}
                                    sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                bgcolor: 'appDark.bgBox',
                                            },
                                        },
                                    }}
                                >
                                    {questionTypes.map((qtype) => (
                                        <MenuItem
                                            sx={{
                                                color: "appDark.text",
                                                bgcolor: 'appDark.bgBox',
                                                '&:hover': {
                                                    bgcolor: 'appDark.selectHover' //change label color
                                                },
                                            }}
                                            key={qtype}
                                            value={qtype}
                                        >
                                            {qtype}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Question description */}
                        <Grid item xs={10} sx={{ mt: 2 }}>
                            <Grid container>
                                <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', height: 100 }}>
                                    <InputLabel sx={{
                                        color: 'appDark.text',
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        },
                                        height: 100
                                    }}>Descripción de la pregunta</InputLabel>
                                    <OutlinedInput
                                        type="input"
                                        label="Descripción de la pregunta"
                                        placeholder="Descripción"
                                        multiline={true}
                                        sx={{
                                            color: 'appDark.text',
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'appDark.box', //change border color on hover
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'appDark.box', //change border color when focused
                                            },
                                            '&.MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'transparent',
                                                },
                                            },
                                            height: 100
                                        }}
                                        name='qdescription'
                                        value={qdescription}
                                        onChange={onInputChange}

                                    />
                                </FormControl>
                            </Grid>
                        </Grid>

                        {qtype == 'codep' ?
                            // SelectorY - TestCases para codigo
                            <>
                            <Grid item xs={10}>
                                <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt:2 }}>
                                    Caso de Prueba Visible
                                </Typography>
                            </Grid>

                            <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                overflowY: 'scroll',
                                height: '25vh',
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
                                
                                {/* <Grid item xs={5}>
                                    <AddTestCasesOC open={open} changeTestCase={changeSinputs} type={"input"}/>
                                </Grid> */}
                                {/* <Grid item xs={5}> */}
                                    {/* <AddTestCasesOC open={open} changeTestCase={changeSTestCase} type={"output"}/> */}
                                {/* </Grid> */}
                                {/* {console.log("sinputs", sinputs)} */}
                                {/* {console.log("soutputs", sTestCases)} */}

                                {/* {testCases.map((testCase) => testCase.jsx)} */}

                                <AddTestCases open={open} changeTestCase={setTestCaseS} />
                                {console.log("prueba de casos S",testCasesS)}

                            </Grid>
                            
                            <Grid item xs={10}>
                                <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt:2 }}>
                                    Caso de Prueba Oculto
                                </Typography>
                            </Grid>

                            <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                overflowY: 'scroll',
                                height: '25vh',
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
                                {/* <Grid item xs={5}>
                                    <AddTestCasesOC open={open} changeTestCase={changeHinputs} type={"input"}/>
                                </Grid> */}
                                {/* <Grid item xs={5}> */}
                                    {/* <AddTestCasesOC open={open} changeTestCase={changeHTestCase} type={"output"}/> */}
                                {/* </Grid> */}
                                {/* <AddTestCasesOC/> */}
                                {/* {console.log("hinputs", hinputs)}
                                {console.log("houtputs", houtputs)} */}

                                <AddTestCases open={open} changeTestCase={setTestCaseH} />
                                {console.log("prueba de casos H",testCasesH)}
                            </Grid>
                            </>

                        :   
                            null
                        }
                        { qtype == "multi" ?
                            // SelectorY - TestCases para preguntas multpiles
                            <>
                                <Grid item xs={10}>
                                <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt:2 }}>
                                    Opciones Incorrectas
                                </Typography>
                                
                                </Grid>

                                <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                    overflowY: 'scroll',
                                    height: '25vh',
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
                                   <AddMultiQ open={open} changeMultiQ={setMultiQ}/> 
                                   {/* {console.log("multi erroneas",wMultiQ)} */}
                                </Grid>
                                <Grid item xs={10}>
                                <Typography variant="h2" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt:2 }}>
                                    Opciones Correctas
                                </Typography>
                                
                                </Grid>

                                <Grid container xs={10} align="center" justifyContent="space-around" sx={{
                                    overflowY: 'scroll',
                                    height: '25vh',
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
                                   <AddMultiQ open={open} changeMultiQ={setCMultiQ}/> 
                                   {/* {console.log("multi erroneas",wMultiQ)} */}
                                </Grid>
                            </>
                        :
                            null
                        }
                        
                        

                    </Grid>
                </Grid>

                {/* Segunda Seccion */}
                <Grid item xs={12} lg={6} md={6} sx={{ mt: 2 }} >
                    <Grid container alignItems="center" justifyContent="center"
                        sx={{
                            overflowY: 'scroll',
                            height: '60vh',
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

                        <Grid item xs={10} alignContent="center" justifyContent="center">

                            <Button xs={12}
                                alignContent="center"
                                variant="contained"
                                component="label"
                                sx={{
                                    width: "30vw",
                                    height: "30vh",
                                    backgroundColor: 'secondary.main',
                                    borderRadius: '10px',
                                    boxShadow: '5px 5px 5px 5px rgba(0.1, 0.1, 0.1, 0.1)',
                                    ':hover': { backgroundColor: 'secondary.main', opacity: 0.9 }
                                }}
                            >
                                <Grid container justifyContent="center" alignItems="center" align='center'>
                                    <Grid item xs={12} justifyContent="center">

                                        <UploadFile sx={{ color: 'appDark.icon', fontSize: 100, fontWeight: 80, my: 2 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                            Subir Archivo
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".json"
                                    hidden
                                    onChange={handleFileUpload}
                                // onChange={(event) => console.log(event.target.files)}
                                />
                            </Button>

                        </Grid>

                        {/* end container segunda seccion */}
                    </Grid>

                </Grid>

                <Grid container justifyContent='center' sx={{ mx: 5.5, mb: 2 }}>
                    <Grid item xs={6} id="cancelar" >

                        <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item xs={6} id="crear tarea" align="right">

                        <Button type="submit" onClick={requestAQuestion} variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                            Enviar solicitud
                        </Button>
                    </Grid>

                </Grid>
            </Grid>

        </Modal>
    )
}