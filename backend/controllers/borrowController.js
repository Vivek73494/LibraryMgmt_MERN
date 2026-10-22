const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');

const normalizeBook = (book) => {
  if (!book) return null;
  const b = book.toObject ? book.toObject() : book;
  const sectionVal = b.section || b.category || 'General';
  return {
    ...b,
    section: sectionVal,
    category: sectionVal,
    ISBN: b.ISBN || b.isbn || '',
    quantity: b.quantity !== undefined ? b.quantity : (b.totalCopies !== undefined ? b.totalCopies : 1),
    availableQuantity: b.availableQuantity !== undefined ? b.availableQuantity : (b.availableCopies !== undefined ? b.availableCopies : (b.quantity || b.totalCopies || 1))
  };
};

// @desc    Get all borrowing records
// @route   GET /api/borrow
exports.getAllBorrowRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find()
      .populate('bookId', 'title author ISBN isbn category section quantity totalCopies availableQuantity availableCopies')
      .sort({ createdAt: -1 });

    const normalizedRecords = records.map((r) => {
      const obj = r.toObject();
      if (obj.bookId) {
        obj.bookId = normalizeBook(obj.bookId);
      }
      return obj;
    });

    res.status(200).json({ success: true, count: normalizedRecords.length, data: normalizedRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Issue a book to a student
// @route   POST /api/borrow
exports.issueBook = async (req, res) => {
  try {
    const { studentName, studentRollNumber, bookId, issueDate } = req.body;

    if (!studentName || !studentRollNumber || !bookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student name, roll number, and book selection'
      });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const currentAvail = book.availableQuantity !== undefined
      ? book.availableQuantity
      : (book.availableCopies !== undefined ? book.availableCopies : 0);

    // Check availability
    if (currentAvail <= 0) {
      return res.status(400).json({
        success: false,
        message: `Sorry, "${book.title}" is currently out of stock (0 available copies)`
      });
    }

    // Reduce available quantity
    const newAvail = currentAvail - 1;
    book.availableQuantity = newAvail;
    book.availableCopies = newAvail;
    await book.save();

    // Create borrow record
    const record = await BorrowRecord.create({
      studentName: studentName.trim(),
      studentRollNumber: studentRollNumber.trim(),
      bookId: book._id,
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      status: 'Issued'
    });

    const populatedRecord = await BorrowRecord.findById(record._id).populate(
      'bookId',
      'title author ISBN isbn category section quantity totalCopies availableQuantity availableCopies'
    );

    const result = populatedRecord.toObject();
    if (result.bookId) {
      result.bookId = normalizeBook(result.bookId);
    }

    res.status(201).json({
      success: true,
      message: `Book "${book.title}" successfully issued to ${studentName}`,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Return an issued book
// @route   PUT /api/borrow/:id/return
exports.returnBook = async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }

    // Prevent returning the same book twice
    if (record.status === 'Returned') {
      return res.status(400).json({
        success: false,
        message: 'This book has already been marked as returned'
      });
    }

    // Increase available quantity on the book
    const book = await Book.findById(record.bookId);
    if (book) {
      const maxQty = book.quantity !== undefined
        ? book.quantity
        : (book.totalCopies !== undefined ? book.totalCopies : 100);

      const currentAvail = book.availableQuantity !== undefined
        ? book.availableQuantity
        : (book.availableCopies !== undefined ? book.availableCopies : 0);

      if (currentAvail < maxQty) {
        book.availableQuantity = currentAvail + 1;
        book.availableCopies = currentAvail + 1;
        await book.save();
      }
    }

    record.status = 'Returned';
    record.returnDate = new Date();
    await record.save();

    const populatedRecord = await BorrowRecord.findById(record._id).populate(
      'bookId',
      'title author ISBN isbn category section quantity totalCopies availableQuantity availableCopies'
    );

    const result = populatedRecord.toObject();
    if (result.bookId) {
      result.bookId = normalizeBook(result.bookId);
    }

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
