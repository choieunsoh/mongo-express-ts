import { Router } from 'express';
import { Movie } from './models/movie-model';
import { MovieService } from './services/movie-service';

const router = Router();
const movieService = new MovieService();

router.get('/test/:testNo/:output', async (req, res) => {
  try {
    const { testNo = '0', output = '' } = req.params;
    const movies = await movieService.test(Number(testNo), output === 'output');
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/', async (req, res) => {
  try {
    const movies = await movieService.getAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await movieService.getById(id);
    if (movie === null) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/', async (req, res) => {
  try {
    const movie = req.body as Movie;
    const createdMovie = await movieService.create(movie);
    res.status(201).json(createdMovie);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = req.body as Partial<Movie>;
    const updatedMovie = await movieService.update(id, movie);
    res.status(200).json({ message: 'Movie updated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSuccess = await movieService.delete(id);
    if (!deleteSuccess) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch('/:id/rating/:rating', async (req, res) => {
  try {
    const { id, rating } = req.params;
    const imdbRating = Number(rating);
    await movieService.updateImdbRating(id, imdbRating);
    res.status(200).json({ message: 'IMDb rating updated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
