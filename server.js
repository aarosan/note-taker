const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public'
app.use(express.static('public'));

// Middleware to parse JSON requests
app.use(express.json());

// Path to db
// PUT DEFINITION OF .JOIN HERE
const dbFilePath = path.join(__dirname, 'db', 'db.json');

//Redirect /notes to /notes.html. *AI help*
app.get('/notes', (req, res) => {
    res.redirect('/notes.html');
});

// API route to get notes
app.get('/api/notes', (req, res) => {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        const notes = JSON.parse(data);
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// API route to add a note
app.post('/api/notes', (req, res) => {
    try {
        const { title, text } = req.body;
        if (!title || !text) {
            return res.statuts(400).json({ message: 'Title and text are required' });
        }

        const newNote = { title, text };
        const notes = readNotes();
        notes.push(newNote);
        writeNotes(notes);

        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

function readNotes() {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
}

function writeNotes(notes) {
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2), 'utf8');
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});