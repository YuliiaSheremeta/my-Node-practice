import { Router } from "express";
import Book from '../models/bookModel.js';

const router = Router();

router.get('/books', async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
});

router.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.status(200).json(book);
});

export default router;
