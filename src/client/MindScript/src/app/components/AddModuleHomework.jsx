import React, { useState } from "react";
import {
    TableCell,
    TableRow,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import FormControl from '@mui/material/FormControl';

export function AddModuleHomework({ module }) {
    const [counts, setCounts] = useState({});

    const handleToggle = (module, value) => {
        setCounts((prevCounts) => {
            const currentCount = prevCounts[module.courseName] || 0;
            if (value === "up") {
                return {
                    ...prevCounts,
                    [module.courseName]: currentCount + 1,
                };
            } else if (value === "down" && currentCount > 0) {
                return {
                    ...prevCounts,
                    [module.courseName]: currentCount - 1,
                };
            } else {
                return prevCounts;
            }
        });
    };

    //Selectors por módulo
    const [course, setCourse] = useState('');
    const handleSelection = (event) => {
        setCourse(event.target.value);
    };

    //Datos que son necesarios para la checklist
    const [checked, setChecked] = React.useState(module.checked);

    const handleChange = () => {
        setChecked(!checked);
        module.checked = !checked;
        setCounts(0);
    };

    // const [modulo, setModulo] = useState(data);
    // const [name, setName] = useState('');
    // let nextId = 0;
    // console.log("state");
    // console.log(modulo);



    return (
    <>
        {/* Desde aqui queremos que se repita */}
        <TableRow >
            <TableCell
                id="tableCellModuleSelect"
                align="left" //??
                sx={{ color: "appDark.text", padding: 0 }}
                component="th"
                scope="row"
            >
                <Grid item xs={10} >
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
                            label={module.courseName}
                            labelPlacement="end"
                        />
                    </FormControl>
                </Grid>

            </TableCell>

            <TableCell sx={{ color: "appDark.text" }}>
                <ToggleButtonGroup
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: 'center',
                        svg: { color: "appDark.text", width: "12px", height: "10px" },
                        "& .MuiToggleButton-root": { padding: "3px" },
                        columnGap: 1,

                    }}
                    value={counts[module.courseName] || 0}
                    exclusive
                    onChange={(event, value) => handleToggle(module, value)}
                >

                    <Typography sx={{ mb: "2px" }}>
                        {counts[module.courseName] || 0}
                    </Typography>

                    <ToggleButtonGroup
                        orientation="vertical"
                        disabled={module.checked ? false : true}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: 'center',

                            svg: { color: "appDark.text", width: "12px", height: "10px" },
                            "& .MuiToggleButton-root": { padding: "3px" },
                            flexDirection: 'column',

                        }}
                        value={counts[module.courseName] || 0}
                        exclusive
                        onChange={(event, value) => handleToggle(module, value)}
                    >
                        <ToggleButton sx={{ bgcolor: "#404655" }} value="up">
                            <ArrowUpwardIcon />
                        </ToggleButton>
                        <ToggleButton sx={{ bgcolor: "#404655" }} value="down">
                            <ArrowDownwardIcon />
                        </ToggleButton>

                    </ToggleButtonGroup>


                </ToggleButtonGroup>

            </TableCell>

        </TableRow>
        {/* Hasta aca se tiene que repetir */}
    </>
    );
}