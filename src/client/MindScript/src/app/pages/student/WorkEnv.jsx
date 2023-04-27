import { Grid, Button, Typography } from '@mui/material'
import { EditorDisplay, QuestionsDropdown } from '../../components';

export const WorkEnv = () => {
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
    
    return (
        <Grid container padding={3} justifyContent='center' alignContent='center' spacing={0} sx={{ minHeight: '100vh', bgcolor: 'primary.main' }}>
            <Grid item xs={4}>
                <Grid container px={1} justifyContent='start' sx={{ bgcolor: 'secondary.main', color: 'appDark.text', height: '90vh' }}>
                    {/* Hw Description*/}
                    <Grid item xs={12}>
                        <Typography>Descripción prrona
                            Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

                            You may assume that each input would have exactly one solution, and you may not use the same element twice.

                            You can return the answer in any order.

                        </Typography>
                    </Grid>

                    <Grid container alignItems='flex-end'>
                        <Grid item xs={12} md={6} align='center' sx={{ mb: 2 }}>
                            <QuestionsDropdown questions={questions} qName={'Pregunta #'} />
                        </Grid>

                        <Grid item xs={12} md={6} align='center' sx={{ mb: 2 }}>
                            <Button variant="contained" sx={{ backgroundColor: 'appDark.button' }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

            <Grid item xs={8}>
                <Grid container px={1} justifyContent='end'>
                    {/* Code Editor */}
                    <Grid item xs={12}
                        sx={{ height: '50vh', bgcolor: 'secondary.main' }}>
                        <EditorDisplay />
                    </Grid>
                    {/* Terminal*/}
                    <Grid item xs={12}
                        sx={{ height: '39vh', bgcolor: 'secondary.main', mt: '1vh' }}>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}