// --------------------------------------------------------------------
// ** file="SModulesPage.jsx" by="Isreales Solutions">
// ** Copyright 2023 Isreales Solutions and its affiliates.
// --------------------------------------------------------------------

// ------------ # Imports region -----------------

// Core components from MUI
import { useState, useEffect } from 'react';
import { Grid, Typography, List, IconButton, Button } from '@mui/material'
import { Card, CardContent, CardActionArea } from '@mui/material'
import { useParams } from 'react-router-dom';
import { getAuth } from "firebase/auth";

// MindScript Components
import { PracticeCard } from '../../components';
import { FreeModeLayout } from '../../layout';

// ------------ ## End Imports region ------------

export const FreeModeM = () => {
    // Initial States and Variables 
    const batmanAPI = import.meta.env.VITE_APP_BATMAN;
    let params = useParams()
    const freemode = '/student/freemode' //remove?
    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

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
    /* Si se crea un endpoint para obtener todos los modulos, esto se borra
    y se remplaza por es API */
    //GET course information

    //GET - Endpoint for obtaining module card data 
    const [modulesData, setModule] = useState([]);

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
                const response = await fetch(`${batmanAPI}coursemodules/${params.course}`, options);
                const responseData = await response.json();
                setModule(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // console.log("modulesData", modulesData)

    //Esto se borra cuando las APIs para obtener los modulos esten listas
    // const modulesData = [
    //     {
    //         "id": "M0000000000000000001",
    //         "name": "Basics"
    //     },
    //     {
    //         "id": "M0000000000000000002",
    //         "name": "Conditionals"
    //     },
    //     {
    //         "id": "M0000000000000000003",
    //         "name": "For loops"
    //     },
    //     {
    //         "id": "M0000000000000000004",
    //         "name": "Atributos"
    //     },
    //     {
    //         "id": "M0000000000000000005",
    //         "name": "Metodos"
    //     },
    //     {
    //         "id": "M0000000000000000006",
    //         "name": "Polimorfismo"
    //     },
    //     {
    //         "id": "M0000000000000000007",
    //         "name": "Complejidades"
    //     },
    //     {
    //         "id": "M0000000000000000008",
    //         "name": "Busqueda binaria"
    //     },
    //     {
    //         "id": "M0000000000000000009",
    //         "name": "Arbol binario"
    //     }
    // ]

    return (
        <FreeModeLayout backPage={"Cursos de modo práctica"} backURL={freemode}>
            {/* Displaying modules cards */}
            {modulesData.map((module, index) => (
                <Grid item key={index} xs={12} md={3.7} lg={2.7} xl={3} >
                    <PracticeCard module={module} index={index} />
                </Grid>
            ))}
        </FreeModeLayout>
    )
}

