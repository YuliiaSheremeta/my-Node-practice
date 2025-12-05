import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['hystory', 'mystery', 'romance', 'adventure', 'biography'],
      default: 'hystory',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
bookSchema.index(
  { name: 'text' },
  {
    name: 'BookTextIndex',
    weights: { name: 10 },
    default_language: 'english',
  },
);

const Book = model('Book', bookSchema);

export default Book;

//weights Використовується, коли текстовий індекс створюється на кілька полів одночасно. Кожному полю можна задати вагу (пріоритет) для розрахунку релевантності під час пошуку.
//name Це назва індексу в базі даних, а не поле колекції. MongoDB зазвичай створює автоматичну назву типу "name_text", але краще дати свою
