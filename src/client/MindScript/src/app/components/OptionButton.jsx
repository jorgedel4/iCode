import { ToggleButton, Grid, useTheme } from '@mui/material';
import { useState } from 'react';

export const OptionButton = ({ option }) => {
    const theme = useTheme();
    const [selected, setSelected] = useState(false);

    return (
        <Grid item align='center' xs={12} sm={6} mt={4}>
            <ToggleButton
                value='check'
                selected={selected}
                onChange={() => { setSelected(!selected) }}
                style={{
                    color: theme.palette.appDark.text,
                    fontWeight: 900,
                    textTransform: 'none',
                    minWidth: '30vh',
                    minHeight: '7vh',
                    backgroundColor: selected ? theme.palette.appDark.adminButton : 'transparent',
                    borderColor: selected ? 'transparent' : theme.palette.appDark.box,
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                {option}
            </ToggleButton>
        </Grid>
    );
};