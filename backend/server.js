const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

let books = [
  { id: 1, title: 'Java', total: 5, available: 5 },
  { id: 2, title: 'C', total: 5, available: 5 },
  { id: 3, title: 'Python', total: 5, available: 5 },
  { id: 4, title: 'Malgudi days', total: 5, available: 5 },
  { id: 5, title: 'Gitanjali', total: 5, available: 5 },
  { id: 6, title: 'Chanakya neeti', total: 5, available: 5 },
  { id: 7, title: 'Panchatantra', total: 5, available: 5 },
  { id: 8, title: 'Akbar birbal stories', total: 5, available: 5 },
  { id: 9, title: 'Tenali Rama stories', total: 5, available: 5 },
  { id: 10, title: 'Thunturu', total: 5, available: 5 },
  { id: 11, title: 'Balamangala', total: 5, available: 5 },
  { id: 12, title: 'The great indian novel', total: 5, available: 5 },
  { id: 13, title: 'The discovery of India', total: 5, available: 5 },
  { id: 14, title: 'The art of war', total: 5, available: 5 },
  { id: 15, title: 'Think and grow rich', total: 5, available: 5 },
  { id: 16, title: 'Deep work', total: 5, available: 5 },
  { id: 17, title: 'Alice in wonderland', total: 5, available: 5 },
  { id: 18, title: 'The little prince', total: 5, available: 5 },
  { id: 19, title: 'The cricket', total: 5, available: 5 },
  { id: 20, title: 'Education', total: 5, available: 5 }
];

let issuedBooks = [];

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/issued', (req, res) => {
  res.json(issuedBooks);
});

app.post('/api/issue', (req, res) => {
  const { studentName, rollNumber, bookTitle, issueDate } = req.body;

  if (!studentName || !rollNumber || !bookTitle) {
    return res.status(400).json({ success: false, message: 'Please enter all details.' });
  }

  const book = books.find((b) => b.title === bookTitle);
  if (!book || book.available <= 0) {
    return res.status(400).json({ success: false, message: 'Book is not available.' });
  }

  book.available -= 1;

  const record = {
    id: Date.now(),
    studentName: studentName.trim(),
    rollNumber: rollNumber.trim(),
    bookTitle,
    issueDate
  };

  issuedBooks.push(record);

  res.json({ success: true, message: 'Book issued successfully.', books, issuedBooks });
});

app.post('/api/return', (req, res) => {
  const { id } = req.body;
  const index = issuedBooks.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }

  const record = issuedBooks[index];
  const book = books.find((b) => b.title === record.bookTitle);
  if (book) {
    book.available += 1;
  }

  issuedBooks.splice(index, 1);

  res.json({ success: true, message: 'Book returned successfully.', books, issuedBooks });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
