const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/Meditrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Define MongoDB Schemas
const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    contact: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    organ: { type: String, enum: ['Heart', 'Lungs', 'Liver', 'Kidney'], required: true },
    hospital: { type: String, required: true },
    blood_group: { type: String, required: true },
    status: { type: String, default: 'Pending' },
});

const Patient = mongoose.model('Patient', PatientSchema, 'patient');

const UserSchema = new mongoose.Schema({
    name: String,
    gender: String,
    phone: String,
    email: { type: String, unique: true }, 
    password: String,

});
const User = mongoose.model('User', UserSchema, 'doclogin');

// MongoDB connection error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully!');

    // Serve the home page
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/home.html'));
    });

    // Handle doctor login
    app.post('/doclogin', async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username }).exec();

            if (user && user.password === password) {
                res.redirect('/patdisp');
            } else {
                res.status(401).send('Invalid username or password');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Handle doctor registration
    app.post('/register', async (req, res) => {
        try {
            const { name, gender, phone, email, password } = req.body;

            // Check if the email is already taken
            const existingUser = await User.findOne({ email }).exec();
            if (existingUser) {
                return res.status(400).send('Email already registered. Please use another email.');
            }

            // Create a new doctor user
            const newDoctor = new User({
                name,
                gender,
                phone,
                email,
                password,
            });

            // Save the new doctor to the database
            await newDoctor.save();

            res.json({ message: 'Registration successful!' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    // Handle patient submission
    app.post('/submit', (req, res) => {
        const newPatient = new Patient({
            name: req.body.name,
            age: req.body.age,
            contact: req.body.contact,
            gender: req.body.gender,
            organ: req.body.organ,
            hospital: req.body.hospital,
            blood_group: req.body.blood_group,
            status: req.body.status,
        });

        newPatient.save()
            .then(() => {
                res.redirect('/patdisp?msg=Patient details saved successfully!');
            })
            .catch(() => {
                res.status(400).send('Unable to save Patient details');
            });
    });

    // Serve the doctor login page
    app.get('/login.html', (req, res) => {
        res.sendFile(__dirname + '/login.html');
    });

    // Serve the add patient page
    app.get('/addpatient', (req, res) => {
        res.sendFile(__dirname + '/patients.html');
    });

    // Serve the logout page
    app.get('/logout', (req, res) => {
        res.sendFile(__dirname + '/logout.html');
    });

    // API endpoint to get all patients
    app.get('/patients', (req, res) => {
        Patient.find({})
            .then(patients => {
                res.json(patients);
            })
            .catch(() => {
                res.status(500).send('Internal Server Error');
            });
    });

    // Serve the patient display page
    app.get('/patdisp', (req, res) => {
        res.sendFile(__dirname + '/patdisp.html');
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
