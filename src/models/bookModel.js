import { Schema,model } from "mongoose";

const bookSchema = new Schema(
  {
  name: {
    type: String,
    required: true,
    trim:true,
    },
    category: {
      type: String,
      required: true,
      enum: ['hystory', 'mystery', 'romance', 'adventure', 'biography'],
      default: 'hystory',
    },
  }, {
    timestamps: true,
    versionKey: false,
  },
);

const Book = model('Book', bookSchema);

export default Book;
