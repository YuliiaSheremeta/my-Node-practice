import { Router } from "express";
import { createNewBook, deleteBook, getBooks,getBooksById, updateBook } from "../controllers/booksController.js";

const router = Router();

router.get('/books',getBooks);

router.get('/books/:bookId', getBooksById);
router.post('/books', createNewBook);
router.delete('/books/:bookId', deleteBook);
router.patch('/books/:bookId', updateBook);

export default router;
