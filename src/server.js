import express from 'express';
import logger from './middleware/logger.js';
import cors from 'cors';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import booksRoutes from './routes/booksRoutes.js';
import connectMongoDB from './db/connectMongoDB.js';
import { errors } from 'celebrate';

const app = express();
const PORT = 3000;

app.use(logger);
app.use(express.json());
app.use(cors());

app.use(booksRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
