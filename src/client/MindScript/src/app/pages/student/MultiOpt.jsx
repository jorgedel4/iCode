import { Grid, Button, Typography } from '@mui/material'
import { NavBar, QuestionsDropdown, OptionButton } from '../../components'
import { getAuth } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const MultiOpt = () => {
    const location = useLocation();
    const data = location.state?.data;
    const riddleAPI = import.meta.env.VITE_APP_RIDDLE;
    let responseInfo;

    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    const schoolID = (user.email).substring(0, 9);
    if (user !== null) {
        // console.log("Student home user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Matrícula A00000000
        // console.log("Matrícula ", schoolID)
    }


    const group = 'TC1028 (Gpo. 404)'
    const module = 'Variables'
    const qNumber = 'Pregunta #'

    const pages = [
        { name: 'Home', route: '/student/home' },
        { name: 'Profile', route: '/student/profile' },
    ]

    const questions = [
        'Pregunta 1',
        'Pregunta 2',
        'Pregunta 3',
        'Pregunta 4',
        'Pregunta 5',
        'Pregunta 6',
        'Pregunta 7',
        'Pregunta 8',
        'Pregunta 9',
        'Pregunta #',
    ];

    const [homework, setHomework] = useState([]);
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
                const response = await fetch(`${riddleAPI}questions?id_assigment=${data.id}&id_student=${schoolID}&id_group=${data.group}`, options);
                const responseData = await response.json();
                setHomework(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [data]);

    if (homework.info !== undefined) {
        responseInfo = JSON.parse(homework.info);
    }

    return (
        <Grid container direction='column' padding={5} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />

            {/* Button to return to modules */}
            <Grid item xs={12} sx={{ mt: 4, height: '24px' }}>
                <Button sx={{ color: 'appDark.text', fontWeight: 900, fontSize: 16 }}>
                    {'<' + group}
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography fontWeight={900} fontSize={18} sx={{ color: 'appDark.text' }}>
                    {module}
                </Typography>
            </Grid>

            {/* Inside card */}
            <Grid item xs={12} sx={{ mt: 2, bgcolor: 'secondary.main', borderRadius: 1 }}>
                <Grid container padding={5} direction="column" justifyContent="center" alignItems="center">
                    {/* Question name */}
                    <Grid item xs={12} >
                        <Typography sx={{ color: 'appDark.text', fontWeight: 900, fontSize: 25 }}>{qNumber}</Typography>
                    </Grid>

                    {/* Question description */}
                    <Grid item xs={12} mt={5}>
                        <Typography align='justify' sx={{ color: 'appDark.text', fontSize: 20 }}>
                            {responseInfo !== undefined && (
                                responseInfo.question
                            )}
                        </Typography>
                    </Grid>

                    {/* Container with the options */}
                    <Grid container direction='row' justifyContent="center">
                        {responseInfo !== undefined && responseInfo.options.map((option, index) => (
                            <OptionButton key={index} option={option} />
                        ))}
                    </Grid>

                    {/* Buttons section */}
                    <Grid container direction='row'>
                        <Grid item xs={12} sm={8} md={9} lg={10} xl={11} mt={2} >
                            <QuestionsDropdown questions={questions} qName={'Pregunta #'} />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3} lg={2} xl={1} mt={2} align='right' >
                            <Button
                                sx={{
                                    color: 'appDark.text',
                                    bgcolor: 'appDark.button',
                                    fontWeight: 900,
                                    ':hover': { backgroundColor: 'appDark.button', opacity: 0.7 }
                                }}>
                                {'Entregar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}