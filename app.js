// app.js
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = 8080;
const logFile = 'output.log';

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  // Read the contents of the log file
  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading log file: ${err}`);
      res.render('index', { output: 'Error reading log file' });
      return;
    }
    // Escape HTML entities before rendering
    const escapedOutput = escapeHtml(data);
    res.render('index', { output: escapedOutput });
  });
});

app.get('/execute', (req, res) => {
  const command = req.query.command;
  executeCommand(command, (output) => {
    // Append the command output to the log file
    fs.appendFile(logFile, output + '\n', (err) => {
      if (err) {
        console.error(`Error appending to log file: ${err}`);
      }
    });
    // Escape HTML entities before sending the output
    const escapedOutput = escapeHtml(output);
    res.send(escapedOutput);
  });
});

function executeCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      callback(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      callback(`Error: ${stderr}`);
      return;
    }
    callback(stdout);
  });
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  }).replace(/\n/g, '<br>');
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
