import { Grid, Typography, List } from '@mui/material'
import { NavBar, HomeworkBoard, SHHomeworkCard, PHHomeworkCard } from '../components' 

export const HomeLayout = ({ children, homeworkData, student=false, hwBTitle, home, pages }) => {

    return (
        <Grid container padding={5} spacing={0} sx={{minHeight:'100vh', bgcolor: 'primary.main'}}>
            <NavBar pages={pages}/>

            <Grid item xs={12} md={3} lg={5} xl={6} sx={{mt:5}}>
                { children }
            </Grid>

            <Grid item xs={12} md={9} lg={7} xl={6} sx={{mt:5}}>
                <Grid container justifyContent='flex-end'>
                    <HomeworkBoard xs={-1} >
                        <Typography sx={{ fontSize: 20, fontWeight: 500, pt: 5, pb: 3 }}>{hwBTitle}</Typography>

                        <List> 
                            {student?
                                <>
                                    {homeworkData.map((data, index) => (
                                        <SHHomeworkCard key={ index }  data={ data } index= { index } />
                                    ))}
                                </>
                        
                            :
                                <>
                                    {homeworkData.map((data, index) => (
                                        <PHHomeworkCard key={ index }  data={ data } />
                                    ))}
                                </>
                                // null
                            }
                        </List>

                    </HomeworkBoard>
                </Grid>
            </Grid>
            
        </Grid>
    )
}