import { Grid, InputLabel, Modal, FormControlLabel, OutlinedInput, Button, Typography, MenuItem } from '@mui/material'

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useState } from 'react';
import { AddModuleHomework } from '../components/AddModuleHomework';

export const GroupHomework = () => {
    //Manejar Seleccionar grupo
    // const removeGroup = (event) => {
    //     setGroup(event.target.value);
    // };
    const addGroup = (event) => {
        setGroup(event.target.value);
    };


    // const coursesList = [
    //     'TC1028',
    //     'TC1030',
    //     'TC10030B',
    // ]

    const [group, setGroup] = useState('');
    const handleGroupSelection = (event) => {
        setGroup(event.target.value);
    };
    const groupList = [
        'grupo1',
        'grupo2',
    ]


    return (
        <Grid container justifyContent="space-between" alignItems='center' >
            <Grid item xs={8} fullWidth >
                <FormControl fullWidth variant="filled" sx={{ my: 3 }}>
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
                    >Seleccionar Grupo</InputLabel>

                    <Select
                        id="groupeSelector"
                        value={group}
                        onChange={handleGroupSelection}
                        sx={{ borderRadius: 2, bgcolor: 'appDark.bgBox', color: 'appDark.text', svg: { color: 'appDark.text' } }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    bgcolor: 'appDark.bgBox',
                                },
                            },
                        }}
                    >
                        {groupList.map((group) => (
                            <MenuItem
                                sx={{
                                    color: "appDark.text",
                                    bgcolor: 'appDark.bgBox',
                                    '&:hover': {
                                        bgcolor: 'appDark.selectHover' //change label color
                                    },
                                }}
                                key={group}
                                value={group}
                            >
                                {group}
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2} align="center">
                <Button onClick={close} type="submit" variant="contained" sx={{ bgcolor: 'error.main', borderRadius: 1, padding: 1, minWidth: 5 }}>
                    <DeleteForeverRoundedIcon />
                </Button>
            </Grid>
            <Grid item xs={2} align="center">
                <Button onClick={close} type="submit" variant="contained" sx={{ bgcolor: 'appDark.button', borderRadius: 1, padding: 1, minWidth: 5 }}>
                    <AddRoundedIcon />
                </Button>
            </Grid>
        </Grid>
    )
}