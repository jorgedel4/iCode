import { Card, CardContent, CardActionArea, Typography, Grid } from '@mui/material'
import * as React from 'react';

export const CoursesCard = ({ group, index, modules}) => {
    const colors = ["#C12C45", "#5EC1F3", "#55D16E", "#FACD34"]
    const color = index - (colors.length * parseInt(index / colors.length));

    return (
        <Grid>
            <Card sx={{
                width: 300,
                backgroundColor: 'secondary.main',
                borderRadius: '12px',
                boxShadow: '5px 5px 0px 5px rgba(0, 0, 0, 0.1)',
                ':hover': { backgroundColor: 'secondary.main', opacity: 0.8 } }}
            >
                <CardActionArea href={modules}>
                    <Grid sx={{ backgroundColor: `${colors[color]}`, height: 40 }} />
                    <CardContent sx={{ pt: 4, pb: 6 }}>
                        <Typography sx={{ color: 'appDark.text', fontSize: 26, fontWeight: 405 }} >
                            {group.name}
                        </Typography>
                        <Typography sx={{ color: 'appDark.text', fontSize: 18, fontWeight: 405 }}>
                            {group.openDate} - {group.closeDate}
                        </Typography>
                        <Typography sx={{ color: 'appDark.text', fontSize: 14, fontWeight: 405 }}>
                            {group.professor}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}