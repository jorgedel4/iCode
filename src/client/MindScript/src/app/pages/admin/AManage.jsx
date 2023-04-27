import { Grid, useTheme, useMediaQuery, Button } from '@mui/material'
import { useState } from 'react'
import { NavBar, SearchBar } from '../../components';
import { Delete } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

export const AManage = () => {
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
        <Grid container alignContent='center' justifyContent='center' padding= {3} spacing={0} sx={{minHeight:'100vh', bgcolor: 'primary.main'}}>
            <NavBar/>
            <Grid container columnSpacing= {1} alignItems='center' justifyContent='space-around' sx={{bgcolor: 'secondary.main', mt:5, borderRadius: 2, height: containerHeight}}>
                <Grid item xs={12} sm={6} lg={5}>
                        <SearchBar searchQuery={searchQuery} name={'Nombre'} setSearchQuery={setSearchQuery}/>
                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                    <SearchBar searchQuery={searchQuery} name={'Matrícula/Nómina'} setSearchQuery={setSearchQuery}/>
                </Grid>

                <Grid item xs={4} lg={1}>
                    <Button
                    fullWidth
                    onClick={handleButtonStudentClick}
                    sx={{
                        color: 'appDark.text',
                        bgcolor: buttonStudentSelected ? 'appDark.adminButton': 'transparent', 
                        '&:hover': {
                            bgcolor: buttonStudentSelected ? 'appDark.adminButton': 'transparent',
                        },
                        '&:focus': {
                            borderColor: buttonStudentSelected ? 'primary.main': 'appDark.box', 
                        },
                        borderRadius:5, 
                        border: 0.5
                    }}
                    >
                    Estudiante
                    </Button>
                </Grid>

                <Grid item xs={4} lg={1}>
                    <Button
                    fullWidth
                    onClick={handleButtonProfessorClick}
                    sx={{
                        color: 'appDark.text',
                        bgcolor: buttonProfessorSelected ? 'appDark.adminButton': 'transparent', 
                        '&:hover': {
                            bgcolor: buttonProfessorSelected ? 'appDark.adminButton' : 'transparent',
                        },
                        '&:focus': {
                            borderColor: buttonProfessorSelected ? 'primary.main': 'appDark.box', 
                        },
                        borderRadius:5, 
                        border: 0.5
                    }}
                    >
                    Profesor
                    </Button>
                </Grid>

                <Grid item xs={4} lg={1}>
                    <Button
                    fullWidth
                    onClick={handleButtonAdminClick}
                    sx={{
                        color: 'appDark.text',
                        bgcolor: buttonAdminSelected ? 'appDark.adminButton': 'transparent', 
                        '&:hover': {
                            bgcolor: buttonAdminSelected ? 'appDark.adminButton' : 'transparent',
                        },
                        '&:focus': {
                            borderColor: buttonAdminSelected ? 'primary.main': 'appDark.box', 
                        },
                        borderRadius:5, 
                        border: 0.5
                    }}
                    >
                    Admin
                    </Button>
                </Grid>

            </Grid>
            <Grid item xs={12} sx={{color: 'appDark.text', bgcolor: 'appDark.bgBox', height: '70vh', mt:2, borderRadius: 2}}>
                <DataGrid disableColumnMenu disableHear rows={rows} columns={columns} theme={theme} sx={{color:'appDark.text', border: 0}} />
            </Grid>


        </Grid>
  )
}

// const EmptyFooter = () => <div></div>;


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
  { name: 'Jorge Delgado', id: 'A01551955', campus: 'PUE', email: 'a01551955@tec.mx', course: 'TC1018', action: 'boton' },
  { name: 'Ruben Vaazquez', id: 'A01735407', campus: 'PUE', email: 'a01735407@tec.mx', course: 'TC1018', action: 'boton' }
];
  
const columns = [
  { field: 'name', headerName: 'Nombre', flex: 2, align:'center', headerAlign: 'center' },
  { field: 'id', headerName: 'Matrícula/Nómina', flex: 2, align:'center', headerAlign: 'center' },
  { field: 'campus', headerName: 'Campus', flex: 2, align:'center', headerAlign: 'center'},
  { field: 'email', headerName: 'Email', flex:2, align:'center', headerAlign: 'center'},
  { field: 'course', headerName: 'Materia', flex:2, align:'center', headerAlign: 'center'},
  { field: 'action', headerName: 'Acciones', flex:2, align:'center', headerAlign: 'center'}
];

  

const filterData = (query, data) => {
if (!query) {
    return data;
} else {
    return data.filter((d) => d.toLowerCase().includes(query));
}
};