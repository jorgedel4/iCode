import {  ToggleButton, Grid } from '@mui/material'
import {useState} from 'react';

export const OptionButton = ({option}) => {
    const [selected, setSelected] = useState(false);
    return (
        <Grid item align='center' xs={12} sm={6} mt={4} >
            <ToggleButton 
            value='check'
            selected={selected}
            onChange={() => {setSelected(!selected)}}
            sx={{ 
                color: 'appDark.text',
                bgcolor: 'appDark.bgBox',
                fontWeight: 900,
                textTransform: 'none',
                minWidth: '30vh',
                minHeight: '7vh',
                ':hover': { backgroundColor: 'appDark.bgBox', opacity: 0.7 }
            }}>
                {option}
            </ToggleButton>
        </Grid>
    )
}