import * as dotenv from 'dotenv';

dotenv.config();

type Config = {
  PORT: number;
};

function getConfig(): Config {
  const port = Number(process.env.PORT ?? 3000);

  return {
    PORT: port,
  };
}

const config = getConfig();
export default config;
