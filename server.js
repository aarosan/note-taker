const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public'
// *AI helped with getting the assets folder to be included
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(express.json());

// Path to db
// PUT DEFINITION OF .JOIN HERE
const dbFilePath = path.join(__dirname, 'db', 'db.json');

// this will genereate a unique ID
const generateUniqueId = () => {
    return uuidv4();
};


// When the user clicks the button that has an href to /notes, then the server will send back the notes.html file that has been set up with static files from 'public'
// *AI help with this code
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API route to get notes
// Tested with Postman and this API route works
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
// Test with Postman and this API route works
app.post('/api/notes', (req, res) => {
    try {
        const { title, text } = req.body;
        if (!title || !text) {
            return res.status(400).json({ message: 'Title and text are required' });
        }

        const newNote = { id: generateUniqueId(), title, text };
        const notes = readNotes();
        notes.push(newNote);
        writeNotes(notes);

        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// tested with postman and it works!
app.delete(`/api/notes/:id`, (req, res) => {
    try {
        let notes = readNotes();
        const noteId = req.params.id;
        //shorthand arrow function to check every note in the array to see if the ids match with the one we want to delete
        const index = notes.findIndex(note => note.id === noteId);

        if(index === -1) {
            return res.status(404).json({ message: 'Note not found' });
        }

        notes.splice(index, 1);

        writeNotes(notes);

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Tested with Postman and it works
function readNotes() {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Tested with Postman and it works
function writeNotes(notes) {
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2), 'utf8');
}

// Server is running successfully
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});