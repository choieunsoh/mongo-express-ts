import { Router } from 'express';
import { Movie } from './models/movie-model';
import { MovieService } from './services/movie-service';

const router = Router();
const movieService = new MovieService();

router.get('/', async (req, res) => {
  const movies = await movieService.getAll();
  res.status(200).json(movies);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await movieService.getById(id);
    if (movie === null) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

router.post('/', async (req, res) => {
  try {
    const movie = req.body as Movie;
    const createdMovie = await movieService.create(movie);
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(400).json({ error: 'Invalid movie format' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = req.body as Partial<Movie>;
    const updatedMovie = await movieService.update(id, movie);
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Invalid movie format' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSuccess = await movieService.delete(id);
    if (!deleteSuccess) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    res.status(200).json(deleteSuccess);
  } catch (error) {
    res.status(400).json({ error: 'Invalid movie format' });
  }
});

export default router;
