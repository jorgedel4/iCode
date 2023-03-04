const express = require('express');

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/:language', (req, res) => {
    const { code, problemID } = req.body;
    const { language } = req.params;

    console.log('\nReceived request');
    console.log(`Code ${code}`);
    console.log(`ID ${problemID}`);
    console.log(`Language ${language}`);

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Code Exec running on port ${port}`);
});
