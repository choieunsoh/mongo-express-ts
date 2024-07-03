import { Db, MongoClient } from 'mongodb';
import config from './config';

const mongoUri = config.MONGODB_URI;
const dbName = config.DATABASE_NAME;

let db: Db;

async function connectToMongo(): Promise<Db> {
  if (db) return db;

  try {
    const client = await MongoClient.connect(mongoUri);
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export { connectToMongo, db };
