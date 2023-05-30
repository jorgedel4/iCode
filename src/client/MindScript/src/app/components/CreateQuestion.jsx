import { Grid, InputLabel, useTheme, useMediaQuery, Modal, FormControlLabel, OutlinedInput, Button, IconButton, Typography, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { Add, Delete, LoopSharp } from '@mui/icons-material';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { UploadFile } from '@mui/icons-material'


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

    //Description
    const { qdescription, onInputChange } = useForm({
        qdescription: '',
    });

    //Selector de curso 
    const [qmodule, setQModule] = useState('');
    const handleQModuleSelection = (event) => {
        setQModule(event.target.value);
        console.log(qmodule)
    };

    //Selector de tipo de pregunta 
    const [qtype, setQType] = useState('');
    const handleQTypeSelection = (event) => {
        setQType(event.target.value);
        console.log(qtype)
    };

    const modulesDummy = ["For loops", "Condicionales", "Basics"]

    /*File upload section */
    let formatedInfo = ``;
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target.result;
            // console.log(fileContent); // Do something with the file content
            // console.log(`{"${JSON.stringify(fileContent).slice(1, -1)}"}`)
            const rawjson = `{"${JSON.stringify(fileContent).slice(1, -1)}"}`;
            const format = rawjson.substring(9, rawjson.length - 7)
            console.log("FORMAT", format)
            formatedInfo = `{"${JSON.stringify(fileContent).slice(1, -1)}"}`
        };
        // console.log(file)

        reader.readAsText(file);
    };

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

    const requestAQuestion = async () => {
        // console.log("this is it",formatedInfo)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },


            mode: 'cors',
            body: JSON.stringify(
                [
                    {
                        "module": "M0000000000000000001",
                        "q_type": "codep",
                        "info": format,
                        "created_by": "L00000003"
                    }
                ]
            )
        }
        console.log(options.body)
        fetch(`${riddleAPI}requestQuestion`, options)
            .then(response => {
                if (response.status === 201) {
                    close();
                }
            })
            .catch(error => {
                console.log(error)
            })
    };



    //GET modules information
    const [modulesData, setModule] = useState([]);
    // useEffect(() => {
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //         },
    //         mode: 'cors',
    //     }

    //     // let userID = "A01551955"
    //     // let term = "current"

    //     const fetchData = async () => {
    //         if (course) {
    //             try {
    //                 const response = await fetch(`http://34.16.137.250:8002/coursemodules/${course}`, options);
    //                 const responseData = await response.json();
    //                 setModule(responseData);
    //             } catch (error) {
    //                 // console.error(error); .push({id:, n_questions: })
    //             }
    //         }
    //     };
    //     fetchData();
    // }, [course]);

    let modules = [];
    // modulesData.map((module) => (
    //     modules.push({
    //         id: module.id,
    //         name: module.name,
    //         n_questions: 0,
    //         checked: true
    //     })
    // ))

    // //POST Create Homework



    // console.log("POST Register Homework", createHomework)

    /*end API region */


    /* Datos necesarios para la interfaz de los test cases */
    //Para la seccion de input
    const [testCases, setTestCase] = useState([]);
    const [testCasesInput, setInput] = useState([]);

    useEffect(() => {
        if (open) {
            addTestCaseControl();
        } else {
            setTestCase([]);
            setInput([]);
        }
    }, [open]);

    const handleTestCaseChangeI = (testCaseId, event) => {
        setTestCase((prevTestCases) => {
            const updatedTestCases = prevTestCases.map((testCase) => {
                if (testCase.key === testCaseId) {
                    console.log("ekedkwld", testCase)
                    return {
                        ...testCase,
                        input: event.target.value,
                    };
                }
                return testCase;
            });

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            return updatedTestCases;
        });
    };

    const handleTestCaseChangeO = (testCaseId, event) => {
        setTestCase((prevTestCases) => {
            const updatedTestCases = prevTestCases.map((testCase) => {
                if (testCase.key === testCaseId) {
                    return {
                        ...testCase,
                        output: event.target.value,
                    };
                }
                return testCase;
            });

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            return updatedTestCases;
        });
    };

    const deleteTestCaseControl = (testCaseId) => {
        setTestCase((prevTestCases) => {
            if (prevTestCases.length === 1 && prevTestCases[0].key === testCaseId) {
                return prevTestCases;
            }

            const updatedTestCases = prevTestCases.filter((testCase) => testCase.key !== testCaseId);

            const updatedInputs = updatedTestCases.map((testCase) => testCase.input);
            setInput(updatedInputs);

            return updatedTestCases;
        });
    };

    const addTestCaseControl = () => {
        const id = Date.now();
        const newTestCase = {
            key: id,
            jsx: (
                <Grid item xs={12} key={id}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item xs={10}>
                            <Grid container>
                                <Grid item xs={6} sx={{ pr: 1 }}>
                                    <FormControl
                                        sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 2 }}
                                    >
                                        <InputLabel
                                            required
                                            sx={{
                                                color: 'appDark.text',
                                                '&.Mui-focused': {
                                                    color: 'appDark.text',
                                                },
                                                height: 100
                                            }}
                                        >
                                            Añadir Input
                                        </InputLabel>
                                        <OutlinedInput
                                            type="input"
                                            label="Nombre del Curso"
                                            placeholder="Input"
                                            multiline={true}
                                            value={modules.input}
                                            onChange={(event) => handleTestCaseChangeI(id, event)}
                                            sx={{
                                                color: 'appDark.text',
                                                height: 100,
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
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6} sx={{ pr: 1 }}>
                                    <FormControl
                                        sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 2 }}>
                                        <InputLabel
                                            required
                                            sx={{
                                                color: 'appDark.text',
                                                '&.Mui-focused': {
                                                    color: 'appDark.text',
                                                },
                                                height: 100
                                            }}
                                        >
                                            Añadir Output
                                        </InputLabel>
                                        <OutlinedInput
                                            type="input"
                                            label="Nombre del Curso"
                                            placeholder="Output"
                                            multiline={true}
                                            value={modules.input}
                                            onChange={(event) => handleTestCaseChangeO(id, event)}
                                            sx={{
                                                color: 'appDark.text',
                                                height: 100,
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
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={2} sx={{ mt: 2 }}>
                            <Grid container align="center" justifyContent="space-around">
                                <Grid item xs={7} sx={{ bgcolor: 'appDark.button', borderRadius: 2 }}>
                                    <IconButton sx={{ color: 'appDark.icon' }} onClick={addTestCaseControl}>
                                        <Add />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={7} sx={{ bgcolor: 'error.main', borderRadius: 2, mt: 2 }}>
                                    <IconButton
                                        sx={{ color: 'appDark.icon' }}
                                        onClick={() => deleteTestCaseControl(id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            ),
        };

        setTestCase((prevTestCases) => [...prevTestCases, newTestCase]);
    };
    /* Fin de test cases */


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
                                    {modulesDummy.map((module) => (
                                        <MenuItem
                                            sx={{
                                                color: "appDark.text",
                                                bgcolor: 'appDark.bgBox',
                                                '&:hover': {
                                                    bgcolor: 'appDark.selectHover' //change label color
                                                },
                                            }}
                                            // key={module.id}
                                            // value={module.id}
                                            key={module}
                                            value={module}
                                        >
                                            {/* {module.id} {module.name} */}
                                            {module}
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

                        {/* SelectorY - TestCases */}
                        <Grid item xs={10}>
                            <Typography variant="h1" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt: 2 }}>
                                Casos de Prueba
                            </Typography>
                        </Grid>

                        <Grid item xs={10} sx={{
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
                            {/* {console.log("test cases",testCases)} */}
                            {testCases.map((testCase) => testCase.jsx)}

                        </Grid>

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