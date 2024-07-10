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

  async create(movie: Movie): Promise<string> {
    const collection = await this.collection();
    const result = await collection.insertOne(movie);
    const { insertedId } = result;
    return insertedId.toHexString();
  }

  async update(id: string, movie: Partial<Movie>): Promise<void> {
    const collection = await this.collection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: movie });
  }

  async delete(id: string): Promise<boolean> {
    const collection = await this.collection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    const { deletedCount } = result;
    return deletedCount > 0;
  }

  async updateImdbRating(id: string, imdbRating: number): Promise<void> {
    const collection = await this.collection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { 'imdb.rating': imdbRating } });
  }

  async test(testNo: number, output = false) {
    switch (testNo) {
      case 0:
        return await this.test0();
      case 1:
        return await this.countByGenre(output);
      case 2:
        return await this.aggregateCast();
      case 3:
        return await this.aggregateCastWithGenres();
      default:
        return [];
    }
  }

  async test0() {
    const collection = await this.collection();
    const aggregationResult = collection.aggregate([
      {
        $facet: {
          genres: [
            { $unwind: '$genres' },
            { $group: { _id: '$genres', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $addFields: { genre: '$_id' } },
            { $unset: ['_id'] },
          ],
          topRated: [
            { $addFields: { rating: '$imdb.rating' } },
            {
              $match: {
                $and: [
                  { type: 'movie' },
                  { runtime: { $lt: 240 } },
                  { year: { $gte: 2000 } },
                  { rating: { $ne: null } },
                  { rating: { $ne: '' } },
                ],
              },
            },
            { $project: { title: 1, year: 1, rating: 1, released: 1, runtime: 1 } },
            { $sort: { runtime: -1 } },
            { $limit: 20 },
            {
              $setWindowFields: {
                sortBy: { rating: -1 },
                output: {
                  no: {
                    $documentNumber: {},
                  },
                },
              },
            },
          ],
        },
      },
    ]);
    return aggregationResult.toArray();
  }

  async countByGenre(output = false) {
    let pipelines: any[] = [
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $set: { genre: '$_id' } },
      { $unset: ['_id'] },
    ];
    if (output) {
      pipelines = [
        ...pipelines,
        {
          $merge: {
            into: 'most_movie_by_genre',
            on: '_id',
            whenMatched: 'replace',
            whenNotMatched: 'insert',
          },
        },
      ];
    }
    const collection = await this.collection();
    const aggregationResult = collection.aggregate(pipelines);
    return aggregationResult.toArray();
  }

  async aggregateCast() {
    const collection = await this.collection();
    const aggregationResult = collection.aggregate([
      { $unwind: '$cast' },
      {
        $group: {
          _id: '$cast',
          firstMovie: { $first: '$released' },
          lastMovie: { $last: '$released' },
          count: { $sum: 1 },
          totalRuntime: { $sum: '$runtime' },
          genres: {
            $push: '$genres',
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $set: {
          name: '$_id',
          genres: {
            $reduce: {
              input: '$genres',
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          },
        },
      },
      { $unset: ['_id'] },
    ]);
    return await aggregationResult.toArray();
  }

  async aggregateCastWithGenres() {
    const collection = await this.collection();
    const aggregationResult = collection.aggregate([
      { $unwind: '$cast' }, // Unwind the cast array
      { $unwind: '$genres' }, // Unwind the genres array within each movie
      {
        $group: {
          _id: '$cast',
          genres: { $addToSet: '$genres' }, // Add each genre to a set to ensure uniqueness
        },
      },
      { $project: { _id: 0, cast: '$_id', genres: 1 } }, // Project to rename _id as cast
    ]);
    return aggregationResult.toArray();
  }
}
