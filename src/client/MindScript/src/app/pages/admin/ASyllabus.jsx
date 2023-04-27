import { Grid, useTheme, useMediaQuery, Button, Typography, CardActionArea, CardContent } from '@mui/material'
import { useState } from 'react'
import { NavBar, SearchBar, ActionButton } from '../../components';
import { AddCircleOutline, NoteAddOutlined } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid';

export const ASyllabus = () => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerHeight = isLargeScreen ? 60 : isMediumScreen ? 100 : 150;

    const [searchQuery, setSearchQuery] = useState("");
    const [filt, setFilt] = useState([])

    const dataFiltered = filterData(searchQuery, data);

    const [buttonStudentSelected, setButtonStudentSelected] = useState(false);
    const [buttonProfessorSelected, setButtonProfessorSelected] = useState(false);
    const [buttonAdminSelected, setButtonAdminSelected] = useState(false);

    const handleButtonStudentClick = () => {
        setButtonStudentSelected(!buttonStudentSelected);
        setButtonProfessorSelected(false);
        setButtonAdminSelected(false);
    };

    const handleButtonProfessorClick = () => {
        setButtonProfessorSelected(!buttonProfessorSelected);
        setButtonStudentSelected(false);
        setButtonAdminSelected(false);
    };

    const handleButtonAdminClick = () => {
        setButtonAdminSelected(!buttonAdminSelected);
        setButtonProfessorSelected(false);
        setButtonStudentSelected(false);
    };
    return (
        <Grid container alignItems='center' justifyContent='center' padding={3} spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar />
            <Grid item fullWidth lg={9}>
                <Grid container columnSpacing={1} alignItems='center' justifyContent='space-around' sx={{ bgcolor: 'secondary.main', mt: 5, borderRadius: 2, height: containerHeight }}>
                    <Grid item xs={12} sm={6} lg={5}>
                        <SearchBar searchQuery={searchQuery} name={'Nombre'} setSearchQuery={setSearchQuery} />
                    </Grid>

                    <Grid item xs={12} sm={6} lg={4}>
                        <SearchBar searchQuery={searchQuery} name={'Matrícula/Nómina'} setSearchQuery={setSearchQuery} />
                    </Grid>

                    <Grid item xs={4} lg={1}>
                        <Button
                            fullWidth
                            onClick={handleButtonStudentClick}
                            sx={{
                                color: 'appDark.text',
                                bgcolor: buttonStudentSelected ? 'appDark.adminButton' : 'transparent',
                                '&:hover': {
                                    bgcolor: buttonStudentSelected ? 'appDark.adminButton' : 'transparent',
                                },
                                '&:focus': {
                                    borderColor: buttonStudentSelected ? 'primary.main' : 'appDark.box',
                                },
                                borderRadius: 5,
                                border: 0.5
                            }}
                        >
                            Materia
                        </Button>
                    </Grid>

                    <Grid item xs={4} lg={1}>
                        <Button
                            fullWidth
                            onClick={handleButtonProfessorClick}
                            sx={{
                                color: 'appDark.text',
                                bgcolor: buttonProfessorSelected ? 'appDark.adminButton' : 'transparent',
                                '&:hover': {
                                    bgcolor: buttonProfessorSelected ? 'appDark.adminButton' : 'transparent',
                                },
                                '&:focus': {
                                    borderColor: buttonProfessorSelected ? 'primary.main' : 'appDark.box',
                                },
                                borderRadius: 5,
                                border: 0.5
                            }}
                        >
                            Modulo
                        </Button>
                    </Grid>

                </Grid>
                <Grid item xs={12} sx={{ color: 'appDark.text', bgcolor: 'appDark.bgBox', height: '70vh', mt: 2, borderRadius: 2 }}>
                    <DataGrid disableColumnMenu disableHeader hideFooterPagination rows={rows} columns={columns} theme={theme} sx={{ color: 'appDark.text', border: 0 }} />
                </Grid>
            </Grid>

            <Grid item fullWidth lg={3}>
                <Grid container rowSpacing={1} justifyContent='center' align='center' alignItems='center'>
                    <Grid item xs={12} >
                        <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 500 }} >Acciones</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <ActionButton >
                            <CardActionArea sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <AddCircleOutline sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100 }} />

                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Crear Materia
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </ActionButton>

                    </Grid>

                    <Grid item xs={12}>
                        <ActionButton >
                            <CardActionArea sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <NoteAddOutlined sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100 }} />
                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Añadir Modulo
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </ActionButton>
                    </Grid>

                </Grid>

            </Grid>

        </Grid>
    )
}

const data = [
    "Paris",
    "London",
    "New York",
    "Tokyo",
    "Berlin",
    "Buenos Aires",
    "Cairo",
    "Canberra",
    "Rio de Janeiro",
    "Dublin"
];


const rows = [
    { id: 1, subject: 'TC1028', module: 'If, While', action: 'boton' },
    { id: 2, subject: 'TC1032', module: 'Funciones', action: 'boton' },

];

const columns = [
    { field: 'subject', headerName: 'Materia', flex: 2, align: 'center', headerAlign: 'center' },
    { field: 'module', headerName: 'Modulos', flex: 2, align: 'center', headerAlign: 'center' },
    { field: 'action', headerName: 'Acciones', flex: 2, align: 'center', headerAlign: 'center' }
];



const filterData = (query, data) => {
    if (!query) {
        return data;
    } else {
        return data.filter((d) => d.toLowerCase().includes(query));
    }
};