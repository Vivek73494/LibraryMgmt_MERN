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
    ISBN: {
      type: String,
      trim: true
    },
    isbn: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category / Section is required'],
      trim: true
    },
    section: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      min: [1, 'Quantity must be at least 1']
    },
    totalCopies: {
      type: Number
    },
    availableQuantity: {
      type: Number,
      min: [0, 'Available quantity cannot be negative']
    },
    availableCopies: {
      type: Number
    }
  },
  {
    timestamps: true,
    strict: false,
    toJSON: {
      transform: function (doc, ret) {
        ret.section = ret.section || ret.category || 'General';
        ret.category = ret.section || ret.category || 'General';
        ret.ISBN = ret.ISBN || ret.isbn || '';
        ret.quantity = ret.quantity !== undefined ? ret.quantity : (ret.totalCopies || 1);
        ret.availableQuantity = ret.availableQuantity !== undefined ? ret.availableQuantity : (ret.availableCopies !== undefined ? ret.availableCopies : ret.quantity);
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Book', bookSchema);
