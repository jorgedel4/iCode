import { Button, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useState, useEffect } from 'react';
import { NavBar, RequestCard, RemoveButton, SearchBar } from '../../components'
import { getAuth } from "firebase/auth";

export const PRequest = () => {
    const batmanAPI = import.meta.env.VITE_APP_BATMAN;
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;

    const theme = useTheme();

    // Api region
    const [requestsData, setRequest] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`${batmanAPI}questionrequests?question_type=all&requested_by=${schoolID}&course=all&status=all`, options);
                const responseData = await response.json();
                setRequest(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    console.log(requestsData)

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

            const response = await fetch(`${riddleAPI}declineQuestionRequest/${id}`, options);
            setRequest(prevData => prevData.filter(request => request.id !== id));
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    // Searchbar
    const [moduleQuery, setModuleQuery] = useState("");
    const [idQuery, setIdQuery] = useState("");
    const [dataFiltered, setFilter] = useState([]);


    const [buttonAccepted, setButtonStudentSelected] = useState(false);
    const [buttonPending, setButtonProfessorSelected] = useState(false);
    const [buttonRejected, setButtonAdminSelected] = useState(false);
    useEffect(() => {
        const filteredData = filterData(moduleQuery, idQuery, buttonAccepted ? requestsData.filter(request => request.status === 'approved') : buttonPending ? requestsData.filter(request => request.status === 'pending') : buttonRejected ? requestsData.filter(request => request.status === 'rejected') : requestsData);
        setFilter(filteredData);
    }, [moduleQuery, idQuery, buttonAccepted, buttonPending, buttonRejected, requestsData]);

    const handleButtonAccepted = () => {
        setButtonStudentSelected(!buttonAccepted);
        setButtonProfessorSelected(false);
        setButtonAdminSelected(false);
    };

    const handleButtonPending = () => {
        setButtonProfessorSelected(!buttonPending);
        setButtonStudentSelected(false);
        setButtonAdminSelected(false);
    };

    const handleButtonRejected = () => {
        setButtonAdminSelected(!buttonRejected);
        setButtonProfessorSelected(false);
        setButtonStudentSelected(false);
    };
    // 

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    let schoolID, email, displayName, emailVerified, uid;
    if (user !== null) {
        // console.log("AdminRequest user info", user)
        //Desestructuración de user
        ({ email, displayName, emailVerified, uid } = user)
        //Nómina L00000000
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Nómina ", schoolID)
    }

    const pages = [
        { name: 'Home', route: '/professor/home' },
        { name: 'Profile', route: '/professor/profile' },
    ]

    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
    const containerHeight = isLargeScreen ? 100 : isMediumScreen ? 100 : 150;



    const [selected, setSelected] = useState(null);
    const handleCardSelection = (id) => {
        if (id === selected) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };
    //Funciones para abrir la modal de Eliminar estudiante
    const [openDeleteRequest, setOpenDeleteRequest] = useState(false);
    const showModalDeleteRequest = () => { setOpenDeleteRequest(true); }
    const closeModalDeleteRequest = () => {
        setOpenDeleteRequest(false);
    }
    const selectedRequest = selected !== null ? requestsData.find((r) => r.id === selected) : null;
    // console.log(selectedRequest)
    var js, hinputs, sinputs;
    const formattedHInputs = {};
    const formattedSInputs = {};

    if (selectedRequest != null) {
        js = JSON.parse(selectedRequest.info)
        console.log(js)
        hinputs = js.hinputs
        sinputs = js.sinputs
        for (const [key, value] of Object.entries(hinputs)) {
            if (Array.isArray(value)) {
                const formattedValue = value.map(arr => arr[0]).join(',');
                formattedHInputs[key] = formattedValue;
            } else {
                formattedHInputs[key] = value;
            }
        }
        for (const [key, value] of Object.entries(sinputs)) {
            if (Array.isArray(value)) {
                const formattedValue = value.map(arr => arr[0]).join(',');
                formattedSInputs[key] = formattedValue;
            } else {
                formattedSInputs[key] = value;
            }
        }
    }
    // console.log(js)
    return (
        <Grid container padding={3} spacing={0} columnSpacing={1} sx={{ height: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />
            < RemoveButton open={openDeleteRequest} close={closeModalDeleteRequest} editData={selected} confirmationText="¿Esta seguro que desea eliminar esta solicitud?" handleDelete={handleDelete} />

            <Grid container columnSpacing={1} alignItems='center' justifyContent='space-around' sx={{ bgcolor: 'secondary.main', mt: 5, borderRadius: 2, height: containerHeight, ml: 1 }}>
                <Grid item xs={12} sm={6}>
                    <SearchBar searchQuery={idQuery} name={'Id'} placeholder={'TC1028'} setSearchQuery={setIdQuery} />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <SearchBar searchQuery={moduleQuery} name={'Modulo'} placeholder={'For Loop'} setSearchQuery={setModuleQuery} />
                </Grid>

                <Grid item xs={4}>
                    <Button
                        fullWidth
                        onClick={handleButtonAccepted}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonAccepted ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonAccepted ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonAccepted ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonAccepted ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Aceptadas
                    </Button>
                </Grid>

                <Grid item xs={4}>
                    <Button
                        fullWidth
                        onClick={handleButtonPending}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonPending ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonPending ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonPending ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonPending ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Pendientes
                    </Button>
                </Grid>

                <Grid item xs={4}>
                    <Button
                        fullWidth
                        onClick={handleButtonRejected}
                        sx={{
                            color: 'appDark.text',
                            bgcolor: buttonRejected ? 'appDark.adminButton' : 'transparent',
                            '&:hover': {
                                bgcolor: buttonRejected ? 'appDark.adminButton' : 'transparent',
                            },
                            '&:focus': {
                                borderColor: buttonRejected ? 'transparent' : 'appDark.box',
                            },
                            '&:not(:focus):not(:focus-within)': {
                                borderColor: buttonRejected ? 'transparent' : 'appDark.box',
                            },
                            borderRadius: 5,
                            border: 1
                        }}
                    >
                        Rechazadas
                    </Button>
                </Grid>

            </Grid>

            <Grid item xs={4} sx={{
                mt: 2,
                height: '70vh',
                overflowY: 'scroll',
                "&::-webkit-scrollbar": {
                    width: 5,
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                    borderRadius: 2,
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "appDark.scrollBar",
                    borderRadius: 2,
                },
            }}>
                <Grid container rowSpacing={1}>
                    {dataFiltered.map((r) => (
                        <Grid key={r.id} item xs={12}>
                            <RequestCard request={r} setSelected={handleCardSelection} selected={selected === r.id} />
                        </Grid>
                    ))}
                </Grid>

            </Grid>

            <Grid item xs={8} sx={{ mt: 2 }}>
                {selectedRequest != null && (
                    <Grid container sx={{
                        bgcolor: 'secondary.main',
                    }}>
                        <Grid item xs={12} paddingX={5} sx={{ mt: '5vh' }}>
                            <Grid container justifyContent='space-between' alignItems='center'>
                                <Grid item xs={10}>

                                <Typography sx={{ color: 'appDark.text', fontSize: 25 }} >
                                    Detalles del Problema
                                </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                <Typography sx={{ color: 'appDark.text', fontSize: 20 }} >
                                    {filterData.status}
                                </Typography>

                                </Grid>

                            </Grid>
                        </Grid>

                        <Grid item xs={12} sx={{
                            height: '60vh',
                            overflowY: 'scroll',
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
                            <Grid container spacing={0} paddingX={8}>
                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Descripción</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.description}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Lenguaje</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.language}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Funciones Prohibidas</li>
                                    </Typography>
                                    {js.forbiddenFunctions.length > 0 ?
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            {js.forbiddenFunctions}
                                        </Typography>
                                        :
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            No hay funciones prohibidas
                                        </Typography>
                                    }
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Código Inicial</li>
                                    </Typography>
                                    {js.initialCode.length > 0 ?
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            {js.initialCode}
                                        </Typography>
                                        :
                                        <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                            No hay código inicial
                                        </Typography>
                                    }
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Inputs Privados</li>
                                    </Typography>
                                    {Object.entries(formattedHInputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Outputs Privados</li>
                                    </Typography>
                                    {Object.entries(js.houtputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Inputs Públicos</li>
                                    </Typography>
                                    {Object.entries(formattedSInputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Outputs Públicos</li>
                                    </Typography>
                                    {Object.entries(js.soutputs).map(([key, value]) => (
                                        <div key={key}>
                                            <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                                {'{'}{value}{'}'}
                                            </Typography>
                                        </div>
                                    ))}
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'appDark.text', fontSize: 18, mt: '2vh' }}>
                                        <li>Tiempos Máximo de Ejecución</li>
                                    </Typography>
                                    <Typography paddingX={3} sx={{ color: 'appDark.text', fontSize: 15 }}>
                                        {js.timeoutSec} seg
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>

                )}
            </Grid>
        </Grid >

    )
}

const filterData = (moduleQuery, idQuery, requestData) => {
    if (!moduleQuery && !idQuery) {
        return requestData;
    } else {
        return requestData.filter((d) => {
            return (
                (moduleQuery && d.module.toLowerCase().includes(moduleQuery.toLowerCase())) ||
                (idQuery && d.course.toLowerCase().includes(idQuery.toLowerCase()))
            );
        });
    }
};