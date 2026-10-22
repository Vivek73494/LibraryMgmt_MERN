const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    studentRollNumber: {
      type: String,
      required: [true, 'Student roll number is required'],
      trim: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required']
    },
    issueDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Issue date is required']
    },
    returnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['Issued', 'Returned'],
      default: 'Issued'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
