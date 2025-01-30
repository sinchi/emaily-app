const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');

const calculateOrderAmount = (items) => {
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let total = 0;
    items.forEach((item) => {
        total += item.amount;
    });
    return total;
};
module.exports = (app) => {
    app.post('/api/stripe/create-payment-intent', async (req, res) => {
        const { items } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: 'eur',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    });

    app.get('/api/stripe/complete', async (req, res) => {
        const {
            payment_intent,
            payment_intent_client_secret,
            redirect_status,
        } = req.query;
        if (redirect_status !== 'succeeded') {
            return res.redirect('/error');
        }
        const User = mongoose.model('users');
        const user = await User.findById(req.user.id);
        user.credits += 5;
        await user.save();

        console.log({
            payment_intent,
            payment_intent_client_secret,
            redirect_status,
            user: req.user,
        });

        res.redirect('/');
    });
};
