import { Button, Grid, Typography } from '@mui/material'
import React, { useState } from 'react';
import { NavBar, RequestCard } from '../../components'
import { getAuth } from "firebase/auth";

export const ARequest = () => {
    //Current user info
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
        // console.log("AdminRequest user info", user)
        //Desestructuración de user
        const { email, displayName, emailVerified, uid } = user
        //Nómina L00000000
        const schoolID = (user.email).substring(0, 8);
        // console.log("Nómina ", schoolID)
    }
    
    const [selected, setSelected] = useState(null);
    const handleCardSelection = (id) => {
        if (id === selected) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };

    const request = [
        {
            id: 1,
            name: "Dan Perez",
            course: "TC1028.Intro a Python",
            module: "If",
        },
        {
            id: 2,
            name: "Claudia Perez",
            course: "TC1028.Intro a Python",
            module: "While",
        },
        {
            id: 3,
            name: "Rosa Paredes",
            course: "TC1028.Intro a Python",
            module: "For",
        },
        {
            id: 4,
            name: "Juan Calleros",
            course: "TC1028.Intro a Python",
            module: "Def",
        },

    ]
    return (
        <Grid container padding={3} columnSpacing={1} sx={{ height: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages}/>
            <Grid item xs={4} sx={{ mt: 5 }}>
                <Grid container rowSpacing={1}>
                    {request.map((r) => (
                        <Grid key={r.id} item xs={12}>
                            <RequestCard request={r} setSelected={handleCardSelection} selected={selected === r.id} />
                        </Grid>
                    ))}
                </Grid>

            </Grid>

            <Grid item xs={8} sx={{ mt: 5 }}>
                <Grid container sx={{ bgcolor: 'secondary.main', height: '90vh', overflowY: 'scroll' }}>
                    <Grid item xs={12}>
                        <Typography padding={5} sx={{ color: 'appDark.text', fontSize: 20 }} >
                            Detalles del Problema
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container justifyContent='flex-end' columnSpacing={2} sx={{ pr: 5 }}>
                            <Grid item>
                                <Button type="submit"
                                    sx={{
                                        color: 'appDark.text',
                                        bgcolor: 'transparent',
                                        border: 0.5,
                                        borderColor: 'appDark.box',
                                        '&:hover': { bgcolor: 'appDark.adminButton', borderColor: 'transparent' },
                                        borderRadius: 5,
                                    }}>
                                    Aceptar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button type="submit"
                                    sx={{
                                        color: 'appDark.text',
                                        bgcolor: 'transparent',
                                        border: 0.5,
                                        borderColor: 'appDark.box',
                                        '&:hover': { bgcolor: 'appDark.adminButton', borderColor: 'transparent' },
                                        borderRadius: 5,
                                    }}>
                                    Rechazar
                                </Button>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>
            </Grid>
        </Grid>

    )
}
