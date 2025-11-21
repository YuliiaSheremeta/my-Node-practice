import Book from '../models/bookModel.js';

export const getBooks = async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
};

export const getBooksById = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.status(200).json(book);
};

export const createNewBook = async (req, res) => {
  const book = await Book.create(req.body);

  res.status(201).json(book);
};

export const deleteBook = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findByIdAndDelete({ _id: bookId });
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  };
  res.status(200).json(book);
};

export const updateBook = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findByIdAndUpdate({ _id: bookId }, req.body, { new: true });
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  };
  res.status(200).json(book);
};
