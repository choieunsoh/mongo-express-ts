import { ObjectId, WithId } from 'mongodb';
import { getCollection } from '../../../mongo-client';
import { Movie } from '../models/movie-model';

export class MovieService {
  private collectionName: string = 'movies';

  async collection() {
    return await getCollection<Movie>(this.collectionName);
  }

  async getAll(): Promise<WithId<Movie>[]> {
    const collection = await this.collection();
    const movies = await collection.find().toArray();
    return movies;
  }

  async getById(id: string): Promise<WithId<Movie> | null> {
    const collection = await this.collection();
    const movie = await collection.findOne({ _id: new ObjectId(id) });
    return movie;
  }

  async create(movie: Movie): Promise<WithId<Movie> | null> {
    const collection = await this.collection();
    const result = await collection.insertOne(movie);
    const { insertedId } = result;
    const createdMovie = await this.getById(insertedId.toHexString());
    return createdMovie;
  }

  async update(id: string, movie: Partial<Movie>): Promise<WithId<Movie> | null> {
    const collection = await this.collection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: movie });
    const updatedMovie = await this.getById(id);
    return updatedMovie;
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.collection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    const { deletedCount } = result;
    return deletedCount > 0;
  }
}
