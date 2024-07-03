import * as dotenv from 'dotenv';

dotenv.config();

type Config = {
  PORT: number;
  MONGODB_URI: string;
  DATABASE_NAME: string;
};

function getConfig(): Config {
  const port = Number(process.env.PORT ?? 3000);
  const mongodbUri = process.env.MONGODB_URI ?? '';
  const databaseName = process.env.DATABASE_NAME ?? 'test';

  return {
    PORT: port,
    MONGODB_URI: mongodbUri,
    DATABASE_NAME: databaseName,
  };
}

const config = getConfig();
export default config;
