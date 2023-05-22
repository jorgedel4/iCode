import { Card, CardContent, CardActionArea, Grid, Typography } from '@mui/material'
import { PersonSearchOutlined } from '@mui/icons-material'
import { ModulesLayout } from "../../layout"
import { PModuleCard } from '../../components'
import { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { useParams } from 'react-router-dom';

export const PModulesPage = () => {
    let params = useParams()
    const home = '/professor/home'
    const groupName = (params.course + ' (Gpo. ID ' + params.group + ')') //El nombren se debe de sacar desde la pagina home

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    var schoolID;
    if (user !== null) {
        // console.log("Professor modules user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Nómina L00000000
        schoolID = (user.email).substring(0, 9).toUpperCase();
        // console.log("Nómina ", schoolID)
    }

    const pages = ['Gestion de Usuarios', 'Solicitudes', 'Plan de Estudios']
    
    //API para obtener los datos de las tareas
    const [homeworkData, setHomework] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        const group = params.group;

        const fetchData = async () => {
            try {
                const response = await fetch(`http://34.125.0.99:8002/homework?id=${schoolID}&time=future&group=${group}&group_by=group`, options);
                // const response = await fetch(`http://34.125.0.99:8002/homework?id=L00000001&time=future&group=G000000001&group_by=group`, options);
                const responseData = await response.json();
                setHomework(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, []);

    // const homeworkData = {
    //     "G000000001": [
    //         {
    //             "hw_id": "H0000000000000000001",
    //             "hw_name": "Tarea 1: Condicionales",
    //             "course_id": "TC1028",
    //             "course_name": "Pensamiento computacional",
    //             "group_id": "G000000001",
    //             "opening": "2023-05-05T00:00:00Z",
    //             "closing": "2023-05-10T00:00:00Z"
    //         },
    //         {
    //             "hw_id": "H0000000000000000002",
    //             "hw_name": "Tarea 2: Condicionales",
    //             "course_id": "TC1028",
    //             "course_name": "Pensamiento computacional",
    //             "group_id": "G000000001",
    //             "opening": "2023-05-11T00:00:00Z",
    //             "closing": "2023-05-16T00:00:00Z"
    //         },
    //         {
    //             "hw_id": "H4809793312412692480",
    //             "hw_name": "Tarea 3: Mas practicas :)",
    //             "course_id": "TC1028",
    //             "course_name": "Pensamiento computacional",
    //             "group_id": "G000000001",
    //             "opening": "2023-05-11T00:00:00Z",
    //             "closing": "2023-05-14T00:00:00Z"
    //         }
    //     ]
    // }

    console.log(homeworkData)
    const homework = Object.values(homeworkData)

    //API para obtener los datos de las tarjeras de modulos
    const [modulesData, setModule] = useState([]);
    useEffect(() => {
       const options = {
           method: 'GET',
           headers: {
               'Accept': 'application/json',
           },
           mode: 'cors',
       }

       //  const group = "G000000001";
       const group = params.group;

       const fetchData = async () => {
           try {
               const response = await fetch(`http://34.125.0.99:8002/groupmodules/${group}`, options);
               const responseData = await response.json();
               setModule(responseData);
           } catch (error) {
               // console.error(error);
           }
       };

       fetchData();
    }, []);

    return (
        <ModulesLayout home={home} homeworkData={homework} student={false} hwBTitle={'Asignaciones'} groupName={groupName} pages={pages}>
            <Grid container columnSpacing={40} rowSpacing={5}>

                <Grid item xs={12} md={4}>

                    <Card sx={{
                        width: 260,
                        height: 190,
                        backgroundColor: 'secondary.main',
                        borderRadius: '12px',
                        boxShadow: '5px 5px 0px 5px rgba(0, 0, 0, 0.1)',
                        ':hover': { backgroundColor: 'secondary.main', opacity: 0.8 }
                    }}
                    >
                        <CardActionArea sx={{ height: 207, textAlign: "center", alignItems: "center" }}>
                            <CardContent sx={{ pt: 4, pb: 6 }}>

                                <PersonSearchOutlined sx={{ color: 'appDark.icon', fontSize: 60, mt: 2 }} />
                                <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                    Gestión de Alumnos
                                </Typography>

                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {modulesData != null && modulesData != undefined ?
                    modulesData.map((module, index) => (
                        <Grid item key={index} xs={12} md={4}>
                            <PModuleCard module={module} index={index} group={params.group}/>
                        </Grid>
                ))
                : null}
            </Grid>
        </ModulesLayout>
    )
}
