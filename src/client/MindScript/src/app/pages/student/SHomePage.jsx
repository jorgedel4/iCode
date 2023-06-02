// --------------------------------------------------------------------
// ** file="SHomePage.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { useState, useEffect } from 'react';
import { CardContent, CardActionArea, Grid, Typography, Card } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { getAuth } from "firebase/auth";

// MindScript Components
import { HomeLayout } from '../../layout/HomeLayout';
import { ActionButton, CoursesCard, CourseRegister } from '../../components';

// ------------ ## End Imports region ------------

export const SHomePage = () => {

    // Initial States and Variables 
    const batmanAPI = import.meta.env.VITE_APP_BATMAN;
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]
    //Navigate to
    //remove?
    const modules = "/student/modules"
    const home = "/student/home"

    //Modal Course Registration States
    const [count, setCount] = useState(0);
    const [openModalRegister, setOpenRegister] = useState(false);
    const showModalRegister = () => { setOpenRegister(true); }
    const closeModalRegister = () => {
        setOpenRegister(false);
        setCount(0);
    }

    //Current user data
    const auth = getAuth();
    const user = auth.currentUser;
    var schoolID;
    if (user !== null) {
        const { email, displayName, emailVerified, uid } = user
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Student modules user info", user)
        // console.log("Matrícula ", schoolID)
    }

    // ------------ # API region ------------

    //POST - remove?
    const handlerHelp = async () => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors',
                body: JSON.stringify({
                    id: "L01922384",
                    term: "current"
                })
            };

            const request = await fetch(`${batmanAPI}courses`, options);
            // if (!request.ok) {
            //   throw new Error(`HTTP error! status: ${request.status}`);
            // }
            // console.log(request);
            const incomingdata = await request.json();
            console.log(data);

        }
        catch (error) {
            console.log("aaaa", error)
        }
    }

    //GET - group information
    const [groupsData, setGroup] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        let term = "all"

        const fetchData = async () => {
            try {
                const response = await fetch(`${batmanAPI}groups?id=${schoolID}&term=${term}`, options);
                const responseData = await response.json();
                setGroup(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [groupsData]);

    //GET - Obtaining weekly homework data
    const [homeworkData, setHomework] = useState([]);
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
                const response = await fetch(`${batmanAPI}homework?id=${schoolID}&time=week&group=all&group_by=week`, options);
                const responseData = await response.json();
                setHomework(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, [homeworkData]);

    // ------------ ## End API region -------

    // ------- # Functions and Events region -------
    // ---- ## End Functions and Events region -----

    return (
        <HomeLayout homeworkData={homeworkData} student={true} hwBTitle={'Asignaciones Faltantes'} home={home} pages={pages} >
            {/* Modales */}
            <CourseRegister open={openModalRegister} close={closeModalRegister} setCount={setCount} count={count} />

            <Grid container columnSpacing={40} rowSpacing={5}>
                <Grid item xs={12} md={4}>
                    <ActionButton >
                        <CardActionArea onClick={showModalRegister} sx={{ height: 207, textAlign: "center" }}>
                            <CardContent sx={{ pt: 4, pb: 6 }}>
                                <AddCircleOutline sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                    Enrolar Curso
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </ActionButton>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{
                        width: 300,
                        height:246.5,
                        backgroundColor: 'secondary.main',
                        borderRadius: '12px',
                        boxShadow: '5px 5px 0px 5px rgba(0, 0, 0, 0.1)',
                        ':hover': { backgroundColor: 'secondary.main', opacity: 0.8 } }}
                    >
                        <CardActionArea href={"freemode"}>
                            <Grid sx={{ backgroundColor: "#C12C45", height: 40 }} />
                            <CardContent sx={{ pt: 4, pb: 6, height: 208 }}>
                                <Typography align='center'  xs={6} sx={{ color: 'appDark.text', fontSize: 30, fontWeight: 405, mt: 5 }} >
                                    Modo de Práctica
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {/* Displaying Group cards */}
                {groupsData.map((group, index) => (
                    <Grid key={index} item xs={12} md={4}>
                        <CoursesCard group={group} index={index} modules={modules} />
                    </Grid>
                ))}

            </Grid>

        </HomeLayout>
    )
}