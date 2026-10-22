const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Total number of unique book titles / book entries
    const totalBooks = await Book.countDocuments();

    // Aggregation to sum total quantity and available quantity with fallbacks
    const quantityAgg = await Book.aggregate([
      {
        $project: {
          qty: { $ifNull: ['$quantity', { $ifNull: ['$totalCopies', 1] }] },
          avail: {
            $ifNull: [
              '$availableQuantity',
              { $ifNull: ['$availableCopies', { $ifNull: ['$quantity', '$totalCopies'] }] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalCopies: { $sum: '$qty' },
          totalAvailableCopies: { $sum: '$avail' }
        }
      }
    ]);

    const totalCopies = quantityAgg.length > 0 ? quantityAgg[0].totalCopies : 0;
    const totalAvailableCopies = quantityAgg.length > 0 ? quantityAgg[0].totalAvailableCopies : 0;

    // Currently issued copies (active borrow records)
    const currentlyIssuedCopies = await BorrowRecord.countDocuments({ status: 'Issued' });

    // Total borrowing records ever created
    const totalBorrowRecords = await BorrowRecord.countDocuments();

    // Section metrics and breakdown
    const books = await Book.find({}, 'section category quantity totalCopies availableQuantity availableCopies');
    const sectionMap = {};
    books.forEach((b) => {
      const sec = (b.section || b.category || 'General').trim();
      if (!sectionMap[sec]) {
        sectionMap[sec] = { count: 0, totalCopies: 0, availableCopies: 0 };
      }
      sectionMap[sec].count += 1;
      const qty = b.quantity !== undefined ? b.quantity : (b.totalCopies || 1);
      const avail = b.availableQuantity !== undefined ? b.availableQuantity : (b.availableCopies !== undefined ? b.availableCopies : qty);
      sectionMap[sec].totalCopies += qty;
      sectionMap[sec].availableCopies += avail;
    });

    const totalSections = Object.keys(sectionMap).length;
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
        totalSections,
        sectionsBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
