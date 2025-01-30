const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: 'config/.env.dev' });
} else if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: 'config/.env.test' });
}
require('./models/User');
require('./services/passport');

const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');

try {
    mongoose.connect(process.env.MONGO_URI);
} catch (error) {
    console.log('Error with mongo connection:', error);
}
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/auth')(app);
require('./routes/stripe')(app);
require('./routes/twilio')(app);

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `Server is running on port ${process.env.PORT || 5000} - env: ${
            process.env.NODE_ENV
        }`
    );
});
