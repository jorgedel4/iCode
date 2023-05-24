import React from 'react';
import { Grid, useTheme } from '@mui/material';
import { NavBar } from '../../components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const PDashboard = () => {
    const theme = useTheme();
    const pages = ['Home', 'Profile'];
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f0e'];

    const data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
        { name: 'C', value: 15 },
        { name: 'D', value: 25 },
    ];

    return (
        <Grid container alignContent='center' justifyContent='center' align='center' padding={3} spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <NavBar pages={pages} />
            <Grid item xs={12} sx={{ height: '90vh' }}>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={data}>
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
                            data={data}
                            dataKey='value'
                            nameKey='name'
                            cx='50%'
                            cy='50%'
                            outerRadius={150}
                            fill={theme.palette.appDark.button}
                            label
                        >
                            {data.map((entry, index) => (
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
