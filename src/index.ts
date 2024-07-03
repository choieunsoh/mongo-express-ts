import app from './app';
import config from './config';
import { connectToMongo } from './mongo-client';

const PORT = config.PORT;

(async () => {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
  }
})();
