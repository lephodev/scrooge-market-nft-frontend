import express from 'express';
import { join } from 'path';
const app = express();
const port = 3000;

app.use(join(__dirname, 'build'));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Running on port ${port}`));