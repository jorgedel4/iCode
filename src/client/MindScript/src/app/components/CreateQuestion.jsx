import { Grid, InputLabel, useTheme, useMediaQuery, Modal, FormControlLabel, OutlinedInput, Button, IconButton, Typography, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { Add, Delete } from '@mui/icons-material';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from '../../hooks/useForm';

import { AddTestCasesOC } from './';


export const CreateQuestion = ({ open, close, schoolID }) => {
    const theme = useTheme();
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const containerWidth = isXLargeScreen ? '80vw' : isLargeScreen ? '50vw' : isMediumScreen ? '60vw' : '95vw';

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

    const createQuestion = {
        qdescription: qdescription,

    }


    // console.log("POST Register Homework", createHomework)

    /*end API region */


    /* Datos necesarios para la interfaz de los test cases */
    //Tal vez se usan 
        // const [testCasesI, setTestCaseI] = useState([]);
        // const [testCasesO, setTestCaseO] = useState([]);

    const [hinputs, setHinputs] = useState([]);
    const changeHinputs = (newHinput) => {
        setHinputs(newHinput);
    }

    const [sinputs, setSinputs] = useState([]);
    const changeSinputs = (newSinput) => {
        setSinputs(newSinput);
    }

    const [houtputs, setHoutputs] = useState([]);
    const changeHoutputs = (newHoutput) => {
        setHoutputs(newHoutput);
    }

    const [soutputs, setSoutputs] = useState([]);
    const changeSoutputs = (newSoutput) => {
        setSoutputs(newSoutput);
    }

    useEffect(() => {
        if (!open) {
            setHinputs([]);
            setSinputs([]);
            setHoutputs([]);
            setSoutputs([]);
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
        };

        reader.readAsText(file);
    };

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
                                        >
                                            {module.id} {module.name}
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
                                    {modulesData.map((course) => (
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
                                <AddTestCasesOC open={open} changeTestCase={changeSoutputs} type={"output"}/>
                            {/* </Grid> */}
                            {/* {console.log("sinputs", sinputs)} */}
                            {console.log("soutputs", soutputs)}

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
                                <AddTestCasesOC open={open} changeTestCase={changeHoutputs} type={"output"}/>
                            {/* </Grid> */}
                            {/* <AddTestCasesOC/> */}
                            {/* {console.log("hinputs", hinputs)}
                            {console.log("houtputs", houtputs)} */}
                        </Grid>

                    </Grid>
                </Grid>

                {/* Segunda Seccion */}
                <Grid item xs={12} lg={6} md={6} sx={{ mt: 2 }}>
                    <Grid container justifyContent="center" sx={{
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

                        <Grid item xs={10} >

                            <Button
                                variant="contained"
                                component="label"
                            >
                                Subir Archivo
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

                        <Button 
                        type="submit" 
                        // onClick={(console.log("hinputs",hinputs))}
                        variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}
                        >
                            Enviar solicitud
                        </Button>
                    </Grid>

                </Grid>
            </Grid>

        </Modal>
    )
}