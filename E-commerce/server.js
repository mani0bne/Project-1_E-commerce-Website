const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a schema and model
const formSchema = new mongoose.Schema({
    email: String,
    message: String
});

const Form = mongoose.model('Form', formSchema);

// Serve the static HTML file
app.use(express.static('public'));

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
    try {
        const newForm = new Form({
            email: req.body.email,
            message: req.body.message
        });

        await newForm.save();
        console.log('Form data saved successfully');
        res.status(200).send('Form data saved successfully!');
    } catch (err) {
        console.error('Error saving to database:', err);
        res.status(500).send('Error saving to database.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
