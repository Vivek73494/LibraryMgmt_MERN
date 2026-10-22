const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');

// Get all borrow records
exports.getAllBorrowRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find()
      .populate('bookId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Issue a book to a student
exports.issueBook = async (req, res) => {
  try {
    const { studentName, studentRollNumber, bookId, issueDate } = req.body;

    if (!studentName || !studentRollNumber || !bookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student name, roll number, and book selection'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check availability
    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: `Sorry, "${book.title}" is currently out of stock (0 available copies)`
      });
    }

    // Reduce available quantity
    book.availableQuantity -= 1;
    await book.save();

    // Create borrow record
    const record = await BorrowRecord.create({
      studentName: studentName.trim(),
      studentRollNumber: studentRollNumber.trim(),
      bookId: book._id,
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      status: 'Issued'
    });

    const populatedRecord = await BorrowRecord.findById(record._id).populate('bookId');

    res.status(201).json({
      success: true,
      message: `Book "${book.title}" issued successfully to ${studentName}`,
      data: populatedRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Return an issued book
exports.returnBook = async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    if (record.status === 'Returned') {
      return res.status(400).json({
        success: false,
        message: 'This book has already been marked as returned'
      });
    }

    // Increase available copies back in stock
    const book = await Book.findById(record.bookId);
    if (book && book.availableQuantity < book.quantity) {
      book.availableQuantity += 1;
      await book.save();
    }

    record.status = 'Returned';
    record.returnDate = new Date();
    await record.save();

    const populatedRecord = await BorrowRecord.findById(record._id).populate('bookId');

    res.status(200).json({
      success: true,
      message: 'Book returned successfully and stock updated',
      data: populatedRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
