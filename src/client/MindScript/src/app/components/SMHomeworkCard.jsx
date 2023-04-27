import { Card, Collapse, List, ListItem, ListItemButton, ListItemText, Typography, Grid, IconButton } from '@mui/material'
import { DeleteOutline, Edit, ExpandLess, ExpandMore } from '@mui/icons-material'
import * as React from 'react';

export const SMHomeworkCard = ({ data }) => {

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (

        <Card
            sx={[
                { borderRadius: '0px', boxShadow: 'none', mb: 2, width: 350 },
                open && {
                    borderRadius: '12px', 
                }
            ]}
        >
            <ListItemButton 
                onClick={handleClick}
                sx={[
                    { 
                    backgroundColor: 'secondary.main' ,
                    ':hover': { backgroundColor: 'secondary.main', opacity: 0.9 }
                    },
                    open && {
                        backgroundColor: '#62569D',
                        ':hover': { backgroundColor: '#62569D', opacity: 0.9 }
                    }
                ]}
            >
                {open ? <ExpandLess sx={{ color: 'appDark.icon' }} /> : <ExpandMore sx={{ color: 'appDark.icon' }} />}
                <ListItemText sx={{ color: 'appDark.text' }} primary={ data.title } />
                <Grid sx={{ borderRadius: '20px', border: 2, borderColor: 'appDark.icon' }}>
                    <Typography sx={{ color: 'appDark.icon', fontWeight: 'bold', my:.1, mx:1.1 }}>{ data.homework.length }</Typography>
                </Grid>

            </ListItemButton>

            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
            >
                <List
                    component="div"
                    disablePadding
                >

                    {data.homework.map((homework, indexH) => (
                        <Grid container key={ indexH }>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText sx={{ pl: 4 }} primary={ homework.work } />
                                </ListItemButton>
                            </ListItem>
                        </Grid>

                    ))}

                </List>
            </Collapse>
        </Card>
    )
}