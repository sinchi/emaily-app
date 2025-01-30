const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const User = mongoose.model('users');
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            const { id: googleId, name, emails } = profile;
            const User = mongoose.model('users');
            const existingUser = await User.findOne({ googleId });
            if (existingUser) {
                done(null, existingUser);
            } else {
                const user = await new User({ googleId }).save();
                done(null, user);
            }
        }
    )
);
