const express = require('express');
const router = express.Router();
const {
  getAllBorrowRecords,
  issueBook,
  returnBook
} = require('../controllers/borrowController');

router.route('/')
  .get(getAllBorrowRecords)
  .post(issueBook);

router.route('/:id/return')
  .put(returnBook);

module.exports = router;
