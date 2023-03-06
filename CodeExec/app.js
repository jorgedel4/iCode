const bodyParser = require('body-parser');
const exp = require('constants');
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const { PythonShell } = require('python-shell');
const uuid = require('uuid');

const app = express();
const appPort = 3001;
const mdbPort = 27017;
const dbName = 'test';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
    .connect(`mongodb://localhost:${mdbPort}/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to mongodb succesfully');
    })
    .catch((err) => {
        console.log(
            `An error ocurred while trying to connect to mongodb: ${err}`
        );
    });

const codingExerciseSchema = new mongoose.Schema({
    id: String,
    description: String,
    language: String,
    nTests: Number,
    inputs: [String],
    outputs: [String],
});

const CodingExercise = new mongoose.model(
    'CodingExercise',
    codingExerciseSchema
);

app.listen(appPort, () => {
    console.log(`Code Exec running on port ${appPort}`);
});

function runPython(problemData, code) {
    const fileName = `${uuid.v4().replaceAll('-', '_')}.py`;
    const path = 'Generated/Python';

    fs.writeFileSync(`${path}/${fileName}`, code);

    const options = {
        mode: 'text',
        scriptPath: path,
    };

    PythonShell.run(fileName, options)
        .then((messages) => {
            console.log(messages);
        })
        .catch((err) => {
            console.log(err);
        });

    // fs.unlinkSync(`./Generated/Python/${fileName}`);
}

function runCode(language, problemID, code) {
    CodingExercise.find({ id: problemID })
        .then((data) => {
            switch (language) {
                case 'python':
                    return runPython(data, code);
            }
        })
        .catch((err) => {});
}

app.post('/:language', (req, res) => {
    const { problemID, code } = req.body;
    const { language } = req.params;

    const result = runCode(language, problemID, code);

    // res.send(result.execution);
    // res.sendStatus(result.status);

    res.sendStatus(200);
});
