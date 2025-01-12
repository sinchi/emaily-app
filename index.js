const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send({ hi: 'Hello World' });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
