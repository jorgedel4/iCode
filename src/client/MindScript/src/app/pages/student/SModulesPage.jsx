import { Grid, Typography } from '@mui/material'
import { ModulesLayout } from "../../layout"
import { SModuleCard } from '../../components'
// import { PModuleCard } from '../../components'
import { getAuth } from "firebase/auth";

export const SModulesPage = () => {
    const home = '/student/home'
    const groupName = 'TC1028 (Gpo. 404)' //El nombren se debe de sacar desde la pagina home

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
        // console.log("Student modules user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Matrícula A00000000
        const schoolID = (user.email).substring(0, 8);
        // console.log("Matrícula ", schoolID)
    }

    const homeworkData = [
        {
            title: 'Lunes',
            homework: [ //Tareas que se entregen el lunes de esa semana
                {
                    work: 'Tarea 1' //nombre de la tarea
                },
                {
                    work: 'Tarea 2'
                },
            ]
        },
        {
            title: 'Martes',
            homework: [
            ]
        },
        {
            title: 'Miercoles',
            homework: [
                {
                    work: 'Tarea 1'
                },
                {
                    work: 'Tarea 2'
                },
            ]
        },
        {
            title: 'Jueves',
            homework: [
                {
                    work: 'Tarea 1'
                },
                {
                    work: 'Tarea 2'
                },
            ]
        },
        {
            title: 'Viernes',
            homework: [
                {
                    work: 'Tarea 1'
                },
                {
                    work: 'Tarea 2'
                },
            ]
        },
        {
            title: 'Sabado',
            homework: [
                {
                    work: 'Tarea 1'
                },
                {
                    work: 'Tarea 2'
                },
            ]
        },
        {
            title: 'Domingo',
            homework: [
                {
                    work: 'Tarea 1'
                },
                {
                    work: 'Tarea 2'
                },
            ]
        }
    ]

    const modules = [
        {
            name: 'Variables',
            noQuestions: 5,
            progress: 3,
            openDate: '23/01/2023',
            closeDate: '23/02/2023',
            block: true
        },
        {
            name: 'Condicionales',
            noQuestions: 10,
            progress: 3,
            openDate: '23/01/2023',
            closeDate: '23/02/2023',
            block: false
        },
        {
            name: 'Ciclos While',
            noQuestions: 5,
            progress: 4,
            openDate: '23/01/2023',
            closeDate: '23/02/2023',
            block: true
        },
    ]

    return (
        <ModulesLayout home={home} homeworkData={homeworkData} student={true} hwBTitle={'Asignaciones Faltantes'} groupName={groupName}>
            <Grid container columnSpacing={40} rowSpacing={5}>
                {modules.map((module, index) => (
                    <Grid item key={index} xs={12} md={4}>
                        <SModuleCard module={module} index={index} />
                    </Grid>
                ))}
            </Grid>
        </ModulesLayout>
    )
}

