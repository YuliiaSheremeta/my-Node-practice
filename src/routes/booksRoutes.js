import { Router } from "express";
import { createNewBook, deleteBook, getBooks,getBooksById, updateBook } from "../controllers/booksController.js";
import { celebrate } from "celebrate";
import { bookIdParamSchema, createBookSchema, updateBookSchema } from "../validation/bookValidation.js";

const router = Router();

router.get('/books',getBooks);

router.get('/books/:bookId',celebrate(bookIdParamSchema),getBooksById);
router.post('/books', celebrate(createBookSchema),createNewBook);
router.delete('/books/:bookId',celebrate(bookIdParamSchema),deleteBook);
router.patch('/books/:bookId',celebrate(updateBookSchema),updateBook);

export default router;
