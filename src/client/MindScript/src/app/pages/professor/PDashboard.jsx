import { useState, useEffect } from 'react';
import { Grid, Typography, useTheme, Button } from '@mui/material';
import { NavBar } from '../../components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useParams, Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Block, Pending, CheckCircle } from '@mui/icons-material';

export const PDashboard = () => {
    const theme = useTheme();
    let params = useParams();
    const batmanAPI = import.meta.env.VITE_APP_BATMAN;


    const pages = [
        { name: 'Home', route: '/professor/home' },
        { name: 'Profile', route: '/professor/profile' },
    ]
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e'];

    const [gridStats, setGridStats] = useState([]);
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
                const response = await fetch(`${batmanAPI}grouphwstatus/${params.group}`, options);
                const responseData = await response.json();
                setGridStats(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    let homeworkNames, columns, rows;
    // Extracting unique homework names
    if (Array.isArray(gridStats) && gridStats.length > 0) {
        homeworkNames = Array.from(new Set(gridStats[0].homework.map(homework => homework.name)));

        // Define columns based on homework names
        columns = [
            { field: 'matricula', headerName: 'Matricula', maxWidth: 100, flex: 2, align: 'center', headerAlign: 'center' },
            { field: 'nombre', headerName: 'Student', maxWidth: 200, flex: 2, align: 'center', headerAlign: 'center' },
            ...homeworkNames.map(homeworkName => ({
                field: homeworkName,
                headerName: homeworkName,
                width: 200,
                renderCell: (params) => {
                    const homeworkStatus = params.row[homeworkName];
                    return homeworkStatus === 'not started' ? <Block sx={{ color: 'appDark.rejected' }} /> : homeworkStatus === 'started' ? <Pending sx={{ color: 'appDark.pending' }} /> : homeworkStatus === 'finished' ? <CheckCircle sx={{ color: 'appDark.approved' }} /> : null;
                },
                flex: 2, align: 'center', headerAlign: 'center'
            })),
            {
                field: 'finishedCount',
                headerName: 'Reporte',
                maxWidth: 90,
                renderCell: (params) => {
                    const homeworkStatuses = Object.values(params.row).slice(3);
                    const finishedCount = homeworkStatuses.filter(status => status === 'finished').length;
                    const totalCount = homeworkStatuses.length;
                    return `${finishedCount}/${totalCount}`;
                },
                flex: 2, align: 'center', headerAlign: 'center'
            },
        ];

        // Define rows based on the data
        rows = gridStats.map((student) => ({
            id: student.matricula,
            matricula: student.matricula,
            nombre: student.nombre,
            ...student.homework.reduce((acc, homework) => {
                acc[homework.name] = homework.status;
                return acc;
            }, {}),
        }));

    }

    return (
        <Grid container alignContent='center' justifyContent='center' align='center' padding={3} spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />
            <Grid item xs={12} align='left' sx={{ mt: 4, height: '1vh' }}>
                <Button component={Link} to={`/professor/modules/${params.group}/${params.course}`} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 16 }}>
                    {'< Modulos'}
                </Button>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, height: '1vh' }}>
                <Typography sx={{ color: 'appDark.text', fontWeight: 500, fontSize: 25 }}>
                    Progreso del Grupo {params.group}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ color: 'appDark.text', bgcolor: 'appDark.bgBox', height: '70vh', mt: 2, borderRadius: 2, mt: 5 }}>
                {Array.isArray(gridStats) && gridStats.length > 0 && (
                    <DataGrid disableColumnMenu disableHear rows={rows} columns={columns} theme={theme} sx={{ color: 'appDark.text', border: 0 }} />
                )}
            </Grid>
            <Grid item xs={12} sx={{ height: '90vh' }}>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={gridStats}>
                        <CartesianGrid />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill={theme.palette.appDark.button} />
                    </BarChart>
                </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} sx={{ height: '90vh' }}>
                <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                        <Pie
                            data={gridStats}
                            dataKey='value'
                            nameKey='name'
                            cx='50%'
                            cy='50%'
                            outerRadius={150}
                            fill={theme.palette.appDark.button}
                            label
                        >
                            {gridStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Grid>
        </Grid>
    );
};
