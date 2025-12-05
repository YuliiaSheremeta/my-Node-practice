import Book from '../models/bookModel.js';

export const getBooks = async (req, res) => {
  // Отримуємо параметри пагінації
  const { page = 1, perPage = 10, category, search } = req.query;

  //Це визначає, скільки записів потрібно пропустити перед тим, як відібрати дані для поточної сторінки:
  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const booksQuery = Book.find();

  // Текстовий пошук по name (працює лише якщо створено текстовий індекс)
  if (search) {
    booksQuery.where({ $text: { $search: search } });
  }

  // Будуємо фільтр за категорією
  if (category) {
    booksQuery.where('category').equals(category);
  }

  // Виконуємо одразу два запити паралельно
  const [totalItems, books] = await Promise.all([
    booksQuery.clone().countDocuments(),
    booksQuery.skip(skip).limit(perPage),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    books,
  });
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
  }
  res.status(200).json(book);
};

export const updateBook = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findByIdAndUpdate({ _id: bookId }, req.body, {
    new: true,
  });
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.status(200).json(book);
};
