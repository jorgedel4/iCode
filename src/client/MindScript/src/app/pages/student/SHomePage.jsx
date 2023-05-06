import { Grid, Typography, CardContent, CardActionArea } from '@mui/material'
import { HomeLayout } from '../../layout/HomeLayout';
import { CoursesCard, ActionButton, CourseRegister } from '../../components'
import { AddCircleOutline } from '@mui/icons-material'
import { useState } from 'react';
import { getAuth } from "firebase/auth";

export const SHomePage = () => {

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
        // console.log("Student home user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Matrícula A00000000
        const schoolID = (user.email).substring(0, 8);
        // console.log("Matrícula ", schoolID)
    }

    const pages = ['Home', 'Profile']
    



//API region
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

        const request = await fetch('http://34.125.0.99:8002/courses', options);
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

//end API region

//Modal course registration
const [count, setCount] = useState(0);
const [openModalRegister, setOpenRegister] = useState(false);
const showModalRegister = () => { setOpenRegister(true); }
const closeModalRegister = () => {
    setOpenRegister(false);
    setCount(0);
}

//Navigate to
const modules = "/student/modules"
const home = "/student/home"

//for every data add to groupsData with desestructured info juas
const groupsData = [ //Se queda este
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
    {
        id_group: "G000000001",
        id_course: "TC1028",
        course_name: "Pensamiento computacional",
        start_date: "2023-02-15T00:00:00Z",
        end_date: "2023-06-26T23:59:59Z",
        first_name: "Daniel",
        flast_name: "Perez",
        slast_name: "Rojas"
    }
]
const homeworkData = [
    {
        title: 'Lunes',
        homework: [ //Tareas que se entregen el lunes de esa semana
            {
                group: 'Curso A', //nombre del grupo que tiene la tarea
                work: 'Tarea 1' //nombre de la tarea
            },
            {
                group: 'Curso A',
                work: 'Tarea 2'
            },
            {
                group: 'Curso C',
                work: 'Quiz 1'
            },
        ]
    },
    {
        title: 'Martes',
        homework: [
            {
                group: 'Curso B',
                work: 'Tarea 1'
            },
            {
                group: 'Curso B',
                work: 'Quiz 2'
            },
        ]
    },
    {
        title: 'Miercoles',
        homework: [
            {
                group: 'Curso A',
                work: 'Tarea 1'
            },
            {
                group: 'Curso A',
                work: 'Tarea 2'
            },
            {
                group: 'Curso C',
                work: 'Quiz 1'
            },
        ]
    },
    {
        title: 'Jueves',
        homework: [
            {
                group: 'Curso A',
                work: 'Tarea 1'
            },
            {
                group: 'Curso A',
                work: 'Tarea 2'
            },
            {
                group: 'Curso C',
                work: 'Quiz 1'
            },
        ]
    },
    {
        title: 'Viernes',
        homework: [
            {
                group: 'Curso A',
                work: 'Tarea 1'
            },
            {
                group: 'Curso A',
                work: 'Tarea 2'
            },
            {
                group: 'Curso C',
                work: 'Quiz 1'
            },
        ]
    },
    {
        title: 'Sabado',
        homework: [
            {
                group: 'Curso A',
                work: 'Tarea 1'
            },
            {
                group: 'Curso A',
                work: 'Tarea 2'
            },
            {
                group: 'Curso C',
                work: 'Quiz 1'
            },
        ]
    },
    {
        title: 'Domingo',
        homework: [
            {
                group: 'Curso A',
                work: 'Tarea 1'
            },
            {
                group: 'Curso A',
                work: 'Tarea 2'
            },
            {
                group: 'Curso C',
                work: 'Quiz 1'
            },
        ]
    }
]

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

            {groupsData.map((group, index) => (
                <Grid key={index} item xs={12} md={4}>
                    <CoursesCard group={group} index={index} modules={modules} />
                </Grid>
            ))}

        </Grid>

    </HomeLayout>
)
}