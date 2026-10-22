const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

// Get overall library dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const books = await Book.find();
    const totalBooks = books.length;

    let totalCopies = 0;
    let totalAvailableCopies = 0;
    const sectionMap = {};

    books.forEach((book) => {
      const qty = Number(book.quantity) || 1;
      const avail = Number(book.availableQuantity) || 0;
      totalCopies += qty;
      totalAvailableCopies += avail;

      const cat = book.category || 'General';
      if (!sectionMap[cat]) {
        sectionMap[cat] = { count: 0, totalCopies: 0, availableCopies: 0 };
      }
      sectionMap[cat].count += 1;
      sectionMap[cat].totalCopies += qty;
      sectionMap[cat].availableCopies += avail;
    });

    const currentlyIssuedCopies = await BorrowRecord.countDocuments({ status: 'Issued' });
    const totalBorrowRecords = await BorrowRecord.countDocuments();

    const sectionsBreakdown = Object.keys(sectionMap).sort().map((name) => ({
      name,
      count: sectionMap[name].count,
      totalCopies: sectionMap[name].totalCopies,
      availableCopies: sectionMap[name].availableCopies
    }));

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalCopies,
        totalAvailableCopies,
        currentlyIssuedCopies,
        totalBorrowRecords,
        totalSections: sectionsBreakdown.length,
        sectionsBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
