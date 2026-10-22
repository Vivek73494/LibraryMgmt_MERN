const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

const normalizeBook = (bookDoc) => {
  const b = bookDoc.toObject ? bookDoc.toObject() : bookDoc;
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

// @desc    Get all books (with optional search and section filter)
// @route   GET /api/books
exports.getAllBooks = async (req, res) => {
  try {
    const { search, section, category } = req.query;
    let query = {};

    const targetSection = (section || category || '').trim();
    if (targetSection && targetSection.toUpperCase() !== 'ALL') {
      query.$or = [{ section: targetSection }, { category: targetSection }];
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      const searchConditions = [{ title: regex }, { author: regex }, { ISBN: regex }, { isbn: regex }];
      if (query.$or) {
        query = {
          $and: [
            { $or: query.$or },
            { $or: searchConditions }
          ]
        };
      } else {
        query.$or = searchConditions;
      }
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    const normalized = books.map(normalizeBook);

    res.status(200).json({ success: true, count: normalized.length, data: normalized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all distinct book sections with book counts
// @route   GET /api/books/sections
exports.getBookSections = async (req, res) => {
  try {
    const books = await Book.find({});
    const sectionCounts = {};
    books.forEach((book) => {
      const sec = (book.section || book.category || 'General').trim();
      sectionCounts[sec] = (sectionCounts[sec] || 0) + 1;
    });

    const sections = Object.keys(sectionCounts).sort().map((name) => ({
      name,
      count: sectionCounts[name]
    }));

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: normalizeBook(book) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new book
// @route   POST /api/books
exports.addBook = async (req, res) => {
  try {
    const { title, author, ISBN, category, section, quantity } = req.body;
    const sectionVal = (section || category || '').trim();

    if (!title || !author || !ISBN || !sectionVal || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, author, ISBN, section/category, quantity'
      });
    }

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number'
      });
    }

    const cleanISBN = ISBN.trim();

    // Check for duplicate ISBN in either field
    const existingBook = await Book.findOne({
      $or: [{ ISBN: cleanISBN }, { isbn: cleanISBN }]
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: `Book with ISBN '${cleanISBN}' already exists`
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      ISBN: cleanISBN,
      isbn: cleanISBN,
      category: sectionVal,
      section: sectionVal,
      quantity: numQuantity,
      totalCopies: numQuantity,
      availableQuantity: numQuantity,
      availableCopies: numQuantity
    });

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: normalizeBook(book)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const { title, author, ISBN, category, section, quantity } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const currentNorm = normalizeBook(book);

    if (ISBN && ISBN.trim() !== currentNorm.ISBN) {
      const cleanISBN = ISBN.trim();
      const duplicate = await Book.findOne({
        $or: [{ ISBN: cleanISBN }, { isbn: cleanISBN }]
      });
      if (duplicate && duplicate._id.toString() !== book._id.toString()) {
        return res.status(400).json({
          success: false,
          message: `Book with ISBN '${cleanISBN}' already exists`
        });
      }
      book.ISBN = cleanISBN;
      book.isbn = cleanISBN;
    }

    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (section || category) {
      const secVal = (section || category).trim();
      book.section = secVal;
      book.category = secVal;
    }

    if (quantity !== undefined) {
      const newQuantity = Number(quantity);
      if (isNaN(newQuantity) || newQuantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a positive number'
        });
      }

      // Calculate how many copies are currently issued
      const currentlyIssued = currentNorm.quantity - currentNorm.availableQuantity;
      if (newQuantity < currentlyIssued) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce total quantity to ${newQuantity} because ${currentlyIssued} copies are currently issued`
        });
      }

      const newAvailable = newQuantity - currentlyIssued;
      book.quantity = newQuantity;
      book.totalCopies = newQuantity;
      book.availableQuantity = newAvailable;
      book.availableCopies = newAvailable;
    }

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: normalizeBook(updatedBook)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if book has active borrowing records
    const activeBorrow = await BorrowRecord.findOne({
      bookId: book._id,
      status: 'Issued'
    });

    if (activeBorrow) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book: There are active borrow records for this book'
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
