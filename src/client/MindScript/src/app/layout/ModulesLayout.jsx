import { Grid, Typography, List, IconButton, Button } from '@mui/material'
import { DeleteOutline, Edit } from '@mui/icons-material'
import { NavBar, HomeworkBoard, SMHomeworkCard } from '../components' 

export const ModulesLayout = ({ children, home, homeworkData, student, hwBTitle, groupName, pages }) => {
    return (
        <Grid container padding={5} spacing={0} sx={{minHeight:'100vh', bgcolor: 'primary.main'}}>
            <NavBar pages={pages}/>

            <Grid item xs={12} sx={{mt:4, height: '24px'}}>
                <Button href={home} sx={{ color: 'appDark.link', fontWeight: 900, fontSize: 16 }}>
                    {'< Cursos'}
                </Button>
            </Grid>

            <Grid item xs={12}>
                <Typography fontWeight={900} fontSize={18} sx={{ color: 'appDark.text' }}>
                    {groupName}
                </Typography>
            </Grid> 

            <Grid item xs={12} md={3} lg={5} xl={6} sx={{mt:1}}>
                { children }
            </Grid>

            <Grid item xs={12} md={9} lg={7} xl={6} sx={{mt:1}}>

                <Grid container justifyContent='flex-end'>
                    
                    <HomeworkBoard xs={-1}>
                        <Typography sx={{ fontSize: 20, fontWeight: 500, pt: 5, pb: 3 }}>{hwBTitle}</Typography>

                        <List>
                            {student?
                                <>
                                    {homeworkData.map((data, index) => (
                                        <SMHomeworkCard key={ index }  data={ data } index={ index } />
                                    ))}
                                </>
                                
                            :
                                <>
                                    {homeworkData[0].map((data, index) => (
                                        <Grid key = { index } container 
                                            alignItems='center'
                                            sx={{ width: 300 }}
                                            >
                                            <Grid item xs={9}>
                                                <Typography>{data.hw_name}</Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton sx={{ color: 'appDark.icon' }}>
                                                    <Edit/>
                                                </IconButton>
                                            </Grid>

                                            <Grid item xs={1}>
                                                <IconButton sx={{ color: 'appDark.icon' }}>
                                                    <DeleteOutline/>
                                                </IconButton>
                                            </Grid>
                                        
                                            
                                        </Grid>
                                    ))}
                                </>
                            }     
                        </List>

                    </HomeworkBoard>

                    {!student ?
                        <>
                            <Button
                                variant="contained"
                                sx={{ width: 400, bgcolor: 'appDark.button', mb: 1,
                                ':hover': { bgcolor: 'appDark.button', opacity: 0.8 } }}
                            >
                                Avances y Progresos
                            </Button>

                            <Button
                                variant='contained'
                                sx={{ width: 400, bgcolor: 'appDark.button', mb: 1,
                                ':hover': { bgcolor: 'appDark.button', opacity: 0.8 } }}
                            >
                                Mandar Preguntas
                            </Button>
                        </>
                    :null}
                </Grid>

            </Grid>

        </Grid>
        
    )
}