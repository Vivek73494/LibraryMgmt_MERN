const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookSections,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

router.route('/')
  .get(getAllBooks)
  .post(addBook);

router.get('/sections', getBookSections);

router.route('/:id')
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
