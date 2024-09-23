const express = require('express');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('common'));

app.use(session({
    secret: 'secret-key', // Replace with a real secret key
    resave: false,
    saveUninitialized: true
}));

// Initialize SQLite Database
let db = new sqlite3.Database('users');

// Serve static files (e.g., CSS, JS)
app.use(express.static(path.join(__dirname, 'public_html')));


app.get('/', (req, res) => {
    res.render('index', { error: undefined }); // Pass error as undefined initially
});

// Register Route - For creating a new user
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
            if (err) {
                return res.status(500).send('Failed to register user. ' + err);
            }
            res.status(200).send('User registered successfully');
        });
    } catch (error) {
        res.status(500).send('Error registering user.');
    }
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query the database for the user with the entered email
    db.get('SELECT * FROM users WHERE username = ?', [email], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Internal server error');
        }

        if (!user) {
            // If no user is found with the provided email
            return res.render('index', {
                error: 'No user found with that email.',
            });
        }

        // Compare entered password with the hashed password stored in the database
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Internal server error');
            }

            if (result) {
                // Password matches, successful login
                req.session.userId = user.id;
                return res.render('upload'); // Redirect to the upload page
            } else {
                // Password doesn't match
                return res.render('index', {
                    error: 'Invalid password.',
                });
            }
        });
    });
});

app.get('/upload', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // If user is not logged in, redirect to login
    }

    res.render('upload');  // Renders the upload.ejs file
});

app.post('/upload', upload.single('jsonFile'), (req, res) => {
    // Move the uploaded file to a desired location or process it directly
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', 'uploadedData.json');

    fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).send('Error saving file.');
        res.redirect('/chart'); // Redirect to chart selection
    });
});

app.get('/chart', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // If user is not logged in, redirect to login
    }
    res.render('chart', { chartType: null, jsonData: [] }); // Send empty chartType to show the chart selection
});

app.get('/generate-chart/:type', (req, res) => {
    const chartType = req.params.type;

    const jsonFilePath = path.join(__dirname, 'uploads', 'uploadedData.json');
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading JSON file.');
        }

        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});


// Start Server
app.listen(port, ()=> {
    // When the application starts, print to the console that our app is
    // running at http://localhost:3000. Print another message indicating
    // how to shut the server down.
    console.log(`Web server running at: http://localhost:${port}`)
    console.log(`Type Ctrl+C to shut down the web server`)
})
