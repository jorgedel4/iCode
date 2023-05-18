import { Grid, InputLabel, Modal, OutlinedInput, Button, FormHelperText, FormControl, Typography, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { useState, useEffect, React } from 'react';
import { useForm } from '../../hooks/useForm';
import { getAuth } from "firebase/auth";


export const RemoveButton = ({ open, close }) => {

    //State date pickers
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const modules = [
        {
            name: "Variables",
            id: "M0000000000000000004",
            n_questions: 0,
            checked: false
        },
        {
            name: "Condicionales",
            id: "M0000000000000000005",
            n_questions: 0,
            checked: true
        },
        {
            name: "Ciclo for",
            id: "M0000000000000000006",
            n_questions: 0,
            checked: true
        },
    ]
    const onSubmit = (event) => {
        event.preventDefault();
        // setFormSubmitted(true);
        // console.log(formState);
        // if (!isFormValid) return;
    }


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
                        Esto debe ser dinámico para que pueda reutilizarse en todo lo que se borra
                    </Typography>
                </Grid>
                {/* Botones */}
                <Grid container justifyContent='center' sx={{ my: 3, mx: 5.5 }}>
                    <Grid item xs={6} id="cancelar" >

                        <Button onClick={close} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button', borderRadius: 2 }}>
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item xs={6} id="crear tarea" align="right">

                        <Button type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                            Eliminar
                        </Button>
                    </Grid>

                </Grid>




            </Grid>

        </Modal >
    )
}