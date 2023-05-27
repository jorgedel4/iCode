import { Grid, InputLabel, Modal, OutlinedInput, Button, FormHelperText, FormControl, Typography, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { useState, useEffect, React } from 'react';
import { useForm } from '../../hooks/useForm';
import { getAuth } from "firebase/auth";


export const Confirmation = ({ open, close, id, confirmationText, handleFunction, confirmationTextButton }) => {

    return (
        <Modal
            open={open}
            onClose={close}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Grid container
                justifyContent='space-around'
                sx={{
                    bgcolor: 'secondary.main',
                    borderRadius: 2,
                    boxShadow: 10,
                    width: '30vw',

                }}>

                <Grid item xs={12} id="PrimeraSección">

                    <Typography id="modal-hw-title" align='center' variant="h6" component="h2" sx={{ color: 'appDark.text', fontSize: 25, fontWeight: 700, mt: 4 }}>
                        {confirmationText}
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

                        <Button
                            onClick={() => {
                                const response = handleFunction(id);
                                response
                                    .then(data => {
                                        if (data.ok) {
                                            close();
                                        }
                                        return data.json;
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }}
                            type="submit" variant="contained" sx={{ backgroundColor: 'appDark.adminButton', borderRadius: 2 }}>
                            {confirmationTextButton}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Modal >
    )
}