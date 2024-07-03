import express from 'express';

import movieRouter from './modules/movie/movie-router';
import router from './routes';

const app = express();
app.use(express.json());

app.use('/api', router);
app.use('/api/movies', movieRouter);

export default app;
