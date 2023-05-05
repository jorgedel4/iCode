import { Grid, InputLabel,Checkbox, Modal, FormControlLabel, OutlinedInput, Button, Typography, MenuItem } from '@mui/material'

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useState } from 'react';
import { AddModuleHomework } from '../components/AddModuleHomework';

export const GroupHomework = ({ group }) => {
    //Manejar Seleccionar grupo
    // const removeGroup = (event) => {
    //     setGroup(event.target.value);
    // };
    const addGroup = (event) => {
        setGroup(event.target.value);
    };


    const groupList = [
        'grupo1',
        'grupo2',
    ]
    //Datos que son necesarios para la checklist
    const [checked, setChecked] = useState(true);

    const handleChange = () => {
        setChecked(!checked);
    };



    return (
        <Grid container justifyContent="space-between" alignItems='center' >
            <Grid item xs={8} fullWidth >
                <FormControl fullWidth variant="filled">
                    {/* CheckBox */}
                    <FormControlLabel
                        value="end"
                        control={<Checkbox
                            checked={checked}
                            onClick={handleChange}
                            sx={{
                                ml: 1.5,
                                color: 'appDark.icon',
                                '&.Mui-checked': {
                                    color: 'appDark.adminButton',
                                },
                            }}
                        />}
                        label={group}
                        labelPlacement="end"
                    />
                </FormControl>
            </Grid>

        </Grid>
    )
}