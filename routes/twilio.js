const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

module.exports = (app) => {
    app.post('/api/messages/send-message', async (req, res) => {
        const { from, to, contentSid, contentVariables } = req.body;
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886',
            contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
            contentVariables: '{"1":"12/1","2":"3pm"}',
            to: 'whatsapp:+33618275111',
        });
        console.log({ message });
        res.send({ message });
    });

    app.post('/api/messages/incoming-message', async (req, res) => {
        const {
            From,
            Body,
            FromCity,
            FromCountry,
            ProfileName,
            WaId,
            Address,
            Label,
        } = req.body;

        console.log({
            From,
            Body,
            FromCity,
            FromCountry,
            ProfileName,
            WaId,
            Address,
            Label,
        });

        const message = 'Hello! Your message has been received!';
        const twiml = new twilio.twiml.MessagingResponse();
        twiml.message(message);
        res.type('text/xml').send(twiml.toString());
    });
};
