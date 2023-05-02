import { Grid, Button, Typography } from '@mui/material'
import * as React from 'react';
import { QuestionsDropdown, TestsTabs } from '../../components';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
  

export const WorkEnv = ({ onPrueba }) => {
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

    const [content, setContent] = useState('');
    //Objeto para codeExec
    const hwData = {
        code: content,
        id: 'HQ000000000000000001',
    }

    const handleEditorDidMount = async () => {

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            mode: 'no-cors',
            body: JSON.stringify({
                // "id": "test/test/2",
                // "code": "def smallest(a, b):\n\treturn a if a < b else b"
                "id": hwData.id,
                "code": hwData.code
            })
        }

        fetch('http://34.125.0.99:8001/exec', options)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })

    };

    //Objeto para test
    const tests = [
        {
            status: true,
            feed: "djchdjdjds"
        },
        {
            status: true,
            feed: "djdkjdidweifujsd"
        },
        {
            status: false,
            feed: "djkdjsldjdkendjcs"
        }

    ]

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
                            <Button onClick={handleEditorDidMount} variant="contained" sx={{ backgroundColor: 'appDark.button' }}>
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
                        <Editor
                            language='python'
                            theme="vs-dark"
                            value={content}
                            onChange={(value) => setContent(value)}
                        />
                    </Grid>
                    {/* Terminal*/}
                    <Grid item xs={12}
                        sx={{ height: '39vh', bgcolor: 'secondary.main', mt: '1vh', padding: '1.5vh' }}
                    >

                        <Typography sx={{ color: 'appDark.text' }}>Casos de Prueba</Typography>

                        <TestsTabs tests={ tests }/>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}