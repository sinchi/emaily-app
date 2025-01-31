const axios = require('axios');
const { Infobip, AuthType } = require('@infobip-api/sdk');
const {
    menuOptions,
    catalogMenu,
    traditionalCatalog,
} = require('../messages/templates/main_menu');
const order = require('../messages/templates/order');

const users = new Map([]);

module.exports = (app) => {
    app.post('/api/infobip/send-template-message', async (req, res) => {
        const options = {
            baseURL: 'https://api.infobip.com',
            headers: {
                Authorization:
                    'App 8e00f64330983e7d3b6d80a50c64bffb-59bd8c23-1189-4b45-a3e7-2322bdb3ad9b',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                maxRedirects: 20,
            },
        };
        const axiosClient = axios.create(options);

        const postData = JSON.stringify({
            messages: [
                {
                    from: '447860099299',
                    to: '33618275111',
                    messageId: '90a923f8-ab7b-4388-abf7-ee5ad9298b20',
                    content: {
                        templateName: 'test_whatsapp_template_en',
                        templateData: {
                            body: {
                                placeholders: ['ayoub'],
                            },
                        },
                        language: 'en',
                    },
                },
            ],
        });

        const { data } = await axiosClient.post(
            '/whatsapp/1/message/template',
            postData
        );
        console.log(data.messages);
        res.send({ message: 'Message sent' });
    });

    app.post('/api/infobip/send-text-message', async (req, res) => {
        let infobip = new Infobip({
            baseUrl: 'https://api.infobip.com',
            apiKey: process.env.INFOBIP_API_KEY,
            authType: AuthType.ApiKey,
        });
        let response = await infobip.channels.whatsapp.send({
            type: 'text',
            from: '447860099299',
            to: '33618275111',
            content: {
                text: 'Hello Ayoub',
            },
        });

        console.log(response);
        res.send({ message: 'Message sent' });
    });

    app.post('/api/infobip/incoming-message', async (req, res) => {
        console.log(req.body);
        const { results } = req.body;
        const {
            from,
            to,
            message: { text },
        } = results[0];
        let message = '';
        const user = users.get(from);
        if (text === '9' && users.has(WaId) && user.step === 'menuOptions') {
            message = `Veuillez selectionnez votre choix: \n${Array.from(
                menuOptions.values()
            ).join('\n')}`;
        }
        if (!user) {
            users.set(from, {
                step: 'menuOptions',
            });
            message = `Bienvenue ${ProfileName} Veuillez selectionnez votre choix: \n${Array.from(
                menuOptions.values()
            ).join('\n')}`;
        } else {
            const { step } = user;
            switch (step) {
                case 'menuOptions':
                    if (text === '1') {
                        message = Array.from(catalogMenu.values()).join('\n');
                        user.step = 'catalogMenu';
                    }

                    if (text === '0') {
                        message = Array.from(menuOptions.values()).join('\n');
                    }
                    break;
                case 'catalogMenu':
                    if (text === '1') {
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
                    if (text === '0') {
                        message = Array.from(menuOptions.values()).join('\n');
                        user.step = 'menuOptions';
                    }
                    break;
                case 'traditionalCatalog':
                    if (text === '0') {
                        message = Array.from(catalogMenu.values()).join('\n');
                        user.step = 'catalogMenu';
                        users.set(WaId, { ...user });
                        break;
                    }
                    user.article = Array.from(traditionalCatalog.keys())[
                        parseInt(text) - 1
                    ];
                    message = order.get('quantity');
                    user.orderStep = 'quantity';
                    user.step = 'order';
                    break;
                case 'order':
                    if (user.orderStep === 'quantity') {
                        user.quantity = text;
                        user.total =
                            parseInt(text) *
                            traditionalCatalog.get(user.article).price;
                        message = order.get('address');
                        user.orderStep = 'address';
                    } else if (user.orderStep === 'address') {
                        user.address = text;
                        message = order.get('payment');
                        user.orderStep = 'payment';
                    } else if (user.orderStep === 'payment') {
                        if (text === '1') {
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
                    if (text === '1') {
                        message =
                            '🥳 Votre commande a été confirmée 🥳\n😊 Merci de votre confiance 😊\n🆕 Pour une nouvelle commande taper ➡️ 9';
                    } else if (text === '2') {
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

        let infobip = new Infobip({
            baseUrl: 'https://api.infobip.com',
            apiKey: process.env.INFOBIP_API_KEY,
            authType: AuthType.ApiKey,
        });

        let response = await infobip.channels.whatsapp.send({
            type: 'text',
            from: to,
            to: from,
            content: {
                text: message,
            },
        });

        console.log(response);
        res.status(200).send({ message: 'Message sent' });
    });
};
