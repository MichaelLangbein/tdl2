import { appFactory } from './api/express';


const app = appFactory();

const port = 1410;
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
})