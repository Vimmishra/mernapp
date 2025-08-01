import express from 'express';
import { searchMovies } from '../controller/searchController.js';

const router = express.Router();

router.get('/:keyword', searchMovies);

export default router;
