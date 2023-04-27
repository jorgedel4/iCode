import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid,
    MenuItem,
    InputLabel,
    Button
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export function AddModuleHomework({ data }) {
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

    const moduleList = [
        'Variables',
        'If',
        'Ciclo for',
    ]

    const [modulo, setModulo] = useState(data);
    const [name, setName] = useState('');
    let nextId = 0;
    console.log("state");
    console.log(modulo);


    /*ToDo
    1.No permitir que se añadan mas de los que existen
    2.Ver si lo cambiamos por check list la neta */

    const addModule = () => {
        setModulo([
            ...modulo, {courseName: "new", //esta "key" tiene que ser diferente cada vez
            exNum: 0}
        ]);
    }
    data=modulo

    return (
        <TableContainer sx={{
            height: "49vh", //to do no me pegues
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

        }}>
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
                            align="center"
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
                        <TableCell
                            align="center"
                            sx={{
                                color: "appDark.text",
                                position: "sticky",
                                top: 0,
                                bgcolor: "primary.main",
                                zIndex: 1,
                            }}
                        >
                            Acciones
                        </TableCell>
                    </TableRow>
                </TableHead>


                <TableBody>
                    {data.map((module) => (
                        <TableRow key={module.courseName}>
                            <TableCell
                                id="tableCellModuleSelect"
                                align="left" //??
                                sx={{ color: "appDark.text", padding: 0 }}
                                component="th"
                                scope="row"
                            >
                                <Grid item xs={10} >
                                    <FormControl fullWidth variant="filled">
                                        <InputLabel id="moduleSelectorInputLabel"
                                            sx={{
                                                color: 'appDark.text',
                                                '&:hover': {
                                                    color: 'appDark.text' //change label color
                                                },
                                                '&.Mui-focused': {
                                                    color: 'appDark.text' //change label color
                                                }
                                            }}
                                        >Selecciona Módulo</InputLabel>

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
                                            {moduleList.map((course) => (
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
                                        <ToggleButton sx={{ bgcolor: "#404655" }} value="up" >
                                            <ArrowUpwardIcon />
                                        </ToggleButton>
                                        <ToggleButton sx={{ bgcolor: "#404655" }} value="down">
                                            <ArrowDownwardIcon />
                                        </ToggleButton>

                                    </ToggleButtonGroup>


                                </ToggleButtonGroup>

                            </TableCell>

                            {/* Acciones */}
                            <TableCell sx={{ color: "appDark.text", padding: 1 }}>

                                <Grid container>

                                    <Grid item xs={6} align="center" >
                                        <Button onClick={close} type="submit" variant="contained" sx={{ bgcolor: 'error.main', borderRadius: 1, padding: 1, minWidth: 5 }}>
                                            <DeleteForeverRoundedIcon />
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6} align="center">
                                        <Button onClick={addModule} type="submit" variant="contained" sx={{ bgcolor: 'appDark.button', borderRadius: 1, padding: 1, minWidth: 5 }}>
                                            <AddRoundedIcon />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    );
}