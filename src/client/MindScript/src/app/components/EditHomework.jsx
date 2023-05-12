import { Grid, InputLabel, Modal, OutlinedInput, Button, FormHelperText, FormControl, Typography, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useState, useEffect, React } from 'react';
import { useForm } from '../../hooks/useForm';
import { getAuth } from "firebase/auth";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { GroupHomework } from './GroupHomework';
import { AddModuleHomework } from './AddModuleHomework';


export const EditHomework = ({ open, close, data }) => {

    //State date pickers
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // const modules = [
    //     {
    //         name: "Variables",
    //         id: "M0000000000000000004",
    //         n_questions: 0,
    //         checked: false
    //     },
    //     {
    //         name: "Condicionales",
    //         id: "M0000000000000000005",
    //         n_questions: 0,
    //         checked: true
    //     },
    //     {
    //         name: "Ciclo for",
    //         id: "M0000000000000000006",
    //         n_questions: 0,
    //         checked: true
    //     },
    // ]
    const onSubmit = (event) => {
        event.preventDefault();
        // setFormSubmitted(true);
        // console.log(formState);
        // if (!isFormValid) return;
    }
    console.log(data);

    //GET modules information
    // const [modulesData, setModule] = useState([]);
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
    //                 const response = await fetch(`http://34.125.0.99:8002/coursemodules/${}`, options);
    //                 const responseData = await response.json();
    //                 setModule(responseData);
    //             } catch (error) {
    //                 // console.error(error); .push({id:, n_questions: })
    //             }
    //         }
    //     };
    //     fetchData();
    // }, [course]);

    // let modules = [];
    // modulesData.map((module) => (
    //     modules.push({
    //         id: module.id,
    //         name: module.name,
    //         n_questions: 0,
    //         checked: true
    //     })
    // ))



    return (
        <Modal
            id="Modal prrona Editar tarea"
            open={open}
            onClose={close}
            aria-labelledby="Unirse a un curso"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                xs={8} md={6} lg={5}
                id="Grid container Unirse curso"
                justifyContent='center'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 10,
                    width: '30vw',

                }}>

                <Grid item xs={12} id="PrimeraSección">
                    <Typography id="modal-hw-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        {data.work}
                    </Typography>
                </Grid>

                {/* Module checklist */}
                <Grid item xs={12} sx={{ mt: 2 }}>
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
                            {/* Tabla de ejercicios de modulos */}
                            <TableContainer sx={{
                                height: "30vh", //to do no me pegues
                                my: 2,
                                borderRadius: 2,
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
                            }}
                            >
                                <Table sx={{ width: 1 }} aria-label="simple table">
                                    <TableHead sx={{ overflowX: "initial" }}>
                                        <TableRow>
                                            <TableCell
                                                align="left"
                                                sx={{
                                                    color: "appDark.text",
                                                    position: "sticky",
                                                    top: 0,
                                                    bgcolor: "primary.main",
                                                    zIndex: 1,
                                                }}
                                            >
                                                Módulos
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    color: "appDark.text",
                                                    position: "sticky",
                                                    top: 0,
                                                    bgcolor: "primary.main",
                                                    zIndex: 1,
                                                }}
                                            >
                                                Ejercicios
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {modules.map((module) => (
                                            <>
                                                <AddModuleHomework key={module.id} module={module} />
                                            </>
                                        ))}
                                    </TableBody>

                                </Table>
                            </TableContainer>

                        </Grid>

                        {/* Fecha Desbloqueo */}
                        <Grid item xs={10}>
                            {/* Date picker */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha de Desbloqueo"
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

                                    value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                            </LocalizationProvider>

                        </Grid>

                        {/* Fecha de Bloqueo */}
                        <Grid item xs={10}>
                            {/* Date picker */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha de Bloqueo"
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

                                    value={endDate} onChange={(newValue) => setEndDate(newValue)} />
                            </LocalizationProvider>

                        </Grid>

                        {/* Botones */}
                        <Grid container justifyContent='center' sx={{ my:3,mx: 5.5 }}>
                            <Grid item xs={6} id="cancelar" >

                                <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                                    Cancelar
                                </Button>
                            </Grid>
                            <Grid item xs={6} id="crear tarea" align="right">

                                <Button type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                                    Crear tarea
                                </Button>
                            </Grid>

                        </Grid>




                    </Grid>
                </Grid>
            </Grid>

        </Modal >
    )
}