import { Card, CardContent, CardActionArea, Grid, Typography } from '@mui/material'
import { PersonSearchOutlined } from '@mui/icons-material'
import { ModulesLayout } from "../../layout"
import { PModuleCard } from '../../components'
import { getAuth } from "firebase/auth";

export const PModulesPage = () => {
    const home = '/professor/home'
    const groupName = 'TC1028 (Gpo. 404)' //El nombren se debe de sacar desde la pagina home

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
        // console.log("Professor modules user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Nómina L00000000
        const schoolID = (user.email).substring(0, 8);
        // console.log("Nómina ", schoolID)
    }

    const homeworkData = [
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

    const modules = [
        {
            name: 'Variables',
            block: true
        },
        {
            name: 'Condicionales',
            block: false
        },
        {
            name: 'Ciclos While',
            block: false
        },
    ]

    return (
        <ModulesLayout home={home} homeworkData={homeworkData} student={false} hwBTitle={'Asignaciones'} groupName={groupName}>
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
                                    Gstión de Alumnos
                                </Typography>

                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>

                {modules.map((module, index) => (
                    <Grid item key={index} xs={12} md={4}>
                        <PModuleCard module={module} index={index} />
                    </Grid>
                ))}
            </Grid>
        </ModulesLayout>
    )
}
