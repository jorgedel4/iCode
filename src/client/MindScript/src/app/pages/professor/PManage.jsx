import { Grid, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { NavBar, SearchBar, RemoveButton } from '../../components';
import { DataGrid } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';

export const PManage = () => {
  const batmanAPI = import.meta.env.VITE_APP_BATMAN;

  const [editData, setIdData] = useState(null);

  //Funciones para abrir la modal de Eliminar estudiante
  const [openRemoveStudent, setOpenRemoveStudent] = useState(false);
  const showModalRemoveStudent = () => { setOpenRemoveStudent(true); }
  const closeModalRemoveStudent = () => {
    setOpenRemoveStudent(false);
  }

  //GET term information
  const [usersData, setUser] = useState([]);
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
        const response = await fetch(`${batmanAPI}enrolledstudents/G000000001`, options);
        const responseData = await response.json();
        setUser(responseData);
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
        body: JSON.stringify({
          "group": "G000000001",
          "student": id
        }),
        mode: 'cors',

      };

      const response = await fetch(`${batmanAPI}unenrollstudent`, options);
      setUser(prevData => prevData.filter(user => user.id !== id));

      return response;

    } catch (error) {
      console.error(error);
    }
  };


  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const containerHeight = isLargeScreen ? 60 : isMediumScreen ? 100 : 150;

  // const dataFiltered = filterData(searchQuery, data);
  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setIdQuery] = useState("");

  const dataFiltered = filterData(nameQuery, idQuery, usersData);
  const pages = [
    { name: 'Home', route: '/professor/home' },
    { name: 'Profile', route: '/professor/profile' },
  ]

  const columns = [
    { field: 'id', headerName: 'Matrícula/Nómina', flex: 2, align: 'center', headerAlign: 'center' },
    { field: 'name', headerName: 'Nombre', flex: 2, align: 'center', headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      mx: 10,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => {
            setIdData(params.row.id);
            showModalRemoveStudent();
          }}
            aria-label="delete" sx={{ color: 'appDark.icon' }}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];


  return (
    <Grid container alignContent='center' justifyContent='center' padding={3} spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
      <NavBar pages={pages} />
      < RemoveButton open={openRemoveStudent} close={closeModalRemoveStudent} editData={editData} confirmationText="¿Esta seguro que desea eliminar esta usuario?" handleDelete={handleDelete} />

      <Grid container columnSpacing={1} alignItems='center' justifyContent='space-around' sx={{ bgcolor: 'secondary.main', mt: 5, borderRadius: 2, height: containerHeight }}>
        <Grid item xs={12} sm={6} lg={6}>
          <SearchBar searchQuery={nameQuery} name={'Nombre'} placeholder={'Jorge Delgado'} setSearchQuery={setNameQuery} />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <SearchBar searchQuery={idQuery} name={'Matrícula/Nómina'} placeholder={'A00000000'} setSearchQuery={setIdQuery} />
        </Grid>

      </Grid>
      <Grid item xs={12} sx={{ color: 'appDark.text', bgcolor: 'appDark.bgBox', height: '70vh', mt: 2, borderRadius: 2 }}>
        <DataGrid disableColumnMenu disableHear rows={dataFiltered} columns={columns} theme={theme} sx={{ color: 'appDark.text', border: 0 }} />
      </Grid>


    </Grid>
  )
}


const filterData = (nameQuery, idQuery, usersData) => {
  if (!nameQuery && !idQuery) {
    return usersData;
  } else {
    return usersData.filter((d) =>
      (nameQuery && d.name.toLowerCase().includes(nameQuery.toLowerCase())) ||
      (idQuery && d.id.toLowerCase().includes(idQuery.toLowerCase()))
    );
  }
};