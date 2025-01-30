const menuOptions = new Map([
    ['catalogMenu', '1. 🎂 Voir le catalogue des gâteaux'],
    ['order', '2. 🚚 Suivre une commande'],
    ['question', '3. 💬 Poser une question'],
    ['special', '4. 🎉 Voir les offres spéciales'],
]);

const catalogMenu = new Map([
    ['traditional', '1. 🍥 Gâteaux Traditionnels Marocains'],
    ['modern', '2. 🍰 Gâteaux Modernes et Personnalisés'],
    ['mini', '3. 🧁 Mini-Gâteaux et Cupcakes'],
    ['special', '4. 🥧 Gâteaux pour Régimes Spéciaux'],
    ['menu', '0. Retour au menu principal'],
]);

const traditionalCatalog = new Map([
    [
        'kaab_ghzal',
        {
            title: '🏷️ Kaab Ghzal - 15 MAD/pièce',
            description:
                "Pâte sablée fourrée aux amandes et parfumée à la fleur d'oranger",
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 15,
        },
    ],
    [
        'briouates_miel',
        {
            title: '🏷️ Briouates au Miel - 10 MAD/pièce',
            description:
                'Feuilles de brick fourrées aux amandes et arrosées de miel',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 10,
        },
    ],
    [
        'ghriba',
        {
            title: '🏷️ Ghriba - 5 MAD/pièce',
            description: 'Biscuits sablés à la noix de coco',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 5,
        },
    ],
    [
        'sellou',
        {
            title: '🏷️ Sellou - 100 MAD/kg',
            description:
                'Pâte d’amandes, graines de sésame, farine grillée, miel et huile',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 100,
        },
    ],
    [
        'chebakia',
        {
            title: '🏷️ Chebakia - 10 MAD/pièce',
            description: 'Pâte feuilletée frite et trempée dans du miel',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 10,
        },
    ],
    [
        'return',
        {
            title: 'Retour au catalogue',
            description: 'Retourner au catalogue des gâteaux traditionnels',
        },
    ],
]);

const modernCatalog = new Map([
    [
        'chocolate_cake',
        {
            title: '🏷️ Gâteau au Chocolat - 200 MAD',
            description: 'Gâteau moelleux au chocolat noir',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 200,
        },
    ],
    [
        'red_velvet',
        {
            title: '🏷️ Red Velvet - 220 MAD',
            description: 'Gâteau rouge velouté au goût de vanille et de cacao',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 220,
        },
    ],
    [
        'coffee_cake',
        {
            title: '🏷️ Gâteau au Café - 210 MAD',
            description: 'Gâteau moelleux au café et à la vanille',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 210,
        },
    ],
    [
        'fruit_cake',
        {
            title: 'Gâteau aux Fruits - 230 MAD',
            description: 'Gâteau aux fruits confits et aux noix',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 230,
        },
    ],
    [
        'custom_cake',
        {
            title: 'Gâteau Personnalisé - 250 MAD',
            description: 'Gâteau personnalisé selon vos goûts et préférences',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 250,
        },
    ],
    [
        'return',
        {
            title: 'Retour au catalogue',
            description: 'Retourner au catalogue des gâteaux modernes',
        },
    ],
]);

const miniCatalog = new Map([
    [
        'cupcakes_varies',
        {
            title: 'Cupcakes Variés - 15 MAD/pièce',
            description: 'Cupcakes aux parfums variés et décorés',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 15,
        },
    ],
    [
        'mini_cheesecakes',
        {
            title: 'Mini-Cheesecakes - 20 MAD/pièce',
            description: 'Petits cheesecakes aux parfums variés',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 20,
        },
    ],
    [
        'macarons',
        {
            title: 'Macarons - 10 MAD/pièce',
            description: 'Petits macarons aux parfums variés',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 10,
        },
    ],
    [
        'return',
        {
            title: 'Retour au catalogue',
            description: 'Retourner au catalogue des mini-gâteaux et cupcakes',
        },
    ],
]);

const specialCatalog = new Map([
    [
        'gluten_free_cake',
        {
            title: 'Gâteau Sans Gluten - 220 MAD',
            description: 'Gâteau sans gluten aux fruits et aux noix',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 220,
        },
    ],
    [
        'sugar_free_cake',
        {
            title: 'Gâteau Sans Sucre - 200 MAD',
            description: 'Gâteau sans sucre aux fruits et aux noix',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 200,
        },
    ],
    [
        'vegan_cake',
        {
            title: 'Gâteau Végétalien - 230 MAD',
            description: 'Gâteau sans produits d’origine animale',
            image: 'https://i.imgur.com/1Q5Z2Zz.jpg',
            price: 230,
        },
    ],
    [
        'return',
        {
            title: 'Retour au catalogue',
            description: 'Retourner au catalogue des gâteaux spéciaux',
        },
    ],
]);

module.exports = {
    menuOptions,
    catalogMenu,
    traditionalCatalog,
    modernCatalog,
    miniCatalog,
    specialCatalog,
};
