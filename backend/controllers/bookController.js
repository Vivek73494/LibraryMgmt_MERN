const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

// Get all books with optional search and category filter
exports.getAllBooks = async (req, res) => {
  try {
    const { search, category, section } = req.query;
    let query = {};

    // Filter by category/section
    const selectedCategory = (category || section || '').trim();
    if (selectedCategory && selectedCategory.toUpperCase() !== 'ALL') {
      query.category = selectedCategory;
    }

    // Search by title, author, or ISBN
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { author: regex }, { isbn: regex }];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get distinct book categories/sections with counts
exports.getBookSections = async (req, res) => {
  try {
    const books = await Book.find({}, 'category');
    const counts = {};

    books.forEach((book) => {
      const cat = book.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const sections = Object.keys(counts).sort().map((name) => ({
      name,
      count: counts[name]
    }));

    res.status(200).json({ success: true, count: sections.length, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, ISBN, category, section, quantity } = req.body;
    const finalIsbn = (isbn || ISBN || '').trim();
    const finalCategory = (category || section || '').trim();
    const numQuantity = Number(quantity);

    if (!title || !author || !finalIsbn || !finalCategory || isNaN(numQuantity) || numQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid title, author, ISBN, category, and positive quantity'
      });
    }

    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ isbn: finalIsbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: `A book with ISBN '${finalIsbn}' already exists in library`
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: finalIsbn,
      category: finalCategory,
      quantity: numQuantity,
      availableQuantity: numQuantity
    });

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update existing book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, ISBN, category, section, quantity } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const finalIsbn = (isbn || ISBN || '').trim();
    if (finalIsbn && finalIsbn !== book.isbn) {
      const duplicate = await Book.findOne({ isbn: finalIsbn });
      if (duplicate && duplicate._id.toString() !== book._id.toString()) {
        return res.status(400).json({
          success: false,
          message: `Book with ISBN '${finalIsbn}' already exists`
        });
      }
      book.isbn = finalIsbn;
    }

    if (title) book.title = title.trim();
    if (author) book.author = author.trim();
    if (category || section) book.category = (category || section).trim();

    if (quantity !== undefined) {
      const newQty = Number(quantity);
      if (isNaN(newQty) || newQty <= 0) {
        return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
      }

      // Keep issued books accounted for
      const issuedCopies = book.quantity - book.availableQuantity;
      if (newQty < issuedCopies) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce total quantity below ${issuedCopies} because those copies are currently issued`
        });
      }

      book.availableQuantity = newQty - issuedCopies;
      book.quantity = newQty;
    }

    const updatedBook = await book.save();
    res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if any copies are currently issued
    const activeBorrow = await BorrowRecord.findOne({
      bookId: book._id,
      status: 'Issued'
    });

    if (activeBorrow) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book: Copies are currently issued to students'
      });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
