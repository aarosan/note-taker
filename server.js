const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const dbFilePath = './db/db.json';