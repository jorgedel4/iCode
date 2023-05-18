import { Grid, useTheme, useMediaQuery, Button, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { NavBar, SearchBar } from '../../components';
import { Delete, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { getAuth } from "firebase/auth";

export const AManage = () => {

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
        // console.log("Admin manager user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Nómina L00000000
        const schoolID = (user.email).substring(0, 8);
        // console.log("Nómina ", schoolID)
    }
    const pages = ['Gestion de Usuarios', 'Solicitudes', 'Plan de Estudios']

    const [studentsData, setStudent] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        // let userID = "A01551955"
        // let term = "current"

        const fetchData = async () => {
            try {
                const response = await fetch(`http://34.16.137.250:8002/users?user_type=student&campus=all&id=all&name=all`, options);
                const responseData = await response.json();
                setStudent(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, []);

    const [professorsData, setProfessor] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        // let userID = "A01551955"
        // let term = "current"

        const fetchData = async () => {
            try {
                const response = await fetch(`http://34.16.137.250:8002/users?user_type=professor&campus=all&id=all&name=all`, options);
                const responseData = await response.json();
                setProfessor(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, []);


    const handleDelete = async (id) => {
        // console.log(id);
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({ "id": id })
                mode: 'cors',

            };

            const response = await fetch(`http://34.16.137.250:8002/user/${id}`, options);
            const data = await response.json();
            return data

        } catch (error) {
            console.error(error);
        }
    };


    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerHeight = isLargeScreen ? 60 : isMediumScreen ? 100 : 200;

    const [nameQuery, setNameQuery] = useState("");
    const [idQuery, setIdQuery] = useState("");
    const [campusQuery, setCampusQuery] = useState("");
    const [dataFiltered, setFilter] = useState([]);

    const [buttonStudentSelected, setButtonStudentSelected] = useState(false);
    const [buttonProfessorSelected, setButtonProfessorSelected] = useState(false);
    const [buttonAdminSelected, setButtonAdminSelected] = useState(false);

    useEffect(() => {
        const filteredData = filterData(nameQuery, idQuery, campusQuery, buttonStudentSelected ? studentsData : buttonProfessorSelected ? professorsData : []);
        setFilter(filteredData);
    }, [nameQuery, idQuery, campusQuery, buttonStudentSelected, buttonProfessorSelected, studentsData, professorsData]);

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

    const columns = [
        { field: 'id', headerName: 'Matrícula/Nómina', flex: 2, align: 'center', headerAlign: 'center' },
        { field: 'name', headerName: 'Nombre', flex: 2, align: 'center', headerAlign: 'center' },
        { field: 'campus', headerName: 'Campus', flex: 2, align: 'center', headerAlign: 'center' },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 2,
            align: 'center',
            headerAlign: 'center',
            mx: 10,
            renderCell: (params) => (
                <>
                    <IconButton aria-label="delete" sx={{ color: 'appDark.icon', mx: 2 }}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} aria-label="delete" sx={{ color: 'appDark.icon', mx: 2 }}>
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Grid container alignContent='center' justifyContent='center' padding={3} spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages}/>
            <Grid container columnSpacing={1} alignItems='center' justifyContent='space-around' sx={{ bgcolor: 'secondary.main', mt: 5, borderRadius: 2, height: containerHeight }}>
                <Grid item xs={12} sm={4} lg={3}>
                    <SearchBar searchQuery={nameQuery} name={'Nombre'} placeholder={'Jorge Delgado'} setSearchQuery={setNameQuery} />
                </Grid>

                <Grid item xs={12} sm={4} lg={3}>
                    <SearchBar searchQuery={idQuery} name={'Matrícula/Nómina'} placeholder={'A00000000'} setSearchQuery={setIdQuery} />
                </Grid>

                <Grid item xs={12} sm={4} lg={3}>
                    <SearchBar searchQuery={campusQuery} name={'Campus'} placeholder={'PUE'} setSearchQuery={setCampusQuery} />
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
                        Estudiante
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
                        Profesor
                    </Button>
                </Grid>

                <Grid item xs={4} lg={1}>
                    <Button
                        fullWidth
                        onClick={handleButtonAdminClick}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonAdminSelected ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonAdminSelected ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonAdminSelected ? 'primary.main' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 0.5
                        }}
                    >
                        Admin
                    </Button>
                </Grid>

            </Grid>
            <Grid item xs={12} sx={{ color: 'appDark.text', bgcolor: 'appDark.bgBox', height: '70vh', mt: 2, borderRadius: 2 }}>
                <DataGrid
                    disableColumnMenu
                    disableSelectionOnClick
                    disableHear
                    rows={dataFiltered}
                    columns={columns}
                    theme={theme}
                    sx={{ color: 'appDark.text', border: 0 }}
                />
            </Grid>


        </Grid>
    )
}





const filterData = (nameQuery, idQuery, campusQuery, usersData) => {
    if (!nameQuery && !idQuery && !campusQuery) {
        return usersData;
    } else {
        return usersData.filter((d) =>
            (nameQuery && d.name.toLowerCase().includes(nameQuery.toLowerCase())) ||
            (idQuery && d.id.toLowerCase().includes(idQuery.toLowerCase())) ||
            (campusQuery && d.campus.toLowerCase().includes(campusQuery.toLowerCase()))
        );
    }
};
