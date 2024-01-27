const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// path to db.json
const dbFilePath = './db/db.json';

// read existing notes from db.json
function readNotes() {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// write notes to db.json
function writeNotes(notes) {
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2), 'utf8');
}