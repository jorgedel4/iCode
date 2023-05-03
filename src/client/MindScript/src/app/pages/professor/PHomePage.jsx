import { Grid, useTheme, Typography, CardContent, CardActionArea } from '@mui/material'
import { HomeLayout } from '../../layout/HomeLayout';
import { CoursesCard, ActionButton, CreateGroup, CreateHomework } from '../../components'
import { AddCircleOutline, NoteAddOutlined, UploadFile } from '@mui/icons-material'
import { useState, useEffect } from 'react';

export const PHomePage = () => {
    const theme = useTheme();

    const [groupsData, setGroup] = useState([]);
    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors',
        }

        let userID = "L00000001"
        let term = "current"

        const fetchData = async () => {
            try {
                const response = await fetch(`http://34.125.0.99:8002/groups?id=${userID}&term=${term}`, options);
                const responseData = await response.json();
                setGroup(responseData);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchData();
    }, []);


    

    //Funciones para abrir la modal de Crear Curso
    const [open, setOpen] = useState(false);
    const showModal = () => { setOpen(true); }
    const closeModal = () => {
        setCount(0)
        setOpen(false);
    }

    //Funciones para abrir la modal de Crear Curso
    const [openCreateHomework, setOpenCreateHomework] = useState(false);
    const showModalCreateHomework = () => { setOpenCreateHomework(true); }
    const closeModalCreateHomework = () => {
        setOpenCreateHomework(false);
    }

    //Dynamic modal view
    const [count, setCount] = useState(0);
    const home = '/professor/home'
    const modules = '/professor/modules' //El nombren se debe de sacar desde la pagina home


    // const groupsData = [ 
    // {
    //     name: "Curso A", //Nombre del grupo (nombre del curso)
    //     openDate: "26 de Marzo", //Cuando abre
    //     closeDate: "26 de Abril", //Cuando cierra
    //     professor: "Daniel Perez Rojas" //Nombre del profesor encargado del grupo
    // },
    // {
    //     name: "Curso B",
    //     openDate: "27 de Marzo",
    //     closeDate: "27 de Abril",
    //     professor: "Daniel Perez Rojas"
    // },
    // {
    //     id_group: "G000000001",
    //     id_course: "TC1028",
    //     course_name: "Pensamiento computacional",
    //     start_date: "2023-02-15T00:00:00Z",
    //     end_date: "2023-06-26T23:59:59Z",
    //     first_name: "Daniel",
    //     flast_name: "Perez",
    //     slast_name: "Rojas"
    // }
    // ]

    const homeworkData = [
        {
            title: 'Curso A',
            homework: [ //Tareas que se entregen del curso A
                {
                    work: 'Tarea 1' //nombre de la tarea
                },
                {
                    work: 'Tarea 2'
                },
                {
                    work: 'Quiz 1'
                },
            ]
        },
        {
            title: 'Curso B',
            homework: [
                {
                    work: 'Tarea 1'
                },
                {
                    work: 'Quiz 2'
                },
            ]
        },
        {
            title: 'Curso C',
            homework: [
                {
                    work: 'Tarea 1'
                },
                {
                    work: 'Tarea 2'
                },
                {
                    work: 'Quiz 1'
                },
            ]
        }
    ]


    //Courses lists de donde va a venir esta lista?
    const coursesList = [
        'TC1028',
        'TC1030',
        'TC10030B',
    ]
    const request = handleEditorDidMount()
    // console.log(groupsData)





    return (
        <Grid container justifyContent='center' alignItems='center'>

            <HomeLayout groupsData={groupsData} homeworkData={homeworkData} hwBTitle={'Asignaciones en Curso'} home={home}>

                {/* Modales */}
                <CreateGroup open={open} close={closeModal} />
                <CreateHomework open={openCreateHomework} close={closeModalCreateHomework} />

                <Grid container columnSpacing={40} rowSpacing={5}>

                    <Grid item md={12} xs={12} >
                        <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 500 }} >Acciones</Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <ActionButton >
                            <CardActionArea onClick={showModal} sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <AddCircleOutline sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Crear Grupo
                                    </Typography>


                                </CardContent>
                            </CardActionArea>
                        </ActionButton>
                    </Grid>

                    <Grid item xs={12} md={4}>

                        <ActionButton >
                            <CardActionArea onClick={showModalCreateHomework} sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <NoteAddOutlined sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Crear Tarea
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </ActionButton>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <ActionButton >
                            <CardActionArea sx={{ height: 207, textAlign: "center" }}>
                                <CardContent sx={{ pt: 4, pb: 6 }}>
                                    <UploadFile sx={{ color: 'appDark.icon', fontSize: 60, fontWeight: 100, mt: 2 }} />
                                    <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 405 }} >
                                        Solicitudes
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </ActionButton>
                    </Grid>

                    <Grid item md={12} xs={12} >
                        <Typography sx={{ color: 'appDark.text', fontSize: 20, fontWeight: 500 }} >Grupos Existentes</Typography>
                    </Grid>

                    {groupsData.map((group, index) => (
                        <Grid key={index} item xs={12} md={4} sx={{ pb: 5, pl: 5 }}>
                            <CoursesCard group={group} index={index} modules={modules} />
                        </Grid>
                    ))}
                </Grid>

            </HomeLayout >
        </Grid>
    )
}


const handleEditorDidMount = async () => {

    // const options = {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',

    //   },
    //   mode: 'cors',
    // }

    // let userID = "A01551955"
    // let term = "current"

    // fetch(`http://34.125.0.99:8002/groups?id=${userID}&term=${term}`, options)
    // .then(response => response.json())
    // // .then(data => console.log("aqui\n", data))
    // .then(data => setGroup(data))
    // .catch(error => console.error(error));



};