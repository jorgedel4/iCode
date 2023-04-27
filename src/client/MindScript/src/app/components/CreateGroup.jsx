import { Grid, InputLabel, Modal, Button, Typography, MenuItem, useTheme, useMediaQuery } from '@mui/material'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useState } from 'react';
import {CounterCell} from './CounterCell';

export const CreateGroup = ({ open, close }) => {
    const theme = useTheme();
    const isXLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const containerWidth = isXLargeScreen ? '35vw' : isLargeScreen ? '50vw' : isMediumScreen ? '60vw' : '95vw';
    const [count, setCount] = useState(0);

    const [course, setCourse] = useState('');
    const handleSelection = (event) => {
        setCourse(event.target.value);
    };
    const [exCounter, setExCounter] = useState(0);
    const coursesList = [
        'TC1028',
        'TC1030',
        'TC10030B',
    ]
   

    const handleCountChange = (index, newCount) => {
        setModules(prevData => {
            const newData = [...prevData];
            newData[index].exNum = newCount;
            return newData;
        });
    };

    const modules = [
        {
            courseName: "Variables",
            exNum: 0
        },
        {
            courseName: "Condicionales",
            exNum: 0
        },
        {
            courseName: "Ciclos For",
            exNum: 0
        },
        {
            courseName: "Ciclos While",
            exNum: 0
        },
        {
            courseName: "Manejo de Strings",
            exNum: 0
        },
        {
            courseName: "Tipo de variables",
            exNum: 0
        },
        {
            courseName: "Funciones",
            exNum: 0
        },
        {
            courseName: "Imports",
            exNum: 0
        },
    ]
    

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
                        >Matrícula del curso</InputLabel>

                        <Select
                            id="courseSelector"
                            value={course}
                            onChange={handleSelection}
                            sx={{ borderRadius: "10px", bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: 'appDark.bgBox',
                                    },
                                },
                            }}
                        >
                            {coursesList.map((course) => (
                                <MenuItem
                                    sx={{
                                        color: "appDark.text",
                                        bgcolor: 'appDark.bgBox',
                                        '&:hover': {
                                            bgcolor: 'appDark.selectHover' //change label color
                                        },
                                    }}
                                    key={course}
                                    value={course}
                                >
                                    {course}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={10}>
                    
                    <CounterCell data = {modules}/>

                </Grid>

                <Grid item xs={10}>
                    {/* Date picker */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Fecha de Cierre"
                            sx={{
                                mt: 3,
                                width: '100%',
                                bgcolor: "appDark.bgBox",
                                borderRadius: 2,


                                '& .MuiInputLabel-root': {
                                    color: 'appDark.text',
                                    '&.Mui-focused ': {
                                        color: 'appDark.text'
                                    }
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'appDark.box',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'appDark.box',
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: 'appDark.text',
                                },


                                svg: { color: 'appDark.text' },
                            }}

                            value={date} onChange={(newValue) => setDate(newValue)} />
                    </LocalizationProvider>

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