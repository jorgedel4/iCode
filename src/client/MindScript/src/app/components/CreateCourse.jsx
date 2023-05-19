import { Grid, InputLabel, Modal, OutlinedInput, Button, Typography, MenuItem, useTheme, useMediaQuery } from '@mui/material'

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState } from 'react';
import { GroupHomework } from './GroupHomework';
import { useEffect } from 'react';


export const CreateCourse = ({ open, close }) => {

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerWidth = isLargeScreen ? 40 : isMediumScreen ? 70 : 90;

    //Selector de curso
    const [course, setCourse] = useState('');
    const handleSelection = (event) => {
        setCourse(event.target.value);
        // console.log(course)
    };

    //State date picker
    const [date, setDate] = useState(null);



    const modules = [
        {
            courseName: "Variables",
            exNum: 0,
            checked: false
        },
        {
            courseName: "Condicionales",
            exNum: 0,
            checked: true
        },
        {
            courseName: "Ciclo for",
            exNum: 0,
            checked: true
        },

    ]

    /*API region */

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

        // let userID = "A01551955"
        // let term = "current"

        const fetchData = async () => {
            try {
                const response = await fetch(`http://34.125.0.99:8002/courses`, options);
                const responseData = await response.json();
                setCourseRequest(responseData);
            } catch (error) {
                // console.error(error);
            }
        };
        fetchData();
    }, []);

    // console.log(coursesData)

    //GET group information
    const [groupsData, setGroup] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        let userID = "L00000001"
        let term = "current"

        const fetchData = async () => {
            if (course) {
                try {
                    const response = await fetch(`http://34.125.0.99:8002/groups?id=${userID}&term=${term}`, options);
                    const responseData = await response.json();
                    setGroup(responseData);
                } catch (error) {
                    // console.error(error);
                }
            }
        };
        fetchData();
    }, [course]);

    // console.log("ADFaf",groupsData)
    // console.log("cursos", course)

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

        // let userID = "A01551955"
        // let term = "current"

        const fetchData = async () => {
            if (course) {
                try {
                    const response = await fetch(`http://34.125.0.99:8002/coursemodules/${course}`, options);
                    const responseData = await response.json();
                    setModule(responseData);
                } catch (error) {
                    // console.error(error);
                }
            }
        };
        fetchData();
    }, [course]);
    console.log("ADFaf", modulesData)
    console.log("cursos", course)

    // //POST Create Group

    // const registerGroup = {
    //     course_id: selectedCourse,
    //     term_id: selectedTerm,
    //     professor_id: "L00000001",
    //     modules_confs: rows,
    // }
    // // console.log(registerGroup)
    // const createGroupRequest = async () => {

    //     const options = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',

    //         },
    //         mode: 'no-cors',
    //         body: JSON.stringify({
    //             // "id": "test/test/2",
    //             // "code": "def smallest(a, b):\n\treturn a if a < b else b"

    //             "course_id": registerGroup.course_id,
    //             "term_id": registerGroup.term_id,
    //             "professor_id": registerGroup.professor_id,
    //             "modules_confs": registerGroup.modules_confs

    //         })
    //     }

    //     fetch('http://34.125.0.99:8002/registergroup', options)
    //         .then(response => {
    //             console.log(response)
    //             if (response.status === 201) {
    //                 close()
    //                 throw new Error('Grupo creado');
    //             }

    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })

    // };



    /*end API region */


    return (
        <Modal
            id="Modal prrona Crear Tarea"
            open={open}
            onClose={close}
            aria-labelledby="crearCurso"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                id="Grid container Crear Materia"
                justifyContent='space-between'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: `${containerWidth}vw`,
                }}>

                <Grid item xs={12} id="PrimeraSección">
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        Crear Materia
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent="center" sx={{
                        py: 3,
                    }}>

                        <Grid item xs={10} >
                            <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%' }}>
                                <InputLabel sx={{
                                    color: 'appDark.text',
                                    '&.Mui-focused': {
                                        color: 'appDark.text' //change label color
                                    }
                                }}>ID del Curso</InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label="ID del Curso"
                                    placeholder="TC1028"
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
                                        }
                                    }}


                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={10} >
                            <FormControl sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%', mt: 2 }}>
                                <InputLabel sx={{
                                    color: 'appDark.text',
                                    '&.Mui-focused': {
                                        color: 'appDark.text' //change label color
                                    }
                                }}>Nombre del Curso</InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label="Nombre del Curso"
                                    placeholder="Pensamiento Computacional"
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
                                        }
                                    }}


                                />
                            </FormControl>
                        </Grid>

                    </Grid>

                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent='space-around' align='center' sx={{ mb: 2 }}>
                        <Grid item xs={6} id="cancelar" >
                            <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs={6} id="crear tarea">
                            <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                Crear Materia
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    )
}