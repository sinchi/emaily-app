const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio');
const client = twilio(accountSid, authToken);
const {
    menuOptions,
    catalogMenu,
    traditionalCatalog,
} = require('../messages/templates/main_menu');
const order = require('../messages/templates/order');

const users = new Map([]);

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
        const { From, Body, ProfileName, WaId } = req.body;
        let message = '';
        const user = users.get(WaId);
        if (Body === '9' && users.has(WaId) && user.step === 'menuOptions') {
            message = `Veuillez selectionnez votre choix: \n${Array.from(
                menuOptions.values()
            ).join('\n')}`;
        }
        if (!user) {
            users.set(WaId, {
                name: ProfileName,
                phone: From,
                step: 'menuOptions',
            });
            message = `Bienvenue ${ProfileName} Veuillez selectionnez votre choix: \n${Array.from(
                menuOptions.values()
            ).join('\n')}`;
        } else {
            const { step } = user;
            switch (step) {
                case 'menuOptions':
                    if (Body === '1') {
                        message = Array.from(catalogMenu.values()).join('\n');
                        user.step = 'catalogMenu';
                    }

                    if (Body === '0') {
                        message = Array.from(menuOptions.values()).join('\n');
                    }
                    break;
                case 'catalogMenu':
                    if (Body === '1') {
                        message = Array.from(traditionalCatalog.values())
                            .map(
                                (v, index) =>
                                    `${
                                        index + 1 === traditionalCatalog.size
                                            ? 0
                                            : index + 1
                                    }. ${v.title}`
                            )
                            .join('\n');
                        user.step = 'traditionalCatalog';
                    }
                    if (Body === '0') {
                        message = Array.from(menuOptions.values()).join('\n');
                        user.step = 'menuOptions';
                    }
                    break;
                case 'traditionalCatalog':
                    if (Body === '0') {
                        message = Array.from(catalogMenu.values()).join('\n');
                        user.step = 'catalogMenu';
                        users.set(WaId, { ...user });
                        break;
                    }
                    user.article = Array.from(traditionalCatalog.keys())[
                        parseInt(Body) - 1
                    ];
                    message = order.get('quantity');
                    user.orderStep = 'quantity';
                    user.step = 'order';
                    break;
                case 'order':
                    if (user.orderStep === 'quantity') {
                        user.quantity = Body;
                        user.total =
                            parseInt(Body) *
                            traditionalCatalog.get(user.article).price;
                        message = order.get('address');
                        user.orderStep = 'address';
                    } else if (user.orderStep === 'address') {
                        user.address = Body;
                        message = order.get('payment');
                        user.orderStep = 'payment';
                    } else if (user.orderStep === 'payment') {
                        if (Body === '1') {
                            user.paymentMethod = 'CASH';
                        }
                        message = `📢 Recapitulatif de votre commande: \n\n🔢 ${
                            user.quantity
                        } x ${
                            traditionalCatalog.get(user.article).title
                        }\n💰 Total: ${
                            user.total
                        } MAD \n📍 adresse de livraison: ${
                            user.address
                        }\n💳 Mode de paiement: ${
                            user.paymentMethod
                        } \n\n1. ✅ Confirmer\n\n2. ❌ Annuler\n
                        `;
                        user.step = 'confirmOrder';
                    }
                    break;
                case 'confirmOrder':
                    if (Body === '1') {
                        message =
                            '🥳 Votre commande a été confirmée 🥳\n😊 Merci de votre confiance 😊\n🆕 Pour une nouvelle commande taper ➡️ 9';
                    } else if (Body === '2') {
                        message =
                            '❌ Votre commande a été annulée\n🆕 Pour une nouvelle commande taper 9';
                    }
                    user.step = 'menuOptions';
                    users.set(WaId, { ...user });

                    break;
                default:
                    message =
                        '🔢 Veuillez entrer votre numéro de commande ou numero de telephone';
                    break;
            }
        }

        const twiml = new twilio.twiml.MessagingResponse();
        twiml.message(message);
        res.type('text/xml').send(twiml.toString());
    });
};
