import { Grid, InputLabel, Modal, FormControlLabel, OutlinedInput, Button, Typography, MenuItem } from '@mui/material'

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useState } from 'react';
import { GroupHomework } from './GroupHomework';
import { AddModuleHomework } from './AddModuleHomework';
import { CounterCell } from './CounterCell';


export const CreateHomework = ({ open, close }) => {
    const [count, setCount] = useState(0);

    const [course, setCourse] = useState('');
    const handleSelection = (event) => {
        setCourse(event.target.value);
    };
    const [group, setGroup] = useState('');
    const handleGroupSelection = (event) => {
        setGroup(event.target.value);
    };

    //Manejar Seleccionar grupo
    const removeGroup = (event) => {
        setGroup(event.target.value);
    };
    const addGroup = (event) => {
        setGroup(event.target.value);
    };


    const coursesList = [
        'TC1028',
        'TC1030',
        'TC10030B',
    ]
    const groupList = [
        'grupo1',
        'grupo2',
    ]

    const modules = [
        {
            courseName: "Variables",
            exNum: 0
        },
        {
            courseName: "Condicionales",
            exNum: 0
        },

    ]

    //State date picker
    const [date, setDate] = useState(null);

    return (
        <Modal
            id="Modal prrona Crear Tarea"
            open={open}
            onClose={close}
            aria-labelledby="Nueva Tarea"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
            
                xs={10}
                id="Grid container Crear Tarea"
                justifyContent='space-between'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: '85vw',
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
                        Crear Tarea
                    </Typography>
                </Grid>

                <Grid item xs={12} lg={6} md={6} fullWidth sx={{ mt: 2 }}>
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

                        {/* Homework name */}
                        <Grid item xs={10} >
                            <Grid container>
                                <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2 }}>
                                    <InputLabel sx={{
                                        color: 'appDark.text',
                                        '&.Mui-focused': {
                                            color: 'appDark.text' //change label color
                                        }
                                    }}>Nombre de la tarea</InputLabel>
                                    <OutlinedInput
                                        type="input"
                                        label="Nombre de la Tarea"
                                        placeholder="Tarea 1"
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
                                    sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
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

                        {/* Fecha Desbloqueo */}
                        <Grid item xs={10}>
                            {/* Date picker */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha de Desbloqueo"
                                    fullWidth
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

                        {/* Fecha de Bloqueo */}
                        <Grid item xs={10}>
                            {/* Date picker */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha de Bloqueo"
                                    fullWidth
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

                        {/* SelectorY - Grupos en donde se despliega la tarea */}
                        <Grid item xs={10} id="Grupo">
                            <GroupHomework />
                        <Grid item id="cancelar">
                            <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                                Cancelar
                            </Button>
                        </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Segunda Seccion */}
                <Grid item xs={12} lg={6} md={6} fullWidth sx={{ mt: 2 }}>
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
                            <AddModuleHomework data={modules} />
                            <Grid item id="cancelar" align="right">

                                <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                    Crear tarea
                                </Button>
                            </Grid>
                        </Grid>

                        {/* end container segunda seccion */}
                    </Grid>

                </Grid>

            </Grid>

        </Modal>
    )
}