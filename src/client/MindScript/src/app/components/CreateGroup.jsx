import { Grid, InputLabel, Modal, Button, Typography, MenuItem, useTheme, useMediaQuery } from '@mui/material'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState, useEffect } from 'react';

import { CounterCell } from './CounterCell';

export const CreateGroup = ({ open, close }) => {
    const theme = useTheme();
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const containerWidth = isXLargeScreen ? '35vw' : isLargeScreen ? '50vw' : isMediumScreen ? '60vw' : '95vw';
    const [count, setCount] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');

    /*API region */

    //GET term information
    const [termsData, setTerm] = useState([]);
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
                const response = await fetch(`http://34.125.0.99:8002/terms?has_started=false`, options);
                const responseData = await response.json();
                setTerm(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, []);

    //GET course information
    const [coursesData, setCourse] = useState([]);
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
                setCourse(responseData);
            } catch (error) {
                // console.error(error);
            }
        };
        fetchData();
    }, []);

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
            if(selectedCourse){
                try {
                    const response = await fetch(`http://34.125.0.99:8002/coursemodules/${selectedCourse}`, options);
                    const responseData = await response.json();
                    setModule(responseData);
                } catch (error) {
                    // console.error(error);
                }
            }
        };
        fetchData();
    }, [selectedCourse]);

    //POST Create Group

    // const data = {
    //     courseName: coursesData.name,
    //     modEx: [
    //         {
    //             moduleName: "For",
    //             moduleNum: 3,
    //         },
    //         {
    //             moduleName: "While",
    //             moduleNum: 5,
    //         }
    //     ],
    //     term: "chance"
    // }
    // console.log(coursesData)
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

    //             "coursename": data.id,
    //             "modEx": data.modEx,
    //             "term": data.term

    //         })
    //     }

    //     fetch('http://34.125.0.99:8001/exec', options)
    //         .then(response => {
    //             console.log(response)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })

    // };



    /*end API region */

    //Estados
    const handleCourseSelection = (event) => {
        setSelectedCourse(event.target.value);
        // console.log(event.target.value)
    };

    const handleTermSelection = (event) => {
        setSelectedTerm(event.target.value);
    };

    const handleCountChange = (index, newCount) => {
        setModule(prevData => {
            const newData = [...prevData];
            newData[index].exNum = newCount;
            return newData;
        });
    };

    // const modules = [
    //     {
    //         courseName: "Variables",
    //         exNum: 0
    //     },
    //     {
    //         courseName: "Condicionales",
    //         exNum: 0
    //     },
    //     {
    //         courseName: "Ciclos For",
    //         exNum: 0
    //     },
    //     {
    //         courseName: "Ciclos While",
    //         exNum: 0
    //     },
    //     {
    //         courseName: "Manejo de Strings",
    //         exNum: 0
    //     },
    //     {
    //         courseName: "Tipo de variables",
    //         exNum: 0
    //     },
    //     {
    //         courseName: "Funciones",
    //         exNum: 0
    //     },
    //     {
    //         courseName: "Imports",
    //         exNum: 0
    //     },
    // ]


    //State date picker
    const [date, setDate] = useState(null);

    return (
        <Modal
            id="Modal prrona"
            open={open}
            onClose={close}
            aria-labelledby="Nuevo Grupo"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                // id="Grid container de la modal"
                justifyContent='center'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: '6px',
                    boxShadow: 24,
                    // width: 512,
                    width: containerWidth,
                    // height: 613,
                }}>

                {/* Primera vista */}

                {/* {count === 0 && ( */}
                {/* //Este parent solo es para no tener containers por cada cambio de vista */}
                {/* <> */}
                <Grid item xs={12}>
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        Nuevo Grupo
                    </Typography>
                </Grid>

                {/* Course Selector */}
                <Grid item xs={10}>
                    <FormControl fullWidth variant="filled" sx={{ mt: 3 }}>
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
                        >ID del curso</InputLabel>

                        <Select
                            id="courseSelector"
                            value={coursesData.id}
                            onChange={handleCourseSelection}
                            sx={{ borderRadius: "10px", bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
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
                                    key={course.name}
                                    value={course.id}
                                >
                                    {course.id} {course.name}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={10}>
                    {modulesData != null && (
                        <CounterCell data={modulesData} />
                    )}


                </Grid>


                {/* Term Selector */}
                <Grid item xs={10}>
                    <FormControl fullWidth variant="filled" sx={{ mt: 3 }}>
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
                        >Periodo Académico</InputLabel>

                        <Select
                            id="termSelector"
                            onChange={handleTermSelection}
                            sx={{ borderRadius: "10px", bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'appDark.bgBox',
                                    },
                                },
                            }}
                        >
                            {termsData.map((term) => (
                                <MenuItem
                                    sx={{
                                        color: "appDark.text",
                                        bgcolor: 'appDark.bgBox',
                                        '&:hover': {
                                            bgcolor: 'appDark.selectHover' //change label color
                                        },
                                    }}
                                    key={term.name}
                                    value={term.id}
                                >
                                    {term.name}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={10}>
                    <Grid container justifyContent='space-between' sx={{ my: 3 }}>
                        <Grid item id="cancelar">
                            <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item id="crearGrupo" >
                            <Button
                                onClick={() => { setCount(count + 1) }}
                                type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                Crear Grupo
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* end first view */}


            </Grid>
            {/* <HomeworkCard key={ 1 }  data={ data } student={ student }></HomeworkCard> */}

        </Modal>
    )
}