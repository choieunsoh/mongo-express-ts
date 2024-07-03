import { Collection, Db, MongoClient } from 'mongodb';
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

async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const database = await connectToMongo();
  return database.collection<T>(collectionName);
}

export { connectToMongo, db, getCollection };
