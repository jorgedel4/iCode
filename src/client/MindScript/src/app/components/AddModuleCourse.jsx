import React, { useState } from "react";
import { Add, Delete } from '@mui/icons-material';
import { Typography, Grid, Modal, useTheme, useMediaQuery, Button, InputLabel, MenuItem, Select, OutlinedInput, IconButton } from "@mui/material";


import FormControl from '@mui/material/FormControl';
import { useEffect } from 'react'


export function AddModuleCourse({ open, close, course }) {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerWidth = isLargeScreen ? 40 : isMediumScreen ? 70 : 90;

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [modules, setModule] = useState([]);
    const [modulesInput, setInput] = useState([]);


    const handleCourseSelection = (event) => {
        setSelectedCourse(event.target.value);
    };

    useEffect(() => {
        if (open) {
            addModuleControl();
        } else {
            setModule([]);
            setInput([]);
            setSelectedCourse(null);
        }
    }, [open]);

    const [modulesData, setSelectedModule] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            if (selectedCourse) {
                try {
                    const response = await fetch(`http://34.16.137.250:8002/coursemodules/${selectedCourse}`, options);
                    const responseData = await response.json();
                    setSelectedModule(responseData);
                } catch (error) {
                    // console.error(error);
                }
            }
        };
        fetchData();
    }, [selectedCourse]);

    const handleModuleChange = (moduleId, event) => {
        setModule((prevModules) => {
            const updatedModules = prevModules.map((module) => {
                if (module.key === moduleId) {
                    return {
                        ...module,
                        input: event.target.value,
                    };
                }
                return module;
            });

            const updatedInputs = updatedModules.map((module) => module.input);
            setInput(updatedInputs);

            return updatedModules;
        });
    };


    const deleteModuleControl = (moduleId) => {
        setModule((prevModules) => {
            if (prevModules.length === 1 && prevModules[0].key === moduleId) {
                return prevModules;
            }

            const updatedModules = prevModules.filter((module) => module.key !== moduleId);

            const updatedInputs = updatedModules.map((module) => module.input);
            setInput(updatedInputs);

            return updatedModules;
        });
    };

    const addModuleControl = () => {
        const id = Date.now();
        const newModule = {
            key: id,
            jsx: (
                <Grid item xs={12} key={id}>
                    <Grid container alignItems="center" justifyContent="center">
                        <Grid item xs={9}>
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
                                    }}
                                >
                                    Añadir Módulo
                                </InputLabel>
                                <OutlinedInput
                                    type="input"
                                    label="Nombre del Curso"
                                    placeholder="For loop"
                                    value={modules.input}
                                    onChange={(event) => handleModuleChange(id, event)}
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
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={3} sx={{ mt: 2 }}>
                            <Grid container align="center" justifyContent="space-around">
                                <Grid item xs={5} sx={{ bgcolor: 'appDark.button', borderRadius: 2 }}>
                                    <IconButton sx={{ color: 'appDark.icon' }} onClick={addModuleControl}>
                                        <Add />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={5} sx={{ bgcolor: 'error.main', borderRadius: 2 }}>
                                    <IconButton
                                        sx={{ color: 'appDark.icon' }}
                                        onClick={() => deleteModuleControl(id)}
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

        setModule((prevModules) => [...prevModules, newModule]);
    };

    return (
        <Modal
            id="Modal prrona Crear Tarea"
            open={open}
            onClose={close}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                id="Grid container Editar Materia"
                justifyContent='center'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 24,
                    width: `${containerWidth}vw`,
                }}>

                <Grid item xs={12}>
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        Añadir Módulo
                    </Typography>
                </Grid>

                <Grid item xs={10}>
                    <Typography variant="h1" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, mt: 2, ml: 1 }}>
                        Cursos Disponibles
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent="center" sx={{
                        py: 2,
                        height: '45vh',
                    }}>
                        <Grid item xs={10}>
                            <FormControl variant="filled" sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 2, width: '100%' }}>
                                <InputLabel
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
                                    value={selectedCourse || ''}
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
                                    {course.map((course) => (
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
                            <Typography variant="h1" component="h2" sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 700, ml: 1, mt:2 }}>
                                Módulos
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
                            {modules.map((module) => module.jsx)}

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
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    );
}
