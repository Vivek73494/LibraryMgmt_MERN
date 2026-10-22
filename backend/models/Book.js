const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    availableQuantity: {
      type: Number,
      default: function () {
        return this.quantity;
      },
      min: [0, 'Available quantity cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual aliases so both book.isbn and book.ISBN, book.category and book.section work
bookSchema.virtual('ISBN').get(function () {
  return this.isbn;
});

bookSchema.virtual('section').get(function () {
  return this.category;
});

module.exports = mongoose.model('Book', bookSchema);
